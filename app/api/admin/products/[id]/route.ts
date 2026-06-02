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

    for (const cat of categories) {
      const name = (cat.name || "").toLowerCase();
      const slug = (cat.slug || "").toLowerCase();

      const nameRegex = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "\\b", "i");
      if (name && nameRegex.test(normalized)) return cat._id.toString();

      if (slug && normalized.includes(slug)) return cat._id.toString();

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectDB();
    const { id } = await params;
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (product.category) {
      const cat = await db.collection("categories").findOne({ _id: new ObjectId(product.category.toString()) });
      if (cat) product.category = cat;
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectDB();
    const { id } = await params;
    const body = await req.json();
    if (body.slug || body.name) body.slug = slugify(body.slug || body.name);
    if (body.name) {
      const detectedBrand = await detectBrand(body.name);
      if (detectedBrand) body.brand = detectedBrand;

      // Attempt to detect category from the name/description when category isn't provided
      if (!body.category) {
        const text = `${body.name || ""} ${body.description || ""}`.trim();
        const detectedCategory = await detectCategory(text);
        if (detectedCategory) body.category = detectedCategory; // keep as string id; will be converted below
      }
    }
    if (body.category) {
      body.category = new ObjectId(body.category);
    }
    body.updatedAt = new Date();
    const product = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: "after" }
    );
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";
    const existing = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (permanent || existing.status === "archived") {
      await db.collection("products").deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: "Product permanently deleted" });
    }

    const product = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: "archived", updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return NextResponse.json({ message: "Product archived" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
