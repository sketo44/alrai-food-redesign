import type { Metadata } from "next";
import { Phone } from "@/components/Icons";
import { BranchLocator } from "@/components/BranchLocator";
import { PageHero } from "@/components/ui";
import { company } from "@/content/company";
import { branches, branchTel } from "@/content/network";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/branches">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/branches", ui.nav.branches[locale], branches.map((b) => b.city[locale]).join(locale === "ar" ? "، " : ", "));
}

export default async function BranchesPage({ params }: PageProps<"/[locale]/branches">) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: ui.nav.company[locale] }, { label: ui.nav.branches[locale] }]} eyebrow={company.name[locale]} title={ui.branches.title[locale]} />
      <BranchLocator locale={locale} headingId="branch-map-title" title={locale === "ar" ? "خريطة الفروع" : "Branch map"} />
      <section aria-labelledby="branch-numbers-title" className="wrap pb-[var(--section)] pt-[calc(var(--section)*0.6)]">
        <h2 id="branch-numbers-title" className="text-[length:var(--step-2)] text-blue-deep">{locale === "ar" ? "جميع أرقام التواصل" : "All contact numbers"}</h2>
        <div className="mt-6 max-w-3xl">
          <table className="w-full text-start">
            <caption className="sr-only">{ui.branches.title[locale]}</caption>
            <thead>
              <tr className="border-b-2 border-ink text-sm text-muted">
                <th scope="col" className="py-3 text-start font-semibold">{ui.branches.branch[locale]}</th>
                <th scope="col" className="py-3 text-end font-semibold">{ui.branches.phone[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id} className="border-b border-line">
                  <th scope="row" className="py-5 text-start font-display text-[length:var(--step-2)] font-semibold">{b.city[locale]}</th>
                  <td className="py-5 text-end">
                    <a href={branchTel(b.phone)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-semibold hover:border-blue hover:text-blue">
                      <Phone className="size-4" />
                      <span className="ltr-num tabular">{b.phone}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
