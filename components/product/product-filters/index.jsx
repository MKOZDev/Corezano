"use client";

import { useState } from "react";

function prettifyValue(val) {
  const units = {
    gb: "GB",
    mb: "MB",
    tb: "TB",
    mhz: "MHz",
    ghz: "GHz",
    mm: "mm",
    cm: "cm",
    w: "W",
  };
  return val
    .split("-")
    .map(
      (w) => units[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

const SHOW_LIMIT = 4;

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="flex flex-col gap-2 pt-5 pb-2">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-mono uppercase tracking-wide text-cv-faint">
          {title}
        </span>
        <svg
          className={
            "w-3.5 h-3.5 text-cv-faint transition-transform duration-200 " +
            (isOpen ? "rotate-180" : "")
          }
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

function CheckboxList({
  items,
  activeValue,
  onChange,
  renderLabel,
  renderCount,
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, SHOW_LIMIT);
  const hasMore = items.length > SHOW_LIMIT;

  return (
    <div className="flex flex-col gap-1.5">
      {visible.map((item, i) => (
        <label
          key={i}
          className="flex items-center justify-between gap-2 cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeValue(item)}
              onChange={() => onChange(item)}
              className="w-4 h-4 accent-cv-accent shrink-0"
            />
            <span className="text-sm text-cv-text group-hover:text-cv-accent-ink transition-colors">
              {renderLabel(item)}
            </span>
          </div>
          {renderCount ? (
            <span className="text-xs text-cv-faint shrink-0">
              {renderCount(item)}
            </span>
          ) : null}
        </label>
      ))}

      {hasMore ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-cv-accent-ink hover:underline text-left mt-1 flex items-center gap-1"
        >
          {expanded ? (
            <>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
              Show less
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              {items.length - SHOW_LIMIT} more
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

export function ProductFilters({
  brands = [],
  categories = [],
  attributes = [],
  activeBrand = "",
  activeCategory = "",
  activeAttrs = {},
  activeMinPrice = 0,
  activeMaxPrice = 2000,
  onBrandChange,
  onCategoryChange,
  onAttrChange,
  onPriceChange,
  noBorder = false,
  labels = {
    title: "Filters",
    category: "Category",
    brand: "Brand",
    price: "Price",
  },
}) {
  const MIN = 0;
  const MAX = 2000;
  const [localMin, setLocalMin] = useState(activeMinPrice);
  const [localMax, setLocalMax] = useState(activeMaxPrice);

  // Jeden aktywny section na raz — domyślnie "category"
  const [activeSection, setActiveSection] = useState("category");

  function toggle(key) {
    setActiveSection((prev) => (prev === key ? null : key));
  }

  function handleCommit() {
    onPriceChange(localMin, localMax);
  }

  const minPercent = ((localMin - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((localMax - MIN) / (MAX - MIN)) * 100;

  // Klucze dla sekcji atrybutów
  const attrSections = attributes.map((attr) => "attr_" + attr.name);

  return (
    <div
      className={
        "flex flex-col divide-y divide-cv-border " +
        (noBorder ? "" : "bg-cv-surface border border-cv-border rounded-cv p-5")
      }
    >
      <span className="font-display text-sm font-bold text-cv-text pb-5">
        {labels.title}
      </span>

      {categories.length > 0 ? (
        <FilterSection
          title={labels.category}
          isOpen={activeSection === "category"}
          onToggle={() => toggle("category")}
        >
          <CheckboxList
            items={categories}
            activeValue={(cat) => activeCategory === cat.slug}
            onChange={(cat) =>
              onCategoryChange(activeCategory === cat.slug ? "" : cat.slug)
            }
            renderLabel={(cat) => cat.name}
            renderCount={(cat) => cat.products?.nodes?.length ?? cat.count ?? 0}
          />
        </FilterSection>
      ) : null}

      {brands.length > 0 ? (
        <FilterSection
          title={labels.brand}
          isOpen={activeSection === "brand"}
          onToggle={() => toggle("brand")}
        >
          <CheckboxList
            items={brands}
            activeValue={(brand) => activeBrand === brand.slug}
            onChange={(brand) =>
              onBrandChange(activeBrand === brand.slug ? "" : brand.slug)
            }
            renderLabel={(brand) => brand.name}
            renderCount={(brand) => brand.count || null}
          />
        </FilterSection>
      ) : null}

      {attributes.map((attr) => (
        <FilterSection
          key={attr.name}
          title={attr.label}
          isOpen={activeSection === "attr_" + attr.name}
          onToggle={() => toggle("attr_" + attr.name)}
        >
          <CheckboxList
            items={attr.values}
            activeValue={(val) => activeAttrs[attr.name] === val}
            onChange={(val) => onAttrChange(attr.name, val)}
            renderLabel={(val) => prettifyValue(val)}
          />
        </FilterSection>
      ))}

      <FilterSection
        title={labels.price}
        isOpen={activeSection === "price"}
        onToggle={() => toggle("price")}
      >
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between text-sm text-cv-dim">
            <span>€ {localMin}</span>
            <span>€ {localMax}</span>
          </div>
          <div className="relative h-5 flex items-center">
            <div className="absolute w-full h-1 bg-cv-border rounded-full" />
            <div
              className="absolute h-1 bg-cv-accent rounded-full"
              style={{ left: minPercent + "%", right: 100 - maxPercent + "%" }}
            />
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={10}
              value={localMin}
              onChange={(e) =>
                setLocalMin(Math.min(Number(e.target.value), localMax - 50))
              }
              onMouseUp={handleCommit}
              onTouchEnd={handleCommit}
              className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
              style={{ zIndex: localMin > MAX - 100 ? 5 : 3 }}
            />
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={10}
              value={localMax}
              onChange={(e) =>
                setLocalMax(Math.max(Number(e.target.value), localMin + 50))
              }
              onMouseUp={handleCommit}
              onTouchEnd={handleCommit}
              className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
