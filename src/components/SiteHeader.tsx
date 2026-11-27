"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, type NavItem } from "@/content/nav";
import { company } from "@/content/company";
import { type Locale, other, ui } from "@/lib/i18n";
import { Arrow, Chevron, Close, Globe, Menu, Phone } from "./Icons";

function useSwitchHref(locale: Locale) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  return `/${other(locale)}${rest}`;
}

export default function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "";
  const switchHref = useSwitchHref(locale);
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const L = (p: string) => `/${locale}${p}`;
  const isActive = (p: string) => pathname === L(p) || pathname.startsWith(L(p) + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change (state adjusted during render, dialog closed in an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`);
        setOpen(null);
        btn?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openMobile = useCallback(() => {
    dialogRef.current?.showModal();
    setMobile(true);
  }, []);
  const closeMobile = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const solid = scrolled || open !== null;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${solid ? "bg-milk/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-milk/0"}`}
    >
      <a href="#main" className="skip-link">{ui.nav.skip[locale]}</a>
      <div className="wrap flex h-[4.75rem] items-center gap-6">
        <Link href={L("")} className="shrink-0 rounded-lg" aria-label={`${company.name[locale]} – ${ui.nav.home[locale]}`}>
          <Image src="/assets/brand/alrai-logo.png" alt="" width={160} height={70} priority className="h-12 w-auto" />
        </Link>

        <nav ref={navRef} aria-label={ui.nav.primary[locale]} className="hidden flex-1 lg:block">
          <ul className="flex items-center justify-center gap-1">
            {primaryNav.map((item) => (
              <DesktopItem key={item.path + item.label.en} item={item} locale={locale} open={open} setOpen={setOpen} active={isActive(item.path) || !!item.children?.some((c) => isActive(c.path))} isActive={isActive} />
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <Link
            href={switchHref}
            hrefLang={other(locale)}
            lang={other(locale)}
            aria-label={ui.nav.langLabel[locale]}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink hover:bg-cream"
          >
            <Globe className="size-5" />
            <span>{ui.nav.langName[locale]}</span>
          </Link>
          <Link href={L("/contact")} className="btn btn-primary hidden !min-h-11 lg:inline-flex" aria-current={isActive("/contact") ? "page" : undefined}>
            {ui.nav.contact[locale]}
          </Link>
          <button type="button" onClick={openMobile} className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden" aria-haspopup="dialog" aria-expanded={mobile}>
            <Menu className="size-6" />
            <span className="sr-only">{ui.nav.menu[locale]}</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setMobile(false)}
        aria-label={ui.nav.menu[locale]}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-blue-night p-0 text-white backdrop:bg-ink/60 on-dark"
      >
        <div className="flex h-full flex-col">
          <div className="wrap flex h-[4.75rem] items-center justify-between">
            <Image src="/assets/brand/alrai-logo.png" alt={company.name[locale]} width={160} height={70} className="h-11 w-auto" />
            <button type="button" onClick={closeMobile} className="inline-flex size-11 items-center justify-center rounded-full border border-white/25" autoFocus>
              <Close className="size-6" />
              <span className="sr-only">{ui.nav.close[locale]}</span>
            </button>
          </div>
          <nav aria-label={ui.nav.primary[locale]} className="wrap flex-1 overflow-y-auto pb-10 pt-4">
            <ul className="grid gap-1">
              <li><MobileLink onNavigate={closeMobile} href={L("")} label={ui.nav.home[locale]} current={pathname === L("")} /></li>
              {primaryNav.map((item) =>
                item.children ? (
                  <li key={item.path + item.label.en} className="border-b border-white/10 pb-3">
                    <p className="pt-4 text-sm font-semibold text-drop">{item.label[locale]}</p>
                    <ul className={item.kind === "mega" ? "mt-1 grid grid-cols-2 gap-x-4" : "mt-1"}>
                      {item.kind === "mega" && <li className="col-span-2"><MobileLink onNavigate={closeMobile} small href={L(item.path)} label={ui.nav.allProducts[locale]} current={pathname === L(item.path)} /></li>}
                      {item.children.map((c) => (
                        <li key={c.path}><MobileLink onNavigate={closeMobile} small href={L(c.path)} label={c.label[locale]} current={isActive(c.path)} /></li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.path}><MobileLink onNavigate={closeMobile} href={L(item.path)} label={item.label[locale]} current={isActive(item.path)} /></li>
                ),
              )}
              <li><MobileLink onNavigate={closeMobile} href={L("/contact")} label={ui.nav.contact[locale]} current={isActive("/contact")} /></li>
            </ul>
            <a href={company.phone.href} className="mt-8 inline-flex items-center gap-3 text-lg font-semibold text-white">
              <Phone className="size-5 text-drop" />
              <span className="ltr-num">{company.phone.display}</span>
            </a>
          </nav>
        </div>
      </dialog>
    </header>
  );
}

function MobileLink({ href, label, current, small, onNavigate }: { href: string; label: string; current?: boolean; small?: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`flex min-h-12 items-center justify-between gap-3 rounded-lg py-2 ${small ? "text-base text-white/85" : "font-display text-2xl"} aria-[current=page]:text-drop`}
    >
      {label}
      {!small && <Arrow className="size-5 opacity-50" />}
    </Link>
  );
}

function DesktopItem({
  item, locale, open, setOpen, active, isActive,
}: {
  item: NavItem; locale: Locale; open: string | null; setOpen: (v: string | null) => void; active: boolean; isActive: (p: string) => boolean;
}) {
  const L = (p: string) => `/${locale}${p}`;
  const id = `menu-${item.label.en.replace(/\W+/g, "-").toLowerCase()}`;
  const linkCls = "relative inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 text-[0.95rem] font-medium transition-colors hover:bg-cream";
  if (!item.children) {
    return (
      <li>
        <Link href={L(item.path)} className={`${linkCls} ${active ? "text-blue" : ""}`} aria-current={active ? "page" : undefined}>
          {item.label[locale]}
        </Link>
      </li>
    );
  }
  const isOpen = open === id;
  return (
    <li className="relative">
      <button
        type="button"
        data-menu={id}
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setOpen(isOpen ? null : id)}
        className={`${linkCls} ${active ? "text-blue" : ""}`}
      >
        {item.label[locale]}
        <Chevron className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        id={id}
        hidden={!isOpen}
        className={`absolute top-[calc(100%+0.75rem)] rounded-[1.5rem] bg-white p-3 shadow-[var(--shadow-lift)] ring-1 ring-line ${item.kind === "mega" ? "start-1/2 w-[min(46rem,80vw)] -translate-x-1/2 rtl:translate-x-1/2" : "start-0 w-64"}`}
      >
        {item.kind === "mega" ? (
          <div className="grid grid-cols-[1fr_14rem] gap-3">
            <ul className="grid grid-cols-2 gap-1">
              {item.children.map((c) => (
                <li key={c.path}>
                  <Link href={L(c.path)} aria-current={isActive(c.path) ? "page" : undefined} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-cream aria-[current=page]:bg-drop-soft">
                    <span className="font-medium">{c.label[locale]}</span>
                    {c.note && <span className="tabular rounded-full bg-cream px-2 text-xs text-muted">{c.note[locale]}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={L(item.path)} className="group flex flex-col justify-end rounded-2xl bg-blue p-5 text-white">
              <span className="font-display text-xl">{ui.nav.allProducts[locale]}</span>
              <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/80">
                {company.tagline[locale]} <Arrow className="size-4" />
              </span>
            </Link>
          </div>
        ) : (
          <ul className="grid gap-1">
            {item.children.map((c) => (
              <li key={c.path}>
                <Link href={L(c.path)} aria-current={isActive(c.path) ? "page" : undefined} className="block rounded-xl px-3 py-2.5 font-medium hover:bg-cream aria-[current=page]:bg-drop-soft">
                  {c.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
