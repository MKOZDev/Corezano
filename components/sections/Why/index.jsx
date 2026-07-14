import { useTranslations } from "next-intl";

import { Sparkles, Zap, Settings, ShieldCheck } from "lucide-react";

const FEATURE_ICONS = [
  { key: "brands", icon: Sparkles, iconColor: "text-cv-accent-ink" },
  { key: "delivery", icon: Zap, iconColor: "text-orange-500" },
  { key: "curated", icon: Settings, iconColor: "text-cv-accent-ink" },
  { key: "payment", icon: ShieldCheck, iconColor: "text-cv-accent-ink" },
];

export function Why({ brands = [] }) {
  const t = useTranslations("why");

  return (
    <section className="my-8 max-sm:my-5">
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wide text-cv-accent-ink">
          {t("eyebrow")}
        </span>
        <h2 className="font-display text-2xl font-bold text-cv-text">
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-cv-border rounded-cv overflow-hidden bg-cv-surface">
        {FEATURE_ICONS.map(({ key, icon: Icon, iconColor }, i) => (
          <div
            key={key}
            className={
              "flex flex-col gap-3 p-6 " +
              "border-cv-border " +
              (i % 2 === 0 ? "sm:border-r " : "sm:border-r-0 ") +
              (i < 3 ? "lg:border-r " : "lg:border-r-0 ") +
              (i < 2 ? "sm:border-b lg:border-b-0 " : "sm:border-b-0 ") +
              (i < 3 ? "border-b sm:border-b " : "border-b-0 ")
            }
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-cv border border-cv-border bg-cv-surface2">
              <Icon className={"w-4 h-4 " + iconColor} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-cv-text">
                {t("features." + key + ".title")}
              </span>
              <p className="text-xs text-cv-dim leading-relaxed">
                {t("features." + key + ".description")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {brands.length > 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-cv-faint">
            {t("brandsLabel")}
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((brand) => (
              <span
                key={brand.id}
                className="px-4 py-2 rounded-cv border border-cv-border bg-cv-surface text-sm font-semibold text-cv-text"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
