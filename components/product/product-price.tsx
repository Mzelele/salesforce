import Price from "components/price";
import { Product } from "lib/sfcc/types";

export function ProductPrice({ product }: { product: Product }) {
  // Choose variant price or fallback to minVariantPrice
  const variant = product.variants && product.variants.length > 0
    ? product.variants.find((v) => v.title === product.defaultVariant) || product.variants[0]
    : undefined;

  const price = variant?.price?.amount || product.priceRange?.minVariantPrice?.amount || undefined;
  const compare = product.comparePrice?.amount;

  return (
    <div className="flex items-baseline gap-3">
      {price ? (
        <Price amount={price} className="text-2xl font-semibold text-neutral-900 md:text-3xl" currencyCode={product.currencyCode} />
      ) : null}
      {compare ? (
        <Price amount={compare} className="text-sm text-neutral-500 line-through" currencyCode={product.currencyCode} />
      ) : null}
    </div>
  );
}

