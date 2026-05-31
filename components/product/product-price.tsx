"use client";

import { Product } from "lib/sfcc/types";
import { useProduct } from "./product-context";

const formatPrice = (amount: number, currencyCode: string) =>
  `${currencyCode} ${new Intl.NumberFormat("en-KE", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;

export function ProductPrice({ product }: { product: Product }) {
  const { state } = useProduct();
  const { priceRange, currencyCode, variants } = product;

  const selectedVariant = variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()],
    ),
  );

  const priceAmount = Number(
    selectedVariant?.price.amount || priceRange.minVariantPrice.amount,
  );
  const maxPriceAmount = Number(priceRange.maxVariantPrice.amount);
  const compareAmount = Number(product.comparePrice?.amount || 0);
  const hasRange = !selectedVariant && priceAmount !== maxPriceAmount;
  const hasDiscount = compareAmount > priceAmount;
  const savingsAmount = hasDiscount ? compareAmount - priceAmount : 0;
  const discountPercent = hasDiscount
    ? Math.round((savingsAmount / compareAmount) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-center gap-2 text-left">
      <span className="text-xl font-bold text-blue-600 md:text-2xl">
        {hasRange
          ? `${formatPrice(priceAmount, currencyCode)} - ${formatPrice(maxPriceAmount, currencyCode)}`
          : formatPrice(priceAmount, currencyCode)}
      </span>
      {hasDiscount ? (
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
          <span className="text-neutral-500 line-through">
            {formatPrice(compareAmount, currencyCode)}
          </span>
          <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700">
            {discountPercent}% Off
          </span>
          <span className="font-medium text-neutral-600">
            Save {formatPrice(savingsAmount, currencyCode)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
