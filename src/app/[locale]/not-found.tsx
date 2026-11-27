"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "@/lib/i18n";

/** 404 inside a locale (unknown product, category or recipe). */
export default function NotFound() {
  const locale = usePathname()?.startsWith("/en") ? "en" : "ar";
  return (
    <section className="wrap grid min-h-[60svh] place-items-center py-24 text-center">
      <div>
        <p className="display text-[length:var(--step-5)] text-blue">404</p>
        <h1 className="mt-2 text-[length:var(--step-3)]">{ui.notFound.title[locale]}</h1>
        <p className="mt-3 text-muted">{ui.notFound.body[locale]}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="btn btn-primary" href={`/${locale}`}>{ui.notFound.home[locale]}</Link>
          <Link className="btn btn-ghost" href={`/${locale}/products`}>{ui.nav.allProducts[locale]}</Link>
        </div>
      </div>
    </section>
  );
}
