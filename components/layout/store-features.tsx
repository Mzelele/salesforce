import { getStoreSettings } from "lib/storefront/settings";
import { BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

export async function StoreFeatures() {
  const settings = await getStoreSettings();
  
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
      description: `Always here to help you${settings.storePhone ? `\nCall/Text: ${settings.storePhone}` : ""}`,
    },
    {
      icon: <BadgeCheck className="h-5 w-5" />,
      title: "Warranty",
      description: "Official brand warranties",
    },
  ];

  return (
    <div className="hidden lg:block">
      <div className="rounded-2xl bg-white dark:bg-neutral-950 overflow-hidden border border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-sm">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
            Why Shop With Us
          </h3>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="text-teal-600 mt-0.5 shrink-0">{feature.icon}</div>
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {feature.title}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 whitespace-pre-line">
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
