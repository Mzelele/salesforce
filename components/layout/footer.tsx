import FooterMenu from "components/layout/footer-menu";
import { getMenu } from "lib/storefront/content";
import { getStoreSettings } from "lib/storefront/settings";
import { Suspense } from "react";

export default async function Footer() {
  const skeleton =
    "w-16 h-4 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  const [menu, settings] = await Promise.all([
    getMenu("next-js-frontend-footer-menu"),
    getStoreSettings(),
  ]);

  return (
    <footer className="border-t border-neutral-200 py-5 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4">
        <Suspense
          fallback={
            <div className="flex items-center gap-4">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} className="flex flex-wrap items-center justify-center" />
        </Suspense>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
