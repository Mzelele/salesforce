import { CategoriesSidebar } from "./categories-sidebar";
import { HeroBanner } from "./hero-banner";
import { StoreFeatures } from "./store-features";

export function HeroSection({
  categories,
}: {
  categories: { slug: string; title: string }[];
}) {
  return (
    <section className="mx-auto mb-6 w-full max-w-7xl px-4 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-4 items-stretch">
        <CategoriesSidebar categories={categories} />
        <div className="min-w-0">
          <HeroBanner />
        </div>
        <StoreFeatures />
      </div>
    </section>
  );
}
