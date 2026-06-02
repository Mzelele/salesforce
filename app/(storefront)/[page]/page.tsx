import type { Metadata } from "next";

import Prose from "components/prose";
import { getPage } from "lib/storefront/content";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
      <article className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-3xl">
        <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10">
          <header className="mb-6 border-b border-neutral-100 pb-5 sm:mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
              {page.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-400">
              Last updated on{" "}
              {new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(page.updatedAt))}
            </p>
          </header>

          <Prose className="max-w-none" html={page.body} />
        </div>
      </article>
    </div>
  );
}
