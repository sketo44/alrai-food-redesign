// Renders the STAGE ONE concept: the live page + qa/bg-system/concept.js injected at capture time.
//   node qa/bg-system/render-concept.mjs [round]
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const round = process.argv[2] ?? "r1";
const out = `qa/bg-system/concept/${round}`;
mkdirSync(out, { recursive: true });
const script = readFileSync("qa/bg-system/concept.js", "utf8");
const b = await chromium.launch({ channel: "chrome" });
const views = [
  ["desktop-ar", { width: 1440, height: 900 }, "ar"],
  ["desktop-1920-ar", { width: 1920, height: 1080 }, "ar"],
  ["tablet-ar", { width: 768, height: 1024 }, "ar"],
  ["mobile-ar", { width: 390, height: 844 }, "ar"],
  ["mobile-360-ar", { width: 360, height: 780 }, "ar"],
  ["desktop-en", { width: 1440, height: 900 }, "en"],
];
for (const [name, vp, loc] of views) {
  const p = await b.newPage({ viewport: vp, reducedMotion: "reduce" });
  await p.goto(`http://localhost:3210/${loc}`, { waitUntil: "networkidle" });
  for (let y = 0; y < 14000; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(100); }
  await p.evaluate(() => scrollTo(0, 0));
  await p.addStyleTag({ content: "header{position:static!important} nextjs-portal{display:none!important}" });
  await p.waitForTimeout(800);
  await p.evaluate(script);
  await p.waitForTimeout(1200);
  const file = `${out}/${name}.png`;
  await p.screenshot({ path: file, fullPage: true });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  // review crops: the full page split into parts small enough to inspect
  const m = await sharp(file).metadata();
  const parts = vp.width < 768 ? 4 : 3, h = Math.ceil(m.height / parts);
  for (let i = 0; i < parts; i++)
    await sharp(file).extract({ left: 0, top: i * h, width: m.width, height: Math.min(h, m.height - i * h) })
      .resize({ width: vp.width < 768 ? 300 : 620 }).toFile(`${out}/${name}-part${i}.png`);
  console.log(name, m.width + "x" + m.height, "overflow", overflow);
  await p.close();
}
await b.close();
