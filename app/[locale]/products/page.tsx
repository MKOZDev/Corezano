// @ts-nocheck
import { getProductsFiltered } from "@/lib/queries/products/api";
import { getCategories } from "@/lib/queries/categories/api";
import { getBrands } from "@/lib/queries/brands/api";
import { ProductsClientPage } from "@/components/sections/products/ProductsClientPage";

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

  return (
    <ProductsClientPage
      initialProducts={products}
      categories={categories}
      brands={brands}
      attributes={attributes}
    />
  );
}
