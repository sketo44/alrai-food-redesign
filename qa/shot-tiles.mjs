import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const [name, vp] of [["desktop-ar",{width:1440,height:900}],["mobile-ar",{width:390,height:844}]]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(`http://localhost:3210/ar`, { waitUntil: "networkidle" });
  const s = p.locator("section[aria-labelledby=products]");
  await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await p.addStyleTag({content:"header{position:static!important}"});
  await s.screenshot({ path: `qa/screenshots/category-tiles/${name}.png` });
  await p.close();
}
await b.close();
