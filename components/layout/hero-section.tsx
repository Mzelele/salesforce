import { CategoriesSidebar } from "./categories-sidebar";
import { HeroBanner } from "./hero-banner";
import { StoreFeatures } from "./store-features";

export function HeroSection({
  categories,
}: {
  categories: { slug: string; title: string; emoji?: string }[];
}) {
  return (
    <section className="w-full" style={{ backgroundColor: "#E1F3FF" }}>
      {/* Desktop 3-column layout */}
      <div className="mx-auto hidden max-w-7xl px-4 py-6 lg:block lg:px-6">
        <div className="grid grid-cols-[220px_1fr_240px] gap-4 items-start">
          <CategoriesSidebar categories={categories} />
          <div className="min-w-0">
            <HeroBanner />
          </div>
          <StoreFeatures />
        </div>
      </div>

      {/* Mobile layout - full width hero */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <HeroBanner />
        </div>
      </div>

      {/* Mobile category shortcuts */}
      <div className="border-t border-neutral-100 py-6 lg:hidden" style={{ backgroundColor: "#E1F3FF" }}>
      </div>
    </section>
  );
}
