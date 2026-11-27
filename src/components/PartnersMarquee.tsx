import Image from "next/image";
import Link from "next/link";
import { distributorCountries, distributors, retailPartners } from "@/content/network";
import { fmt, type Locale } from "@/lib/i18n";
import { Arrow } from "./Icons";

const t = {
  eyebrow: { ar: "شركاؤنا", en: "Our partners" },
  title: { ar: "منتجاتنا عند شركائنا", en: "Where our products are" },
  lead: {
    ar: (n: string) => `في أسواق المملكة، ولدى موزعينا المعتمدين في ${n} دول.`,
    en: (n: string) => `In stores across the Kingdom, and with our approved distributors in ${n} countries.`,
  },
  inside: { ar: "داخل المملكة", en: "Inside the Kingdom" },
  region: { ar: "شركاء الري", en: "AlRai partners" },
  all: { ar: "جميع الموزعين", en: "All distributors" },
};

type Card = { key: string; kind: "retail" | "distributor"; name: string; place: string; logo?: { src: string; w: number; h: number } };

/**
 * Auto-scrolling partner strip (CSS only). Retail chains show their own logo; distributors
 * have no published logos, so they show their registered name and country (not invented).
 * Pauses on hover and keyboard focus; under reduced motion it becomes a swipeable row.
 */
export function PartnersMarquee({ locale }: { locale: Locale }) {
  const cards: Card[] = [
    ...retailPartners.map((r) => ({ key: r.logo, kind: "retail" as const, name: r.name[locale], place: t.inside[locale], logo: { src: r.logo, w: r.width, h: r.height } })),
    ...distributors.map((d) => ({ key: d.phone, kind: "distributor" as const, name: d.name[locale], place: d.country[locale] })),
  ];
  const row = (copy: 0 | 1) => (
    <ul className="partner-row" aria-hidden={copy === 1 || undefined}>
      {cards.map((c) => (
        <li key={`${copy}-${c.key}`} className="partner-item">
          <div className={`partner-card ${c.kind === "retail" ? "partner-card-logo" : ""}`}>
            {c.logo ? (
              <>
                <Image src={c.logo.src} alt={copy === 0 ? c.name : ""} width={c.logo.w} height={c.logo.h} sizes="180px" className="h-11 w-auto max-w-[11rem] object-contain" />
                <span className="partner-place">{c.place}</span>
              </>
            ) : (
              <>
                <span className="partner-name">{c.name}</span>
                <span className="partner-place">{c.place}</span>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="partners" className="pb-[calc(var(--section)*0.7)]">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow[locale]}</p>
          <h2 id="partners" className="mt-3 text-[length:var(--step-3)]">{t.title[locale]}</h2>
          <p className="mt-3 text-muted">{t.lead[locale](fmt(distributorCountries.length, locale))}</p>
        </div>
        <Link href={`/${locale}/distributors`} className="inline-flex items-center gap-2 font-semibold text-blue hover:underline">
          {t.all[locale]} <Arrow className="size-4" />
        </Link>
      </div>
      <div className="partner-marquee mt-10" role="region" aria-label={t.region[locale]} tabIndex={0}>
        <div className="partner-track">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </section>
  );
}
