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
