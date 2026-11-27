/**
 * Branch locator QA (src/components/BranchLocator.tsx), boundary-region version.
 *
 *   node qa/test-branch-locator.mjs [baseUrl]      (default http://localhost:3210)
 *
 * Desktop 1440x900, tablet 820x1180 and mobile 390x844 (touch), AR + EN, home page and
 * /branches; reduced-motion pass; axe. Geometry checks: each branch's city point (projected
 * independently with d3-geo from network.ts) must lie inside its own drawn boundary region
 * and inside no other branch region. Screenshots: qa/screenshots/branch-locator/.
 * Exit code 1 if anything fails.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { geoMercator } from "d3-geo";

const BASE = process.argv[2] ?? "http://localhost:3210";
const SHOTS = new URL("./screenshots/branch-locator/", import.meta.url);
mkdirSync(SHOTS, { recursive: true });
const shot = (name) => fileURLToPath(new URL(name, SHOTS));

const net = readFileSync(new URL("../src/content/network.ts", import.meta.url), "utf8");
const gen = readFileSync(new URL("../src/content/ksa-map.generated.ts", import.meta.url), "utf8");
const BR = [...net.matchAll(/\{ id: "([^"]+)", city: \{ ar: "([^"]+)", en: "([^"]+)" \}, phone: "(\d+)", pin: city\(([\d.]+), ([\d.]+),/g)]
  .map((m) => ({ id: m[1], ar: m[2], en: m[3], phone: m[4], lat: +m[5], lon: +m[6] }));
const scale = +gen.match(/scale: ([\d.]+)/)[1];
const [tx, ty] = gen.match(/translate: \[([-\d.]+), ([-\d.]+)\]/).slice(1).map(Number);
const proj = geoMercator().scale(scale).translate([tx, ty]);
const mapsHref = (b, l) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l === "ar" ? `${b.ar}، المملكة العربية السعودية` : `${b.en}, Saudi Arabia`)}`;
const telHref = (p) => `tel:+966${p.replace(/^0/, "")}`;

const results = [];
const ok = (name, cond, detail = "") => { results.push({ name, pass: !!cond, detail }); console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`); };

const browser = await chromium.launch({ channel: "chrome" });

async function open(ctxOpts, path) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => { if (!r.url().includes("_next/webpack-hmr")) errors.push(`requestfailed ${r.url()}`); });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  return { ctx, page, errors };
}
async function toMap(page) {
  await page.locator(".bl-map").first().evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => document.querySelector("[data-bl-svg]")?.dataset.entered === "1", null, { timeout: 8000 });
  await page.waitForTimeout(150);
}
const selectedRegion = (page) => page.locator('.bl-region[data-on="1"]').getAttribute("data-region").catch(() => null);
const panelTitle = (page) => page.locator(".bl-panel h3").innerText().catch(() => "");
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
/** screen position of a branch's city point (independent projection -> SVG screen CTM) */
async function screenPoint(page, b) {
  const m = await page.evaluate(() => { const c = document.querySelector("[data-bl-svg]").getScreenCTM(); return [c.a, c.b, c.c, c.d, c.e, c.f]; });
  const [x, y] = proj([b.lon, b.lat]);
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

async function geometryChecks(page, l, tag) {
  // every city point lies in its own region, and in no other branch region
  const rows = await page.evaluate((pts) => {
    const shapes = [...document.querySelectorAll(".bl-region")].map((g) => ({ id: g.dataset.region, el: g.querySelector(".bl-shape") }));
    return pts.map((p) => {
      const pt = new DOMPoint(p.x, p.y);
      return { id: p.id, inside: shapes.filter((s) => s.el.isPointInFill(pt)).map((s) => s.id) };
    });
  }, BR.map((b) => { const [x, y] = proj([b.lon, b.lat]); return { id: b.id, x, y }; }));
  const bad = rows.filter((r) => r.inside.length !== 1 || r.inside[0] !== r.id).map((r) => `${r.id} in [${r.inside}]`);
  ok(`${tag} ${l} each city point lies inside its own boundary region only`, !bad.length, bad.join("; "));
  // city markers sit on the projected coordinate
  let worst = 0;
  for (const b of BR) {
    const e = await screenPoint(page, b);
    const r = await page.locator(`[data-pin="${b.id}"]`).boundingBox();
    worst = Math.max(worst, Math.hypot(r.x - e.x, r.y - e.y)); // pin box is 0x0 at the point
  }
  ok(`${tag} ${l} city markers match projected coordinates (max ${worst.toFixed(2)}px <= 1px)`, worst <= 1);
  const lens = await page.evaluate(() => ["bl-gov-lines", "bl-reg-lines", "bl-outline"].map((c) => document.querySelector(`.${c}`)?.getAttribute("d")?.length ?? 0));
  ok(`${tag} ${l} internal governorate + region borders drawn`, lens.every((n) => n > 1000), lens.join("/"));
}

// ── desktop, AR + EN ──
for (const l of ["ar", "en"]) {
  const tag = "desktop";
  const { ctx, page, errors } = await open({ viewport: { width: 1440, height: 900 }, locale: l === "ar" ? "ar-SA" : "en-US" }, `/${l}`);
  await toMap(page);
  ok(`${tag} ${l} 9 boundary regions (role=button) + 9 list options`, (await page.locator('.bl-shape[role="button"]').count()) === BR.length && (await page.locator('.bl-list [role="radio"]').count()) === BR.length);
  ok(`${tag} ${l} city markers are decorative (no pointer events, aria-hidden)`, (await page.locator(".bl-layer").getAttribute("aria-hidden")) === "true" && (await page.locator(".bl-layer").evaluate((e) => getComputedStyle(e).pointerEvents)) === "none");
  await geometryChecks(page, l, tag);
  await page.screenshot({ path: shot(`desktop-${l}-default.png`) });

  // hover a region at a point well inside it (not at the marker)
  const riy = await page.locator('[data-region="riyadh"] .bl-shape').boundingBox();
  const inside = await page.evaluate(() => { const s = document.querySelector('[data-region="riyadh"] .bl-shape'); const b = s.getBBox(); for (let fy = 0.3; fy < 0.8; fy += 0.05) for (let fx = 0.2; fx < 0.8; fx += 0.05) { const p = new DOMPoint(b.x + b.width * fx, b.y + b.height * fy); if (s.isPointInFill(p)) return [fx, fy]; } return [0.5, 0.5]; });
  await page.mouse.move(riy.x + riy.width * inside[0], riy.y + riy.height * inside[1]);
  await page.waitForTimeout(400);
  ok(`${tag} ${l} hovering a region highlights it`, (await page.locator('[data-region="riyadh"]').getAttribute("data-hot")) === "1" && (await page.locator(".bl-top-hot").count()) === 1);
  const fill = await page.locator('[data-region="riyadh"] .bl-shape').evaluate((e) => getComputedStyle(e).fillOpacity);
  ok(`${tag} ${l} hovered region fill strengthens`, +fill >= 0.35, `fill-opacity ${fill}`);
  const tipText = await page.locator(".bl-tip").innerText().catch(() => "");
  ok(`${tag} ${l} tooltip names the city`, tipText.includes(l === "ar" ? "الرياض" : "Riyadh"), tipText.replace(/\n/g, " | "));
  const tipBox = await page.locator(".bl-tip").boundingBox();
  ok(`${tag} ${l} tooltip sits above the region, not over it`, tipBox && tipBox.y + tipBox.height <= riy.y + 2);
  await page.screenshot({ path: shot(`desktop-${l}-hover.png`) });

  // click a region (Jeddah, a small coastal one) on its own fill
  const jp = await screenPoint(page, BR.find((b) => b.id === "jeddah"));
  await page.mouse.click(jp.x, jp.y + 6);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(1300);
  ok(`${tag} ${l} clicking a region selects it`, (await selectedRegion(page)) === "jeddah", `selected ${await selectedRegion(page)}`);
  ok(`${tag} ${l} panel shows the city`, (await panelTitle(page)) === (l === "ar" ? "جدة" : "Jeddah"));
  ok(`${tag} ${l} list mirrors map selection`, (await page.locator('.bl-list [data-branch="jeddah"]').getAttribute("aria-checked")) === "true");
  ok(`${tag} ${l} selected region keeps an active overlay`, (await page.locator('[data-top-on="jeddah"]').count()) === 1);
  ok(`${tag} ${l} panel shows zoomed boundary inset`, (await page.locator('.bl-panel [data-inset="jeddah"]').count()) === 1);
  ok(`${tag} ${l} panel says area is the boundary, not the branch`, (await page.locator(".bl-panel").innerText()).includes(l === "ar" ? "وليست العنوان الدقيق" : "not the exact branch address"));
  await page.screenshot({ path: shot(`desktop-${l}-selected.png`) });

  // Jeddah and Makkah are neighbours: a click on Makkah's fill must pick Makkah
  const mp = await screenPoint(page, BR.find((b) => b.id === "makkah"));
  await page.mouse.click(mp.x + 4, mp.y);
  await page.waitForTimeout(300);
  ok(`${tag} ${l} neighbouring region (Makkah) selectable`, (await selectedRegion(page)) === "makkah");

  // list -> map
  await page.locator('.bl-list [data-branch="tabuk"]').click();
  await page.waitForTimeout(300);
  ok(`${tag} ${l} list selection highlights the region`, (await selectedRegion(page)) === "tabuk" && (await page.locator('[data-region="tabuk"] .bl-shape').getAttribute("aria-pressed")) === "true");

  // list hover previews the region
  await page.locator('.bl-list [data-branch="madinah"]').hover();
  await page.waitForTimeout(200);
  ok(`${tag} ${l} hovering a list item previews its region`, (await page.locator('[data-region="madinah"]').getAttribute("data-hot")) === "1");
  await page.mouse.move(5, 5);

  // all phone + Maps links
  const linkBad = [];
  for (const b of BR) {
    await page.locator(`.bl-list [data-branch="${b.id}"]`).click();
    const [href, target, rel, tel] = await Promise.all([page.locator(".bl-panel [data-maps]").getAttribute("href"), page.locator(".bl-panel [data-maps]").getAttribute("target"), page.locator(".bl-panel [data-maps]").getAttribute("rel"), page.locator(".bl-panel [data-tel]").getAttribute("href")]);
    if (href !== mapsHref(b, l) || target !== "_blank" || !rel?.includes("noopener") || tel !== telHref(b.phone)) linkBad.push(b.id);
  }
  ok(`${tag} ${l} all 9 phone + Google Maps links correct`, !linkBad.length, linkBad.join(","));

  // keyboard: regions are tab stops; Enter selects
  await page.locator('[data-region="dammam"] .bl-shape').focus();
  ok(`${tag} ${l} focused region shows tooltip`, (await page.locator(".bl-tip").innerText()).includes(l === "ar" ? "الدمام" : "Dammam"));
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  ok(`${tag} ${l} Enter on a focused region selects it`, (await selectedRegion(page)) === "dammam");
  await page.keyboard.press("Tab");
  const nextFocus = await page.evaluate(() => document.activeElement?.closest("[data-region]")?.getAttribute("data-region"));
  ok(`${tag} ${l} Tab moves to the next region`, nextFocus === "jeddah", nextFocus);
  await page.keyboard.press(" ");
  await page.waitForTimeout(200);
  ok(`${tag} ${l} Space selects it`, (await selectedRegion(page)) === "jeddah");
  await page.locator('.bl-list [data-branch="riyadh"]').focus();
  await page.keyboard.press(l === "ar" ? "ArrowLeft" : "ArrowRight");
  ok(`${tag} ${l} list arrow keys move + select`, (await selectedRegion(page)) === "dammam");
  ok(`${tag} ${l} roving tabindex (one tab stop in list)`, (await page.locator('.bl-list [tabindex="0"]').count()) === 1);

  if (l === "ar") {
    await page.waitForTimeout(900); // let the panel fade-in finish (mid-fade text reads as low contrast)
    const axe = await new AxeBuilder({ page }).include(".branch-locator").analyze();
    ok(`${tag} ${l} axe: 0 violations in the locator`, axe.violations.length === 0, axe.violations.map((v) => `${v.id}(${v.nodes.length})`).join(", "));
  }
  ok(`${tag} ${l} no horizontal overflow`, await noOverflow(page));
  ok(`${tag} ${l} no console errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ── mobile (touch), AR + EN ──
for (const l of ["ar", "en"]) {
  const tag = "mobile";
  const { ctx, page, errors } = await open({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, `/${l}`);
  await toMap(page);
  await geometryChecks(page, l, tag);
  ok(`${tag} ${l} sheet hidden before selection`, (await page.locator(".bl-panel").evaluate((e) => getComputedStyle(e).visibility)) === "hidden");
  if (l === "ar") await page.screenshot({ path: shot(`mobile-${l}-default.png`) });

  // tap inside a big region away from its marker
  const box = await page.locator('[data-region="al-ahsa"] .bl-shape').boundingBox();
  await page.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.75);
  await page.waitForTimeout(900);
  ok(`${tag} ${l} tapping a region opens the bottom sheet`, (await selectedRegion(page)) === "al-ahsa" && (await page.locator(".bl-panel").getAttribute("data-open")) === "1");
  ok(`${tag} ${l} sheet is a dialog with focus inside`, (await page.locator(".bl-panel").getAttribute("role")) === "dialog" && (await page.evaluate(() => !!document.activeElement?.closest(".bl-panel"))));
  if (l === "ar") await page.screenshot({ path: shot(`mobile-${l}-selected.png`) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  ok(`${tag} ${l} Esc closes the sheet`, (await page.locator(".bl-panel").getAttribute("data-open")) === "0");

  // tiny neighbouring coastal regions: tap on each city point
  for (const id of ["jeddah", "makkah", "dammam"]) {
    const p = await screenPoint(page, BR.find((b) => b.id === id));
    await page.touchscreen.tap(p.x, p.y);
    await page.waitForTimeout(500);
    ok(`${tag} ${l} tap on ${id} picks ${id}`, (await selectedRegion(page)) === id, `got ${await selectedRegion(page)}`);
    await page.locator('.bl-panel button[aria-label]').last().tap();
    await page.waitForTimeout(450);
  }
  ok(`${tag} ${l} close button closes the sheet`, (await page.locator(".bl-panel").getAttribute("data-open")) === "0");
  ok(`${tag} ${l} no horizontal overflow`, await noOverflow(page));
  ok(`${tag} ${l} no console errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ── tablet: inline panel ──
{
  const { ctx, page, errors } = await open({ viewport: { width: 820, height: 1180 } }, "/ar");
  await toMap(page);
  await page.locator('[data-region="madinah"] .bl-shape').click({ position: { x: 20, y: 30 }, force: true }).catch(() => {});
  if ((await selectedRegion(page)) !== "madinah") await page.locator('.bl-list [data-branch="madinah"]').click();
  ok("tablet ar inline panel (not a sheet) shows city", (await page.locator(".bl-panel").getAttribute("data-sheet")) === "0" && (await panelTitle(page)) === "المدينة المنورة");
  ok("tablet ar no horizontal overflow", await noOverflow(page));
  ok("tablet ar no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ── reduced motion ──
{
  const { ctx, page, errors } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }, "/ar");
  await toMap(page);
  ok("reduced-motion regions visible without entrance animation", (await page.locator(".bl-region").first().evaluate((e) => getComputedStyle(e).opacity)) === "1");
  await page.locator('.bl-list [data-branch="dammam"]').click();
  await page.waitForTimeout(50);
  const lift = await page.locator('[data-top-on="dammam"] g').first().evaluate((e) => getComputedStyle(e).opacity);
  ok("reduced-motion selection applies instantly", (await selectedRegion(page)) === "dammam" && lift === "1");
  ok("reduced-motion no hover keyframes", (await page.evaluate(() => { const s = document.createElement("div"); s.className = "bl-tip"; document.body.append(s); const n = getComputedStyle(s).animationName; s.remove(); return n; })) === "none");
  ok("reduced-motion no console errors", errors.length === 0);
  await ctx.close();
}

// ── branches page ──
for (const l of ["ar", "en"]) {
  const { ctx, page, errors } = await open({ viewport: { width: 1440, height: 900 } }, `/${l}/branches`);
  ok(`branches page ${l} locator with 9 regions + full contact table`, (await page.locator(".bl-shape").count()) === BR.length && (await page.locator("table tbody tr").count()) === BR.length);
  ok(`branches page ${l} no console errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
