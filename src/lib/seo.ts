import type { Metadata } from "next";
import { company } from "@/content/company";
import { type Locale, locales } from "./i18n";

/** Production origin is an assumption (the current domain). Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alraifood.com";

export const href = (locale: Locale, path = "") => `/${locale}${path}`;

export function pageMeta(locale: Locale, path: string, title: string, description: string, image?: string): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));
  const full = title ? `${title} | ${company.name[locale]}` : company.name[locale];
  return {
    title: full,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}${path}`, languages: { ...languages, "x-default": `${SITE_URL}/ar${path}` } },
    openGraph: {
      type: "website",
      siteName: company.name[locale],
      title: full,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [{ url: image ?? "/og/alrai-og.jpg", width: 1200, height: 630, alt: company.name[locale] }],
    },
    twitter: { card: "summary_large_image", title: full, description },
  };
}

export const clip = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
