import Prose from "components/prose";
import { Product } from "lib/sfcc/types";
import { ProductPrice } from "./product-price";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <>
      <div className={compact ? "mb-2.5 border-b border-neutral-200 pb-2.5" : "mb-4 border-b border-neutral-200 pb-4 md:mb-5 md:pb-5"}>
        <h1 className={compact ? "mb-1.5 text-lg font-semibold leading-snug text-neutral-950" : "mb-3 text-2xl font-semibold leading-tight text-neutral-950 md:text-3xl lg:text-4xl"}>
          {product.title}
        </h1>
        <ProductPrice product={product} />
      </div>
      <VariantSelector
        options={product.options}
        variants={product.variants}
        images={product.images}
        defaultVariant={product.defaultVariant}
      />
      {product.productHighlights && !compact ? (
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 md:text-sm">
            Key Features
          </h3>
          <Prose
            className="text-sm leading-relaxed text-neutral-700"
            html={product.productHighlights}
          />
        </div>
      ) : null}
    </>
  );
}
