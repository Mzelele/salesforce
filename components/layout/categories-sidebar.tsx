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
      <div className="rounded-2xl bg-white overflow-hidden border border-neutral-200 h-full flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-900">
            Categories
          </h3>
        </div>
        <ul className="divide-y divide-neutral-200 overflow-y-auto">
          {categories.slice(0, 12).map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors group"
              >
                <span className="text-lg">
                  {cat.emoji || "📦"}
                </span>
                <span className="flex-1 truncate text-neutral-900">{cat.title}</span>
                <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
