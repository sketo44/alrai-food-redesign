import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVars } from "@/lib/fonts";
import { ui } from "@/lib/i18n";

export const metadata: Metadata = { title: "404 | الري للصناعات الغذائية · AlRai Food Industries", robots: { index: false } };

/** Unmatched URLs (outside /ar and /en) get one bilingual 404. */
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVars}>
      <body>
        <main className="wrap grid min-h-svh place-items-center py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <section lang="ar" dir="rtl">
              <p className="display text-[length:var(--step-5)] text-blue">404</p>
              <h1 className="mt-2 text-[length:var(--step-3)]">{ui.notFound.title.ar}</h1>
              <p className="mt-3 text-muted">{ui.notFound.body.ar}</p>
              <Link className="btn btn-primary mt-8" href="/ar">{ui.notFound.home.ar}</Link>
            </section>
            <section lang="en" dir="ltr">
              <p aria-hidden className="display text-[length:var(--step-5)] text-sand">404</p>
              <h2 className="mt-2 text-[length:var(--step-3)]">{ui.notFound.title.en}</h2>
              <p className="mt-3 text-muted">{ui.notFound.body.en}</p>
              <Link className="btn btn-ghost mt-8" href="/en">{ui.notFound.home.en}</Link>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
