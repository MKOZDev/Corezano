import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/queries/pages/api";
import { LegalPage } from "@/components/sections/legal-page";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLegalPage("privacy-policy-2", locale);
  if (!page) notFound();
  return <LegalPage page={page} />;
}
