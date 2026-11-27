/**
 * Product taxonomy (source: WordPress REST /wp-json/wp/v2/products-category, AR + EN,
 * and the rendered category pages, read 2026-11-22) and the product list generated from
 * the live product pages into products.json (see docs/content-inventory.md).
 */
import type { Bi } from "@/lib/i18n";
import productsData from "./products.json";

export type NutritionRow = { label: { ar: string; en: string | null }; amount: Bi; dv: string | null };
export type Product = {
  slug: string;
  category: string;
  alsoIn: string[];
  name: Bi;
  nameEnSource: string;
  size: Bi;
  image: string | null;
  description: { ar: string[] };
  ingredients: { ar: string[] };
  nutrition: {
    status: "published" | "suppressed-template-copy" | "missing";
    servingAr: string | null;
    noteAr: string | null;
    rows: NutritionRow[];
  };
  source: string;
};

export type Category = {
  slug: string;
  wpId: number[];
  name: Bi;
  /** EN label as it appears on the live EN site, when it differs from our cleaned-up label */
  liveEnName?: string;
  parent?: string;
  /** Accent used for the category's editorial band (decorative only) */
  /** Slug of the product whose packshot represents the category */
  cover?: string;
  tone: "milk" | "sky" | "leaf" | "sun" | "berry" | "coffee" | "tomato";
  sourceAr: string;
};

export const categories: Category[] = [
  { slug: "milk", cover: "full-fat-milk-1l", wpId: [2], name: { ar: "الحليب", en: "Milk" }, tone: "sky", sourceAr: "https://alraifood.com/products-category/الحليب/" },
  { slug: "dairy", cover: "laban-180ml", wpId: [35], name: { ar: "الألبان", en: "Dairy" }, liveEnName: "dairy", tone: "milk", sourceAr: "https://alraifood.com/products-category/الألبان/" },
  { slug: "juices", cover: "orange-nectar-200ml", wpId: [3], name: { ar: "العصائر", en: "Juices" }, tone: "sun", sourceAr: "https://alraifood.com/products-category/العصائر/" },
  { slug: "nectar", cover: "mango-nectar-200ml", wpId: [45], name: { ar: "نكتار", en: "Nectar" }, parent: "juices", tone: "sun", sourceAr: "https://alraifood.com/products-category/نكتار/" },
  { slug: "juice", wpId: [43], name: { ar: "عصير", en: "Juice" }, parent: "juices", tone: "sun", sourceAr: "https://alraifood.com/products-category/عصير/" },
  { slug: "drink", wpId: [67], name: { ar: "شراب", en: "Drink" }, parent: "juices", tone: "berry", sourceAr: "https://alraifood.com/products-category/شراب/" },
  { slug: "creams", cover: "qishta-250ml", wpId: [37], name: { ar: "كريمات والقشطة", en: "Creams & Qishta" }, liveEnName: "Creams", tone: "milk", sourceAr: "https://alraifood.com/products-category/كريمات-والقشطة/" },
  { slug: "barista-cafe", cover: "coffee-latte-original-250ml", wpId: [71], name: { ar: "باريستا كافيه", en: "Barista Café" }, liveEnName: "barista cafe", tone: "coffee", sourceAr: "https://alraifood.com/products-category/باريستا-كافيه/" },
  { slug: "ice-cream-mix", cover: "ice-cream-mix-strawberry", wpId: [5], name: { ar: "مزيج الايس كريم", en: "Ice Cream Mix" }, liveEnName: "Ice cream mix", tone: "berry", sourceAr: "https://alraifood.com/products-category/مزيج-الايس-كريم/" },
  { slug: "tomato-paste", cover: "tomato-paste", wpId: [38], name: { ar: "معجون الطماطم", en: "Tomato Paste" }, liveEnName: "tomato paste", tone: "tomato", sourceAr: "https://alraifood.com/products-category/معجون-الطماطم/" },
  { slug: "hummus", cover: "hummus-135g", wpId: [40], name: { ar: "حمص", en: "Hummus" }, liveEnName: "hummus", tone: "leaf", sourceAr: "https://alraifood.com/products-category/حمص/" },
  { slug: "frozen-ice-cream", wpId: [72], name: { ar: "ايس كريم مثلج", en: "Frozen Ice Cream" }, liveEnName: "frozen ice cream", tone: "berry", sourceAr: "https://alraifood.com/products-category/ايس-كريم-مثلج/" },
  { slug: "wafer-biscuits", wpId: [41, 73], name: { ar: "البسكويت الويفر", en: "Wafer Biscuits" }, tone: "sun", sourceAr: "https://alraifood.com/products-category/البسكويت-الويفر/" },
  { slug: "other-products", cover: "ketchup-5kg", wpId: [42], name: { ar: "منتجات أخرى", en: "Other Products" }, liveEnName: "Other products", tone: "tomato", sourceAr: "https://alraifood.com/products-category/منتجات-أخرى/" },
];

export const products = productsData as Product[];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const childCategories = (slug: string) => categories.filter((c) => c.parent === slug);
export const topCategories = () => categories.filter((c) => !c.parent);

/** Products in a category, including its sub-categories (juices -> nectar, juice, drink). */
export function productsIn(slug: string): Product[] {
  const slugs = [slug, ...childCategories(slug).map((c) => c.slug)];
  return products.filter((p) => slugs.includes(p.category) || p.alsoIn.some((s) => slugs.includes(s)));
}
export const getProduct = (category: string, slug: string) =>
  products.find((p) => p.slug === slug && p.category === category);

/** Representative pack for a category card (first product with an image). */
export const coverFor = (slug: string) => {
  const c = getCategory(slug);
  const list = productsIn(slug);
  return (list.find((p) => p.slug === c?.cover) ?? list.find((p) => p.image))?.image ?? null;
};
