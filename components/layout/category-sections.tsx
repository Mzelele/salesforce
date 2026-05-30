"use client";

import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { Product } from "lib/sfcc/types";
import Link from "next/link";

interface CategoryData {
  slug: string;
  name: string;
}

interface CategorySectionsProps {
  categories: CategoryData[];
  initialData: Record<string, { products: Product[]; total: number; page: number; totalPages: number }>;
}

export default function CategorySections({ categories, initialData }: CategorySectionsProps) {
  const data = initialData;

  return (
    <div className="w-full py-8" style={{ backgroundColor: "#E1F3FF" }}>
      <div className="mx-auto max-w-7xl px-4 space-y-12 lg:px-6">
        {categories.map((cat) => {
          const catData = data[cat.slug];
          if (!catData || catData.products.length === 0) return null;

          return (
            <section key={cat.slug}>
              {/* Section Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{cat.name}</h2>
                  <p className="mt-1 text-sm text-neutral-600">Discover our latest collection</p>
                </div>
                <Link
                  href={`/product-category/${cat.slug}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All →
                </Link>
              </div>

              {/* Products Grid */}
              <Grid className="grid-cols-2 gap-3 lg:grid-cols-6 lg:gap-4">
                {catData.products.map((product, index) => (
                  <Grid.Item
                    key={product.handle}
                    className={`animate-fadeIn ${index >= 4 ? "hidden lg:block" : ""}`}
                  >
                    <Link
                      className="group relative inline-block h-full w-full"
                      href={`/product/${product.handle}`}
                      prefetch={true}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-neutral-100">
                        <GridTileImage
                          alt={product.title}
                          label={{
                            title: product.title,
                            amountMin: product.priceRange.minVariantPrice.amount,
                            amountMax: product.priceRange.maxVariantPrice.amount,
                            currencyCode: product.currencyCode,
                          }}
                          src={product.featuredImage?.url}
                          fill
                          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 50vw, 100vw"
                          priority={index < 2}
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/10" />
                      </div>
                    </Link>
                  </Grid.Item>
                ))}
              </Grid>

              {/* View All Button */}
              <div className="mt-6">
                <Link
                  href={`/product-category/${cat.slug}`}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  View All {cat.name}
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
