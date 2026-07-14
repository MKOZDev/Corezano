import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";

export function Bestsellers({ products = [] }) {
  const t = useTranslations("bestsellers");

  if (!products.length) return null;

  return (
    <section className="mt-8 max-sm:mt-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wide text-cv-accent-ink">
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-2xl font-bold text-cv-text">
            {t("title")}
          </h2>
        </div>

        <Link
          href="/products"
          className="px-4 py-2 rounded-cv border border-cv-border text-sm text-cv-text hover:bg-cv-surface2 transition-colors"
        >
          {t("viewAll")} →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
