"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartTrigger() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative w-9 h-9 flex items-center justify-center rounded-cv border border-cv-border hover:bg-cv-surface2 transition-colors"
      aria-label="Winkelwagen openen"
    >
      <ShoppingCart className="w-4 h-4 text-cv-text" />
      {itemCount > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-cv-accent text-cv-on-accent text-[10px] font-bold">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
