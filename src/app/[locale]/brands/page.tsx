import type { Metadata } from "next";
import Image from "next/image";
import { BrandShowcase } from "@/components/BrandShowcase";
import { Breadcrumbs, TextLink } from "@/components/ui";
import { brands, campaigns } from "@/content/brands";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/brands">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/brands", ui.nav.brands[locale], brands.map((b) => b.name[locale]).join(" · "));
}

export default async function BrandsPage({ params }: PageProps<"/[locale]/brands">) {
  const { locale } = (await params) as { locale: Locale };
  const hero = campaigns[0];
  return (
    <>
      <BrandShowcase
        locale={locale}
        as="h1"
        headingId="brands-title"
        cta={{ href: `/${locale}/products`, label: ui.nav.allProducts[locale] }}
        top={<div className="mb-10"><Breadcrumbs locale={locale} items={[{ label: ui.nav.company[locale] }, { label: ui.nav.brands[locale] }]} /></div>}
      />
      <section aria-label={hero.alt[locale]} className="wrap pb-[var(--section)] pt-6">
        <div className="relative aspect-[1920/661] overflow-hidden rounded-[var(--radius-plate)]">
          <Image src={hero.src} alt={hero.alt[locale]} fill sizes="(min-width:1360px) 1360px, 100vw" className="object-cover" />
        </div>
        <div className="mt-10"><TextLink href={`/${locale}/products`}>{ui.nav.allProducts[locale]}</TextLink></div>
      </section>
    </>
  );
}
