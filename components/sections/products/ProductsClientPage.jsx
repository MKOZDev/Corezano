"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Wrapper } from "@/components/ui/Wrapper";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "@/components/product/product-filters";
import { MobileFiltersSheet } from "@/components/product/product-filters/MobileFilterSheet";

export function ProductsClientPage({
  initialProducts = [],
  categories = [],
  brands = [],
  attributes = [],
}) {
  const t = useTranslations("products");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (isPending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isPending]);

  const SORT_OPTIONS = [
    { value: "DATE_DESC", label: t("sortOptions.popularity") },
    { value: "PRICE_ASC", label: t("sortOptions.priceAsc") },
    { value: "PRICE_DESC", label: t("sortOptions.priceDesc") },
    { value: "NAME_ASC", label: t("sortOptions.nameAsc") },
  ];

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value || value === 0) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    setShowSkeleton(true);
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  }

  function handleCategoryChange(slug) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    for (const key of Array.from(params.keys())) {
      if (key.startsWith("attr_")) params.delete(key);
    }
    setShowSkeleton(true);
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  }

  function handlePriceChange(min, max) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    setShowSkeleton(true);
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  }

  function handleAttrChange(attrName, value) {
    const params = new URLSearchParams(searchParams.toString());
    const key = "attr_" + attrName;
    const current = params.get(key);
    if (current === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setShowSkeleton(true);
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  }

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeSort = searchParams.get("sort") || "DATE_DESC";
  const activeMinPrice = Number(searchParams.get("minPrice") || 0);
  const activeMaxPrice = Number(searchParams.get("maxPrice") || 2000);

  const activeAttrs = {};
  for (const [key, val] of searchParams.entries()) {
    if (key.startsWith("attr_")) {
      activeAttrs[key.replace("attr_", "")] = val;
    }
  }

  const filterLabels = {
    title: t("filters.title"),
    category: t("filters.category"),
    brand: t("filters.brand"),
    price: t("filters.price"),
  };

  const filterProps = {
    brands,
    categories,
    attributes,
    activeBrand,
    activeCategory,
    activeAttrs,
    activeMinPrice,
    activeMaxPrice,
    onBrandChange: (slug) => updateParam("brand", slug),
    onCategoryChange: handleCategoryChange,
    onAttrChange: handleAttrChange,
    onPriceChange: handlePriceChange,
    labels: filterLabels,
  };

  const activeCount = [
    activeBrand,
    activeCategory,
    ...Object.keys(activeAttrs),
    activeMinPrice > 0 ? "min" : "",
    activeMaxPrice < 2000 ? "max" : "",
  ].filter(Boolean).length;

  const categoryName =
    categories.find((c) => c.slug === activeCategory)?.name || "";

  const filteredProducts = initialProducts
    .filter((p) => {
      if (!activeBrand) return true;
      return p.productBrands?.nodes?.some((b) => b.slug === activeBrand);
    })
    .filter((p) => {
      const price = parsePriceToNumber(p.onSale ? p.salePrice : p.price);
      if (activeMaxPrice === 2000) return price >= activeMinPrice;
      return price >= activeMinPrice && price <= activeMaxPrice;
    })
    .filter((p) => {
      const attrs = p.attributes?.nodes || [];
      for (const [attrName, attrValue] of Object.entries(activeAttrs)) {
        const found = attrs.find(
          (a) => a.name === attrName && a.options?.includes(attrValue),
        );
        if (!found) return false;
      }
      return true;
    });

  return (
    <main className="py-8">
      <Wrapper>
        <nav className="text-xs text-cv-faint mb-6 flex gap-2">
          <span>{t("breadcrumb.home")}</span>
          <span>/</span>
          {categoryName ? (
            <>
              <span className="text-cv-dim">{categoryName}</span>
              <span>/</span>
            </>
          ) : (
            <>
              <span>{t("breadcrumb.products")}</span>
              <span>/</span>
            </>
          )}
        </nav>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold text-cv-text">
            {categoryName || t("allProducts")}
            <span className="ml-2 text-cv-faint text-base font-normal font-sans">
              {filteredProducts.length} {t("results")}
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-sm text-cv-dim hidden sm:block">
              {t("sort")}
            </span>
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="text-sm bg-cv-surface border border-cv-border rounded-cv px-3 py-1.5 text-cv-text"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filters button */}
        <div className="mb-4 lg:hidden">
          <MobileFiltersSheet {...filterProps} activeCount={activeCount} />
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0 sticky top-[calc(3.5rem+1.5rem)] self-start">
            <ProductFilters {...filterProps} />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {showSkeleton ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-cv-dim text-sm">{t("noProducts")}</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </main>
  );
}

function parsePriceToNumber(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}
