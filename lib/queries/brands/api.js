import { fetchGraphQL } from "@/lib/graphql/client";
import { GET_BRANDS } from "./index";

export async function getBrands() {
  const data = await fetchGraphQL(GET_BRANDS);
  return data.productBrands.nodes;
}
