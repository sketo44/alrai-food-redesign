import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const b = await chromium.launch({ channel: "chrome" });
const out = {};
for (const [name, vp] of [["desktop",{width:1440,height:900}],["mobile",{width:390,height:844}]]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto("http://localhost:3210/ar", { waitUntil: "networkidle" });
  for (let y = 0; y < 14000; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
  out[name] = await p.evaluate(() => {
    const els = [...document.querySelectorAll("main > *, main > div > section, footer")];
    const seen = new Set();
    return [...document.querySelectorAll("main section, footer")].filter((e) => !e.parentElement.closest("section")).map((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { tag: e.tagName, id: e.getAttribute("aria-labelledby") || e.getAttribute("aria-label") || e.className.slice(0,40), top: Math.round(r.top + scrollY), h: Math.round(r.height), bg: cs.backgroundColor, bgImg: cs.backgroundImage.slice(0, 60) };
    });
  });
  await p.addStyleTag({ content: "header{position:static!important}" });
  await p.screenshot({ path: `qa/bg-system/current/${name}-full.png`, fullPage: true });
  out[name + "_docH"] = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.close();
}
await b.close();
writeFileSync("qa/bg-system/current/sections.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 0));
