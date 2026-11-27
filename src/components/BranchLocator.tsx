"use client";

/**
 * BranchLocator: "فروعنا حول المملكة" as an interactive, boundary-based map.
 *
 * Geometry (scripts/build-ksa-map.mjs -> src/content/ksa-map.generated.ts):
 * - Saudi Arabia, its 13 region borders and its governorate borders come from real
 *   administrative boundaries (geoBoundaries ADM2 / OpenStreetMap), simplified with a
 *   topology-preserving algorithm and projected with d3-geo geoMercator at build time.
 * - Each branch city is its governorate's administrative boundary (BRANCH_REGIONS). Those
 *   shapes are the main interactive targets. City points (`pin` in network.ts) are drawn on
 *   top as secondary markers and labels only.
 * To use better GIS data later, replace the source files and re-run the script; this
 * component only reads BRANCH_REGIONS by branch id.
 *
 * Interaction
 * - Pointer: hovering a region highlights it; clicking selects it and opens the details.
 *   On touch, a tap within a few pixels of a city point picks that city first, so the small
 *   coastal governorates (Jeddah, Makkah, Dammam) stay easy to hit on a phone.
 * - Keyboard: every region is a focusable button (Tab, Enter/Space). The city list is a
 *   radiogroup with roving tabindex (arrows, Home/End). List and map stay in sync.
 * - Mobile (< md): details open in a non-modal bottom sheet (Esc / close button).
 * Motion (GSAP): regions rise in when the map first enters the viewport; the selected region
 * lifts, its outline is traced, and a ripple leaves the city point. Reduced motion: instant.
 *
 * Content rules: only city + phone are published per branch. The shaded area is the city's
 * administrative boundary, not a branch location; the UI says so.
 */

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Arrow, Phone, Pin } from "@/components/Icons";
import { company } from "@/content/company";
import {
  BRANCH_REGIONS, GOVERNORATE_LINES_PATH, GRATICULE_PATH, KSA_PATH, KSA_VIEWBOX,
  NEIGHBOURS_PATH, projectKsa, REGION_LINES_PATH, type BranchRegion,
} from "@/content/ksa-map.generated";
import { branches, branchMapsHref, branchTel, type Branch } from "@/content/network";
import { fmt, type Locale, ui } from "@/lib/i18n";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
const { w: VW, h: VH } = KSA_VIEWBOX;
const TOUCH_SNAP = 16; // px: on touch, a tap this close to a city point picks that city
// Rounded so server and client render identical strings (Math.log/tan can differ in the last bit).
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
const at = (lon: number, lat: number) => projectKsa(lon, lat).map((v) => v.toFixed(1)).join(",");
const REGION = new Map<string, BranchRegion>(BRANCH_REGIONS.map((r) => [r.id, r]));

// Presentational only: which side of the city point its small map label sits on.
const LABEL_SIDE: Record<string, "e" | "w" | "s" | "n"> = {
  jeddah: "w", makkah: "e", madinah: "w", tabuk: "e", riyadh: "w",
  "al-ahsa": "s", dammam: "n", "hafar-al-batin": "e", "khamis-mushait": "e",
};

const t = {
  eyebrow: { ar: "شبكة الفروع", en: "Branch network" },
  lead: {
    ar: "المناطق المظللة على الخريطة هي مدن فروعنا بحدودها الإدارية. مرّر عليها أو اخترها لعرض رقم التواصل وفتحها في خرائط Google.",
    en: "The shaded areas are our branch cities, drawn to their administrative boundaries. Hover or select one to see its contact number and open it in Google Maps.",
  },
  listed: { ar: "فروع مدرجة على الموقع", en: "branches listed on the site" },
  list: { ar: "اختر مدينة", en: "Choose a city" },
  map: { ar: "خريطة المملكة العربية السعودية بحدود المناطق والمحافظات، مع تظليل مدن الفروع", en: "Map of Saudi Arabia with region and governorate borders, branch cities shaded" },
  boundary: { ar: "الحدود الإدارية", en: "Administrative boundary" },
  cityNote: {
    ar: "المنطقة المظللة هي الحدود الإدارية للمدينة، والنقطة مركزها؛ وليست العنوان الدقيق للفرع.",
    en: "The shaded area is the city's administrative boundary and the dot its centre, not the exact branch address.",
  },
  noAddress: { ar: "العنوان التفصيلي للفرع غير منشور؛ تواصل مع الفرع للاستدلال.", en: "The branch street address is not published; call the branch for directions." },
  maps: { ar: "افتح في خرائط Google", en: "Open in Google Maps" },
  mapsSearch: { ar: "بحث عن المدينة", en: "city search" },
  newTab: { ar: "تفتح في نافذة جديدة", en: "opens in a new tab" },
  emptyTitle: { ar: "اختر مدينة", en: "Select a city" },
  emptyBody: { ar: "اضغط على أي منطقة مظللة في الخريطة أو اختر مدينة من القائمة.", en: "Tap a shaded area on the map or pick a city from the list." },
  close: { ar: "إغلاق التفاصيل", en: "Close details" },
  next: { ar: "المدينة التالية", en: "Next city" },
  prev: { ar: "المدينة السابقة", en: "Previous city" },
  founded: { ar: `هنا تأسست الري عام ${company.founded}`, en: `Where AlRai was founded in ${company.founded}` },
  noRegion: { ar: "الحدود غير متوفرة، لا تظهر على الخريطة", en: "Boundary unavailable, not on the map" },
  redSea: { ar: "البحر الأحمر", en: "Red Sea" },
  gulf: { ar: "الخليج العربي", en: "Arabian Gulf" },
  details: { ar: "تفاصيل الفرع", en: "Branch details" },
  credit: { ar: "الحدود: © مساهمو OpenStreetMap، geoBoundaries", en: "Boundaries: © OpenStreetMap contributors, geoBoundaries" },
} as const;

// Physical (non-mirroring) arrow for the panel controls, which sit in a dir="ltr" row.
const PhysArrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {dir === "left" ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
  </svg>
);

type Placed = Branch & { x: number; y: number; region: BranchRegion | undefined }; // viewBox units

/** Zoomed silhouette of one governorate in its surroundings (details panel). */
function RegionInset({ region, point }: { region: BranchRegion; point: { x: number; y: number } | null }) {
  const [x, y, w, h] = region.bbox;
  const side = Math.max(w, h) * 1.55 + 14;
  const vb = [x + w / 2 - side / 2, y + h / 2 - side / 2, side, side].map((v) => v.toFixed(1)).join(" ");
  return (
    <svg viewBox={vb} className="bl-inset" aria-hidden data-inset={region.id}>
      <rect x="-50" y="-50" width={VW + 100} height={VH + 100} fill="#e6eef5" />
      <path d={KSA_PATH} fill="#fbf9f4" />
      <path d={GOVERNORATE_LINES_PATH} fill="none" stroke="#00529b" strokeOpacity="0.16" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      <path d={REGION_LINES_PATH} fill="none" stroke="#00529b" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={region.d} fill="#00529b" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {point && <circle cx={point.x} cy={point.y} r={side * 0.035} fill="#fff" stroke="#003a70" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

export function BranchLocator({
  locale, headingId = "branches-title", title, cta,
}: {
  locale: Locale; headingId?: string; title: string;
  cta?: { href: string; label: string };
}) {
  const rtl = locale === "ar";
  const other: Locale = rtl ? "en" : "ar";
  const N = branches.length;

  const placed = useMemo<Placed[]>(
    () => branches.filter((b) => b.pin).map((b) => {
      const [x, y] = projectKsa(b.pin!.lon, b.pin!.lat);
      return { ...b, x: +x.toFixed(2), y: +y.toFixed(2), region: REGION.get(b.id) };
    }),
    [],
  );
  const byId = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed]);
  const shaded = useMemo(() => placed.filter((p) => p.region), [placed]);

  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isSheet, setIsSheet] = useState(false);
  const [rovingIdx, setRovingIdx] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<SVGGElement>(null);
  const liftRef = useRef<SVGGElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shapeRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const returnFocus = useRef<Element | null>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const isSheetRef = useRef(false);
  const reduced = useRef(false);
  const entered = useRef(false);
  const lastPointer = useRef<string>("mouse");

  const sel = selected ? branches.find((b) => b.id === selected) ?? null : null;
  const selIdx = sel ? branches.indexOf(sel) : -1;
  const selPlaced = selected ? byId.get(selected) ?? null : null;
  const hotId = hover ?? focusId;
  const tip = hotId ? byId.get(hotId) ?? null : null;
  const hotRegion = hotId && hotId !== selected ? REGION.get(hotId) : undefined;
  const selRegion = selected ? REGION.get(selected) : undefined;

  // ── media: reduced motion + sheet breakpoint ──
  useIsoLayout(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mq = window.matchMedia("(max-width: 767.98px)");
    const sync = () => { reduced.current = rm.matches; isSheetRef.current = mq.matches; setIsSheet(mq.matches); };
    sync();
    rm.addEventListener("change", sync);
    mq.addEventListener("change", sync);
    return () => { rm.removeEventListener("change", sync); mq.removeEventListener("change", sync); };
  }, []);

  // ── entrance: regions rise in, then the city points drop, once, on first view ──
  useIsoLayout(() => {
    const svg = svgRef.current, layer = layerRef.current;
    if (!svg || !layer) return;
    const regions = svg.querySelectorAll<SVGGElement>("[data-region]");
    const lines = svg.querySelectorAll<SVGPathElement>("[data-lines]");
    const pins = layer.querySelectorAll<HTMLElement>("[data-pin-inner]");
    const done = () => { entered.current = true; layer.dataset.entered = "1"; svg.dataset.entered = "1"; };
    if (reduced.current) { done(); return; }
    gsap.set(regions, { autoAlpha: 0, y: 10, transformOrigin: "50% 50%" });
    gsap.set(lines, { autoAlpha: 0 });
    gsap.set(pins, { autoAlpha: 0, y: -12, scale: 0.4 });
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting) || entered.current) return;
      io.disconnect();
      gsap.timeline({ onComplete: () => { done(); gsap.set([...regions, ...pins, ...lines], { clearProps: "transform,opacity,visibility" }); } })
        .to(lines, { autoAlpha: 1, duration: 0.9, ease: "power2.out", stagger: 0.15 })
        .to(regions, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.07 }, 0.2)
        .to(pins, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.05 }, 0.55);
    }, { threshold: 0.25 });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  // pause idle effects when the section is off-screen (low-power path)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => { root.dataset.visible = e.isIntersecting ? "1" : "0"; });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // ── selection animation: lift + outline trace + ripple + panel stagger ──
  useEffect(() => {
    const p = selected ? byId.get(selected) : undefined;
    const inst = reduced.current;
    const lift = liftRef.current, trace = traceRef.current, ripple = rippleRef.current, body = panelBodyRef.current;
    if (lift && p?.region) {
      gsap.killTweensOf(lift);
      if (inst) gsap.set(lift, { y: -4, opacity: 1 });
      else gsap.fromTo(lift, { y: 0, opacity: 0.4 }, { y: -4, opacity: 1, duration: 0.55, ease: "power3.out" });
    }
    if (trace && p?.region) {
      gsap.killTweensOf(trace);
      if (inst) gsap.set(trace, { strokeDashoffset: 0, opacity: 0 });
      else gsap.fromTo(trace, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", onComplete: () => { gsap.to(trace, { opacity: 0, duration: 0.6 }); } });
    }
    if (p && ripple && !inst) {
      const rings = ripple.querySelectorAll("circle");
      gsap.killTweensOf(rings);
      gsap.set(rings, { attr: { cx: p.x, cy: p.y, r: 4 }, opacity: 0.6 });
      gsap.to(rings, { attr: { r: 60 }, opacity: 0, duration: 1.4, ease: "power2.out", stagger: 0.25, delay: 0.2 });
    }
    if (p && !inst) {
      const drop = layerRef.current?.querySelector(`[data-pin="${p.id}"] [data-drop]`);
      if (drop) gsap.fromTo(drop, { scale: 2.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(2.2)", delay: 0.15, clearProps: "transform,opacity,visibility" });
    }
    if (body && !inst) {
      const items = body.querySelectorAll("[data-pi]");
      gsap.killTweensOf(items);
      // opacity, not autoAlpha: the sheet title must stay focusable while it animates
      gsap.fromTo(items, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.05, clearProps: "transform,opacity" });
    }
  }, [selected, byId]);

  const choose = useCallback((id: string, opts: { openSheet?: boolean; from?: Element | null } = {}) => {
    setSelected(id);
    const i = branches.findIndex((b) => b.id === id);
    if (i >= 0) setRovingIdx(i);
    if (opts.openSheet) {
      returnFocus.current = opts.from ?? null;
      setSheetOpen(true);
      // Phone: keep the map visible above the sheet so the highlighted region can be seen.
      const box = mapBoxRef.current;
      if (isSheetRef.current && box) {
        const r = box.getBoundingClientRect();
        if (r.top < 64 || r.bottom > window.innerHeight * 0.52) box.scrollIntoView({ block: "start", behavior: reduced.current ? "auto" : "smooth" });
      }
    }
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    const back = returnFocus.current as HTMLElement | SVGElement | null;
    returnFocus.current = null;
    if (back && "focus" in back) requestAnimationFrame(() => back.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (isSheet && sheetOpen && selected) {
      const h = panelRef.current?.querySelector<HTMLElement>("[data-sheet-title]");
      h?.focus({ preventScroll: true });
    }
  }, [isSheet, sheetOpen, selected]);

  useEffect(() => {
    if (!(isSheet && sheetOpen)) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSheet(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSheet, sheetOpen, closeSheet]);

  // ── pointer: the region under the pointer; on touch, a nearby city point wins ──
  const nearestPoint = useCallback((clientX: number, clientY: number, radius: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    let best: Placed | null = null, bd = Infinity;
    for (const p of shaded) {
      const d = Math.hypot(r.left + (p.x / VW) * r.width - clientX, r.top + (p.y / VH) * r.height - clientY);
      if (d < bd) { bd = d; best = p; }
    }
    return best && bd <= radius ? best.id : null;
  }, [shaded]);

  const regionAt = useCallback((target: EventTarget | null, clientX: number, clientY: number, touch: boolean) => {
    if (touch) { const near = nearestPoint(clientX, clientY, TOUCH_SNAP); if (near) return near; }
    const g = (target as Element | null)?.closest?.("[data-region]");
    return g?.getAttribute("data-region") ?? null;
  }, [nearestPoint]);

  const onMapMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    setHover(regionAt(e.target, e.clientX, e.clientY, false));
  };
  const onMapClick = (e: React.MouseEvent) => {
    if (e.detail === 0) return; // keyboard activation is handled on the region itself
    const id = regionAt(e.target, e.clientX, e.clientY, lastPointer.current === "touch");
    if (id) choose(id, { openSheet: true, from: shapeRefs.current.get(id) ?? null });
  };
  const onRegionKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    choose(id, { openSheet: true, from: e.currentTarget });
  };

  // ── city list: radiogroup with roving tabindex ──
  const onListKey = (e: React.KeyboardEvent, i: number) => {
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let n = -1;
    if (e.key === "ArrowDown" || e.key === fwd) n = (i + 1) % N;
    else if (e.key === "ArrowUp" || e.key === back) n = (i - 1 + N) % N;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = N - 1;
    if (n < 0) return;
    e.preventDefault();
    optionRefs.current[n]?.focus();
    choose(branches[n].id);
  };

  const step = (d: number) => {
    const i = selIdx < 0 ? 0 : (selIdx + d + N) % N;
    choose(branches[i].id);
  };

  const num = (n: number) => String(n).padStart(2, "0");
  const sheetHidden = isSheet && !(sheetOpen && sel);
  const comma = rtl ? "، " : ", ";

  return (
    <section ref={rootRef} aria-labelledby={headingId} className="branch-locator relative">
      <div className="wrap">
        {/* areas: intro spans the top; lg: [list over panel] beside the map; md: map, then list + panel; < md: panel is a bottom sheet */}
        <div className="grid gap-x-6 gap-y-6 md:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5 md:col-span-12 md:row-start-1 lg:mb-4">
            <div className="max-w-[46rem]">
              <p className="eyebrow">{t.eyebrow[locale]}</p>
              <h2 id={headingId} className="mt-4 text-[length:var(--step-4)] leading-[var(--leading-display)] text-blue-deep">{title}</h2>
              <p className="mt-4 max-w-xl text-muted">{t.lead[locale]}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <p className="flex items-baseline gap-3">
                <span className="display tabular text-[length:var(--step-4)] leading-none text-blue">{fmt(N, locale)}</span>
                <span className="max-w-[9rem] text-sm leading-snug text-muted">{t.listed[locale]}</span>
              </p>
              {cta && <Link href={cta.href} className="btn btn-ghost">{cta.label} <Arrow className="size-4" /></Link>}
            </div>
          </div>

          <div className="order-3 md:order-none md:col-span-6 md:row-start-3 lg:col-span-4 lg:col-start-1 lg:row-start-2">
            <div role="radiogroup" aria-label={t.list[locale]} className="bl-list grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2">
              {branches.map((b, i) => {
                const on = b.id === selected;
                return (
                  <button
                    key={b.id}
                    ref={(el) => { optionRefs.current[i] = el; }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={i === rovingIdx ? 0 : -1}
                    data-branch={b.id}
                    data-hot={hotId === b.id ? "1" : undefined}
                    onClick={(e) => choose(b.id, { openSheet: true, from: e.currentTarget })}
                    onKeyDown={(e) => onListKey(e, i)}
                    onPointerEnter={(e) => { if (e.pointerType !== "touch") setHover(REGION.has(b.id) ? b.id : null); }}
                    onPointerLeave={() => setHover(null)}
                    className="bl-option group"
                  >
                    <span className="bl-option-num tabular" aria-hidden>{num(i + 1)}</span>
                    <span className="min-w-0 flex-1 py-1.5 leading-tight">{b.city[locale]}</span>
                    {!REGION.has(b.id) && <span className="text-xs text-muted">{t.noRegion[locale]}</span>}
                    <Arrow className="bl-option-arrow size-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── map ── */}
          <div className="order-2 md:order-none md:col-span-12 md:row-start-2 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-2 lg:self-start">
            <div ref={mapBoxRef} className="bl-map relative overflow-hidden rounded-[var(--radius-plate)]">
              <div dir="ltr" className="relative mx-auto w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${VW} ${VH}`}
                  className="absolute inset-0 size-full"
                  role="group"
                  aria-label={t.map[locale]}
                  data-bl-svg
                  onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
                  onPointerMove={onMapMove}
                  onPointerLeave={() => setHover(null)}
                  onClick={onMapClick}
                >
                  <defs>
                    <linearGradient id="bl-land" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="1" stopColor="#f4f0e7" />
                    </linearGradient>
                    <linearGradient id="bl-on" x1="0" y1="0" x2="0.4" y2="1">
                      <stop offset="0" stopColor="#1f7fd0" />
                      <stop offset="1" stopColor="#00529b" />
                    </linearGradient>
                    <linearGradient id="bl-hot" x1="0" y1="0" x2="0.4" y2="1">
                      <stop offset="0" stopColor="#7cc9ee" />
                      <stop offset="1" stopColor="#3d93d6" />
                    </linearGradient>
                    <filter id="bl-shadow" x="-10%" y="-10%" width="120%" height="125%">
                      <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0a2540" floodOpacity="0.16" />
                    </filter>
                    <filter id="bl-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
                    <filter id="bl-lift" x="-30%" y="-30%" width="160%" height="170%">
                      <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#003a70" floodOpacity="0.35" />
                    </filter>
                  </defs>

                  {/* context */}
                  <path d={GRATICULE_PATH} fill="none" stroke="#0a2540" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="2 5" />
                  <path d={NEIGHBOURS_PATH} fill="#e9e2d2" fillOpacity="0.55" stroke="#ddcfb2" strokeWidth="0.8" />
                  <path d={KSA_PATH} fill="url(#bl-land)" filter="url(#bl-shadow)" />

                  {/* internal divisions: governorates (thin), regions (stronger) */}
                  <path data-lines d={GOVERNORATE_LINES_PATH} className="bl-gov-lines" />
                  <path data-lines d={REGION_LINES_PATH} className="bl-reg-lines" />

                  {/* branch cities: the interactive boundary regions */}
                  <g className="bl-regions" data-dim={hotId || selected ? "1" : undefined}>
                    {shaded.map((p) => (
                      <g
                        key={p.id}
                        data-region={p.id}
                        data-on={p.id === selected ? "1" : undefined}
                        data-hot={p.id === hotId ? "1" : undefined}
                        className="bl-region"
                      >
                        <path
                          ref={(el) => { if (el) shapeRefs.current.set(p.id, el); else shapeRefs.current.delete(p.id); }}
                          d={p.region!.d}
                          className="bl-shape"
                          tabIndex={0}
                          role="button"
                          aria-pressed={p.id === selected}
                          aria-label={`${p.city[locale]}${comma}${t.boundary[locale]}`}
                          onKeyDown={(e) => onRegionKey(e, p.id)}
                          onFocus={() => { setHover(null); setFocusId(p.id); }}
                          onBlur={() => setFocusId(null)}
                        />
                      </g>
                    ))}
                  </g>

                  <path data-lines d={KSA_PATH} className="bl-outline" />

                  {/* hover overlay: the hovered region, lifted and glowing (drawn above its neighbours) */}
                  {hotRegion && (
                    <g key={`hot-${hotRegion.id}`} className="bl-top bl-top-hot" aria-hidden>
                      <path d={hotRegion.d} className="bl-top-glow" />
                      <path d={hotRegion.d} className="bl-top-shape" />
                    </g>
                  )}
                  {/* selected overlay: lifted slab + traced outline */}
                  {selRegion && (
                    <g className="bl-top bl-top-on" aria-hidden data-top-on={selRegion.id}>
                      <path d={selRegion.d} className="bl-top-glow" />
                      <g ref={liftRef}>
                        <path d={selRegion.d} className="bl-top-shape" />
                        <path ref={traceRef} d={selRegion.d} className="bl-trace" pathLength={1} />
                      </g>
                    </g>
                  )}

                  <g ref={rippleRef} fill="none" stroke="#00529b" strokeWidth="1.5" aria-hidden>
                    <circle r="0" opacity="0" />
                    <circle r="0" opacity="0" />
                  </g>
                  <g className="bl-sea" aria-hidden>
                    <text transform={`translate(${at(37.25, 23.1)}) rotate(58)`}>{t.redSea[locale]}</text>
                    <text transform={`translate(${at(52.55, 26.55)}) rotate(-24)`}>{t.gulf[locale]}</text>
                  </g>
                </svg>

                {/* city points + labels: secondary, decorative (the regions carry the interaction) */}
                <div ref={layerRef} className="bl-layer absolute inset-0" aria-hidden>
                  {placed.map((p) => (
                    <span
                      key={p.id}
                      className="bl-pin"
                      data-pin={p.id}
                      data-on={p.id === selected ? "1" : undefined}
                      data-hot={p.id === hotId ? "1" : undefined}
                      data-side={LABEL_SIDE[p.id] ?? "e"}
                      style={{ left: pct(p.x, VW), top: pct(p.y, VH), zIndex: p.id === selected ? 30 : p.id === hotId ? 20 : 10 }}
                    >
                      <span data-pin-inner className="bl-pin-inner">
                        <span className="bl-dot" />
                        <span data-drop className="bl-sel" />
                        <span className="bl-label" dir={rtl ? "rtl" : "ltr"}>{p.city[locale]}</span>
                      </span>
                    </span>
                  ))}

                  {tip && (
                    <div
                      className="bl-tip"
                      data-on={tip.id === selected ? "1" : undefined}
                      style={tip.region ? { left: pct(tip.region.bbox[0] + tip.region.bbox[2] / 2, VW), top: pct(tip.region.bbox[1], VH) } : { left: pct(tip.x, VW), top: pct(tip.y, VH) }}
                      dir={rtl ? "rtl" : "ltr"}
                    >
                      <span className="block font-semibold text-ink">{tip.city[locale]}</span>
                      <span className="block text-xs text-muted">{t.boundary[locale]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* data credit (required by the OpenStreetMap / geoBoundaries licences) */}
            <p className="mt-3 px-1 text-end text-[0.7rem] text-muted">{t.credit[locale]}</p>
          </div>

          {/* details: inline panel (md+), bottom sheet (< md) */}
          <div className="order-4 md:order-none md:col-span-6 md:col-start-7 md:row-start-3 lg:col-span-4 lg:col-start-1 lg:row-start-3">
            <div
              ref={panelRef}
              role={isSheet ? "dialog" : "region"}
              aria-modal={isSheet ? false : undefined}
              aria-label={t.details[locale]}
              aria-hidden={sheetHidden || undefined}
              inert={sheetHidden || undefined}
              className="bl-panel"
              data-sheet={isSheet ? "1" : "0"}
              data-open={isSheet && sheetOpen && sel ? "1" : "0"}
            >
              {isSheet && <span className="bl-grab" aria-hidden />}
              <div ref={panelBodyRef} aria-live="polite" className="relative">
                {sel ? (
                  <>
                    <div className="flex items-center justify-between gap-3" data-pi>
                      <span className="tabular text-xs font-semibold tracking-wider text-leaf-ink"><span dir="ltr">{num(selIdx + 1)} / {num(N)}</span></span>
                      <div className="flex items-center gap-1.5" dir="ltr">
                        <button type="button" className="bl-mini" onClick={() => step(rtl ? 1 : -1)} aria-label={rtl ? t.next[locale] : t.prev[locale]}><PhysArrow dir="left" /></button>
                        <button type="button" className="bl-mini" onClick={() => step(rtl ? -1 : 1)} aria-label={rtl ? t.prev[locale] : t.next[locale]}><PhysArrow dir="right" /></button>
                        {isSheet && (
                          <button type="button" className="bl-mini" onClick={closeSheet} aria-label={t.close[locale]}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4" data-pi>
                      {selPlaced?.region && <RegionInset region={selPlaced.region} point={selPlaced} />}
                      <div className="min-w-0">
                        <h3 data-sheet-title tabIndex={-1} className="font-display text-[length:var(--step-3)] leading-tight text-blue-deep outline-none">{sel.city[locale]}</h3>
                        <p className="text-[0.95rem] text-muted" lang={other}>{sel.city[other]}</p>
                        <p className="mt-1 text-xs font-semibold text-blue">{t.boundary[locale]}</p>
                      </div>
                    </div>
                    {sel.city.en === company.city.en && <p data-pi className="mt-2 text-sm font-semibold text-leaf-ink">{t.founded[locale]}</p>}

                    <div data-pi className="mt-4 flex items-start gap-2 rounded-2xl bg-cream/70 px-3 py-2.5 text-[0.8rem] leading-relaxed text-ink/80">
                      <Pin className="mt-0.5 size-4 shrink-0 text-blue" />
                      <span>{REGION.has(sel.id) ? t.cityNote[locale] : t.noRegion[locale]} {t.noAddress[locale]}</span>
                    </div>

                    <div data-pi className="mt-4 border-t border-line pt-4 max-md:mt-3 max-md:pt-3">
                      <p className="text-sm text-muted max-md:sr-only">{ui.branches.phone[locale]}</p>
                      <div className="mt-2 flex flex-wrap gap-2.5 max-md:mt-0">
                        <a href={branchTel(sel.phone)} data-tel className="btn btn-ghost" aria-label={`${ui.branches.call[locale]} ${sel.city[locale]}: ${sel.phone}`}>
                          <Phone className="size-4" /><span className="ltr-num tabular">{sel.phone}</span>
                        </a>
                        <a
                          data-maps
                          href={branchMapsHref(sel, locale)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary flex-1 whitespace-nowrap"
                          aria-label={`${t.maps[locale]}: ${sel.city[locale]} (${t.mapsSearch[locale]}${comma}${t.newTab[locale]})`}
                        >
                          <Pin className="size-5" /> {t.maps[locale]}
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div data-pi className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-drop-soft text-blue"><Pin className="size-5" /></span>
                    <div>
                      <p className="font-display text-[length:var(--step-1)] text-blue-deep">{t.emptyTitle[locale]}</p>
                      <p className="mt-1 text-sm text-muted">{t.emptyBody[locale]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
