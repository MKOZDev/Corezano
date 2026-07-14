import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("announcement");

  return (
    <div
      className="w-full py-2 px-4 text-center text-xs font-medium"
      style={{ background: "var(--cv-accent)", color: "var(--cv-on-accent)" }}
    >
      {t("message")}
    </div>
  );
}
