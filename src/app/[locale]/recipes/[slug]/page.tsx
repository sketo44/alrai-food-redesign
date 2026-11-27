import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui";
import { recipes } from "@/content/recipes";
import { locales, type Locale, ui } from "@/lib/i18n";
import { clip, pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => recipes.map((r) => ({ locale, slug: r.slug })));
}

type P = PageProps<"/[locale]/recipes/[slug]">;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const r = recipes.find((x) => x.slug === slug);
  if (!r) return {};
  return pageMeta(locale, `/recipes/${r.slug}`, r.title[locale], clip(r.description[locale]), r.image);
}

export default async function RecipePage({ params }: P) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const r = recipes.find((x) => x.slug === slug);
  if (!r) notFound();
  const more = recipes.filter((x) => x.slug !== r.slug);
  const L = (p: string) => `/${locale}${p}`;
  return (
    <>
      <div className="wrap pt-8">
        <Breadcrumbs locale={locale} items={[{ label: ui.recipes.title[locale], href: L("/recipes") }, { label: r.title[locale] }]} />
      </div>
      <article className="wrap grid gap-10 py-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="plate aspect-[360/207]">
            <Image src={r.image} alt={r.title[locale]} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="eyebrow">{ui.recipes.title[locale]}</p>
          <h1 className="mt-4 text-[length:var(--step-4)]">{r.title[locale]}</h1>
          <p className="mt-6 text-[length:var(--step-1)] leading-relaxed">{r.description[locale]}</p>
        </div>
      </article>
      <section aria-labelledby="more" className="section bg-cream">
        <div className="wrap">
          <h2 id="more" className="text-[length:var(--step-3)]">{ui.recipes.more[locale]}</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={L(`/recipes/${m.slug}`)} className="plate-link group grid grid-cols-[40%_1fr] items-center gap-5">
                  <div className="plate aspect-[360/207]"><Image src={m.image} alt="" fill sizes="20vw" className="object-cover" /></div>
                  <div>
                    <h3 className="text-[length:var(--step-2)]">{m.title[locale]}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{m.description[locale]}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
