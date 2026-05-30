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
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {categories.map((cat) => {
        const catData = data[cat.slug];
        if (!catData || catData.products.length === 0) return null;

        return (
          <section key={cat.slug} className="lg:rounded-2xl lg:border lg:border-orange-300 lg:bg-white lg:shadow-sm dark:lg:border-neutral-800 dark:lg:bg-neutral-950 overflow-hidden">
            <div className="px-4 py-3 lg:px-8 lg:py-4 lg:border-b lg:border-neutral-200 dark:lg:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 dark:from-neutral-900 dark:to-neutral-900">
              <h2 className="text-base lg:text-lg font-bold text-neutral-900 dark:text-white">{cat.name}</h2>
              <Link
                href={`/product-category/${cat.slug}`}
                className="text-xs lg:text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View all →
              </Link>
            </div>
            <div className="px-4 py-4 lg:px-8 lg:py-6">
              <Grid className="grid-cols-2 lg:grid-cols-6">
                {catData.products.map((product, index) => (
                  <Grid.Item
                    key={product.handle}
                    className={`animate-fadeIn ${index >= 4 ? "hidden lg:block" : ""}`}
                  >
                    <Link
                      className="relative inline-block h-full w-full"
                      href={`/product/${product.handle}`}
                      prefetch={true}
                    >
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
                    </Link>
                  </Grid.Item>
                ))}
              </Grid>
              <div className="mt-4 lg:mt-6">
                <Link
                  href={`/product-category/${cat.slug}`}
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-xs lg:text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-red-600 lg:py-4 dark:bg-teal-700 dark:hover:bg-teal-600"
                >
                  View All {cat.name}
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
