"use client";

import {
  Armchair,
  ChevronRight,
  CookingPot,
  Gamepad2,
  Home,
  Monitor,
  Plug,
  Scissors,
  ShoppingBasket,
  Smartphone,
  Speaker,
  Tv,
  Watch,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  smartphones: <Smartphone className="h-4 w-4" />,
  "phones & tablets": <Smartphone className="h-4 w-4" />,
  "tv & audio": <Tv className="h-4 w-4" />,
  appliances: <CookingPot className="h-4 w-4" />,
  "health & beauty": <Scissors className="h-4 w-4" />,
  "home & office": <Home className="h-4 w-4" />,
  fashion: <ShoppingBasket className="h-4 w-4" />,
  computing: <Monitor className="h-4 w-4" />,
  gaming: <Gamepad2 className="h-4 w-4" />,
  electronics: <Plug className="h-4 w-4" />,
  furniture: <Armchair className="h-4 w-4" />,
  audio: <Speaker className="h-4 w-4" />,
  watches: <Watch className="h-4 w-4" />,
};

function getIcon(title: string) {
  const key = title.toLowerCase();
  for (const [k, v] of Object.entries(iconMap)) {
    if (key.includes(k)) return v;
  }
  return <ChevronRight className="h-4 w-4" />;
}

export function CategoriesSidebar({
  categories,
}: {
  categories: { slug: string; title: string; emoji?: string }[];
}) {
  return (
    <div className="hidden lg:block">
      <div className="flex h-[392px] flex-col overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-neutral-200 px-4 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Categories
          </h3>
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-neutral-200 overflow-y-auto">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="group flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                  {cat.emoji || getIcon(cat.title)}
                </span>
                <span className="flex-1 truncate text-neutral-900">{cat.title}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 transition-colors group-hover:text-blue-600" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
