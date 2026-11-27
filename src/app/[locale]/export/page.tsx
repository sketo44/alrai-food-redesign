import type { Metadata } from "next";
import Image from "next/image";
import ExportForm from "@/components/forms/ExportForm";
import { PageHero, TextLink } from "@/components/ui";
import { company } from "@/content/company";
import { distributorCountries, distributors } from "@/content/network";
import { fmt, type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/export">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/export", ui.nav.export[locale], company.timeline[3][locale]);
}

export default async function ExportPage({ params }: PageProps<"/[locale]/export">) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: ui.nav.export[locale] }]}
        eyebrow={ui.home.exportEyebrow[locale]}
        title={ui.home.exportCta[locale]}
        lead={company.timeline[3][locale]}
      />
      <section aria-label={ui.home.exportCta[locale]} className="wrap grid gap-10 pb-[var(--section)] lg:grid-cols-12">
        <div className="rounded-[var(--radius-plate)] bg-white p-6 shadow-[var(--shadow-plate)] md:p-10 lg:col-span-8">
          <ExportForm locale={locale} />
        </div>
        <aside className="grid h-fit gap-4 lg:col-span-4">
          <div className="on-dark rounded-[var(--radius-plate)] bg-blue-deep p-8 text-white">
            <p className="text-white/75">{ui.home.exportTitle[locale]}</p>
            <p className="mt-4 flex gap-8">
              <span><span className="display tabular block text-[length:var(--step-4)]">{fmt(distributors.length, locale)}</span>{ui.home.distributorsLabel[locale]}</span>
              <span><span className="display tabular block text-[length:var(--step-4)]">{fmt(distributorCountries.length, locale)}</span>{ui.home.countriesLabel[locale]}</span>
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {distributorCountries.map((c) => <li key={c.en} className="rounded-full bg-white/10 px-3 py-1">{c[locale]}</li>)}
            </ul>
          </div>
          <div className="relative aspect-[528/351] overflow-hidden rounded-[var(--radius-plate)]">
            <Image src="/assets/about/about-landscape.jpg" alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
          </div>
          <TextLink href={`/${locale}/distributors`}>{ui.nav.distributors[locale]}</TextLink>
        </aside>
      </section>
    </>
  );
}
