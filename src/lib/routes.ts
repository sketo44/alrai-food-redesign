import { categories, products } from "@/content/catalog";
import { recipes } from "@/content/recipes";

/** Every route path (without the locale prefix). Used by sitemap.xml and the QA crawler. */
export const staticPaths = ["", "/about", "/branches", "/brands", "/products", "/recipes", "/export", "/distributors", "/careers", "/contact"];

export function allPaths() {
  return [
    ...staticPaths,
    ...categories.map((c) => `/products/${c.slug}`),
    ...products.map((p) => `/products/${p.category}/${p.slug}`),
    ...recipes.map((r) => `/recipes/${r.slug}`),
  ];
}
