import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Icons";
import { Breadcrumbs, ProductCard } from "@/components/ui";
import { getCategory, getProduct, products, productsIn } from "@/content/catalog";
import { company } from "@/content/company";
import { locales, type Locale, ui } from "@/lib/i18n";
import { clip, pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, category: p.category, product: p.slug })));
}

type P = PageProps<"/[locale]/products/[category]/[product]">;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, category, product } = (await params) as { locale: Locale; category: string; product: string };
  const p = getProduct(category, product);
  if (!p) return {};
  const c = getCategory(p.category)!;
  const desc = p.description.ar[0] && locale === "ar" ? p.description.ar[0] : `${p.name[locale]} · ${c.name[locale]} · ${company.name[locale]}`;
  return pageMeta(locale, `/products/${p.category}/${p.slug}`, p.name[locale], clip(desc), p.image ?? undefined);
}

export default async function ProductPage({ params }: P) {
  const { locale, category, product } = (await params) as { locale: Locale; category: string; product: string };
  const p = getProduct(category, product);
  if (!p) notFound();
  const c = getCategory(p.category)!;
  const parent = c.parent ? getCategory(c.parent) : undefined;
  const L = (x: string) => `/${locale}${x}`;
  const siblings = productsIn(c.slug);
  const idx = siblings.findIndex((x) => x.slug === p.slug);
  const similar = [...siblings.slice(idx + 1), ...siblings.slice(0, idx)].slice(0, 4);
  const arOnly = locale === "en"; // ingredient and label text exists in Arabic only
  const n = p.nutrition;
  const hasNutrition = n.status === "published" && n.rows.length > 0;

  return (
    <>
      <div className="wrap pt-8">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: ui.products.title[locale], href: L("/products") },
            ...(parent ? [{ label: parent.name[locale], href: L(`/products/${parent.slug}`) }] : []),
            { label: c.name[locale], href: L(`/products/${c.slug}`) },
            { label: p.name[locale] },
          ]}
        />
      </div>

      <article className="wrap grid gap-12 pb-[var(--section)] pt-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-28">
            <div className="plate relative aspect-square">
              {p.image && <Image src={p.image} alt={p.name[locale]} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-contain p-[6%]" />}
              <span className="absolute end-5 top-5 rounded-full bg-blue px-4 py-1.5 text-sm font-semibold text-white">{p.size[locale]}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <Link href={L(`/products/${c.slug}`)} className="eyebrow hover:underline">{c.name[locale]}</Link>
          <h1 className="mt-4 text-[length:var(--step-4)]">{p.name[locale]}</h1>
          {locale === "en" && <p lang="ar" dir="rtl" className="mt-2 text-start text-muted">{p.name.ar}</p>}

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5">
            <div><dt className="text-sm text-muted">{ui.products.size[locale]}</dt><dd className="mt-1 font-semibold">{p.size[locale]}</dd></div>
            <div><dt className="text-sm text-muted">{ui.products.category[locale]}</dt><dd className="mt-1 font-semibold">{c.name[locale]}</dd></div>
          </dl>

          {p.description.ar.length > 0 && (
            <section className="mt-10" aria-labelledby="desc">
              <h2 id="desc" className="text-[length:var(--step-2)]">{ui.products.description[locale]}</h2>
              {arOnly && <p className="mt-2 text-xs font-semibold text-muted">{ui.products.arabicOnly.en}</p>}
              <div lang="ar" dir="rtl" className="mt-3 grid gap-2 text-start leading-[1.9]">
                {p.description.ar.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </section>
          )}

          {p.ingredients.ar.length > 0 && (
            <section className="mt-10" aria-labelledby="ingr">
              <h2 id="ingr" className="text-[length:var(--step-2)]">{ui.products.ingredients[locale]}</h2>
              {arOnly && <p className="mt-2 text-xs font-semibold text-muted">{ui.products.arabicOnly.en}</p>}
              <div lang="ar" dir="rtl" className="mt-3 grid gap-2 rounded-2xl bg-cream p-5 text-start leading-[1.9]">
                {p.ingredients.ar.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </section>
          )}

          {hasNutrition && (
            <section className="mt-10" aria-labelledby="nutr">
              <h2 id="nutr" className="text-[length:var(--step-2)]">{ui.products.nutrition[locale]}</h2>
              <div className="mt-4 rounded-2xl border-2 border-ink bg-white p-5">
                <table className="nutrition w-full text-start">
                  <caption className="pb-3 text-start text-sm text-muted">
                    {n.servingAr ? (locale === "ar" ? n.servingAr : <span lang="ar">{n.servingAr}</span>) : ui.products.perServing[locale]}
                  </caption>
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">{ui.products.nutrient[locale]}</th>
                      <th scope="col">{ui.products.amount[locale]}</th>
                      <th scope="col">{ui.products.dv[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {n.rows.map((r, i) => {
                      const label = locale === "ar" ? r.label.ar : r.label.en ?? r.label.ar;
                      return (
                        <tr key={i}>
                          <th scope="row" className="text-start font-semibold">{label}</th>
                          <td className="tabular text-end"><span className="ltr-num">{r.amount[locale]}</span></td>
                          <td className="tabular w-20 text-end font-semibold"><span className="ltr-num">{r.dv ?? ""}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-muted">{locale === "ar" && n.noteAr ? n.noteAr : ui.products.dvNote[locale]}</p>
              </div>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href={L(`/products/${c.slug}`)} className="btn btn-ghost">
              <Arrow className="size-5 rotate-180" /> {ui.products.back[locale]} {c.name[locale]}
            </Link>
            <Link href={L("/export")} className="btn btn-primary">{ui.home.exportCta[locale]}</Link>
          </div>
        </div>
      </article>

      {similar.length > 0 && (
        <section aria-labelledby="similar" className="section bg-white">
          <div className="wrap">
            <h2 id="similar" className="text-[length:var(--step-3)]">{ui.products.similar[locale]}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {similar.map((s) => <li key={s.slug}><ProductCard p={s} locale={locale} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
