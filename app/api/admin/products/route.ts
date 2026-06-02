import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function detectBrand(title: string) {
  try {
    const db = await connectDB();
    const brands = await db.collection("brands").find().toArray();
    if (!brands.length) return null;
    const normalizedTitle = title.toLowerCase();
    for (const brand of brands) {
      const brandName = brand.name?.toLowerCase();
      if (brandName && normalizedTitle.includes(brandName)) {
        return brand.slug;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Detect category by matching title/description against existing category names, slugs or keywords
async function detectCategory(text: string) {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find().toArray();
    if (!categories.length) return null;
    const normalized = (text || "").toLowerCase();

    // exact or whole-word matches against name or slug, also match against a `keywords` field if present
    for (const cat of categories) {
      const name = (cat.name || "").toLowerCase();
      const slug = (cat.slug || "").toLowerCase();

      // match name as whole word or as substring in longer names
      const nameRegex = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "\\b", "i");
      if (name && nameRegex.test(normalized)) return cat._id.toString();

      if (slug && normalized.includes(slug)) return cat._id.toString();

      // support a keywords field if categories store synonyms
      const keywords = Array.isArray(cat.keywords) ? cat.keywords : (cat.keywords ? String(cat.keywords).split(",") : []);
      for (const kw of keywords) {
        const k = (kw || "").toLowerCase().trim();
        if (!k) continue;
        const kwRegex = new RegExp("\\b" + k.replace(/[.*+?^${}()|[\\]\\]\\\\]/g, "\\$&") + "\\b", "i");
        if (kwRegex.test(normalized) || normalized.includes(k)) return cat._id.toString();
      }
    }

    return null;
  } catch {
    return null;
  }
}

const slugify = (str: string) =>
  str.toLowerCase().trim()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter: any = {};
    if (status) filter.status = status;
    if (category) {
      try { filter.category = new ObjectId(category); } catch { filter.category = category; }
    }
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const col = db.collection("products");

    const countFilter = { ...filter };
    delete countFilter.status;

    const [products, total, statusCounts] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
      col
        .aggregate([
          { $match: countFilter },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    // Populate category names
    const categoryIds = [...new Set(products.map((p) => p.category?.toString()).filter(Boolean))];
    const categories = categoryIds.length
      ? await db.collection("categories").find({ _id: { $in: categoryIds.map((id) => { try { const { ObjectId } = require("mongodb"); return new ObjectId(id); } catch { return id; } }) } }).toArray()
      : [];
    const catMap = Object.fromEntries(categories.map((c) => [c._id.toString(), { _id: c._id, name: c.name }]));

    const populated = products.map((p) => ({
      ...p,
      category: p.category ? catMap[p.category.toString()] || p.category : null,
    }));

    const counts = statusCounts.reduce(
      (acc, item) => ({ ...acc, [item._id || "draft"]: item.count }),
      { active: 0, draft: 0, archived: 0 },
    );

    return NextResponse.json({ products: populated, total, counts, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();
    body.slug = slugify(body.slug || body.name || `draft-product-${Date.now()}`);
    if (body.name) {
      const detectedBrand = await detectBrand(body.name);
      if (detectedBrand) body.brand = detectedBrand;

      // Attempt to detect category from the name/description when category isn't provided
      if (!body.category) {
        const text = `${body.name || ""} ${body.description || ""}`.trim();
        const detectedCategory = await detectCategory(text);
        if (detectedCategory) body.category = detectedCategory; // keep as string id; will be converted to ObjectId below
      }
    }
    if (body.category) {
      body.category = new ObjectId(body.category);
    }
    const now = new Date();
    const toInsert = { ...body, createdAt: now, updatedAt: now };
    const result = await db.collection("products").insertOne(toInsert);
    return NextResponse.json({ ...toInsert, _id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

