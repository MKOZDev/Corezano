import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries/products/api";
import { ProductPageClient } from "@/components/sections/product-page/ProductPageClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const [product, similar] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ locale, first: 5 }),
  ]);

  if (!product) notFound();

  return (
    <ProductPageClient
      product={product}
      similarProducts={similar
        .filter((p: { slug: string }) => p.slug !== slug)
        .slice(0, 4)}
    />
  );
}
