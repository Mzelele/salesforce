import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "components/breadcrumbs";
import { GridTileImage } from "components/grid/tile";
import { TrackViewContent } from "components/meta-pixel/view-content";
import { Gallery } from "components/product/gallery";
import { ProductActions } from "components/product/product-actions";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import Prose from "components/prose";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { Image } from "lib/sfcc/types";
import { getProductBySlug, getRelatedProducts } from "lib/storefront/products";
import { getStoreSettings } from "lib/storefront/settings";
import { baseUrl } from "lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    const product = await getProductBySlug(params.handle);
    if (!product) return notFound();

    const { url, width, height, altText: alt } = product.featuredImage || {};
    const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

    const productUrl = `${baseUrl}/product/${params.handle}`;

    return {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      robots: {
        index: indexable,
        follow: indexable,
        googleBot: {
          index: indexable,
          follow: indexable,
        },
      },
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        type: "website",
        title: product.seo.title || product.title,
        description: product.seo.description || product.description,
        url: productUrl,
        images: url
          ? [
              {
                url,
                width,
                height,
                alt,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: product.seo.title || product.title,
        description: product.seo.description || product.description,
        images: url ? [url] : undefined,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  try {
    const [product, settings] = await Promise.all([
      getProductBySlug(params.handle),
      getStoreSettings(),
    ]);
    if (!product) return notFound();

  const productUrl = `${baseUrl}/product/${params.handle}`;
  const variantOffers = product.variants.map((v) => ({
    "@type": "Offer",
    name: v.title,
    price: v.price.amount,
    priceCurrency: product.currencyCode,
    availability: v.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    url: productUrl,
    sku: v.id,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    url: productUrl,
    sku: (product as any).sku,
    brand: {
      "@type": "Brand",
      name: (product as any).brandName || product.title.split(" ")[0],
    },
    offers: variantOffers.length > 1
      ? {
          "@type": "AggregateOffer",
          availability: product.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          priceCurrency: product.currencyCode,
          highPrice: product.priceRange.maxVariantPrice.amount,
          lowPrice: product.priceRange.minVariantPrice.amount,
          offerCount: variantOffers.length,
          offers: variantOffers,
        }
      : variantOffers[0] || undefined,
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(product.categoryName && product.categorySlug
      ? [{ label: product.categoryName, href: `/product-category/${product.categorySlug}` }]
      : product.brandSlug
        ? [{ label: product.brandSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), href: `/brand/${product.brandSlug}` }]
        : []),
    { label: product.title },
  ];

  const defaultVariant = product.defaultVariant
    ? product.variants.find((v) => v.title === product.defaultVariant)
    : product.variants.length === 1 ? product.variants[0] : undefined;
  const viewContentVariantId = defaultVariant?.id || product.variants[0]?.id || product.id;
  const viewContentPrice = Number(defaultVariant?.price?.amount || product.variants[0]?.price?.amount || 0);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <TrackViewContent
        productId={product.id}
        variantId={viewContentVariantId}
        value={viewContentPrice}
        currency={product.currencyCode}
      />
      <div className="mx-auto mt-0 w-full max-w-none px-0 pb-24 md:px-4 md:pb-0 lg:max-w-(--breakpoint-5xl)">
        <Breadcrumbs items={breadcrumbItems} centerOnMobile />
        <div className="flex flex-col gap-2 rounded-none border-0 border-neutral-200 bg-white px-3 pb-3 pt-0 md:gap-4 md:rounded-lg md:border md:p-6 lg:grid lg:grid-cols-[5rem_1fr_0.85fr_280px] lg:gap-4 lg:pt-4 dark:border-neutral-800 dark:bg-black">
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[280px] w-full overflow-hidden lg:max-h-[400px]" />
              }
            >
              <ProductProvider>
                <Gallery
                  images={product.images.slice(0, 5).map((image: Image) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </ProductProvider>
            </Suspense>
          </div>

          <Suspense fallback={null}>
            <ProductProvider>
              <div>
                <ProductDescription product={product} />
              </div>
              <div>
                <ProductActions product={product} whatsappPhone={settings.whatsappPhone || settings.storePhone} storePhone={settings.storePhone} />
              </div>
            </ProductProvider>
          </Suspense>
        </div>
        {product.descriptionHtml ? (
          <div className="mt-4 mb-4 rounded-lg border border-neutral-200 bg-white p-4 md:mt-6 md:mb-6 md:p-8 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-2 text-xl font-bold md:mb-4 dark:text-white">Product Description</h2>
            <Prose
              className="text-sm leading-relaxed dark:text-white/[60%]"
              html={product.descriptionHtml}
            />
          </div>
        ) : null}
        <RelatedProducts
          categoryId={product.categoryId}
          categorySlug={product.categorySlug}
          categoryName={product.categoryName}
          excludeId={product.id}
        />
      </div>
    </div>
  );
  } catch {
    return notFound();
  }
}

async function RelatedProducts({
  categoryId,
  categorySlug,
  categoryName,
  excludeId,
}: {
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  excludeId: string;
}) {
  if (!categoryId) return null;
  const relatedProducts = await getRelatedProducts(categoryId, excludeId);

  if (!relatedProducts.length) return null;

  const items = relatedProducts.slice(0, 4);

  return (
    <div className="mt-4 mb-4 rounded-lg border border-neutral-200 bg-white p-4 md:mt-6 md:mb-6 md:p-8 dark:border-neutral-800 dark:bg-black">
      <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl dark:text-white">Related Products</h2>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((product: any) => (
          <li key={product.handle} className="aspect-square">
            <Link
              className="relative block h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amountMin: product.priceRange.minVariantPrice.amount,
                  amountMax: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
      {categorySlug && (
        <div className="mt-4 md:mt-6">
          <Link
            href={`/category/${categorySlug}`}
            prefetch={true}
            className="flex w-full items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 md:py-4 md:text-base dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            View All {categoryName || "Products"}
          </Link>
        </div>
      )}
    </div>
  );
}
