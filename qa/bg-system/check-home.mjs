// Homepage checks for the background system: axe (WCAG 2.2 AA), CLS while scrolling, decorative
// layers hidden from assistive tech, sticky timeline title still sticks, reduced motion = static.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
const BASE = process.env.BASE ?? "http://localhost:3210";
const b = await chromium.launch({ channel: "chrome" });
const res = []; const ok = (n, c, d = "") => res.push(`${c ? "PASS" : "FAIL"} ${n} ${d}`);
for (const [loc, vp] of [["ar", { width: 1440, height: 900 }], ["en", { width: 1440, height: 900 }], ["ar", { width: 390, height: 844 }]]) {
  const tag = `${loc} ${vp.width}`;
  const ctx = await b.newContext({ viewport: vp });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
  await p.goto(`${BASE}/${loc}`, { waitUntil: "networkidle" });
  for (let y = 0; y < 12000; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200);
  const cls = await p.evaluate(() => window.__cls);
  ok(`${tag} CLS < 0.1`, cls < 0.1, cls.toFixed(4));
  const deco = await p.evaluate(() => [...document.querySelectorAll(".page-canvas, .bg-art")].every((e) => e.getAttribute("aria-hidden") === "true" && getComputedStyle(e).pointerEvents === "none"));
  ok(`${tag} decorative layers aria-hidden + no pointer events`, deco);
  const imgs = await p.evaluate(() => [...document.querySelectorAll(".bg-art img")].map((i) => ({ src: i.currentSrc.slice(-60), w: i.naturalWidth, vis: i.getBoundingClientRect().width > 0 && getComputedStyle(i.closest(".bg-art")).display !== "none" })));
  ok(`${tag} visible art images decoded`, imgs.filter((i) => i.vis).every((i) => i.w > 0), JSON.stringify(imgs.filter((i) => i.vis).map((i) => i.w)));
  if (vp.width >= 1024) {
    // sticky timeline title must stick while the timeline scrolls
    const st = await p.evaluate(async () => {
      const t = document.querySelector('[data-bg="journey"] [class*="lg:sticky"]'); const s = t.closest("section");
      scrollTo({ top: s.getBoundingClientRect().top + scrollY + 250, behavior: "instant" }); await new Promise((r) => setTimeout(r, 400));
      return Math.round(t.getBoundingClientRect().top);
    });
    ok(`${tag} timeline title sticky`, st > 100 && st < 140, `top=${st}`);
  }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900);
  const axe = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  ok(`${tag} axe 0 violations`, axe.violations.length === 0, axe.violations.map((v) => `${v.id}(${v.nodes.length})`).join(","));
  await ctx.close();
}
// reduced motion: canvas present, no dash animation pending, no parallax transform
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${BASE}/ar`, { waitUntil: "networkidle" }); await p.waitForTimeout(800);
const rm = await p.evaluate(() => ({
  drawn: [...document.querySelectorAll(".page-canvas [data-draw]")].every((e) => !e.style.strokeDashoffset || e.style.strokeDashoffset === "0px"),
  still: [...document.querySelectorAll("[data-bg-parallax]")].every((e) => !e.style.transform || /none|translate\(0px, 0px\)/.test(e.style.transform)),
}));
ok("reduced motion: thread fully drawn, no parallax", rm.drawn && rm.still, JSON.stringify(rm));
await ctx.close(); await b.close();
console.log(res.join("\n")); console.log(`${res.filter((r) => r.startsWith("PASS")).length}/${res.length} passed`);
