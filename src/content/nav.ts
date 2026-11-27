import { ui, type Bi } from "@/lib/i18n";
import { categories, productsIn } from "./catalog";

export type NavLink = { label: Bi; path: string; note?: Bi };
export type NavItem = NavLink & { children?: NavLink[]; kind?: "mega" | "list" };

const n = (count: number): Bi => ({ ar: `${count}`, en: `${count}` });

/** Mirrors the live menu: عن الشركة (من نحن، فروعنا) · المنتجات · التصدير · الموزعين · العلامات التجارية · انضم إلينا · اتصل بنا, plus Recipes (linked from the live home page). */
export const primaryNav: NavItem[] = [
  { label: ui.nav.company, path: "/about", kind: "list", children: [{ label: ui.nav.about, path: "/about" }, { label: ui.nav.branches, path: "/branches" }, { label: ui.nav.brands, path: "/brands" }] },
  {
    label: ui.nav.products,
    path: "/products",
    kind: "mega",
    children: categories
      .filter((c) => !c.parent && productsIn(c.slug).length > 0)
      .map((c) => ({ label: c.name, path: `/products/${c.slug}`, note: n(productsIn(c.slug).length) })),
  },
  { label: ui.nav.recipes, path: "/recipes" },
  { label: ui.nav.export, path: "/export", kind: "list", children: [{ label: ui.nav.export, path: "/export" }, { label: ui.nav.distributors, path: "/distributors" }] },
  { label: ui.nav.careers, path: "/careers" },
];

export const footerQuick: NavLink[] = [
  { label: ui.nav.about, path: "/about" },
  { label: ui.nav.branches, path: "/branches" },
  { label: ui.nav.brands, path: "/brands" },
  { label: ui.nav.recipes, path: "/recipes" },
  { label: ui.nav.distributors, path: "/distributors" },
  { label: ui.nav.export, path: "/export" },
  { label: ui.nav.careers, path: "/careers" },
  { label: ui.nav.contact, path: "/contact" },
];
