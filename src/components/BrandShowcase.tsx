"use client";

/**
 * BrandShowcase: the brand logos ride a tilted, ring-like track. One card is the
 * active, centred brand; a floating panel above it names that brand.
 *
 * Motion model: a single float `progress` (index units) drives every card. Cards
 * are positioned imperatively each frame (no React re-render per frame). Pointer
 * drag (mouse + touch via Pointer Events), horizontal trackpad wheel, arrows,
 * dots, keyboard and card clicks all move `progress`; GSAP tweens it to the
 * nearest whole index (snap), with a velocity projection for flicks. The track
 * loops. Reduced motion: snapping is instant; dragging still works.
 *
 * Content rules: logos are the original files, shown undistorted. The live site
 * publishes no brand descriptions, so the panel only states names and the fact
 * that the brand belongs to AlRai Food Industries.
 */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { brands } from "@/content/brands";
import type { Locale } from "@/lib/i18n";

const N = brands.length;
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
const mod = (a: number, n: number) => ((a % n) + n) % n;

type Geo = {
  w: number; h: number; compact: boolean;
  sp: number; card: number; cx: number; baseY: number;
  winMin: number; winMax: number;
};

const t = {
  eyebrow: { ar: "علاماتنا التجارية", en: "Our brands" },
  title: { ar: "العلامات التجارية", en: "Brands" },
  lead: { ar: "ست علامات تجارية ضمن محفظة الري للصناعات الغذائية.", en: "Six brands in the AlRai Food Industries portfolio." },
  belongs: { ar: "إحدى العلامات التجارية لشركة الري للصناعات الغذائية.", en: "A brand of AlRai Food Industries." },
  browse: { ar: "تصفح المنتجات", en: "Browse products" },
  next: { ar: "العلامة التالية", en: "Next brand" },
  prev: { ar: "العلامة السابقة", en: "Previous brand" },
  carousel: { ar: "عرض العلامات التجارية", en: "Brand showcase" },
  slide: { ar: "علامة", en: "brand" },
  features: [
    { icon: "since", title: { ar: "منذ 1968", en: "Since 1968" }, sub: { ar: "تأسست في الأحساء", en: "Founded in Al-Ahsa" } },
    { icon: "brands", title: { ar: "6 علامات تجارية", en: "6 brands" }, sub: { ar: "تحت مظلة الري للصناعات الغذائية", en: "Under AlRai Food Industries" } },
    { icon: "pin", title: { ar: "+20 فرعًا", en: "20+ branches" }, sub: { ar: "حول المملكة", en: "Across the Kingdom" } },
  ],
} as const;

function FeatureIcon({ kind }: { kind: string }) {
  const p = { width: 34, height: 34, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "since") return <svg {...p}><circle cx="12" cy="9" r="5.5" /><path d="M9.5 9l1.8 1.8L14.8 7.3M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" /></svg>;
  if (kind === "brands") return <svg {...p}><path d="M12 3l8.5 4.5L12 12 3.5 7.5z" /><path d="M3.5 12L12 16.5 20.5 12M3.5 16.5L12 21l8.5-4.5" /></svg>;
  return <svg {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
}

const ArrowSide = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {dir === "left" ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
  </svg>
);

export function BrandShowcase({
  locale, as = "h2", headingId = "brands-title", cta, top, initial = 3,
}: {
  locale: Locale; as?: "h1" | "h2"; headingId?: string;
  cta: { href: string; label: string }; top?: ReactNode; initial?: number;
}) {
  const rtl = locale === "ar";
  const s = rtl ? -1 : 1; // screen direction of increasing index
  const other: Locale = rtl ? "en" : "ar";
  const H = as;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prog = useRef({ p: initial });
  const geo = useRef<Geo | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const reduced = useRef(false);
  const moved = useRef(false);
  const activeRef = useRef(initial);

  const [active, setActive] = useState(initial);
  const [g, setG] = useState<Geo | null>(null);
  const [dragging, setDragging] = useState(false);

  // y offset of the track for a horizontal screen offset dx (tilted, gently curved)
  const yOf = useCallback((dx: number, G: Geo) => {
    const u = dx / G.w;
    const k = -s; // the side holding more cards (inline-start) sits lower
    return G.compact ? G.w * (k * 0.1 * u + 0.22 * u * u) : G.w * (k * 0.13 * u + 0.12 * u * u);
  }, [s]);

  const render = useCallback(() => {
    const G = geo.current;
    if (!G) return;
    const p = prog.current.p;
    const span = G.winMax - G.winMin;
    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const d = mod(i - p - G.winMin, span) + G.winMin; // wrapped offset in [winMin, winMax)
      const dx = s * d * G.sp;
      const x = G.cx + dx;
      const y = G.baseY + yOf(dx, G);
      const ad = Math.abs(d);
      const e = Math.max(0, 1 - ad); // 1 = fully active
      const scale = (1 - 0.07 * Math.min(ad, 3)) * (1 + (G.compact ? 0.12 : 0.17) * e);
      const rot = Math.max(-28, Math.min(28, (-dx / G.w) * 34));
      const fade = 0.45;
      let op = 1;
      if (d > G.winMax - fade) op = (G.winMax - d) / fade;
      else if (d < G.winMin + fade) op = (d - G.winMin) / fade;
      el.style.transform = `translate3d(${x - G.card / 2}px, ${y - G.card / 2}px, 0) perspective(1100px) rotateY(${rot}deg) scale(${scale})`;
      el.style.opacity = String(Math.max(0, Math.min(1, op)));
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.setProperty("--e", e.toFixed(3));
      el.style.pointerEvents = op < 0.3 ? "none" : "";
    }
    const a = mod(Math.round(p), N);
    if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
  }, [s, yOf]);

  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const compact = w < 900;
    const card = compact ? Math.min(168, w * 0.38) : Math.min(212, w * 0.148);
    const G: Geo = compact
      ? { w, h: card * 2.25, compact, sp: card * 1.08, card, cx: w / 2, baseY: card * 1.02, winMin: -3, winMax: 3 }
      : { w, h: 590, compact, sp: card * 1.08, card, cx: rtl ? w * 0.415 : w * 0.585, baseY: 392, winMin: -3.5, winMax: 2.5 };
    geo.current = G;
    setG(G);
    render();
  }, [render, rtl]);

  useIsoLayout(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const snapTo = useCallback((target: number, dur = 0.7) => {
    tween.current?.kill();
    if (reduced.current || dur === 0) { prog.current.p = target; render(); return; }
    tween.current = gsap.to(prog.current, { p: target, duration: dur, ease: "power3.out", onUpdate: render });
  }, [render]);

  const goTo = useCallback((i: number) => {
    const p = prog.current.p;
    let delta = mod(i - p, N);
    if (delta > N / 2) delta -= N;
    snapTo(p + delta);
  }, [snapTo]);

  const step = useCallback((dirIdx: number) => {
    const base = tween.current?.isActive() ? (tween.current.vars.p as number) : Math.round(prog.current.p);
    snapTo(base + dirIdx);
  }, [snapTo]);

  // Pointer drag (mouse, pen, touch). touch-action: pan-y keeps vertical page scroll.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let startX = 0, startP = 0, down = false, captured = false, pid = -1;
    let samples: { x: number; t: number }[] = [];

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      down = true; captured = false; moved.current = false; pid = ev.pointerId;
      startX = ev.clientX; startP = prog.current.p;
      samples = [{ x: ev.clientX, t: performance.now() }];
      tween.current?.kill();
    };
    const onMove = (ev: PointerEvent) => {
      if (!down || ev.pointerId !== pid || !geo.current) return;
      const dx = ev.clientX - startX;
      if (!captured) {
        if (Math.abs(dx) < 6) return;
        captured = true; moved.current = true;
        try { el.setPointerCapture(pid); } catch {}
        setDragging(true);
      }
      prog.current.p = startP - (s * dx) / geo.current.sp;
      render();
      const now = performance.now();
      samples.push({ x: ev.clientX, t: now });
      while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
    };
    const onUp = (ev: PointerEvent) => {
      if (!down || ev.pointerId !== pid) return;
      down = false;
      if (!captured) return;
      captured = false;
      setDragging(false);
      try { el.releasePointerCapture(pid); } catch {}
      const G = geo.current!;
      const a = samples[0], b = samples[samples.length - 1];
      const v = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px/ms
      const projected = prog.current.p - (s * v * 240) / G.sp;
      const from = Math.round(startP);
      const target = Math.max(from - 2, Math.min(from + 2, Math.round(projected)));
      snapTo(target, 0.85);
    };
    // Horizontal trackpad / shift-wheel
    let wheelT: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (ev: WheelEvent) => {
      const G = geo.current;
      if (!G) return;
      const dX = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.shiftKey ? ev.deltaY : 0;
      if (!dX) return;
      ev.preventDefault();
      tween.current?.kill();
      prog.current.p += (s * dX) / (G.sp * 1.4);
      render();
      clearTimeout(wheelT);
      wheelT = setTimeout(() => snapTo(Math.round(prog.current.p), 0.6), 120);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelT);
    };
  }, [render, s, snapTo]);

  useEffect(() => () => { tween.current?.kill(); }, []);

  // Visual left/right: in RTL the next brand sits to the left.
  const goLeft = () => step(-s);
  const goRight = () => step(s);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goLeft(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goRight(); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(N - 1); }
  };

  const b = brands[active];
  const num = (n: number) => String(n).padStart(2, "0");

  // Ring ellipse (decorative) sized from the geometry
  const ring = g && (() => {
    const cxE = g.compact ? g.w / 2 : g.w * 0.5;
    const cyE = g.compact ? g.baseY + g.card * 0.05 : g.baseY - 6;
    const rx = g.compact ? g.w * 0.78 : g.w * 0.6;
    const ry = g.compact ? g.card * 0.62 : g.card * 0.66;
    const rot = -s * Math.atan(g.compact ? 0.1 : 0.13) * (180 / Math.PI);
    const under = g.card * (g.compact ? 0.4 : 0.36);
    const band = (off: number) => {
      const pts: string[] = [];
      for (let dx = -g.w * 1.05; dx <= g.w * 1.05; dx += 16) {
        pts.push(`${(g.cx + dx).toFixed(1)},${(g.baseY + yOf(dx, g) + under + off).toFixed(1)}`);
      }
      return `M${pts.join("L")}`;
    };
    return { cxE, cyE, rx, ry, rot, band };
  })();

  const bubble = (
    <div key={active} className="brand-bubble-in">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="tabular text-xs font-semibold tracking-wider text-leaf-ink"><span dir="ltr">{num(active + 1)} / {num(N)}</span></p>
          <p className="mt-1 font-display text-[length:var(--step-2)] leading-tight text-blue-deep">{b.name[locale]}</p>
          {b.name[other] !== b.name[locale] && <p className="mt-0.5 text-sm text-muted" lang={other}>{b.name[other]}</p>}
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.belongs[locale]}</p>
        </div>
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgb(10_37_64/0.06)]">
          <Image src={b.logo[locale]} alt="" fill sizes="64px" className="object-contain mix-blend-multiply" />
        </div>
      </div>
      <Link href={`/${locale}/products`} className="group mt-4 inline-flex items-center gap-3 text-sm font-semibold text-blue-deep">
        <span className="grid size-8 place-items-center rounded-full bg-drop-soft text-blue transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
          <ArrowSide dir={rtl ? "left" : "right"} />
        </span>
        {t.browse[locale]}
      </Link>
    </div>
  );

  return (
    <section aria-labelledby={headingId} className="brand-showcase relative isolate overflow-hidden">
      {/* soft light field + silk ribbon at the bottom edge */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,#ffffff_0%,#f6f3ec_55%,#eef0f3_100%)]" />
        <svg className="absolute inset-x-0 bottom-0 h-[180px] w-full" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="silk-a" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#003a70" stopOpacity="0.9" />
              <stop offset="0.35" stopColor="#00529b" stopOpacity="0.25" />
              <stop offset="0.65" stopColor="#00529b" stopOpacity="0.1" />
              <stop offset="1" stopColor="#003a70" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="silk-b" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7fd0f2" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7fd0f2" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 120C240 60 420 170 720 140S1200 40 1440 70V180H0z" fill="url(#silk-a)" />
          <path d="M0 120C240 60 420 170 720 140S1200 40 1440 70" fill="none" stroke="url(#silk-b)" strokeWidth="3" />
        </svg>
      </div>

      <div className="wrap relative pb-14 pt-10 md:pb-16 md:pt-14">
        {top}
        {/* heading block sits at the inline-start, overlapped by the stage on desktop */}
        <div className="relative z-[150] max-w-[34rem] lg:max-w-[31rem]">
          <p className="eyebrow">{t.eyebrow[locale]}</p>
          <H id={headingId} className="mt-4 whitespace-nowrap text-[length:var(--step-4)] leading-[var(--leading-display)] text-blue-deep">{t.title[locale]}</H>
          <p className="mt-5 max-w-md text-[length:var(--step-1)] text-muted">{t.lead[locale]}</p>
          <Link href={cta.href} className="btn btn-primary mt-7">
            {cta.label}
            <ArrowSide dir={rtl ? "left" : "right"} />
          </Link>
        </div>

        {/* stage */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t.carousel[locale]}
          tabIndex={0}
          onKeyDown={onKey}
          className="relative mt-6 outline-none focus-visible:rounded-[2rem] focus-visible:ring-2 focus-visible:ring-drop lg:-mt-[19.5rem]"
        >
          <div
            ref={stageRef}
            data-ready={g ? "1" : "0"}
            className={`brand-stage relative touch-pan-y select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ height: g ? g.h : 590 }}
          >
            {g && ring && (
              <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`}>
                <defs>
                  <linearGradient id="rb-blue" x1="0" x2="1">
                    <stop offset="0" stopColor="#00529b" stopOpacity="0" />
                    <stop offset="0.18" stopColor="#00529b" stopOpacity="0.9" />
                    <stop offset="0.5" stopColor="#003a70" />
                    <stop offset="0.82" stopColor="#00529b" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#00529b" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="rb-glass" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="0.6" stopColor="#e3eef8" stopOpacity="0.85" />
                    <stop offset="1" stopColor="#9cc6e6" stopOpacity="0.7" />
                  </linearGradient>
                  <clipPath id="rb-front"><rect x={-g.w} y={ring.cyE} width={g.w * 3} height={g.h} /></clipPath>
                  <clipPath id="rb-back"><rect x={-g.w} y={-g.h} width={g.w * 3} height={g.h + ring.cyE} /></clipPath>
                  <filter id="rb-shadow" x="-10%" y="-50%" width="120%" height="200%">
                    <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#003a70" floodOpacity="0.25" />
                  </filter>
                </defs>
                <g transform={`rotate(${ring.rot} ${ring.cxE} ${ring.cyE})`}>
                  {/* back of the ring: thin, faint */}
                  <g clipPath="url(#rb-back)" opacity="0.55">
                    <ellipse cx={ring.cxE} cy={ring.cyE} rx={ring.rx} ry={ring.ry} fill="none" stroke="url(#rb-glass)" strokeWidth={g.compact ? 8 : 14} />
                    <ellipse cx={ring.cxE} cy={ring.cyE + (g.compact ? 5 : 8)} rx={ring.rx} ry={ring.ry} fill="none" stroke="url(#rb-blue)" strokeWidth={g.compact ? 2 : 3} />
                  </g>
                  {/* front band: glass ribbon with a deep-blue lower edge */}
                  {/* front band follows the exact card track, just beneath the cards */}
                  <g transform={`rotate(${-ring.rot} ${ring.cxE} ${ring.cyE})`} filter="url(#rb-shadow)">
                    <path d={ring.band(0)} fill="none" stroke="url(#rb-glass)" strokeWidth={g.compact ? 16 : 30} strokeLinecap="round" />
                    <path d={ring.band(g.compact ? 10 : 18)} fill="none" stroke="url(#rb-blue)" strokeWidth={g.compact ? 6 : 11} strokeLinecap="round" />
                    <path d={ring.band(g.compact ? -7 : -13)} fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
                  </g>
                </g>
              </svg>
            )}

            {brands.map((br, i) => (
              <button
                key={br.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                type="button"
                aria-label={`${br.name[locale]} (${i + 1}/${N})`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => { if (moved.current) return; goTo(i); }}
                className="brand-card absolute left-0 top-0 origin-center will-change-transform"
                style={{ width: g?.card ?? 200, height: g?.card ?? 200 }}
                tabIndex={-1}
              >
                <span className="brand-tile">
                  <span className="relative block size-full">
                    <Image src={br.logo[locale]} alt="" fill draggable={false} sizes="(min-width:900px) 220px, 170px" className="scale-[1.14] object-contain mix-blend-multiply" />
                  </span>
                </span>
              </button>
            ))}

            {/* floating info panel above the active card (desktop) */}
            {g && !g.compact && (
              <div
                aria-live="polite"
                className="brand-bubble absolute z-[140] w-[22rem] -translate-x-1/2"
                style={{ left: g.cx, bottom: g.h - (g.baseY - g.card * 0.62) + 26 }}
              >
                {bubble}
              </div>
            )}
          </div>

          {/* mobile info panel sits below the track */}
          {g?.compact && <div aria-live="polite" className="brand-bubble relative mx-auto -mt-2 w-full max-w-[24rem]">{bubble}</div>}

          {/* controls */}
          <div className="mt-6 flex items-center justify-center gap-6 md:mt-2" dir="ltr">
            <button type="button" onClick={goLeft} aria-label={rtl ? t.next[locale] : t.prev[locale]} className="brand-ctrl"><ArrowSide dir="left" /></button>
            <div className="flex items-center" dir={rtl ? "rtl" : "ltr"}>
              {brands.map((br, i) => (
                // 24px hit area (WCAG 2.2 target size) around the small visual dot
                <button
                  key={br.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${t.slide[locale]} ${i + 1}: ${br.name[locale]}`}
                  aria-current={i === active ? "true" : undefined}
                  className="group grid h-6 min-w-6 place-items-center px-1"
                >
                  <span aria-hidden className={`block h-2.5 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-blue" : "w-2.5 bg-ink/15 group-hover:bg-ink/35"}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={goRight} aria-label={rtl ? t.prev[locale] : t.next[locale]} className="brand-ctrl"><ArrowSide dir="right" /></button>
          </div>
        </div>

        {/* feature strip */}
        <ul className="relative z-10 mx-auto mt-10 grid max-w-5xl gap-0 rounded-[1.75rem] border border-white bg-white/75 px-4 shadow-[var(--shadow-plate)] backdrop-blur-md sm:grid-cols-3 sm:px-2">
          {t.features.map((f, i) => (
            <li key={f.icon} className={`flex items-center gap-4 px-4 py-5 sm:justify-center sm:px-6 ${i ? "border-t border-line sm:border-s sm:border-t-0" : ""}`}>
              <span className="text-blue"><FeatureIcon kind={f.icon} /></span>
              <span>
                <span className="block font-display text-[length:var(--step-1)] text-blue-deep">{f.title[locale]}</span>
                <span className="block text-sm text-muted">{f.sub[locale]}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
