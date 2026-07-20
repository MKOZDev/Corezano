"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils/formatPrice";
import { redirectToCheckout } from "@/lib/cart/checkout";

export function CartDrawer() {
  const t = useTranslations("cart");
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  }

  function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const payload = items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        ...(item.variationId ? { variationId: item.variationId } : {}),
        ...(item.attributes ? { attributes: item.attributes } : {}),
      }));
      redirectToCheckout(payload);
    } catch (e) {
      console.error(e);
      setIsCheckingOut(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={
          isClosing
            ? "absolute inset-0 bg-black/50 animate-fade-out-overlay"
            : "absolute inset-0 bg-black/50 animate-fade-in-overlay"
        }
        onClick={handleClose}
      />

      <div
        className={
          "relative w-full max-w-md h-full bg-cv-surface flex flex-col " +
          (isClosing ? "animate-slide-out-right" : "animate-slide-in-right")
        }
      >
        <div className="flex items-center justify-between p-5 border-b border-cv-border">
          <h2 className="font-display text-lg font-bold text-cv-text">
            {t("title")}{" "}
            <span className="text-cv-dim font-normal">({itemCount})</span>
          </h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-cv border border-cv-border hover:bg-cv-surface2 transition-colors"
            aria-label={t("close")}
          >
            <X className="w-4 h-4 text-cv-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-5 text-sm text-cv-dim">{t("empty")}</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-5 border-b border-cv-border"
              >
                <div className="relative w-16 h-16 rounded-cv overflow-hidden bg-cv-elev shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-cv-text line-clamp-2">
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-cv-faint hover:text-cv-text transition-colors"
                      aria-label={t("remove")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 border border-cv-border rounded-cv">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center hover:bg-cv-surface2 transition-colors"
                        aria-label={t("less")}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center hover:bg-cv-surface2 transition-colors"
                        aria-label={t("more")}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-mono font-semibold text-cv-text">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-cv-border bg-cv-surface2 p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between mt-1">
              <span className="font-display font-bold text-cv-text">
                {t("total")}
              </span>
              <span className="font-display font-bold text-cv-accent-ink text-lg">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <button
              // onClick={handleCheckout}
              disabled={isCheckingOut}
              className="mt-3 w-full py-4 rounded-cv cursor-pointer bg-cv-accent text-cv-on-accent font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isCheckingOut ? t("loading") : t("checkout")}
            </button>

            <p className="text-center text-xs text-cv-faint mt-1">
              {t("paymentNote")}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
