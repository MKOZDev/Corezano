"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/context/CartContext";
import { Sun, Moon, ShoppingCart, Menu, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Wrapper } from "../ui/Wrapper";

export function Navbar({ categories = [] }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { itemCount, setIsOpen: openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function openMobile() {
    setMobileClosing(false);
    setMobileOpen(true);
  }

  function closeMobile() {
    if (!mobileOpen) return;
    setMobileClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setMobileClosing(false);
    }, 280);
  }

  function switchLocale(newLocale) {
    const segments = pathname.split("/").filter(Boolean);
    const newPath = "/" + newLocale + "/" + segments.join("/");
    router.push(newPath);
  }

  return (
    <>
      {/* ===== STICKY HEADER ===== */}
      <header
        className={
          "sticky top-0 z-40 bg-cv-surface border-b border-cv-border transition-all duration-200 " +
          (scrolled ? "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]" : "")
        }
      >
        <Wrapper>
          <div className="h-14 flex items-center gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 font-display font-bold text-cv-text text-base leading-none"
            >
              <span
                className="w-7 h-7 rounded-cv flex items-center justify-center font-black text-xs"
                style={{
                  background: "var(--cv-accent)",
                  color: "var(--cv-on-accent)",
                }}
              >
                CZ
              </span>
              Corezano
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={"/products?category=" + cat.slug}
                  className="px-3 py-1.5 text-sm text-cv-dim hover:text-cv-text hover:bg-cv-surface2 rounded-cv transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Prawa strona */}
            <div className="ml-auto flex items-center gap-1.5">
              {/* Przełącznik języka — desktop */}
              <div className="hidden sm:flex items-center border border-cv-border rounded-cv overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => switchLocale("en")}
                  className={
                    "px-2.5 py-1.5 transition-colors " +
                    (locale === "en"
                      ? "bg-cv-accent text-cv-on-accent"
                      : "text-cv-dim hover:text-cv-text hover:bg-cv-surface2")
                  }
                >
                  EN
                </button>
                <button
                  onClick={() => switchLocale("nl")}
                  className={
                    "px-2.5 py-1.5 transition-colors " +
                    (locale === "nl"
                      ? "bg-cv-accent text-cv-on-accent"
                      : "text-cv-dim hover:text-cv-text hover:bg-cv-surface2")
                  }
                >
                  NL
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-cv border border-cv-border text-cv-dim hover:text-cv-text hover:bg-cv-surface2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Koszyk */}
              <button
                onClick={() => openCart(true)}
                className="relative flex items-center gap-2 h-8 px-3 rounded-cv border border-cv-border text-cv-dim hover:text-cv-text hover:bg-cv-surface2 transition-colors text-sm font-medium"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{t("cart")}</span>
                {itemCount > 0 ? (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                    style={{
                      background: "var(--cv-accent)",
                      color: "var(--cv-on-accent)",
                    }}
                  >
                    {itemCount}
                  </span>
                ) : null}
              </button>

              <button
                onClick={mobileOpen ? closeMobile : openMobile}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-cv border border-cv-border hover:bg-cv-surface2 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col justify-center items-center gap-[5px]">
                  <span
                    className={
                      "block w-4 h-[2px] bg-cv-text rounded-full transition-all duration-300 " +
                      (mobileOpen && !mobileClosing
                        ? "translate-y-[7px] rotate-45"
                        : "")
                    }
                  />
                  <span
                    className={
                      "block w-4 h-[2px] bg-cv-text rounded-full transition-all duration-300 " +
                      (mobileOpen && !mobileClosing ? "opacity-0 w-0" : "")
                    }
                  />
                  <span
                    className={
                      "block w-4 h-[2px] bg-cv-text rounded-full transition-all duration-300 " +
                      (mobileOpen && !mobileClosing
                        ? "-translate-y-[7px] -rotate-45"
                        : "")
                    }
                  />
                </div>
              </button>
            </div>
          </div>
        </Wrapper>
      </header>

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen ? (
        <div
          className={
            "fixed inset-0 z-50 " +
            (mobileClosing
              ? "animate-fade-out-overlay"
              : "animate-fade-in-overlay")
          }
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={closeMobile}
        />
      ) : null}

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen ? (
        <div
          className={
            "fixed top-0 right-0 bottom-0 z-50 w-72 bg-cv-surface flex flex-col border-l border-cv-border " +
            (mobileClosing
              ? "animate-slide-out-right"
              : "animate-slide-in-right")
          }
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-cv-border shrink-0">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex items-center gap-2 font-display font-bold text-cv-text text-base"
            >
              <span
                className="w-6 h-6 rounded-cv flex items-center justify-center font-black text-[10px]"
                style={{
                  background: "var(--cv-accent)",
                  color: "var(--cv-on-accent)",
                }}
              >
                CZ
              </span>
              Corezano
            </Link>
            <button
              onClick={closeMobile}
              className="w-8 h-8 flex items-center justify-center rounded-cv border border-cv-border text-cv-dim hover:text-cv-text hover:bg-cv-surface2 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 overflow-y-auto py-3">
            <p className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-cv-faint">
              {t("categories")}
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={"/products?category=" + cat.slug}
                onClick={closeMobile}
                className="flex items-center gap-3 px-5 py-3 text-sm text-cv-text hover:bg-cv-surface2 transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--cv-accent)" }}
                />
                {cat.name}
              </Link>
            ))}

            <div className="mx-5 my-3 border-t border-cv-border" />

            <Link
              href="/products"
              onClick={closeMobile}
              className="flex items-center gap-3 px-5 py-3 text-sm text-cv-dim hover:text-cv-text hover:bg-cv-surface2 transition-colors"
            >
              {t("products")}
            </Link>
          </nav>

          {/* Drawer footer */}
          <div className="shrink-0 px-5 py-4 border-t border-cv-border flex flex-col gap-3">
            {/* Język */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-cv-faint flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {t("language")}
              </span>
              <div className="flex items-center border border-cv-border rounded-cv overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => switchLocale("en")}
                  className={
                    "px-3 py-1.5 transition-colors " +
                    (locale === "en"
                      ? "bg-cv-accent text-cv-on-accent"
                      : "text-cv-dim hover:text-cv-text")
                  }
                >
                  EN
                </button>
                <button
                  onClick={() => switchLocale("nl")}
                  className={
                    "px-3 py-1.5 transition-colors " +
                    (locale === "nl"
                      ? "bg-cv-accent text-cv-on-accent"
                      : "text-cv-dim hover:text-cv-text")
                  }
                >
                  NL
                </button>
              </div>
            </div>

            {/* Motyw */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-cv-faint">
                {theme === "dark" ? t("darkMode") : t("lightMode")}
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-cv border border-cv-border text-xs text-cv-dim hover:text-cv-text hover:bg-cv-surface2 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
                {t("toggleTheme")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
