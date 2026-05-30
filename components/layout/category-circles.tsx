"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface Category {
  slug: string;
  title: string;
  emoji?: string;
}

function CircularCategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const displayedCategories = categories.slice(0, visibleCount);
  const hasMore = visibleCount < categories.length;
  const remainingCount = categories.length - visibleCount;
  const nextLoadCount = Math.min(6, remainingCount);

  return (
    <section className="mx-auto mb-8 w-full max-w-7xl px-4 mt-4 lg:mt-16">
      <div className="lg:rounded-2xl lg:border lg:border-orange-300 lg:bg-white lg:p-8 lg:shadow-sm dark:lg:border-neutral-800 dark:lg:bg-neutral-950">
        <div className="relative flex items-center gap-2">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="z-10 p-2 transition-all disabled:opacity-30 hidden lg:flex flex-shrink-0 outline-none focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Categories Carousel - Desktop */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="hidden lg:flex gap-4 overflow-x-auto pb-2 scrollbar-hide flex-1"
            style={{
              scrollBehavior: "smooth",
              scrollSnapType: "x mandatory",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2 flex-shrink-0"
                style={{ scrollSnapAlign: "center" }}
              >
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 text-6xl transition-transform hover:scale-110 dark:from-teal-900/20 dark:to-teal-800/20 flex-shrink-0">
                  {category.emoji || "📦"}
                </div>
                <p className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-2 w-40">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="z-10 p-2 transition-all disabled:opacity-30 hidden lg:flex flex-shrink-0 outline-none focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Mobile Grid - 3 columns with wrapping */}
          <div className="lg:hidden grid grid-cols-3 gap-4 w-full">
            {displayedCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-3xl transition-transform hover:scale-110 dark:from-teal-900/20 dark:to-teal-800/20">
                  {category.emoji || "📦"}
                </div>
                <p className="text-center text-xs font-medium text-neutral-700 dark:text-neutral-300 line-clamp-2 w-24">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More Button - appears after all visible categories */}
        {hasMore && (
          <div className="mt-6 flex justify-center lg:hidden">
            <Button
              onClick={() => setVisibleCount(prev => prev + nextLoadCount)}
              variant="outline"
              className="px-8"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function CategoryGrid({ categories }: { categories: Category[] }) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = categories.length > 6;
  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="mx-auto mb-8 w-full max-w-7xl px-4 mt-16">
      <div className="lg:rounded-2xl lg:border lg:border-orange-300 lg:bg-white lg:p-8 lg:shadow-sm dark:lg:border-neutral-800 dark:lg:bg-neutral-950">
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
          {displayedCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-24 w-24 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-3xl lg:text-5xl transition-transform hover:scale-110 dark:from-teal-900/20 dark:to-teal-800/20">
                {category.emoji || "📦"}
              </div>
              <p className="text-center text-xs lg:text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-2 w-24 lg:w-32">
                {category.title}
              </p>
            </Link>
          ))}
        </div>

        {hasMore && !showAll && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="px-8"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export function CategoryCircles({ categories }: { categories: Category[] }) {
  const hasMany = categories.length > 6;
  return hasMany ? (
    <CircularCategoryCarousel categories={categories} />
  ) : (
    <CategoryGrid categories={categories} />
  );
}
