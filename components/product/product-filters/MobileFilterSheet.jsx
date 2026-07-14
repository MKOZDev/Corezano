"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters } from "./index";

export function MobileFiltersSheet({
  brands,
  categories,
  attributes,
  activeBrand,
  activeCategory,
  activeAttrs,
  activeMinPrice,
  activeMaxPrice,
  onBrandChange,
  onCategoryChange,
  onAttrChange,
  onPriceChange,
  labels,
  activeCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  }

  return (
    <>
      {/* Przycisk otwierający — tylko na mobile */}
      <button
        onClick={handleOpen}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-cv border border-cv-border bg-cv-surface text-sm text-cv-text"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {labels?.title || "Filters"}
        {activeCount > 0 ? (
          <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-cv-accent text-cv-on-accent text-xs font-bold">
            {activeCount}
          </span>
        ) : null}
      </button>

      {/* Overlay + Sheet */}
      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Overlay */}
          <div
            className={
              isClosing
                ? "absolute inset-0 bg-black/50 animate-fade-out-overlay"
                : "absolute inset-0 bg-black/50 animate-fade-in-overlay"
            }
            onClick={handleClose}
          />

          {/* Sheet */}
          <div
            className={
              "relative bg-cv-surface rounded-t-2xl max-h-[85vh] flex flex-col " +
              (isClosing ? "animate-slide-out-down" : "animate-slide-in-up")
            }
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-cv-border2" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-cv-border mb-5">
              <span className="font-display font-bold text-cv-text"></span>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-cv border border-cv-border hover:bg-cv-surface2 transition-colors"
              >
                <X className="w-4 h-4 text-cv-text" />
              </button>
            </div>

            {/* Filtry — scrollowalne */}
            <div className="overflow-y-auto flex-1 px-5 pb-8">
              <ProductFilters
                brands={brands}
                categories={categories}
                attributes={attributes}
                activeBrand={activeBrand}
                activeCategory={activeCategory}
                activeAttrs={activeAttrs}
                activeMinPrice={activeMinPrice}
                activeMaxPrice={activeMaxPrice}
                onBrandChange={(slug) => {
                  onBrandChange(slug);
                  handleClose();
                }}
                onCategoryChange={(slug) => {
                  onCategoryChange(slug);
                  handleClose();
                }}
                onAttrChange={onAttrChange}
                onPriceChange={onPriceChange}
                labels={labels}
                noBorder
              />
            </div>

            {/* Przycisk zamykania na dole */}
            <div className="p-4 border-t border-cv-border">
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-cv bg-cv-accent text-cv-on-accent font-bold text-sm"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
