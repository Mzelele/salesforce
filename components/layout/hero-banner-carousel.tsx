"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroBannerCarouselProps = {
  images: string[];
  interval: 3000 | 5000;
};

export function HeroBannerCarousel({ images, interval }: HeroBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-100 md:aspect-[2/1]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={`Hero banner ${index + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1280px, calc(100vw - 2rem)"
              quality={100}
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
