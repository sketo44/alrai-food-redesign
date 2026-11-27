import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Phone } from "@/components/Icons";
import { PageHero } from "@/components/ui";
import { distributorCountries, distributors } from "@/content/network";
import { fmt, type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/distributors">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/distributors", ui.nav.distributors[locale], distributorCountries.map((c) => c[locale]).join(" · "));
}

export default async function DistributorsPage({ params }: PageProps<"/[locale]/distributors">) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <>
      <PageHero
        locale={locale}
        tone="blue"
        crumbs={[{ label: ui.nav.export[locale], href: `/${locale}/export` }, { label: ui.nav.distributors[locale] }]}
        eyebrow={`${fmt(distributors.length, locale)} ${ui.home.distributorsLabel[locale]} · ${fmt(distributorCountries.length, locale)} ${ui.home.countriesLabel[locale]}`}
        title={ui.distributors.title[locale]}
        aside={
          <div className="flex justify-end">
            <Link href={`/${locale}/export`} className="btn btn-light">{ui.home.exportCta[locale]} <Arrow className="size-5" /></Link>
          </div>
        }
      />
      <section aria-label={ui.distributors.title[locale]} className="section">
        <div className="wrap grid gap-14">
          {distributorCountries.map((country) => {
            const list = distributors.filter((d) => d.country.en === country.en);
            return (
              <div key={country.en} className="grid gap-6 lg:grid-cols-12">
                <h2 className="text-[length:var(--step-3)] lg:col-span-3">{country[locale]}</h2>
                <ul className="grid gap-3 md:grid-cols-2 lg:col-span-9">
                  {list.map((d) => (
                    <li key={d.phone} className="flex flex-col justify-between gap-5 rounded-[1.25rem] bg-white p-6 shadow-[var(--shadow-plate)]">
                      <div>
                        <h3 className="font-sans text-[length:var(--step-1)] font-semibold leading-snug">{d.name[locale]}</h3>
                        <p className="mt-1 text-sm text-muted">
                          <span className="sr-only">{ui.distributors.city[locale]}: </span>{d.location[locale]}
                        </p>
                      </div>
                      <a href={`tel:${d.phone}`} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-cream px-4 font-semibold hover:bg-drop-soft">
                        <Phone className="size-4" />
                        <span className="sr-only">{ui.distributors.phone[locale]}: </span>
                        <span className="ltr-num tabular">{d.phone}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
