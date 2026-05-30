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

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Array of vibrant background colors for variety
  const bgColors = [
    'bg-gradient-to-br from-orange-400 to-orange-500',
    'bg-gradient-to-br from-amber-400 to-yellow-500',
    'bg-gradient-to-br from-orange-500 to-amber-600',
    'bg-gradient-to-br from-yellow-400 to-orange-400',
    'bg-gradient-to-br from-blue-800 to-blue-900',
    'bg-gradient-to-br from-red-500 to-orange-500',
  ];

  return (
    <section className="w-full py-4 lg:py-6">
      {/* Desktop - 6 columns filling width with scrolling */}
      <div className="hidden lg:block">
        <div className="relative flex items-center gap-2 px-2">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="z-10 flex-shrink-0 rounded-full bg-white p-2 shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>

          {/* Categories Carousel - Desktop - 6 columns */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide flex-1"
            style={{
              scrollBehavior: "smooth",
              scrollSnapType: "x mandatory",
            }}
          >
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
                style={{ scrollSnapAlign: "center", minWidth: "calc(16.666% - 10px)" }}
              >
                <div className={`relative flex h-36 w-36 items-center justify-center rounded-full ${bgColors[index % bgColors.length]} transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg overflow-visible`}>
                  <span className="text-6xl transform group-hover:scale-125 transition-transform duration-300" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                    {category.emoji || "📦"}
                  </span>
                </div>
                <p className="text-center text-xs font-semibold text-white line-clamp-2 w-36 drop-shadow-sm">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="z-10 flex-shrink-0 rounded-full bg-white p-2 shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-neutral-700" />
          </button>
        </div>
      </div>

      {/* Mobile Grid - 4 columns filling width */}
      <div className="lg:hidden grid grid-cols-4 gap-1 px-3 w-full">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`relative flex h-24 w-24 items-center justify-center rounded-full ${bgColors[index % bgColors.length]} transition-all duration-300 group-hover:scale-110 shadow-lg overflow-visible`}>
              <span className="text-4xl transform group-hover:scale-125 transition-transform duration-300" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                {category.emoji || "📦"}
              </span>
            </div>
            <p className="text-center text-[10px] font-semibold text-white line-clamp-2 w-24 drop-shadow-sm">
              {category.title}
            </p>
          </Link>
        ))}
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

  // Array of vibrant background colors for variety
  const bgColors = [
    'bg-gradient-to-br from-orange-400 to-orange-500',
    'bg-gradient-to-br from-amber-400 to-yellow-500',
    'bg-gradient-to-br from-orange-500 to-amber-600',
    'bg-gradient-to-br from-yellow-400 to-orange-400',
    'bg-gradient-to-br from-blue-800 to-blue-900',
    'bg-gradient-to-br from-red-500 to-orange-500',
  ];

  return (
    <section className="w-full py-4 lg:py-6 px-3">
      <div className="grid grid-cols-4 gap-3 lg:grid-cols-6 lg:gap-4">
        {displayedCategories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex flex-col items-center gap-1.5 lg:gap-2 group"
          >
            <div className={`relative flex h-24 w-24 lg:h-36 lg:w-36 items-center justify-center rounded-full ${bgColors[index % bgColors.length]} transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl shadow-lg overflow-visible`}>
              <span className="text-4xl lg:text-6xl transform group-hover:scale-125 transition-transform duration-300" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                {category.emoji || "📦"}
              </span>
            </div>
            <p className="text-center text-[10px] lg:text-xs font-semibold text-white line-clamp-2 w-24 lg:w-36 drop-shadow-sm">
              {category.title}
            </p>
          </Link>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="px-6 py-2 text-sm bg-white hover:bg-gray-100"
          >
            Load More
          </Button>
        </div>
      )}
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
