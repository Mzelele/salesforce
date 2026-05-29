"use client";

import Link from "next/link";
import {
  Smartphone,
  Tv,
  Home,
  CookingPot,
  Scissors,
  ShoppingBasket,
  Speaker,
  Plug,
  Armchair,
  Watch,
  Gamepad2,
  Monitor,
  ChevronRight,
} from "lucide-react";

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
  categories: { slug: string; title: string }[];
}) {
  return (
    <div className="hidden lg:block">
      <div className="rounded-xl bg-white dark:bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
            Categories
          </h3>
        </div>
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {categories.slice(0, 12).map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
              >
                <span className="text-neutral-400 group-hover:text-teal-600 transition-colors">
                  {getIcon(cat.title)}
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
