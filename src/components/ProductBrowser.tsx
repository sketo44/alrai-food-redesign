"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Arrow, Search } from "./Icons";

export type BrowserItem = { slug: string; category: string; name: { ar: string; en: string }; size: { ar: string; en: string }; image: string | null };
export type BrowserCat = { slug: string; name: { ar: string; en: string }; members: string[] };

const t = {
  search: { ar: "ابحث في المنتجات", en: "Search products" },
  placeholder: { ar: "مثال: حليب، نكتار، فستق", en: "e.g. milk, nectar, pistachio" },
  all: { ar: "الكل", en: "All" },
  filter: { ar: "تصفية حسب القسم", en: "Filter by category" },
  results: { ar: "نتيجة", en: "results" },
  none: { ar: "لا توجد منتجات مطابقة لبحثك.", en: "No products match your search." },
  clear: { ar: "مسح البحث", en: "Clear search" },
  view: { ar: "عرض المنتج", en: "View product" },
};

/** Client-side search and category filter over the published catalogue (replaces the live site's WP product search). */
export default function ProductBrowser({ items, cats, locale }: { items: BrowserItem[]; cats: BrowserCat[]; locale: Locale }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const dq = useDeferredValue(q);
  const list = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    const members = cat === "all" ? null : cats.find((c) => c.slug === cat)?.members ?? [];
    return items.filter((p) => {
      if (members && !members.includes(p.category)) return false;
      if (!needle) return true;
      return `${p.name.ar} ${p.name.en} ${p.size.ar} ${p.size.en}`.toLowerCase().includes(needle);
    });
  }, [dq, cat, items, cats]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="field w-full max-w-md">
          <label htmlFor="product-search">{t.search[locale]}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input id="product-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.placeholder[locale]} className="input ps-12" autoComplete="off" />
          </div>
        </div>
        <fieldset>
          <legend className="sr-only">{t.filter[locale]}</legend>
          <div className="flex flex-wrap gap-2">
            {[{ slug: "all", name: t.all }, ...cats].map((c) => (
              <label key={c.slug} className="cursor-pointer">
                <input type="radio" name="cat" value={c.slug} checked={cat === c.slug} onChange={() => setCat(c.slug)} className="peer sr-only" />
                <span className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-medium transition-colors hover:border-ink peer-checked:border-blue peer-checked:bg-blue peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue">
                  {c.name[locale]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-8 text-sm text-muted" role="status" aria-live="polite">
        <span className="tabular">{list.length}</span> {t.results[locale]}
      </p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-plate)] bg-cream p-10 text-center">
          <p>{t.none[locale]}</p>
          <button type="button" className="btn btn-ghost mt-4" onClick={() => { setQ(""); setCat("all"); }}>{t.clear[locale]}</button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => (
            <li key={p.slug}>
              <Link href={`/${locale}/products/${p.category}/${p.slug}`} className="group block rounded-[var(--radius-plate)]">
                <div className="plate aspect-[4/5]">
                  {p.image && <Image src={p.image} alt={p.name[locale]} fill sizes="(min-width:1280px) 18vw, (min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw" className="object-contain p-[8%]" />}
                  <span className="absolute end-3 top-3 rounded-full bg-cream/90 px-2.5 py-0.5 text-xs font-semibold">{p.size[locale]}</span>
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold leading-snug">{p.name[locale]}</h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue">{t.view[locale]} <Arrow className="size-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
