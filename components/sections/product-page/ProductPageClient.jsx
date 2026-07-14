"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { Wrapper } from "@/components/ui/Wrapper";
import { ProductCard } from "@/components/product/product-card";
import {
  decodeHtmlEntities,
  parsePriceToNumber,
} from "@/lib/utils/formatPrice";

const STOCK_MAP = {
  IN_STOCK: { key: "inStock", color: "text-green-500" },
  OUT_OF_STOCK: { key: "outOfStock", color: "text-red-500" },
  ON_BACKORDER: { key: "onBackorder", color: "text-blue-400" },
};

function prettifyValue(val) {
  if (!val) return "";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.08 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
};

export function ProductPageClient({ product, similarProducts = [] }) {
  const t = useTranslations("productPage");
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("specs");
  const [activeImage, setActiveImage] = useState(0);

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.galleryImages?.nodes || []),
  ];

  const brand = product.productBrands?.nodes?.[0];
  const category = product.productCategories?.nodes?.[0];
  const displayPrice = product.onSale ? product.salePrice : product.price;
  const stock = STOCK_MAP[product.stockStatus] || STOCK_MAP.IN_STOCK;
  const visibleAttributes = (product.attributes?.nodes || []).filter(
    (a) => a.visible,
  );

  function handleAddToCart() {
    addItem({
      id: product.databaseId,
      slug: product.slug,
      name: product.name,
      image: product.image?.sourceUrl,
      price: parsePriceToNumber(displayPrice),
    });
  }

  return (
    <main className="py-8">
      <Wrapper>
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-cv-faint mb-6 flex gap-2 flex-wrap"
        >
          <Link href="/" className="hover:text-cv-text transition-colors">
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          {category ? (
            <>
              <Link
                href={"/products?category=" + category.slug}
                className="hover:text-cv-text transition-colors"
              >
                {category.name}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-cv-dim">{product.name}</span>
          <span>/</span>
        </motion.nav>

        {/* Główna sekcja */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Galeria — wchodzi z lewej */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <div className="relative aspect-[4/3] bg-cv-elev rounded-cv overflow-hidden border border-cv-border">
              <AnimatePresence mode="wait">
                {allImages[activeImage] ? (
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={allImages[activeImage].sourceUrl}
                      alt={allImages[activeImage].altText || product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {allImages.length > 1 ? (
              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={
                      "relative w-16 h-16 rounded-cv overflow-hidden border transition-colors " +
                      (i === activeImage
                        ? "border-cv-accent"
                        : "border-cv-border hover:border-cv-border2")
                    }
                  >
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Info — wchodzi z prawej, stagger na elementach */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="flex flex-col gap-5"
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex items-center gap-2 flex-wrap"
            >
              {brand ? (
                <span className="text-sm text-cv-dim">{brand.name}</span>
              ) : null}
              {category ? (
                <>
                  <span className="text-cv-faint">·</span>
                  <span className="text-sm text-cv-dim">{category.name}</span>
                </>
              ) : null}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-3xl font-bold text-cv-text leading-tight"
            >
              {product.name}
            </motion.h1>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex items-center gap-2"
            >
              <span className={"text-sm font-medium " + stock.color}>
                {"● " + t(stock.key)}
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="bg-cv-surface2 border border-cv-border rounded-cv p-4 flex flex-col gap-3"
            >
              <div className="flex items-baseline gap-2">
                {product.onSale && product.regularPrice ? (
                  <span className="text-cv-faint text-sm line-through">
                    {decodeHtmlEntities(product.regularPrice)}
                  </span>
                ) : null}
                <span className="font-display text-3xl font-bold text-cv-accent-ink">
                  {decodeHtmlEntities(displayPrice)}
                </span>
                <span className="text-xs text-cv-faint">{t("inclVat")}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-cv-dim">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>{t("delivery")}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-cv bg-cv-accent text-cv-on-accent font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
                {t("addToCart")}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-cv-faint pt-1">
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  {t("returnPolicy")}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t("warranty")}
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {t("payment")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mt-10 border-b border-cv-border"
        >
          <div className="flex gap-6">
            {["specs", "description"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  "pb-3 text-sm font-medium border-b-2 transition-colors " +
                  (activeTab === tab
                    ? "border-cv-accent text-cv-text"
                    : "border-transparent text-cv-faint hover:text-cv-text")
                }
              >
                {t("tabs." + tab)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content z AnimatePresence */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === "specs" ? (
              <motion.div
                key="specs"
                initial={fadeIn.hidden}
                animate={fadeIn.visible}
                exit={fadeIn.hidden}
                className="border border-cv-border rounded-cv overflow-hidden"
              >
                {visibleAttributes.map((attr, i) => (
                  <div
                    key={attr.name}
                    className={
                      "grid grid-cols-2 px-4 py-3 text-sm " +
                      (i % 2 === 0 ? "bg-cv-surface" : "bg-cv-surface2")
                    }
                  >
                    <span className="text-cv-dim">
                      {attr.label || attr.name}
                    </span>
                    <span className="text-cv-text font-medium">
                      {attr.options?.map((o) => prettifyValue(o)).join(", ")}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="description"
                initial={fadeIn.hidden}
                animate={fadeIn.visible}
                exit={fadeIn.hidden}
                className="prose prose-sm max-w-none text-cv-dim leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Podobne produkty — stagger */}
        {similarProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="font-display text-xl font-bold text-cv-text mb-4">
              {t("similarProducts")}
            </h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
            >
              {similarProducts.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: "easeOut" },
                    },
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </Wrapper>
    </main>
  );
}
