// Quick screenshot helper: node qa/shot.mjs <out-dir> <width>x<height> <path>[,path...] [--full] [--reduced]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [outDir, size, paths, ...flags] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const full = flags.includes("--full");
const reduced = flags.includes("--reduced");
const base = process.env.BASE ?? "http://localhost:3210";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference", deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
for (const p of paths.split(",")) {
  await page.goto(base + p, { waitUntil: "networkidle" });
  // Walk the page so lazy images and scroll triggers settle, then return to top
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const name = `${p.replace(/\//g, "_").replace(/^_/, "") || "root"}-${w}${reduced ? "-reduced" : ""}${full ? "-full" : ""}.png`;
  await page.screenshot({ path: path.join(outDir, name), fullPage: full });
  console.log("saved", name);
}
if (errors.length) console.log("CONSOLE ERRORS:\n" + errors.join("\n"));
await browser.close();
