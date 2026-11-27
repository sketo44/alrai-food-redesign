import type { Metadata } from "next";
import Image from "next/image";
import CountUp from "@/components/motion/CountUp";
import IrrigationTimeline from "@/components/motion/IrrigationTimeline";
import { DropLeaf } from "@/components/Icons";
import { PageHero, TextLink } from "@/components/ui";
import { company } from "@/content/company";
import { fmt, type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/about", ui.nav.about[locale], company.intro[locale][0], "/assets/about/about-landscape.jpg");
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = (await params) as { locale: Locale };
  const L = (p: string) => `/${locale}${p}`;
  const [p1, p2, p3, p4] = company.aboutMore[locale];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: ui.nav.company[locale] }, { label: ui.nav.about[locale] }]}
        eyebrow={ui.home.whoTitle[locale]}
        title={company.name[locale]}
        lead={company.intro[locale][0]}
        aside={
          <div className="relative ms-auto aspect-[528/351] w-full max-w-lg overflow-hidden rounded-[var(--radius-plate)]">
            <Image src="/assets/about/about-landscape.jpg" alt={locale === "ar" ? "خط تعبئة العصائر في مصنع الري" : "Juice filling line in the AlRai factory"} fill priority sizes="(min-width:1024px) 36vw, 100vw" className="object-cover" />
          </div>
        }
      />

      {/* Story in two columns with tall imagery */}
      <section aria-label={ui.nav.about[locale]} className="section pt-8">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[length:var(--step-2)] font-medium leading-relaxed text-ink">{company.intro[locale][1]}</p>
            <div className="mt-10 grid gap-6 text-[length:var(--step-0)] text-ink/85 md:grid-cols-2">
              <p>{p1}</p>
              <p>{p2}</p>
              <p>{p3}</p>
              <p>{p4}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[263/500] overflow-hidden rounded-[var(--radius-plate)]">
              <Image src="/assets/about/about-1.jpg" alt={locale === "ar" ? "مبنى بشعار الري" : "Building bearing the AlRai logo"} fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover" />
            </div>
            <div className="relative mt-12 aspect-[263/500] overflow-hidden rounded-[var(--radius-plate)]">
              <Image src="/assets/about/about-2.jpg" alt={locale === "ar" ? "علم المملكة العربية السعودية" : "The flag of Saudi Arabia"} fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section aria-labelledby="scale" className="on-dark bg-blue-night py-[var(--section)] text-white">
        <div className="wrap">
          <h2 id="scale" className="text-[length:var(--step-3)]">{ui.about.scaleTitle[locale]}</h2>
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {company.stats.map((s) => (
              <div key={s.label.en} className="flex flex-col-reverse gap-1 border-t border-white/15 pt-6">
                <dt className="text-white/75">{s.label[locale]}</dt>
                <dd className="display text-[length:var(--step-4)]"><CountUp value={s.value} locale={locale} /><span className="text-leaf">{s.suffix}</span></dd>
              </div>
            ))}
            {company.scale.map((s) => (
              <div key={s.label.en} className="flex flex-col-reverse gap-1 border-t border-white/15 pt-6">
                <dt className="text-white/75">{s.label[locale]}</dt>
                <dd className="display text-[length:var(--step-4)]">
                  <span className="me-2 align-middle font-sans text-base font-normal text-drop">{s.prefix[locale]}</span>
                  <span className="tabular">{fmt(s.value, locale)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Vision, mission, features */}
      <section aria-label={`${ui.about.vision[locale]} · ${ui.about.mission[locale]}`} className="section">
        <div className="wrap grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <div className="rounded-[var(--radius-plate)] bg-blue p-8 text-white md:p-10 lg:col-span-5 on-dark">
            <h2 className="text-[length:var(--step-1)] text-drop-soft">{ui.about.vision[locale]}</h2>
            <p className="mt-4 font-display text-[length:var(--step-3)] leading-tight">{company.vision[locale]}</p>
          </div>
          <div className="rounded-[var(--radius-plate)] bg-cream p-8 md:p-10 lg:col-span-7">
            <h2 className="text-[length:var(--step-1)] text-leaf-ink">{ui.about.mission[locale]}</h2>
            <p className="mt-4 font-display text-[length:var(--step-3)] leading-tight">{company.mission[locale]}</p>
          </div>
          <div className="grid gap-8 rounded-[var(--radius-plate)] bg-white p-8 shadow-[var(--shadow-plate)] md:col-span-2 md:p-10 lg:col-span-12 lg:grid-cols-12">
            <h2 className="text-[length:var(--step-3)] lg:col-span-4">{ui.about.features[locale]}</h2>
            <ul className="grid gap-6 md:grid-cols-2 lg:col-span-8">
              {company.features.map((f, i) => (
                <li key={i} className="flex gap-4">
                  <DropLeaf className="mt-1 size-8 shrink-0 text-drop" />
                  <p className="text-[length:var(--step-1)] leading-relaxed">{f[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey" className="section bg-white">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow">{ui.home.storyEyebrow[locale]}</p>
              <h2 id="journey" className="mt-3 text-[length:var(--step-3)]">{company.timelineTitle[locale]}</h2>
              <div className="relative mt-10 hidden aspect-square w-48 overflow-hidden rounded-[var(--radius-plate)] lg:block">
                <Image src="/assets/about/tetra-pak-coffee.jpg" alt={locale === "ar" ? "عبوات كوفي لاتيه على خط الإنتاج" : "Coffee latte packs on the production line"} fill sizes="12rem" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <IrrigationTimeline label={company.timelineTitle[locale]} entries={company.timeline.map((t) => ({ year: t.year, text: t[locale] }))} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-2xl font-display text-[length:var(--step-3)]">{company.tagline[locale]}</p>
          <div className="flex flex-wrap gap-6">
            <TextLink href={L("/products")}>{ui.nav.allProducts[locale]}</TextLink>
            <TextLink href={L("/branches")}>{ui.nav.branches[locale]}</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
