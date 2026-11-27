import type { Metadata } from "next";
import Link from "next/link";
import CategoryTile from "@/components/CategoryTile";
import ProductBrowser from "@/components/ProductBrowser";
import { PageHero } from "@/components/ui";
import { categories, childCategories, products, productsIn } from "@/content/catalog";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/products", ui.products.title[locale], ui.products.lead[locale]);
}

export default async function ProductsPage({ params }: PageProps<"/[locale]/products">) {
  const { locale } = (await params) as { locale: Locale };
  const tops = categories.filter((c) => !c.parent);
  const live = tops.filter((c) => productsIn(c.slug).length > 0);
  const empty = tops.filter((c) => productsIn(c.slug).length === 0);
  const items = products.map(({ slug, category, name, size, image }) => ({ slug, category, name, size, image }));
  const cats = live.map((c) => ({ slug: c.slug, name: c.name, members: [c.slug, ...childCategories(c.slug).map((x) => x.slug)] }));

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: ui.products.title[locale] }]}
        eyebrow={`${products.length} ${ui.products.count[locale]}`}
        title={ui.products.title[locale]}
        lead={ui.products.lead[locale]}
      />
      <section aria-label={ui.products.title[locale]} className="wrap pb-10">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {live.map((c, i) => (
            <li key={c.slug} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
              <CategoryTile c={c} locale={locale} big={i === 0} priority={i < 3} />
            </li>
          ))}
        </ul>
        {empty.length > 0 && (
          <p className="mt-6 text-sm text-muted">
            {ui.products.otherListed[locale]}{" "}
            {empty.map((c, i) => (
              <span key={c.slug}>
                <Link className="link-u text-ink" href={`/${locale}/products/${c.slug}`}>{c.name[locale]}</Link>
                {i < empty.length - 1 ? (locale === "ar" ? "، " : ", ") : ""}
              </span>
            ))}
          </p>
        )}
      </section>
      <section aria-labelledby="all-products" className="section bg-white">
        <div className="wrap">
          <h2 id="all-products" className="text-[length:var(--step-3)]">{ui.nav.allProducts[locale]}</h2>
          <div className="mt-8"><ProductBrowser items={items} cats={cats} locale={locale} /></div>
        </div>
      </section>
    </>
  );
}
