"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CategoriesSidebar({
  categories,
}: {
  categories: { slug: string; title: string; emoji?: string }[];
}) {
  return (
    <div className="hidden lg:block">
      <div className="rounded-2xl bg-white dark:bg-neutral-950 overflow-hidden border border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
            Categories
          </h3>
        </div>
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto">
          {categories.slice(0, 12).map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group"
              >
                <span className="text-lg">
                  {cat.emoji || "📦"}
                </span>
                <span className="flex-1 truncate">{cat.title}</span>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-teal-600 transition-colors shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
