import Image from "next/image";
import Link from "next/link";
import { company } from "@/content/company";
import { categories, productsIn } from "@/content/catalog";
import { footerQuick } from "@/content/nav";
import { type Locale, ui } from "@/lib/i18n";
import { DropLeaf, Mail, Phone, Pin, Social } from "./Icons";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const L = (p: string) => `/${locale}${p}`;
  const cats = categories.filter((c) => !c.parent && productsIn(c.slug).length > 0);
  return (
    <footer className="on-dark relative overflow-hidden bg-blue-night text-white">
      {/* Oversized wordmark as a quiet texture */}
      <p aria-hidden className="pointer-events-none absolute -bottom-[0.2em] end-[-0.04em] select-none font-display text-[clamp(8rem,22vw,22rem)] leading-none text-white/[0.04]">
        {company.shortName[locale]}
      </p>
      <div className="wrap relative grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/assets/brand/alrai-logo.png" alt={company.name[locale]} width={160} height={70} className="h-14 w-auto" />
          <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-white">{company.tagline[locale]}</p>
          <p className="mt-4 max-w-sm text-white/70">{company.vision[locale]}</p>
          <ul className="mt-8 flex gap-2" aria-label={ui.contact.follow[locale]}>
            {company.socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-drop hover:text-drop">
                  <Social id={s.id} className="size-5" />
                  <span className="sr-only">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="md:col-span-2" aria-labelledby="f-quick">
          <h2 id="f-quick" className="font-sans text-sm font-semibold text-drop">{ui.footer.quick[locale]}</h2>
          <ul className="mt-4 grid gap-2.5">
            {footerQuick.map((l) => (
              <li key={l.path}><Link className="link-u text-white/85 hover:text-white" href={L(l.path)}>{l.label[locale]}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-3" aria-labelledby="f-products">
          <h2 id="f-products" className="font-sans text-sm font-semibold text-drop">{ui.footer.products[locale]}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {cats.map((c) => (
              <li key={c.slug}><Link className="link-u text-white/85 hover:text-white" href={L(`/products/${c.slug}`)}>{c.name[locale]}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-semibold text-drop">{ui.footer.contact[locale]}</h2>
          <ul className="mt-4 grid gap-4">
            <li className="flex gap-3"><Pin className="mt-1 size-5 shrink-0 text-drop" /><span>{company.address[locale]}</span></li>
            <li className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-drop" /><a className="link-u break-all" href={`mailto:${company.email}`}>{company.email}</a></li>
            <li className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-drop" /><a className="link-u ltr-num" href={company.phone.href}>{company.phone.display}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/65">
        <p>© {company.name[locale]} {new Date().getFullYear()} · {ui.footer.rights[locale]}</p>
        <DropLeaf className="size-6 text-drop/70" />
      </div>
    </footer>
  );
}
