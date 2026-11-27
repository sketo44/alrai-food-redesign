import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/content/catalog";
import { type Locale, ui } from "@/lib/i18n";
import { Arrow } from "./Icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  return (
    <nav aria-label={ui.nav.breadcrumb[locale]} className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li><Link className="link-u hover:text-ink" href={`/${locale}`}>{ui.nav.home[locale]}</Link></li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="text-sand">/</span>
            {c.href ? <Link className="link-u hover:text-ink" href={c.href}>{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Inner-page header: breadcrumb, eyebrow, display title, optional lead and aside. */
export function PageHero({
  locale, crumbs, eyebrow, title, lead, aside, tone = "milk",
}: {
  locale: Locale; crumbs: Crumb[]; eyebrow?: string; title: string; lead?: ReactNode; aside?: ReactNode; tone?: "milk" | "cream" | "blue";
}) {
  const bg = tone === "blue" ? "bg-blue text-white on-dark" : tone === "cream" ? "bg-cream" : "bg-milk";
  return (
    <header className={`${bg} relative overflow-hidden`}>
      <div className="wrap grid gap-10 pb-14 pt-8 md:pb-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <div className={tone === "blue" ? "[&_nav]:text-white/75 [&_[aria-current]]:text-white" : ""}><Breadcrumbs items={crumbs} locale={locale} /></div>
          {eyebrow && <p className={`eyebrow mt-10 ${tone === "blue" ? "!text-drop" : ""}`}>{eyebrow}</p>}
          <h1 className={`mt-4 ${title.length > 26 ? "text-[length:var(--step-4)]" : "text-[length:var(--step-5)]"}`}>{title}</h1>
          {lead && <div className={`mt-6 max-w-2xl text-[length:var(--step-1)] ${tone === "blue" ? "text-white/85" : "text-muted"}`}>{lead}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, lead, action, id }: { eyebrow?: string; title: string; lead?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="mt-3 text-[length:var(--step-4)]">{title}</h2>
        {lead && <p className="mt-4 max-w-2xl text-[length:var(--step-1)] text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProductCard({ p, locale, priority, sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw" }: { p: Product; locale: Locale; priority?: boolean; sizes?: string }) {
  return (
    <Link href={`/${locale}/products/${p.category}/${p.slug}`} className="group block rounded-[var(--radius-plate)]">
      <div className="plate aspect-[4/5]">
        {p.image && (
          <Image src={p.image} alt={p.name[locale]} fill sizes={sizes} priority={priority} className="object-contain p-[8%]" />
        )}
        <span className="absolute end-3 top-3 rounded-full bg-cream/90 px-2.5 py-0.5 text-xs font-semibold text-ink">{p.size[locale]}</span>
      </div>
      <h3 className="mt-4 font-sans text-base font-semibold leading-snug">{p.name[locale]}</h3>
      <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue opacity-80 transition-opacity group-hover:opacity-100">
        {ui.products.view[locale]} <Arrow className="size-4" />
      </span>
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 font-semibold text-blue">
      <span className="link-u">{children}</span>
      <Arrow className="size-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
