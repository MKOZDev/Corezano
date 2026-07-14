import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Wrapper } from "../ui/Wrapper";

export function Footer({ categories = [] }) {
  const t = useTranslations("footer");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useLocale();

  const legalLinks = [
    { href: "/privacy-policy", label: t("legal.privacy") },
    { href: "/terms-conditions", label: t("legal.terms") },
    { href: "/returns-refund-policy", label: t("legal.returns") },
  ];

  const paymentBadges = ["Przelewy24"];

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-cv-border bg-cv-surface py-8 max-sm:py-5">
      <Wrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-bold text-cv-text text-base"
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
            <p className="text-sm text-cv-dim leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {/* Winkel / Shop */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cv-faint">
              {t("shop.title")}
            </span>
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={"/products?category=" + cat.slug}
                  className="text-sm text-cv-dim hover:text-cv-text transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="text-sm text-cv-dim hover:text-cv-text transition-colors"
              >
                {t("shop.all")}
              </Link>
            </nav>
          </div>

          {/* Informatie */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cv-faint">
              {t("info.title")}
            </span>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cv-dim hover:text-cv-text transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Betalen & Bezorgen */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cv-faint">
              {t("payment.title")}
            </span>
            <div className="flex flex-wrap gap-2">
              {paymentBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 text-xs font-medium rounded-cv border border-cv-border text-cv-dim"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
      <div className="mt-8 max-sm:mt-5 pt-8 max-sm:pt-5 border-t border-cv-border ">
        <Wrapper className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-cv-faint">
            © {year} Corezano · {t("allRights")}
          </p>
          <p className="text-xs text-cv-faint">{t("disclaimer")}</p>
        </Wrapper>
      </div>
    </footer>
  );
}
