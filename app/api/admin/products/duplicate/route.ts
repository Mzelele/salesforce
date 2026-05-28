import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const slugify = (str: string) =>
  str.toLowerCase().trim()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const original = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!original) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const { _id, createdAt, updatedAt, slug, ...rest } = original;
    const now = new Date();
    const newName = `${rest.name} (Copy)`;
    const newSlug = `${slugify(rest.slug || rest.name)}-${Date.now()}`;

    const toInsert: any = {
      ...rest,
      name: newName,
      slug: newSlug,
      sku: rest.sku ? `${rest.sku}-copy` : "",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    if (toInsert.category && typeof toInsert.category === "string") {
      try { toInsert.category = new ObjectId(toInsert.category); } catch {}
    }

    const result = await db.collection("products").insertOne(toInsert);
    return NextResponse.json({ ...toInsert, _id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
