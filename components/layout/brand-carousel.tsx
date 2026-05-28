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
    <section className="mb-4">
      <h2 className="mb-3 text-center text-xl font-bold text-neutral-900 dark:text-white">Shop by Brands</h2>
      <div className="relative mx-4 overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 dark:border-neutral-700 dark:bg-neutral-900 md:py-4">
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
              className="flex h-11 w-28 flex-none snap-start items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500"
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
    </section>
  );
}
