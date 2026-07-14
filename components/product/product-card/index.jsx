"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  decodeHtmlEntities,
  parsePriceToNumber,
} from "@/lib/utils/formatPrice";
import { getBrandFromName } from "@/lib/utils/formatAttribute";

const STOCK_STATUS = {
  IN_STOCK: { label: "In stock", color: "text-green-500" },
  OUT_OF_STOCK: { label: "Out of stock", color: "text-red-500" },
  ON_BACKORDER: { label: "Pre-order", color: "text-blue-400" },
  LIMITED: { label: "Limited stock", color: "text-orange-400" },
};

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const brandNode = product.productBrands?.nodes?.[0];
  const brand = brandNode?.name || getBrandFromName(product.name);

  const displayPrice = product.onSale ? product.salePrice : product.price;
  const numericPrice = parsePriceToNumber(displayPrice);

  const discountPercent =
    product.onSale && product.regularPrice
      ? Math.round(
          (1 -
            parsePriceToNumber(product.salePrice) /
              parsePriceToNumber(product.regularPrice)) *
            100,
        )
      : null;

  const stock = STOCK_STATUS[product.stockStatus] || STOCK_STATUS.IN_STOCK;

  const attributes = product.attributes?.nodes || [];
  const specLine = attributes
    .slice(0, 2)
    .map((a) => {
      const val = a.options?.[0] || "";
      return val
        .split("-")
        .map((w) => {
          const units = {
            gb: "GB",
            mb: "MB",
            mhz: "MHz",
            ghz: "GHz",
            mm: "mm",
            w: "W",
          };
          return (
            units[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1)
          );
        })
        .join(" ");
    })
    .filter(Boolean)
    .join(" · ");

  function handleAddToCart(e) {
    e.preventDefault();
    addItem({
      id: product.databaseId,
      slug: product.slug,
      name: product.name,
      image: product.image?.sourceUrl,
      price: numericPrice,
    });
  }

  function handleClick() {
    setLoading(true);
  }

  return (
    <Link
      href={"/products/" + product.slug}
      onClick={handleClick}
      className="group flex flex-col bg-cv-surface border border-cv-border rounded-cv overflow-hidden hover:border-cv-border2 transition-all hover:-translate-y-0.5 hover:shadow-cv"
    >
      <div className="relative aspect-square bg-cv-elev overflow-hidden">
        {product.onSale && discountPercent ? (
          <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-cv bg-red-500 text-white text-xs font-bold">
            -{discountPercent}%
          </span>
        ) : null}

        {product.image?.sourceUrl ? (
          <Image
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        {/* Loader overlay na zdjęciu */}
        {loading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-cv-elev/70 backdrop-blur-[2px]">
            <Loader2 className="w-8 h-8 animate-spin text-cv-accent" />
          </div>
        ) : null}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-cv-faint">{brand}</span>
          <span className={"text-xs font-medium " + stock.color}>
            {"● " + stock.label}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-cv-text line-clamp-2 min-h-[2.5rem] group-hover:text-cv-accent-ink transition-colors">
          {product.name}
        </h3>

        {specLine ? <p className="text-xs text-cv-dim">{specLine}</p> : null}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex flex-col">
            {product.onSale && product.regularPrice ? (
              <span className="text-xs text-cv-faint line-through">
                {decodeHtmlEntities(product.regularPrice)}
              </span>
            ) : null}
            <span
              className={
                product.onSale
                  ? "font-mono font-bold text-red-500"
                  : "font-mono font-bold text-cv-accent-ink"
              }
            >
              {decodeHtmlEntities(displayPrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-9 h-9 flex items-center justify-center rounded-cv border border-cv-border transition-colors hover:bg-cv-accent hover:border-cv-accent hover:text-cv-on-accent"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
