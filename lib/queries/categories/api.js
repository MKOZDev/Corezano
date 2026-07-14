import { fetchGraphQL } from "@/lib/graphql/client";
import { GET_CATEGORIES } from "./index";

export async function getCategories({ locale = "en" } = {}) {
  const data = await fetchGraphQL(GET_CATEGORIES, { language: locale });
  return data.productCategories.nodes;
}
