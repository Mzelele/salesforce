"use client";

import clsx from "clsx";
import { Menu } from "lib/sfcc/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <Link
      href={item.path}
      className={clsx(
        "block py-1 text-sm underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300",
        {
          "text-black dark:text-neutral-300": active,
        },
      )}
    >
      {item.title}
    </Link>
  );
}

export default function FooterMenu({ menu, className }: { menu: Menu[]; className?: string }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul className={className}>
        {menu.map((item: Menu, index: number) => {
          return (
            <li key={item.title} className="flex items-center">
              <FooterMenuItem item={item} />
              {index < menu.length - 1 && (
                <span className="mx-2 text-neutral-300 dark:text-neutral-600">|</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
