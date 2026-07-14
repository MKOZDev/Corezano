import { Categories } from "@/components/sections/Categories";
import { Hero } from "@/components/sections/Hero";
import { Wrapper } from "@/components/ui/Wrapper";
import { getProducts, getFeaturedProducts } from "@/lib/queries/products/api";
import { getBrands } from "@/lib/queries/brands/api";
import { getCategories } from "@/lib/queries/categories/api";
import { Bestsellers } from "@/components/sections/bestsellers";
import { Why } from "@/components/sections/Why";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [featuredProducts, categories, products, brands] = await Promise.all([
    getFeaturedProducts({ locale }),
    getCategories({ locale }),
    getProducts({ locale, first: 10 }),
    getBrands(),
  ]);

  return (
    <main>
      <Wrapper>
        <Hero products={featuredProducts} />
        <Categories categories={categories} />
        <Bestsellers products={products} />
        <Why brands={brands} />
      </Wrapper>
    </main>
  );
}
