import type { Metadata } from "next";
import CareersForm from "@/components/forms/CareersForm";
import { PageHero } from "@/components/ui";
import { company } from "@/content/company";
import { departments } from "@/content/forms";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/careers", ui.careers.title[locale], company.aboutMore[locale][2]);
}

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: ui.careers.title[locale] }]} eyebrow={company.name[locale]} title={ui.careers.title[locale]} lead={company.aboutMore[locale][2]} />
      <section aria-label={ui.careers.title[locale]} className="wrap grid gap-10 pb-[var(--section)] lg:grid-cols-12">
        <aside className="h-fit lg:sticky lg:top-28 lg:col-span-4">
          <h2 className="text-[length:var(--step-2)]">{ui.careers.department[locale]}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {departments.map((d) => <li key={d.value} className="rounded-full bg-cream px-3 py-1 text-sm">{d.label[locale]}</li>)}
          </ul>
        </aside>
        <div className="rounded-[var(--radius-plate)] bg-white p-6 shadow-[var(--shadow-plate)] md:p-10 lg:col-span-8">
          <CareersForm locale={locale} />
        </div>
      </section>
    </>
  );
}
