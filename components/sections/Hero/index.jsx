"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { decodeHtmlEntities } from "@/lib/utils/formatPrice";

export function Hero({ products = [] }) {
  const t = useTranslations("hero");
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products.length) return null;

  const product = products[activeIndex];
  const specs = (product.attributes?.nodes || []).slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-cv-surface border border-cv-border rounded-cv mt-8 max-sm:mt-5">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--cv-border) 1px, transparent 1px), linear-gradient(90deg, var(--cv-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 lg:p-16 items-center">
          <div
            key={"text-" + product.id}
            className="flex flex-col gap-4 animate-fade-in"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-cv-text leading-tight">
              {product.name}
            </h1>

            {product.shortDescription ? (
              <div
                className="text-cv-dim text-sm max-w-md"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            ) : null}

            {specs.length > 0 ? (
              <div className="flex gap-6 mt-2">
                {specs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs font-mono uppercase text-cv-faint">
                      {spec.name}
                    </span>
                    <span className="text-sm font-semibold text-cv-text">
                      {spec.options ? spec.options[0] : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-4 mt-4">
              <a
                href={"/products/" + product.slug}
                className="px-5 py-3 rounded-cv bg-cv-accent text-cv-on-accent font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {t("viewProduct")}
              </a>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-cv-accent-ink font-mono">
                  {decodeHtmlEntities(product.price)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              key={"image-" + product.id}
              className="relative aspect-[4/3] animate-fade-in"
            >
              {product.image && product.image.sourceUrl ? (
                <Image
                  src={product.image.sourceUrl}
                  alt={product.image.altText || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-cv"
                  style={{
                    filter: "drop-shadow(rgba(0, 0, 0, 0.5) 0px 30px 40px)",
                  }}
                  priority
                />
              ) : null}
            </div>

            {products.length > 1 ? (
              <div className="flex justify-center gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={t("goToSlide") + " " + (i + 1)}
                    className={
                      i === activeIndex
                        ? "h-1.5 rounded-full transition-all w-6 bg-cv-accent"
                        : "h-1.5 rounded-full transition-all w-3 bg-cv-border2"
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
