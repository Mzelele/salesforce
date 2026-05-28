import { BrandCarousel } from "components/layout/brand-carousel";
import CategorySections from "components/layout/category-sections";
import { HeroBanner } from "components/layout/hero-banner";
import { getBrands } from "lib/storefront/brands";
import { getAllCategories } from "lib/storefront/categories";
import { getProducts } from "lib/storefront/products";
import { baseUrl } from "lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Premium Watches in Kenya | Authentic Brands, Fast Delivery",
  description:
    "Discover a curated collection of luxury and everyday watches in Kenya. Shop top brands with fast delivery across Nairobi and nationwide. Best prices guaranteed.",
  alternates: {
    canonical: `${baseUrl}/`,
  },
  openGraph: {
    type: "website",
    title: "Shop Premium Watches in Kenya | Authentic Brands, Fast Delivery",
    description:
      "Discover a curated collection of luxury and everyday watches in Kenya. Shop top brands with fast delivery across Nairobi and nationwide. Best prices guaranteed.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Watches in Kenya | Authentic Brands, Fast Delivery",
    description:
      "Discover a curated collection of luxury and everyday watches in Kenya. Shop top brands with fast delivery across Nairobi and nationwide.",
  },
};

export default async function HomePage() {
  const [categories, rawBrands] = await Promise.all([getAllCategories(), getBrands()]);

  const brands = rawBrands.map((b: any) => ({
    _id: b._id?.toString?.() || String(b._id),
    name: b.name,
    slug: b.slug,
    imageUrl: b.imageUrl,
    createdAt: b.createdAt?.toISOString?.() || b.createdAt,
    updatedAt: b.updatedAt?.toISOString?.() || b.updatedAt,
  }));

  const initialData: Record<string, any> = {};
  await Promise.all(
    categories.map(async (cat) => {
      const result = await getProducts({ category: cat.handle, limit: 6, page: 1 });
      initialData[cat.handle] = result;
    })
  );

  const categoriesWithProducts = categories.filter((cat) => {
    const result = initialData[cat.handle];
    return result && result.products.length > 0;
  });

  return (
    <>
      <HeroBanner />
      <BrandCarousel brands={brands} />
      <CategorySections
        categories={categoriesWithProducts.map((c) => ({ slug: c.handle, name: c.title }))}
        initialData={initialData}
      />
    </>
  );
}
