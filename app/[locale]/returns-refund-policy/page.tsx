import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/queries/pages/api";
import { LegalPage } from "@/components/sections/legal-page";

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLegalPage("returns-refund-policy", locale);
  if (!page) notFound();
  return <LegalPage page={page} />;
}
