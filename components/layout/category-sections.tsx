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
    <div className="mx-auto max-w-7xl px-4 py-6">
      {categories.map((cat) => {
        const catData = data[cat.slug];
        if (!catData || catData.products.length === 0) return null;

        return (
          <section key={cat.slug} className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{cat.name}</h2>
              <Link
                href={`/product-category/${cat.slug}`}
                className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white"
              >
                View all
              </Link>
            </div>
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
            <div className="mt-4 md:mt-6">
              <Link
                href={`/product-category/${cat.slug}`}
                className="flex w-full items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 md:py-4 md:text-base dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                View All {cat.name}
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}
