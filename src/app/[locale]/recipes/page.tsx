import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Icons";
import { PageHero } from "@/components/ui";
import { recipes, recipesIntro } from "@/content/recipes";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/recipes">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/recipes", ui.recipes.title[locale], recipesIntro[locale], recipes[0].image);
}

export default async function RecipesPage({ params }: PageProps<"/[locale]/recipes">) {
  const { locale } = (await params) as { locale: Locale };
  const [first, ...rest] = recipes;
  const L = (p: string) => `/${locale}${p}`;
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: ui.recipes.title[locale] }]} title={ui.recipes.title[locale]} lead={recipesIntro[locale]} />
      <section aria-label={ui.recipes.title[locale]} className="wrap grid gap-10 pb-[var(--section)] lg:grid-cols-12">
        <Link href={L(`/recipes/${first.slug}`)} className="plate-link group lg:col-span-7">
          <div className="plate aspect-[360/207]">
            <Image src={first.image} alt="" fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <h2 className="mt-6 text-[length:var(--step-3)]">{first.title[locale]}</h2>
          <p className="mt-3 max-w-2xl text-[length:var(--step-1)] text-muted">{first.description[locale]}</p>
          <span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue">{ui.recipes.readMore[locale]} <Arrow className="size-5" /></span>
        </Link>
        <ul className="grid content-start gap-10 lg:col-span-5">
          {rest.map((r) => (
            <li key={r.slug}>
              <Link href={L(`/recipes/${r.slug}`)} className="plate-link group grid grid-cols-[42%_1fr] items-center gap-5">
                <div className="plate aspect-[360/207]">
                  <Image src={r.image} alt="" fill sizes="(min-width:1024px) 16vw, 40vw" className="object-cover" />
                </div>
                <div>
                  <h2 className="text-[length:var(--step-2)]">{r.title[locale]}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{r.description[locale]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
