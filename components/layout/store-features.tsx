import { BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Fast Delivery",
    description: "Same-day delivery in Nairobi",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Quality Assurance",
    description: "100% genuine products guaranteed",
  },
  {
    icon: <RotateCcw className="h-5 w-5" />,
    title: "Easy Returns",
    description: "7-day hassle-free returns",
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: "24/7 Support",
    description: "Always here to help you",
  },
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: "Warranty",
    description: "Official brand warranties",
  },
];

export function StoreFeatures() {
  return (
    <div className="hidden lg:block">
      <div className="rounded-2xl bg-white overflow-hidden border border-neutral-200 h-full flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-900">
            Why Shop With Us
          </h3>
        </div>
        <div className="divide-y divide-neutral-200 overflow-y-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="text-blue-600 mt-0.5 shrink-0">{feature.icon}</div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {feature.title}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
