import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const [name, vp, loc] of [["desktop-ar",{width:1440,height:900},"ar"],["desktop-en",{width:1440,height:900},"en"],["mobile-ar",{width:390,height:844},"ar"]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
  await p.goto(`http://localhost:3210/${loc}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  const h = await p.$eval("section[aria-labelledby=hero-title]", (s) => s.getBoundingClientRect().bottom + scrollY);
  await p.screenshot({ path: `qa/screenshots/hero-bg/${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.ceil(h) + 40 } , fullPage: true});
  await p.close();
}
await b.close();
