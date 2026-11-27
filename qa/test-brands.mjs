import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const act = p => p.locator('.brand-card[aria-current="true"]').getAttribute('aria-label');
const res = []; const ok = (n, c, d='') => res.push(`${c?'PASS':'FAIL'} ${n} ${d}`);
const errs = [];
for (const l of ['ar','en']) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
  await p.goto(`http://localhost:3210/${l}/brands`, { waitUntil:'networkidle' });
  ok(`${l} default active`, (await act(p)).startsWith(l==='ar'?'رايو':'RAIO'));
  const next = l==='ar' ? 'العلامة التالية' : 'Next brand';
  await p.getByRole('button', { name: next }).click(); await p.waitForTimeout(900);
  ok(`${l} next arrow`, (await act(p)).includes('(5/6)'), await act(p));
  await p.getByRole('button', { name: next }).click(); await p.waitForTimeout(150);
  await p.getByRole('button', { name: next }).click(); await p.waitForTimeout(900);
  ok(`${l} loops past end`, (await act(p)).includes('(1/6)'), await act(p));
  await p.locator('button[aria-label*=": "]').nth(2).click(); await p.waitForTimeout(900);
  ok(`${l} dot click`, (await act(p)).includes('(3/6)'), await act(p));
  // click a visible side card
  await p.locator('.brand-card').nth(1).click(); await p.waitForTimeout(900);
  ok(`${l} card click`, (await act(p)).includes('(2/6)'), await act(p));
  // keyboard
  await p.locator('[aria-roledescription="carousel"]').focus();
  await p.keyboard.press(l==='ar'?'ArrowLeft':'ArrowRight'); await p.waitForTimeout(900);
  ok(`${l} keyboard`, (await act(p)).includes('(3/6)'), await act(p));
  await p.keyboard.press('End'); await p.waitForTimeout(900);
  ok(`${l} End key`, (await act(p)).includes('(6/6)'), await act(p));
  // trackpad horizontal wheel
  const st = await p.locator('.brand-stage').boundingBox();
  await p.mouse.move(st.x + st.width/2, st.y + 400);
  for (let i=0;i<8;i++){ await p.mouse.wheel(l==='ar'?-30:30, 0); await p.waitForTimeout(16);} await p.waitForTimeout(900);
  ok(`${l} trackpad wheel`, !(await act(p)).includes('(6/6)'), await act(p));
  // vertical wheel must still scroll the page
  const y0 = await p.evaluate(()=>scrollY); await p.mouse.wheel(0, 300); await p.waitForTimeout(400);
  ok(`${l} vertical wheel scrolls page`, (await p.evaluate(()=>scrollY)) > y0);
  ok(`${l} bubble text matches active`, (await p.locator('.brand-stage .brand-bubble').innerText()).length > 0);
  ok(`${l} no horizontal overflow`, await p.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
  // home
  await p.goto(`http://localhost:3210/${l}`, { waitUntil:'networkidle' });
  ok(`${l} home showcase present`, await p.locator('#brands').count() === 1 && await p.locator('.brand-card').count() === 6);
  ok(`${l} home one h1`, await p.locator('h1').count() === 1);
  await p.close();
}
// touch swipe on mobile
for (const l of ['ar','en']) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:3210/${l}/brands`, { waitUntil:'networkidle' });
  const st = await p.locator('.brand-stage').boundingBox();
  await p.evaluate(y => scrollTo(0, y), st.y - 200); await p.waitForTimeout(300);
  const s2 = await p.locator('.brand-stage').boundingBox();
  const cdp = await ctx.newCDPSession(p);
  const y = s2.y + s2.height/2, x0 = 300, x1 = 90;
  await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{x:x0,y}] });
  for (let i=1;i<=10;i++) { await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{x:x0+(x1-x0)*i/10,y}] }); await p.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] }); await p.waitForTimeout(1000);
  const a = await act(p);
  ok(`${l} mobile touch swipe`, !a.includes('(4/6)'), a);
  ok(`${l} mobile no horizontal overflow`, await p.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
  await ctx.close();
}
// reduced motion: arrow snaps instantly
{
  const p = await b.newPage({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
  await p.goto(`http://localhost:3210/ar/brands`, { waitUntil:'networkidle' });
  await p.getByRole('button', { name: 'العلامة التالية' }).click(); await p.waitForTimeout(60);
  ok('reduced motion instant snap', (await act(p)).includes('(5/6)'), await act(p));
  const anim = await p.evaluate(()=>getComputedStyle(document.querySelector('.brand-bubble-in')).animationName);
  ok('reduced motion no bubble animation', anim === 'none', anim);
  await p.close();
}
console.log(res.join('\n')); console.log('console/page errors:', errs.length ? errs : 'none');
await b.close();
