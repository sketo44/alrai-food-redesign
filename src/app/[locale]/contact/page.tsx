import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, Pin, Social } from "@/components/Icons";
import { PageHero } from "@/components/ui";
import { company } from "@/content/company";
import { type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "/contact", ui.nav.contact[locale], ui.contact.lead[locale]);
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: ui.nav.contact[locale] }]} title={ui.nav.contact[locale]} lead={ui.contact.lead[locale]} />
      <section aria-label={ui.nav.contact[locale]} className="wrap grid gap-10 pb-[var(--section)] lg:grid-cols-12">
        <aside aria-labelledby="ci" className="on-dark h-fit rounded-[var(--radius-plate)] bg-blue-deep p-8 text-white lg:col-span-4">
          <h2 id="ci" className="text-[length:var(--step-2)]">{ui.contact.info[locale]}</h2>
          <ul className="mt-8 grid gap-6">
            <li className="flex gap-4"><Pin className="mt-1 size-6 shrink-0 text-drop" /><div><p className="text-sm text-white/70">{ui.contact.address[locale]}</p><p className="mt-1 font-semibold">{company.address[locale]}</p></div></li>
            <li className="flex gap-4"><Mail className="mt-1 size-6 shrink-0 text-drop" /><div><p className="text-sm text-white/70">{ui.contact.email[locale]}</p><p className="mt-1 font-semibold"><a className="link-u break-all" href={`mailto:${company.email}`}>{company.email}</a></p></div></li>
            <li className="flex gap-4"><Phone className="mt-1 size-6 shrink-0 text-drop" /><div><p className="text-sm text-white/70">{ui.contact.phone[locale]}</p><p className="mt-1 font-semibold"><a className="link-u ltr-num" href={company.phone.href}>{company.phone.display}</a></p></div></li>
          </ul>
          <p className="mt-10 text-sm text-white/70">{ui.contact.follow[locale]}</p>
          <ul className="mt-3 flex gap-2">
            {company.socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 hover:border-drop hover:text-drop">
                  <Social id={s.id} className="size-5" /><span className="sr-only">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="rounded-[var(--radius-plate)] bg-white p-6 shadow-[var(--shadow-plate)] md:p-10 lg:col-span-8">
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}
