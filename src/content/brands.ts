/**
 * Brand logos (source: /العلامات-التجارية/ and /en/brands/). The live page shows logos only,
 * with no names, descriptions or links. Names below were transcribed from the logo artwork
 * itself (used for alt text). No brand descriptions exist, so none are shown.
 */
import type { Bi } from "@/lib/i18n";

export type Brand = { id: string; name: Bi; logo: Bi };

export const brands: Brand[] = [
  { id: "alrai", name: { ar: "الري", en: "AlRai" }, logo: { ar: "/assets/brands/alrai.jpg", en: "/assets/brands/alrai.jpg" } },
  { id: "lunait", name: { ar: "لونيت", en: "LUNAIT" }, logo: { ar: "/assets/brands/lunait.jpg", en: "/assets/brands/lunait.jpg" } },
  { id: "fwakeh", name: { ar: "فواكه", en: "Fwakeh" }, logo: { ar: "/assets/brands/fwakeh.jpg", en: "/assets/brands/fwakeh.jpg" } },
  { id: "raio", name: { ar: "رايو", en: "RAIO" }, logo: { ar: "/assets/brands/raioo.jpg", en: "/assets/brands/raioo-en.jpg" } },
  { id: "alora", name: { ar: "الورا", en: "Alora" }, logo: { ar: "/assets/brands/alora.jpg", en: "/assets/brands/alora-en.jpg" } },
  { id: "r-zero", name: { ar: "R-ZERO", en: "R-ZERO" }, logo: { ar: "/assets/brands/r-zero.jpg", en: "/assets/brands/r-zero.jpg" } },
];

/** Home slider campaign banners (source: home page AR + EN). Artwork contains baked-in text. */
export const campaigns = [
  { id: "coffee-latte", src: "/assets/banners/banner-coffee-latte.jpg", w: 1920, h: 661, alt: { ar: "حملة كوفي لاتيه من الري بست نكهات", en: "AlRai Coffee Latte campaign showing six flavours" }, link: "barista-cafe" },
  { id: "hummus", src: "/assets/banners/banner-hummus.jpg", w: 1920, h: 680, alt: { ar: "حملة حمص الري", en: "AlRai hummus campaign" }, link: "hummus" },
  { id: "cherry-drink", src: "/assets/banners/banner-cherry-drink.jpg", w: 1920, h: 650, alt: { ar: "حملة شراب الكرز من الري", en: "AlRai cherry drink campaign" }, link: null },
] as const;
