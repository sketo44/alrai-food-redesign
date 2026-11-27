import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toneBg } from "@/components/CategoryTile";
import { ProductCard, PageHero } from "@/components/ui";
import { categories, childCategories, coverFor, getCategory, productsIn } from "@/content/catalog";
import { company } from "@/content/company";
import { locales, type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })));
}

type P = PageProps<"/[locale]/products/[category]">;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, category } = (await params) as { locale: Locale; category: string };
  const c = getCategory(category);
  if (!c) return {};
  const list = productsIn(c.slug);
  const desc = list.length ? list.slice(0, 6).map((p) => p.name[locale]).join(locale === "ar" ? "، " : ", ") : company.tagline[locale];
  return pageMeta(locale, `/products/${c.slug}`, c.name[locale], desc, coverFor(c.slug) ?? undefined);
}

export default async function CategoryPage({ params }: P) {
  const { locale, category } = (await params) as { locale: Locale; category: string };
  const c = getCategory(category);
  if (!c) notFound();
  const L = (p: string) => `/${locale}${p}`;
  const parent = c.parent ? getCategory(c.parent) : undefined;
  const children = childCategories(c.slug);
  const siblings = parent ? childCategories(parent.slug) : children;
  const list = productsIn(c.slug);
  const cover = coverFor(c.slug);
  const count = list.length === 1 ? ui.products.countOne[locale] : `${list.length} ${ui.products.count[locale]}`;

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: ui.products.title[locale], href: L("/products") }, ...(parent ? [{ label: parent.name[locale], href: L(`/products/${parent.slug}`) }] : []), { label: c.name[locale] }]}
        eyebrow={count}
        title={c.name[locale]}
        aside={
          cover ? (
            <div className={`relative ms-auto aspect-[16/9] w-full max-w-md overflow-hidden rounded-[var(--radius-plate)] ${toneBg[c.tone]}`}>
              <div className="plate absolute bottom-[-18%] end-[10%] aspect-square w-[46%] rotate-[-4deg] rtl:rotate-[4deg]">
                <Image src={cover} alt="" fill priority sizes="(min-width:1024px) 20vw, 50vw" className="object-contain p-[7%]" />
              </div>
            </div>
          ) : undefined
        }
      />

      {siblings.length > 0 && (
        <nav aria-label={ui.products.subcategories[locale]} className="wrap relative z-10 pb-8 pt-2">
          <ul className="flex flex-wrap gap-2">
            {(parent ? [parent, ...siblings] : [c, ...siblings]).map((s) => {
              const n = productsIn(s.slug).length;
              const current = s.slug === c.slug;
              return (
                <li key={s.slug}>
                  <Link
                    href={L(`/products/${s.slug}`)}
                    aria-current={current ? "page" : undefined}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink aria-[current=page]:border-blue aria-[current=page]:bg-blue aria-[current=page]:text-white"
                  >
                    {s.name[locale]} <span className="tabular opacity-70">{n}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <section aria-label={c.name[locale]} className="section bg-white pt-14">
        <div className="wrap">
          {list.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p, i) => (
                <li key={p.slug}><ProductCard p={p} locale={locale} priority={i < 4} /></li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-plate)] bg-cream p-10 md:p-14">
              <p className="max-w-xl text-[length:var(--step-1)]">{ui.products.noneYet[locale]}</p>
              <Link href={L("/products")} className="btn btn-primary mt-8">{ui.nav.allProducts[locale]}</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
