import { CategoriesSidebar } from "./categories-sidebar";
import { HeroBanner } from "./hero-banner";
import { StoreFeatures } from "./store-features";

export function HeroSection({
  categories,
}: {
  categories: { slug: string; title: string; emoji?: string }[];
}) {
  return (
    <section className="mb-6 w-full mt-0 lg:mt-4 lg:mx-auto lg:max-w-7xl lg:px-4">
      <div className="hidden lg:grid lg:grid-cols-[220px_1fr_240px] gap-4 items-start">
        <CategoriesSidebar categories={categories} />
        <div className="min-w-0">
          <HeroBanner />
        </div>
        <StoreFeatures />
      </div>
      
      {/* Mobile layout - full width hero */}
      <div className="lg:hidden">
        <HeroBanner />
      </div>
    </section>
  );
}
