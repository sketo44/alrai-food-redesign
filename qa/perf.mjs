// Lab performance sample (not Lighthouse): LCP, CLS, JS/total transfer on the local production server.
// Mobile run uses CPU 4x slowdown + "Fast 3G-ish" network via CDP. Usage: node qa/perf.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE ?? "http://localhost:3211";
const root = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ channel: "chrome" });
const out = [];
for (const profile of ["desktop", "mobile-throttled"]) {
  for (const p of ["/ar", "/en", "/ar/products", "/en/products/barista-cafe/coffee-latte-mocha-250ml"]) {
    const mobile = profile !== "desktop";
    const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    if (mobile) {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    }
    let bytes = 0, js = 0;
    cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; });
    page.on("response", async (r) => { if (r.request().resourceType() === "script") { const l = Number(r.headers()["content-length"] ?? 0); js += l; } });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0; window.__lcpEl = "";
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = (e.element?.tagName ?? "") + " " + (e.element?.textContent?.slice(0, 30) ?? e.url ?? ""); } }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(BASE + p, { waitUntil: "load" });
    await page.waitForTimeout(3500);
    const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), lcpEl: window.__lcpEl, ttfb: Math.round(performance.getEntriesByType("navigation")[0].responseStart) }));
    out.push({ profile, path: p, ...m, transferKB: Math.round(bytes / 1024) });
    console.log(profile, p, JSON.stringify(m), Math.round(bytes / 1024) + "KB");
    await ctx.close();
  }
}
fs.writeFileSync(path.join(root, "perf-results.json"), JSON.stringify(out, null, 1));
await browser.close();
