import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { company } from "@/content/company";
import { fontVars } from "@/lib/fonts";
import { dirOf, isLocale, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#00529b", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: company.name[locale], template: `%s` },
    description: company.intro[locale][0],
    applicationName: company.name[locale],
    formatDetection: { telephone: false },
    // The GitHub Pages copy is a client preview: keep it out of search results.
    ...(process.env.GITHUB_PAGES === "1" && { robots: { index: false, follow: false } }),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVars} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so entrance styles never flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteHeader locale={locale} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
