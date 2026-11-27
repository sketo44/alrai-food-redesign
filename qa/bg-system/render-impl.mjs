// Stage Two review: full-page captures of the REAL page at every test size.
//   node qa/bg-system/render-impl.mjs <round>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import sharp from "sharp";
const round = process.argv[2] ?? "i1";
const out = `qa/bg-system/impl/${round}`;
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const views = [
  ["desktop-ar", { width: 1440, height: 900 }, "ar"], ["desktop-1920-ar", { width: 1920, height: 1080 }, "ar"],
  ["tablet-ar", { width: 768, height: 1024 }, "ar"], ["mobile-ar", { width: 390, height: 844 }, "ar"],
  ["mobile-360-ar", { width: 360, height: 780 }, "ar"], ["desktop-en", { width: 1440, height: 900 }, "en"], ["mobile-en", { width: 390, height: 844 }, "en"],
];
for (const [name, vp, loc] of views) {
  const p = await b.newPage({ viewport: vp });
  const errors = [];
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  p.on("pageerror", (e) => errors.push(e.message));
  const bad = [];
  p.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url()));
  await p.goto(`http://localhost:3210/${loc}`, { waitUntil: "networkidle" });
  for (let y = 0; y < 14000; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(140); }
  await p.evaluate(() => scrollTo(0, 0));
  await p.addStyleTag({ content: "header{position:static!important} nextjs-portal{display:none!important}" });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    canvas: !!document.querySelector(".page-canvas[data-ready] svg"),
    h: document.documentElement.scrollHeight,
  }));
  const file = `${out}/${name}.png`;
  await p.screenshot({ path: file, fullPage: true });
  const m = await sharp(file).metadata();
  const parts = vp.width < 768 ? 4 : 3, h = Math.ceil(m.height / parts);
  for (let i = 0; i < parts; i++)
    await sharp(file).extract({ left: 0, top: i * h, width: m.width, height: Math.min(h, m.height - i * h) }).resize({ width: vp.width < 768 ? 300 : 620 }).toFile(`${out}/${name}-part${i}.png`);
  console.log(name, JSON.stringify(info), "errors:", errors.length, errors.slice(0, 2).join(" | "), "bad:", bad.join(", "));
  await p.close();
}
await b.close();
