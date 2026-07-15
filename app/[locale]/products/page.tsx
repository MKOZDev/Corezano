// @ts-nocheck
import type { Metadata } from "next";
import { getProductsFiltered } from "@/lib/queries/products/api";
import { getCategories } from "@/lib/queries/categories/api";
import { getBrands } from "@/lib/queries/brands/api";
import { ProductsClientPage } from "@/components/sections/products/ProductsClientPage";

const BASE_URL = "https://corezano.eu";

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const category = sp.category || null;

  const title = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")} kopen | Corezano`
    : "Grafische kaarten, processors & RAM kopen | Corezano";

  const description = category
    ? `Koop ${category.replace(/-/g, " ")} van A-merken bij Corezano. Snelle levering, veilig betalen met Przelewy24.`
    : "Ontdek ons assortiment pc-componenten van NVIDIA, AMD, Intel en meer. Grafische kaarten, processors en RAM van A-merken.";

  return {
    title,
    description,
    alternates: {
      canonical: category
        ? `${BASE_URL}/products?category=${category}`
        : `${BASE_URL}/products`,
    },
    openGraph: {
      title,
      description,
      url: category
        ? `${BASE_URL}/products?category=${category}`
        : `${BASE_URL}/products`,
      type: "website",
    },
  };
}

function extractAttributes(products) {
  const map = {};

  for (const product of products) {
    const attrs = product.attributes?.nodes || [];
    for (const attr of attrs) {
      if (!attr.name || !attr.options?.length) continue;
      if (!map[attr.name]) map[attr.name] = new Set();
      for (const opt of attr.options) {
        map[attr.name].add(opt);
      }
    }
  }

  return Object.entries(map).map(([name, values]) => ({
    name,
    label: formatAttrName(name),
    values: Array.from(values).sort(),
  }));
}

function formatAttrName(name) {
  return name
    .replace(/^pa_/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProductsPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;

  const category = sp.category || undefined;
  const sort = sp.sort || "DATE_DESC";
  const [orderby, order] = sort.split("_");

  const [{ products }, categories, brands] = await Promise.all([
    getProductsFiltered({ locale, categorySlug: category, orderby, order }),
    getCategories({ locale }),
    getBrands(),
  ]);

  const attributes = extractAttributes(products);

  const categoryName = categories.find((c) => c.slug === category)?.name;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName || "Producten",
        item: category
          ? `${BASE_URL}/products?category=${category}`
          : `${BASE_URL}/products`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsClientPage
        initialProducts={products}
        categories={categories}
        brands={brands}
        attributes={attributes}
      />
    </>
  );
}
