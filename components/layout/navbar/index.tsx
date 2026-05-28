"use client";

import LogoSquare from "components/logo-square";
import { Collection, Menu } from "lib/sfcc/types";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5.01L2 22l5.09-1.34A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.58 0-3.05-.46-4.3-1.26l-.31-.19-3.06.8.82-2.83-.21-.33A8.02 8.02 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8zm4.24-5.76c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4l-.46-.02c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.5.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function WhatsAppNavButton({ phone }: { phone?: string }) {
  const cleanPhone = phone?.replace(/\D/g, "");
  if (!cleanPhone) return null;

  const formattedPhone = cleanPhone.startsWith("254")
    ? `+${cleanPhone}`
    : cleanPhone.startsWith("0")
      ? `+254${cleanPhone.slice(1)}`
      : `+${cleanPhone}`;

  const text = encodeURIComponent("Hi, I'd like to inquire about your products.");
  const href = `https://wa.me/${cleanPhone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700 md:flex"
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold">Ask on WhatsApp</span>
        <span className="text-[10px] opacity-90">Call/WhatsApp: {formattedPhone}</span>
      </div>
    </a>
  );
}

const CartModal = dynamic(() => import("components/cart/modal"), { ssr: false });

export function Navbar({
  menu,
  categories,
  settings,
}: {
  menu: Menu[];
  categories: Collection[];
  settings: Record<string, any>;
}) {
  const iconUrl = settings.faviconUrl && settings.faviconUrl !== "/favicon.ico" ? settings.faviconUrl : undefined;
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith("/product/") ?? false;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-200 bg-white p-4 lg:px-6 dark:border-neutral-800 dark:bg-black">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} categories={categories} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName}
                className="h-8 w-auto max-w-[160px] object-contain md:h-10"
              />
            ) : (
              <>
                {settings.showLogoIcon && (
                  <LogoSquare iconUrl={iconUrl} logoIconUrl={settings.logoIconUrl || undefined} />
                )}
                <div
                  className={`flex-none text-base font-bold text-black md:hidden lg:block dark:text-white${
                    settings.showLogoIcon ? " ml-2" : ""
                  }`}
                >
                  {settings.storeName}
                </div>
              </>
            )}
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => {
                const isCatalog =
                  item.title.toLowerCase() === "catalog" ||
                  item.title.toLowerCase() === "shop" ||
                  item.path === "/shop";
                if (isCatalog && categories.length) {
                  return (
                    <li key={item.title} className="group relative">
                      <Link
                        href={item.path}
                        prefetch={true}
                        className="flex items-center gap-1 text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {item.title}
                        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                      </Link>
                      <div className="absolute left-0 top-full z-50 hidden min-w-[200px] rounded-md border border-neutral-200 bg-white py-2 shadow-lg group-hover:block dark:border-neutral-700 dark:bg-neutral-900">
                        {categories.map((cat) => (
                          <Link
                            key={cat.handle}
                            href={`/category/${cat.handle}`}
                            prefetch={true}
                            className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                          >
                            {cat.title}
                          </Link>
                        ))}
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex items-center justify-end gap-3 md:w-1/3">
          {!isProductPage && (
            <WhatsAppNavButton
              phone={settings.whatsappPhone || settings.storePhone}
            />
          )}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
