import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Categories({ categories = [] }) {
  const t = useTranslations("categories");

  if (!categories.length) return null;

  return (
    <section className="mt-8 max-sm:mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.map((category) => {
          const productCount = category.products?.nodes?.length ?? 0;

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative flex flex-col justify-between h-40 bg-cv-surface border border-cv-border rounded-cv overflow-hidden hover:border-cv-border2 transition-colors"
            >
              {category.image?.sourceUrl ? (
                <div className="absolute right-0 top-0 h-full w-[45%]">
                  <Image
                    src={category.image.sourceUrl}
                    alt={category.image.altText || category.name}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="relative z-10 p-5">
                <span className="font-mono text-sm uppercase tracking-wide text-cv-accent-ink">
                  {category.name}
                </span>
              </div>

              <div className="relative z-10 px-5 py-4">
                <span className="text-sm text-cv-dim inline-flex items-center gap-1.5">
                  {productCount} {t("products")}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
