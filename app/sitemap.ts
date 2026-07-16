import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/queries/products/api";
import { getCategories } from "@/lib/queries/categories/api";

const BASE_URL = "https://corezano.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pobierz produkty i kategorie
  const [products, categoriesEN, categoriesNL] = await Promise.all([
    getProducts({ locale: "en", first: 100 }),
    getCategories({ locale: "en" }),
    getCategories({ locale: "nl" }),
  ]);

  // Strony statyczne
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          nl: BASE_URL,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          nl: `${BASE_URL}/products`,
          en: `${BASE_URL}/en/products`,
        },
      },
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/returns-refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Strony kategorii
  const categoryPages: MetadataRoute.Sitemap = categoriesEN.map(
    (cat: { slug: unknown }) => {
      const nlCat = categoriesNL.find(
        (c: { slug: unknown }) => c.slug === cat.slug,
      );
      return {
        url: `${BASE_URL}/products?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            nl: `${BASE_URL}/products?category=${nlCat?.slug || cat.slug}`,
            en: `${BASE_URL}/en/products?category=${cat.slug}`,
          },
        },
      };
    },
  );

  // Strony produktów
  const productPages: MetadataRoute.Sitemap = products.map(
    (product: { slug: unknown }) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          nl: `${BASE_URL}/products/${product.slug}`,
          en: `${BASE_URL}/en/products/${product.slug}`,
        },
      },
    }),
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
