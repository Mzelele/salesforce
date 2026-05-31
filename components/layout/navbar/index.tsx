"use client";

import LogoSquare from "components/logo-square";
import { Collection, Menu } from "lib/sfcc/types";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import MenuDrawer from "./menu-drawer";
import Search, { SearchSkeleton } from "./search";

const CartModal = dynamic(() => import("components/cart/modal"), { ssr: false });

export function Navbar({
  menu,
  categories,
  pages = [],
  settings,
}: {
  menu: any[];
  categories: Collection[];
  pages?: Menu[];
  settings: Record<string, any>;
}) {
  const iconUrl = settings.faviconUrl && settings.faviconUrl !== "/favicon.ico" ? settings.faviconUrl : undefined;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main navbar */}
      <div className="border-b border-neutral-200 px-3 py-2 lg:px-6 lg:py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 md:gap-4">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-1.5 md:gap-4">
            {/* Hamburger Drawer Menu */}
            <MenuDrawer categories={categories} pages={pages} />

            {/* Logo */}
            <Link
              href="/"
              prefetch={true}
              className="flex flex-shrink-0 items-center gap-1.5 md:gap-2"
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="h-7 w-auto max-w-[110px] object-contain md:h-8 md:max-w-[120px]"
                />
              ) : (
                <>
                  {settings.showLogoIcon && (
                    <LogoSquare iconUrl={iconUrl} logoIconUrl={settings.logoIconUrl || undefined} />
                  )}
                  <div className="text-sm font-bold text-black md:text-base">
                    {settings.storeName}
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden flex-1 max-w-md md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>

          {/* Right: Contact Dropdown + Cart */}
          <div className="flex items-center gap-1.5 md:gap-4">
            {/* Contact Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 md:px-3 md:py-2">
                <svg className="h-4.5 w-4.5 text-neutral-900 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden sm:inline">Contact</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full z-50 hidden min-w-[220px] rounded-lg border border-neutral-200 bg-white py-2 shadow-lg group-hover:block">
                {/* Call Button */}
                <a
                  href={`tel:${settings.storePhone?.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-neutral-900">Call</p>
                    <p className="text-xs text-neutral-600">{settings.storePhone}</p>
                  </div>
                </a>

                {/* WhatsApp Button */}
                {settings.whatsappPhone && (
                  <a
                    href={`https://wa.me/${settings.whatsappPhone?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                  >
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5.01L2 22l5.09-1.34A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.58 0-3.05-.46-4.3-1.26l-.31-.19-3.06.8.82-2.83-.21-.33A8.02 8.02 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-neutral-900">WhatsApp</p>
                      <p className="text-xs text-neutral-600">Message us</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Cart Icon */}
            <CartModal />
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-2 block border-t border-neutral-200 pt-2 md:hidden">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}






