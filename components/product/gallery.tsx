"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GridTileImage } from "components/grid/tile";
import { useProduct, useUpdateURL } from "components/product/product-context";
import Image from "next/image";
import { useRef } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;
  const thumbRef = useRef<HTMLDivElement>(null);

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "flex h-full items-center justify-center px-5 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white md:px-6";

  const hasMultipleImages = images.length > 1;

  return (
    <form className={clsx("flex flex-col lg:grid lg:gap-4", hasMultipleImages ? "lg:grid-cols-[5rem_1fr]" : "lg:grid-cols-[1fr]")}>
      {/* Thumbnails - left on desktop, bottom on mobile */}
      {hasMultipleImages ? (
        <div className="relative order-2 mt-2 lg:order-1 lg:mt-0">
          {/* Up arrow - desktop only */}
          <button
            type="button"
            className="scrollbar-hide absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-neutral-800 p-1 text-white shadow lg:block"
            onClick={() => thumbRef.current?.scrollBy({ top: -88, behavior: "smooth" })}
            aria-label="Scroll thumbnails up"
          >
            <ArrowLeftIcon className="h-3 w-3 rotate-90" />
          </button>
          <div
            ref={thumbRef}
            className="scrollbar-hide overflow-x-auto px-3 py-0.5 sm:px-4 lg:mx-0 lg:max-h-[400px] lg:overflow-x-hidden lg:overflow-y-auto lg:px-0 lg:py-1"
          >
            <ul className="flex w-max min-w-full snap-x snap-mandatory items-center justify-center gap-2 lg:w-auto lg:min-w-0 lg:flex-col lg:justify-start lg:gap-3">
              {images.map((image, index) => {
                const isActive = index === imageIndex;

                return (
                  <li key={image.src} className="h-14 w-14 flex-none snap-start lg:h-20 lg:w-20">
                    <button
                      formAction={() => {
                        const newState = updateImage(index.toString());
                        updateURL(newState);
                      }}
                      aria-label="Select product image"
                      className="h-full w-full"
                    >
                      <GridTileImage
                        alt={image.altText}
                        src={image.src}
                        width={80}
                        height={80}
                        active={isActive}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Down arrow - desktop only */}
          <button
            type="button"
            className="absolute -bottom-2 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-neutral-800 p-1 text-white shadow lg:block"
            onClick={() => thumbRef.current?.scrollBy({ top: 88, behavior: "smooth" })}
            aria-label="Scroll thumbnails down"
          >
            <ArrowRightIcon className="h-3 w-3 rotate-90" />
          </button>
        </div>
      ) : null}

      {/* Main image - right on desktop, top on mobile */}
      <div className={clsx("relative mt-2 aspect-square w-full overflow-hidden rounded-lg bg-white dark:bg-black md:mt-0 lg:max-h-[400px]", hasMultipleImages && "lg:order-2")}>
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
            unoptimized
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-3 flex w-full justify-center md:bottom-[15%]">
            <div className="mx-auto flex h-10 items-center rounded-full border border-white bg-neutral-950/60 text-white shadow-lg backdrop-blur-sm md:h-11 dark:border-black dark:bg-neutral-900/80">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
