import { connectDB } from "@/lib/mongodb";
import { Collection, SEO } from "lib/sfcc/types";

function mapCategory(doc: any): Collection {
  const seo: SEO = { title: doc.name, description: doc.description || "" };
  return {
    handle: doc.slug,
    title: doc.name,
    description: doc.description || "",
    seo,
    updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    path: `/product-category/${doc.slug}`,
    emoji: doc.emoji || "",
  };
}

export async function getAllCategories() {
  const db = await connectDB();
  const docs = await db.collection("categories").find().sort({ name: 1 }).toArray();
  return docs.map(mapCategory);
}

export async function getCategoryBySlug(slug: string) {
  const db = await connectDB();
  const doc = await db.collection("categories").findOne({ slug });
  if (!doc) return null;
  return mapCategory(doc);
}

export async function getCollections() {
  return getAllCategories();
}

export async function getCollection(handle: string) {
  return getCategoryBySlug(handle);
}
