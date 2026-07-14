import { fetchGraphQL } from "@/lib/graphql/client";
import {
  GET_PRODUCTS,
  GET_FEATURED_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  buildProductsQuery,
} from "./index";

export async function getProducts({ first = 20, locale = "en" } = {}) {
  const data = await fetchGraphQL(GET_PRODUCTS, { first, language: locale });
  return data.products.nodes;
}

export async function getFeaturedProducts({ locale = "en" } = {}) {
  const data = await fetchGraphQL(GET_FEATURED_PRODUCTS, { language: locale });
  return data.products.nodes;
}
export async function getProductsFiltered({
  locale = "en",
  first = 20,
  after = null,
  categorySlug = null,

  orderby = "DATE",
  order = "DESC",
} = {}) {
  const query = buildProductsQuery({ orderby, order });
  const data = await fetchGraphQL(query, {
    language: locale,
    first,
    after,
  });

  let products = data.products.nodes;

  if (categorySlug) {
    products = products.filter((p) =>
      p.productCategories?.nodes?.some((c) => c.slug === categorySlug),
    );
  }

  return {
    products,
    pageInfo: data.products.pageInfo,
  };
}
export async function getProductBySlug(slug) {
  const data = await fetchGraphQL(GET_PRODUCT_BY_SLUG, { slug });
  return data.product;
}
