import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const [name, vp, loc] of [["desktop-ar",{width:1440,height:900},"ar"],["desktop-en",{width:1440,height:900},"en"],["mobile-ar",{width:390,height:844},"ar"]]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(`http://localhost:3210/${loc}`, { waitUntil: "networkidle" });
  const s = p.locator("section[aria-labelledby=who]");
  await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
  await s.screenshot({ path: `qa/screenshots/about-bg/${name}.png` });
  await p.close();
}
await b.close();
