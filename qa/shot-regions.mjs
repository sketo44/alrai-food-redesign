// Quick visual check of the boundary-based branch map. node qa/shot-regions.mjs [base]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const BASE = process.argv[2] ?? "http://localhost:3210";
const OUT = "qa/screenshots/branch-regions/";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
async function go(opts, path) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(BASE + path, { waitUntil: "networkidle" });
  await p.locator(".bl-map").first().evaluate((el) => el.scrollIntoView({ block: "center" }));
  await p.waitForFunction(() => document.querySelector("[data-bl-svg]")?.dataset.entered === "1", null, { timeout: 8000 });
  await p.waitForTimeout(300);
  return { ctx, p, errs };
}
for (const l of ["ar", "en"]) {
  const { ctx, p, errs } = await go({ viewport: { width: 1440, height: 900 } }, `/${l}`);
  const sec = p.locator(".branch-locator").first();
  await p.screenshot({ path: `${OUT}desktop-${l}-default.png` });
  await p.locator('[data-region="riyadh"] .bl-shape').hover();
  await p.waitForTimeout(450);
  await p.screenshot({ path: `${OUT}desktop-${l}-hover.png` });
  await p.locator('.bl-list [data-branch="madinah"]').click();
  await p.mouse.move(5, 5);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}desktop-${l}-selected.png` });
  console.log(l, "errors:", errs.length ? errs : "none");
  await ctx.close();
}
for (const l of ["ar"]) {
  const { ctx, p, errs } = await go({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, `/${l}`);
  await p.screenshot({ path: `${OUT}mobile-${l}-default.png` });
  const r = await p.locator('[data-region="riyadh"] .bl-shape').boundingBox();
  await p.touchscreen.tap(r.x + r.width * 0.3, r.y + r.height * 0.6);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}mobile-${l}-selected.png` });
  console.log("mobile", l, "errors:", errs.length ? errs : "none", "selected:", await p.locator(".bl-panel h3").innerText());
  await ctx.close();
}
await b.close();
