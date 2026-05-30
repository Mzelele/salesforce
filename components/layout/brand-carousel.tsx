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
    <section className="w-full py-8" style={{ backgroundColor: "#E1F3FF" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Shop by Brands</h2>
          <p className="mt-1 text-sm text-neutral-600">Explore our trusted brand partners</p>
        </div>

        <div className="relative">
          {/* Desktop arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-md transition-all hover:shadow-lg md:flex"
            aria-label="Scroll left"
            type="button"
          >
            <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-md transition-all hover:shadow-lg md:flex"
            aria-label="Scroll right"
            type="button"
          >
            <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-8 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-hidden md:snap-none md:px-12"
          >
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brand/${brand.slug}`}
                className="flex h-20 w-32 flex-none snap-start items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-md"
              >
                {brand.imageUrl ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="whitespace-nowrap text-sm font-semibold text-neutral-700">{brand.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
