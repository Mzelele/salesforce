"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function BrandCarousel({ brands }: { brands: any[] }) {
  if (!brands?.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto mb-8 w-full max-w-7xl px-4">
      <div className="lg:rounded-2xl lg:border lg:border-orange-300 lg:bg-white lg:shadow-sm dark:lg:border-neutral-800 dark:lg:bg-neutral-950 overflow-hidden">
        <div className="px-4 py-3 lg:px-8 lg:py-4 lg:border-b lg:border-orange-200 dark:lg:border-neutral-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-neutral-900 dark:to-neutral-900">
          <h2 className="text-base lg:text-lg font-bold text-neutral-900 dark:text-white">Shop by Brands</h2>
        </div>
        <div className="relative overflow-hidden py-3 md:py-4 lg:py-6 px-4 md:px-6 lg:px-8">
          {/* Desktop arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow-md backdrop-blur hover:bg-white md:flex dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
            aria-label="Scroll left"
            type="button"
          >
            <svg className="h-5 w-5 text-neutral-700 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow-md backdrop-blur hover:bg-white md:flex dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
            aria-label="Scroll right"
            type="button"
          >
            <svg className="h-5 w-5 text-neutral-700 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-hidden md:snap-none md:px-12"
          >
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brand/${brand.slug}`}
                className="flex h-11 w-28 flex-none snap-start items-center justify-center overflow-hidden rounded-lg border border-red-300 bg-gradient-to-br from-red-50 to-red-100 transition hover:border-red-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500"
              >
                {brand.imageUrl ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="whitespace-nowrap text-sm font-semibold">{brand.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
