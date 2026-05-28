import Prose from "components/prose";
import { Product } from "lib/sfcc/types";
import { ProductPrice } from "./product-price";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({
  product,
}: {
  product: Product;
}) {
  return (
    <>
      <div className="mb-3 flex flex-col border-b border-neutral-200 pb-3 dark:border-neutral-800 md:mb-4 md:pb-4">
        <h1 className="mb-2 text-lg font-semibold leading-snug md:text-3xl lg:text-4xl">{product.title}</h1>
        <ProductPrice product={product} />
      </div>
      <VariantSelector options={product.options} variants={product.variants} images={product.images} defaultVariant={product.defaultVariant} />
      {product.productHighlights ? (
        <div className="my-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/50">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 md:text-sm">
            Key Features
          </h3>
          <Prose
            className="text-sm leading-relaxed dark:text-white"
            html={product.productHighlights}
          />
        </div>
      ) : null}
    </>
  );
}
