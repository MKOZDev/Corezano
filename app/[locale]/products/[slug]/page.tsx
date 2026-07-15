import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries/products/api";
import { ProductPageClient } from "@/components/sections/product-page/ProductPageClient";
import { parsePriceToNumber } from "@/lib/utils/formatPrice";

const BASE_URL = "https://corezano.eu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const title = product.name;
  const description =
    product.shortDescription?.replace(/<[^>]*>/g, "").trim() ||
    `${product.name} kopen bij Corezano. Snelle levering, veilig betalen met Przelewy24.`;
  const image = product.image?.sourceUrl;
  const url = `${BASE_URL}/${locale === "nl" ? "nl/" : ""}products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

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

  const price = parsePriceToNumber(
    product.onSale ? product.salePrice : product.price,
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.replace(/<[^>]*>/g, "").trim() || product.name,
    image: product.image?.sourceUrl,
    sku: product.sku,
    brand: product.productBrands?.nodes?.[0]
      ? {
          "@type": "Brand",
          name: product.productBrands.nodes[0].name,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${slug}`,
      priceCurrency: "EUR",
      price: price.toFixed(2),
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : product.stockStatus === "ON_BACKORDER"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Corezano",
      },
      // eslint-disable-next-line react-hooks/purity
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductPageClient
        product={product}
        similarProducts={similar
          .filter((p: { slug: string }) => p.slug !== slug)
          .slice(0, 4)}
      />
    </>
  );
}
