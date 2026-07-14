import { fetchGraphQL } from "@/lib/graphql/client";
import { GET_PAGE_BY_SLUG } from "./index";

export async function getPageBySlug(slug) {
  const data = await fetchGraphQL(GET_PAGE_BY_SLUG, { slug });
  return data.page;
}

export async function getLegalPage(enSlug, locale) {
  const page = await getPageBySlug(enSlug);
  if (!page) return null;

  if (locale === "nl") {
    const nlTranslation = page.translations?.find(
      (t) => t.language.code === "nl",
    );
    if (nlTranslation) {
      return await getPageBySlug(nlTranslation.slug);
    }
  }

  return page;
}
