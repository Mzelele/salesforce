import { HeroBannerCarousel } from "components/layout/hero-banner-carousel";
import { getStoreSettings } from "lib/storefront/settings";
import Link from "next/link";

export async function HeroBanner() {
  const settings = await getStoreSettings();

  if (!settings.heroEnabled) {
    return null;
  }

  const bgColor = settings.heroBgColor || "#f5f5dc";
  const primaryColor = settings.primaryColor || "#2563eb";

  if (settings.heroMode === "image") {
    const images = settings.heroImageUrls.length
      ? settings.heroImageUrls
      : settings.heroImageUrl
        ? [settings.heroImageUrl]
        : [];

    if (!images.length) return null;

    const img = <HeroBannerCarousel images={images} interval={settings.heroAutoplayInterval as 3000 | 5000} />;

    if (settings.heroButtonLink) {
      return (
        <div className="w-full">
          <Link href={settings.heroButtonLink} className="block">
            {img}
          </Link>
        </div>
      );
    }

    return <div className="w-full">{img}</div>;
  }

  // text mode
  if (!settings.heroTitle) return null;

  return (
    <section className="mb-4">
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-10 text-center sm:px-8 sm:py-14 md:px-10 md:py-18 border border-neutral-200 shadow-sm dark:border-neutral-800"
        style={{ backgroundColor: bgColor }}
      >
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl" style={{ color: "#0f172a" }}>
            {settings.heroTitle}
          </h2>
          {settings.heroSubtitle ? (
            <p className="text-base font-medium sm:text-lg" style={{ color: "#334155" }}>
              {settings.heroSubtitle}
            </p>
          ) : null}
          {settings.heroButtonLink ? (
            <Link
              href={settings.heroButtonLink}
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:px-10 sm:py-3.5 sm:text-base"
              style={{ backgroundColor: primaryColor }}
            >
              {settings.heroButtonText || "Shop Now"}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
