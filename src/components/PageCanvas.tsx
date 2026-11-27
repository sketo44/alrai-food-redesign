"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION, saveData, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * One continuous background canvas behind the whole homepage (see docs/background-art-direction.md).
 *
 * The page is wrapped in `.bg-canvas-host` and each section carries `data-bg="<name>"`. This
 * component measures those anchors (ResizeObserver) and paints, behind all content:
 *   1. a tonal foundation: one vertical gradient whose stops are pinned to section positions
 *   2. soft light glows
 *   3. a faint paper grain behind Recipes
 *   4. the storytelling thread: a fine blue line that is only seen where it crosses the empty
 *      space between two sections, plus the timeline lead-in lines, the About arcs, one
 *      botanical sprig and the curved navy edge that leads into the footer.
 * The client's raster artwork lives inside its own section (server-rendered, lazy) and is
 * only animated from here (gentle desktop parallax on `[data-bg-parallax]`).
 * Everything is decorative: aria-hidden, pointer-events none, no layout impact.
 */

type Box = { top: number; bottom: number; h: number; mid: number };
type Geo = {
  W: number;
  H: number;
  mobile: boolean;
  rtl: boolean;
  xS: number;
  xE: number;
  S: Record<"hero" | "stats" | "who" | "products" | "campaigns" | "journey" | "recipes" | "brands" | "branches" | "export", Box>;
  firstYear: { x: number; y: number } | null;
};

const NAMES = ["hero", "stats", "who", "products", "campaigns", "journey", "recipes", "brands", "branches", "export"] as const;

function measure(host: HTMLElement): Geo | null {
  const hr = host.getBoundingClientRect();
  const W = Math.round(hr.width);
  const H = Math.round(hr.height);
  const S = {} as Geo["S"];
  for (const n of NAMES) {
    const el = host.querySelector<HTMLElement>(`[data-bg="${n}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const top = r.top - hr.top;
    S[n] = { top, bottom: top + r.height, h: r.height, mid: top + r.height / 2 };
  }
  const rtl = getComputedStyle(host).direction === "rtl";
  const wrap = host.querySelector<HTMLElement>(".wrap");
  const wrapL = wrap ? wrap.getBoundingClientRect().left - hr.left : 24;
  const gut = Math.max(10, wrapL / 2);
  const year = host.querySelector<HTMLElement>('[data-bg="journey"] [data-year] p');
  let firstYear: Geo["firstYear"] = null;
  if (year) {
    const r = year.getBoundingClientRect();
    firstYear = { x: rtl ? r.right - hr.left + 52 : r.left - hr.left - 52, y: r.top - hr.top - 2 };
  }
  return { W, H, mobile: W < 768, rtl, xS: rtl ? W - gut : gut, xE: rtl ? gut : W - gut, S, firstYear };
}

const r = (n: number) => Math.round(n);
const curve = (x0: number, y0: number, x1: number, y1: number) => {
  const k = (y1 - y0) * 0.55;
  return `C ${r(x0)} ${r(y0 + k)} ${r(x1)} ${r(y1 - k)} ${r(x1)} ${r(y1)}`;
};

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .42 0 0 0 0 .3 0 0 0 0 .18 0 0 0 .55 0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>',
)}")`;

export default function PageCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // Measure on mount and whenever the host or any section changes size.
  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const g = measure(host);
        setGeo((prev) => (g && prev && JSON.stringify(prev) === JSON.stringify(g) ? prev : g));
      });
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(host);
    host.querySelectorAll<HTMLElement>("[data-bg]").forEach((el) => ro.observe(el));
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Keep ScrollTrigger positions in sync after a re-measure.
  useEffect(() => {
    if (geo) ScrollTrigger.refresh();
  }, [geo]);

  // Motion: crossings draw in once; desktop-only slow parallax on the raster art.
  useGSAP(
    () => {
      const root = ref.current;
      const host = root?.parentElement;
      if (!root || !host || !geo) return;
      const mm = gsap.matchMedia();
      mm.add({ ok: MOTION.ok, wide: "(min-width: 1024px)" }, (ctx) => {
        const { ok, wide } = ctx.conditions as { ok: boolean; wide: boolean };
        if (!ok || saveData()) return;
        root.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
          const len = p.getTotalLength();
          gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: host, start: `top+=${Number(p.dataset.draw)} 85%`, once: true },
          });
        });
        if (wide) {
          host.querySelectorAll<HTMLElement>("[data-bg-parallax]").forEach((el) => {
            const sec = el.closest("[data-bg]") ?? el;
            gsap.fromTo(el, { y: -24 }, { y: 24, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
          });
        }
      });
      return () => mm.revert();
    },
    { dependencies: [geo], scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="page-canvas" data-ready={geo ? "" : undefined}>
      {geo && <Layers g={geo} />}
    </div>
  );
}

function Layers({ g }: { g: Geo }) {
  const { W, H, S, rtl, mobile, xS, xE } = g;

  /* 1 ─ tonal foundation */
  const stops: [number, string][] = [
    [0, "#faf7f0"], [S.hero.bottom - 120, "#faf7f0"],
    [S.who.mid, "#f6f1e6"],
    [S.products.top + 220, "#fcfbf7"], [S.products.bottom - 220, "#fcfbf7"],
    [S.journey.top + 80, "#f3f4f4"], [S.journey.bottom - 120, "#f2f3f5"],
    [S.recipes.top + 140, "#f2e9d9"], [S.recipes.bottom - 160, "#f2e9d9"],
    [S.brands.top + 260, "#f7f5f0"],
    [S.branches.top + 120, "#faf7f0"], [H - 260, "#faf7f0"], [H, "#efe9dd"],
  ];
  const tone = `linear-gradient(to bottom,${stops.map(([y, c]) => `${c} ${r(y)}px`).join(",")})`;

  /* 2 ─ glows */
  const glow = (cx: number, cy: number, rx: number, ry: number, c: string) =>
    `radial-gradient(${r(rx)}px ${r(ry)}px at ${r(cx)}px ${r(cy)}px,${c},transparent)`;
  const glows = [
    glow(rtl ? W * 0.28 : W * 0.72, S.hero.top + S.hero.h * 0.42, W * 0.42, S.hero.h * 0.55, "rgb(215 238 250 / .55)"),
    glow(rtl ? W * 0.8 : W * 0.2, S.products.top + 260, W * 0.5, 420, "rgb(255 255 255 / .9)"),
    glow(W * 0.5, S.brands.top + S.brands.h * 0.45, W * 0.55, S.brands.h * 0.5, "rgb(255 255 255 / .75)"),
  ].join(",");

  /* 4 ─ thread geometry: the empty gaps between neighbouring sections' content */
  const gA: [number, number] = [S.who.bottom - 150, S.products.top + 110];
  const gB: [number, number] = [S.products.bottom - 110, S.campaigns.top + 90];
  const gD: [number, number] = [S.journey.bottom - 130, S.recipes.top + 120];
  const gE: [number, number] = [S.recipes.bottom - 110, S.brands.top + 60];
  const fy = H; // footer starts where the host ends

  const crossings: { id: string; g: [number, number]; from: number; to: number; op: number; w: number; tail: number }[] = mobile
    ? [
        { id: "a", g: gA, from: W + 10, to: -10, op: 0.5, w: 1.1, tail: 60 },
        { id: "d", g: gD, from: -10, to: W + 10, op: 0.45, w: 1.1, tail: 60 },
        { id: "f", g: [S.export.bottom - 120, fy - 50], from: W + 10, to: W * 0.5, op: 0.5, w: 1.1, tail: 60 },
      ]
    : [
        { id: "a", g: gA, from: xS, to: xE, op: 0.6, w: 1.2, tail: 240 },
        { id: "b", g: gB, from: xE, to: xS, op: 0.45, w: 1.2, tail: 240 },
        { id: "d", g: gD, from: xE, to: xS, op: 0.5, w: 1.2, tail: 240 },
        { id: "e", g: gE, from: xS, to: xE, op: 0.25, w: 1, tail: 160 },
        { id: "f", g: [S.export.bottom - 130, fy - 70], from: xE, to: W * 0.5, op: 0.55, w: 1.2, tail: 120 },
      ];

  const yA = (gA[0] + gA[1]) / 2;
  const silk = mobile
    ? `M 0 ${r(yA + 40)} C ${r(W * 0.35)} ${r(yA - 30)} ${r(W * 0.65)} ${r(yA + 60)} ${W} ${r(yA - 20)} L ${W} ${r(yA + 10)} C ${r(W * 0.65)} ${r(yA + 90)} ${r(W * 0.35)} ${r(yA)} 0 ${r(yA + 70)} Z`
    : `M 0 ${r(yA + 70)} C ${r(W * 0.3)} ${r(yA - 60)} ${r(W * 0.62)} ${r(yA + 110)} ${W} ${r(yA - 40)} L ${W} ${r(yA + 10)} C ${r(W * 0.62)} ${r(yA + 150)} ${r(W * 0.3)} ${r(yA - 10)} 0 ${r(yA + 120)} Z`;

  // timeline lead-in: five fine lines converge on the first year's marker
  const lead = !mobile && g.firstYear
    ? [-2, -1, 0, 1, 2].map((i) => {
        const o = i * 11;
        const { x: tx, y: ty } = g.firstYear!;
        return {
          d: `M ${rtl ? W + 10 : -10} ${r(S.campaigns.bottom + 24 + o * 2)} C ${r(rtl ? W * 0.82 : W * 0.18)} ${r(S.campaigns.bottom + 50 + o)} ${r(rtl ? tx + 140 : tx - 140)} ${r(ty - 30 + o * 0.4)} ${r(tx)} ${r(ty)}`,
          main: i === 0,
        };
      })
    : [];

  // botanical sprig where the thread enters Recipes
  const sx = mobile ? (rtl ? 28 : W - 28) : xS;
  const sy = mobile ? S.recipes.top + 60 : gD[1] - 10;
  const leaf = (l: number) => `M0 0 C ${l * 0.35} ${-l * 0.32} ${l * 0.8} ${-l * 0.26} ${l} 0 C ${l * 0.8} ${l * 0.26} ${l * 0.35} ${l * 0.32} 0 0Z`;
  const leaves: [number, number, number][] = [[18, -38, 26], [40, 32, 24], [62, -34, 22], [84, 30, 20], [104, -26, 16]];

  const lift = mobile ? [40, 50] : [70, 96];

  return (
    <>
      <div className="absolute inset-0" style={{ background: tone }} />
      <div className="absolute inset-0" style={{ background: glows }} />
      <div
        className="page-canvas-grain absolute inset-x-0"
        style={{ top: r(S.recipes.top - 120), height: r(S.recipes.h + 240), backgroundImage: GRAIN }}
      />
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        <defs>
          <linearGradient id="pc-silk" x1="0" x2="1">
            <stop offset="0" stopColor="#7fd0f2" stopOpacity="0" />
            <stop offset=".5" stopColor="#7fd0f2" stopOpacity=".22" />
            <stop offset="1" stopColor="#00529b" stopOpacity="0" />
          </linearGradient>
          {crossings.map((c) => (
            <linearGradient key={c.id} id={`pc-x-${c.id}`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={r(c.g[0] - c.tail)} y2={r(c.g[1] + c.tail)}>
              <stop offset="0" stopColor="#43b7ea" stopOpacity="0" />
              <stop offset=".35" stopColor="#2f8fd0" stopOpacity={c.op} />
              <stop offset=".65" stopColor="#00529b" stopOpacity={c.op} />
              <stop offset="1" stopColor="#00529b" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* About: architectural arcs rising from the outer corner on the PHOTO side (never behind text) */}
        {!mobile &&
          [0, 1, 2].map((i) => {
            const rad = 360 + i * 90, cx = rtl ? W + 40 : -40, cy = S.who.bottom + 40;
            return (
              <path key={i} d={`M ${r(cx + (rtl ? -rad : rad))} ${r(cy)} A ${rad} ${rad} 0 0 ${rtl ? 1 : 0} ${r(cx)} ${r(cy - rad)}`}
                stroke="#0a2540" strokeOpacity={(0.16 - i * 0.04).toFixed(2)} strokeWidth="1" />
            );
          })}

        {/* the only soft ribbon below the hero */}
        <path d={silk} fill="url(#pc-silk)" />

        {/* the thread, seen only where it crosses between sections */}
        {crossings.map((c) => (
          <path key={c.id} data-draw={r(c.g[0])} stroke={`url(#pc-x-${c.id})`} strokeWidth={c.w}
            d={`M ${r(c.from)} ${r(c.g[0] - c.tail)} L ${r(c.from)} ${r(c.g[0])} ${curve(c.from, c.g[0], c.to, c.g[1])} L ${r(c.to)} ${r(c.g[1] + c.tail)}`} />
        ))}

        {/* timeline lead-in */}
        {lead.map((l, i) => (
          <path key={i} data-draw={r(S.campaigns.bottom - 120)} d={l.d} stroke="#2f8fd0" strokeOpacity={l.main ? 0.45 : 0.18} strokeWidth={l.main ? 1.3 : 0.8} />
        ))}

        {/* botanical sprig */}
        <g transform={`translate(${r(sx)} ${r(sy)}) scale(${rtl ? -1 : 1} 1) rotate(-70)`} stroke="#2ebb68" strokeOpacity=".42" strokeWidth="1">
          <path d="M0 0 C 30 -6 70 -4 120 10" />
          {leaves.map(([x, a, l]) => (
            <path key={x} d={leaf(l)} transform={`translate(${x} ${(x * 0.05).toFixed(1)}) rotate(${a})`} />
          ))}
        </g>

        {/* curved navy edge leading into the footer */}
        <path d={`M 0 ${fy + 2} C ${r(W * 0.28)} ${fy - lift[0]} ${r(W * 0.62)} ${fy + 10} ${W} ${fy - lift[1]} L ${W} ${fy + 2} Z`} fill="#04203d" />
        <path d={`M 0 ${fy - 14} C ${r(W * 0.28)} ${fy - lift[0] - 16} ${r(W * 0.62)} ${fy - 8} ${W} ${fy - lift[1] - 20}`} stroke="#43b7ea" strokeOpacity=".35" strokeWidth="1" />
      </svg>
    </>
  );
}
