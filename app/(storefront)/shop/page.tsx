import { Breadcrumbs } from "components/breadcrumbs";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Collections from "components/layout/search/collections";
import FilterList from "components/layout/search/filter";
import { StickyWhatsAppButton } from "components/layout/sticky-whatsapp-button";
import { Pagination } from "components/pagination";
import { sorting } from "lib/storefront/constants";
import { getProducts } from "lib/storefront/products";
import { getStoreSettings } from "lib/storefront/settings";
import { baseUrl } from "lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getStoreSettings();
  const title = settings.shopMetaTitle || "Shop All Watches in Kenya | Browse Premium Timepieces";
  const description = settings.shopMetaDescription || "Browse our full catalog of watches in Kenya. Luxury, sports, and everyday timepieces from top brands with fast delivery across Nairobi and nationwide.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/shop`,
    },
    openGraph: {
      type: "website",
      title,
      description: settings.shopMetaDescription || "Browse our full catalog of watches in Kenya.",
      url: `${baseUrl}/shop`,
    },
    twitter: {
      card: "summary",
      title,
      description: settings.shopMetaDescription || "Browse our full catalog of watches in Kenya.",
    },
  };
}

const DEFAULT_CATEGORY = "mens-watch";

export default async function ShopPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const searchValue = (searchParams?.q as string) || "";
  const sort = (searchParams?.sort as string) || undefined;
  const pageParam = searchParams?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) || 1 : 1;

  const [settings, { products, totalPages }] = await Promise.all([
    getStoreSettings(),
    getProducts({
      search: searchValue,
      category: DEFAULT_CATEGORY,
      sort,
      limit: 12,
      page,
    }),
  ]);
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      <div className="mb-6 flex items-center gap-1 border-b border-neutral-200 py-3 sm:gap-3 dark:border-neutral-700">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
        <Collections horizontal defaultPath="/product-category/mens-watch" />
        <div className="ml-auto">
          <FilterList list={sorting} title="Sort by" horizontal />
        </div>
      </div>
      {searchValue ? (
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <>
          <Grid className="grid-cols-2 lg:grid-cols-6">
            <ProductGridItems products={products} />
          </Grid>
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : null}
      <StickyWhatsAppButton
        phone={settings.whatsappPhone || settings.storePhone}
        message="Hi, I'm browsing your shop and have a question."
      />
    </>
  );
}
