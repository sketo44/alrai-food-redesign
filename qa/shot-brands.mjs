import { chromium } from 'playwright';
const out = 'qa/screenshots/brands-showcase';
const b = await chromium.launch({ channel: 'chrome' });
const errs = [];
for (const l of ['ar','en']) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  p.on('console', m => m.type()==='error' && errs.push(l+': '+m.text()));
  p.on('pageerror', e => errs.push(l+': '+e.message));
  await p.goto(`http://localhost:3210/${l}/brands`, { waitUntil:'networkidle' });
  await p.waitForTimeout(900);
  await p.screenshot({ path:`${out}/${l}-desktop-default.png` });
  // drag the track one+ card toward the end
  const st = await p.locator('.brand-stage').boundingBox();
  const y = st.y + 390, x0 = st.x + st.width*0.5;
  await p.mouse.move(x0, y); await p.mouse.down();
  for (let i=1;i<=12;i++){ await p.mouse.move(x0 + (l==='ar'?1:-1)*i*22, y); await p.waitForTimeout(16); }
  await p.mouse.up(); await p.waitForTimeout(1200);
  const act = await p.locator('.brand-card[aria-current="true"]').getAttribute('aria-label');
  console.log(l, 'after drag active =', act);
  await p.screenshot({ path:`${out}/${l}-desktop-dragged.png` });
  await p.close();
}
for (const l of ['ar','en']) {
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  await p.goto(`http://localhost:3210/${l}/brands`, { waitUntil:'networkidle' });
  await p.waitForTimeout(600);
  await p.evaluate(()=>window.scrollTo(0, document.querySelector('.brand-stage').getBoundingClientRect().top + scrollY - 160));
  await p.waitForTimeout(600);
  await p.screenshot({ path:`${out}/${l}-mobile.png` });
  await p.screenshot({ path:`${out}/${l}-mobile-full.png`, fullPage:true });
  await p.close();
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
