"use client";

import clsx from "clsx";
import { useProduct, useUpdateURL } from "components/product/product-context";
import { Image, ProductOption, ProductVariant } from "lib/sfcc/types";
import { startTransition, useEffect } from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  images,
  defaultVariant,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  images: Image[];
  defaultVariant?: string;
}) {
  const { state, updateOption, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  useEffect(() => {
    // If URL already has variant option params, don't override with default
    const urlParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const hasUrlOptionParams =
      urlParams &&
      options.some((option) => urlParams.get(option.name.toLowerCase()));

    if (hasUrlOptionParams) return;

    // Check if any option is already selected
    const hasAnyOptionSelected = options.some(
      (option) => state[option.name.toLowerCase()]
    );

    // Auto-select default variant (or first as fallback) if nothing is selected yet
    if (!hasAnyOptionSelected && variants.length > 0) {
      const targetVariant = (defaultVariant
        ? variants.find((v) => v.title === defaultVariant) || variants[0]
        : variants[0])!;
      startTransition(() => {
        let currentState = { ...state };
        targetVariant.selectedOptions.forEach((opt) => {
          currentState = updateOption(opt.name.toLowerCase(), opt.value);
        });
        if (targetVariant.image) {
          const imageIndex = images.findIndex(
            (img) => img.url === targetVariant.image!.url
          );
          if (imageIndex >= 0) {
            updateImage(imageIndex.toString());
            currentState = { ...currentState, image: imageIndex.toString() };
          }
        }
        updateURL(currentState);
      });
    }
  }, [options, variants, state, updateOption, updateImage, updateURL, images, defaultVariant]);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-4 overflow-visible border-b border-neutral-200 pb-3 dark:border-neutral-800 md:mb-8 md:border-b-0 md:pb-0">
        <dt className="mb-3 text-xs font-semibold uppercase leading-none tracking-wide text-neutral-500 dark:text-neutral-400 md:mb-4 md:text-sm md:leading-normal">
          {option.name}
        </dt>
        <dd className={clsx(
          "scrollbar-hide -mx-3 flex gap-2 px-3 pb-2 pt-px md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0 md:pt-0",
          option.values.length <= 4 ? "flex-nowrap" : "snap-x snap-mandatory overflow-x-auto",
        )}>
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = {
              ...state,
              [optionNameLowerCase]: value.name,
            };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.some((val) => val.name === value),
                ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale,
              ),
            );

            // The option is active if it's in the selected options.
            const isActive = state[optionNameLowerCase] === value.name;

            const handleSelect = () => {
              const optionState = updateOption(optionNameLowerCase, value.name);
              let combinedState = optionState;

              // Check if we now have a complete variant match
              const matchedVariant = variants.find((variant) =>
                variant.selectedOptions.every(
                  (opt) => optionState[opt.name.toLowerCase()] === opt.value,
                ),
              );

              if (matchedVariant?.image) {
                const imageIndex = images.findIndex(
                  (img) => img.url === matchedVariant.image!.url,
                );
                if (imageIndex >= 0) {
                  updateImage(imageIndex.toString());
                  combinedState = { ...optionState, image: imageIndex.toString() };
                }
              }

              updateURL(combinedState);
            };

            return (
              <button
                formAction={handleSelect}
                key={value.id}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value.name}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "flex items-center justify-center rounded-full border bg-neutral-100 px-2.5 py-1 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900 md:min-w-[48px] md:px-2 md:py-1 md:text-base",
                  option.values.length <= 4 ? "flex-1" : "min-w-max shrink-0 snap-start",
                  {
                    "cursor-default ring-2 ring-blue-600": isActive,
                    "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 dark:before:bg-neutral-700":
                      !isAvailableForSale,
                  },
                )}
              >
                {value.name}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
