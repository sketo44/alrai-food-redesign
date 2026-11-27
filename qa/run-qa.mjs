// Full QA run. Usage: node qa/run-qa.mjs <round-label> [--skip-crawl] [--skip-shots]
// BASE env overrides the server (default http://localhost:3210).
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const round = process.argv[2] ?? "round1";
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
const skipCrawl = process.argv.includes("--skip-crawl");
const skipShots = process.argv.includes("--skip-shots");
const BASE = process.env.BASE ?? "http://localhost:3210";
const root = path.dirname(fileURLToPath(import.meta.url));
const shotDir = path.join(root, "screenshots", round);
fs.mkdirSync(shotDir, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const results = { round, base: BASE, startedAt: new Date().toISOString(), checks: [], crawl: [], axe: [], screenshots: [] };
const check = (name, pass, detail = "") => { results.checks.push({ name, pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };

async function section(name, fn) { try { await fn(); } catch (e) { check(`section ${name} completed without a script error`, false, String(e.message).split(String.fromCharCode(10))[0]); } }

const browser = await chromium.launch({ channel: "chrome" });

async function newPage(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: opts.reduced ? "reduce" : "no-preference", isMobile: viewport.width < 768, hasTouch: viewport.width < 768 });
  const page = await ctx.newPage();
  page._errors = []; page._failed = []; page._imgs = []; page._posts = [];
  page.on("console", (m) => { if (m.type() === "error") page._errors.push(m.text()); });
  page.on("pageerror", (e) => page._errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => { const u = r.url(); if (!u.includes("_next/webpack-hmr") && !u.includes("__nextjs")) page._failed.push(`${u} ${r.failure()?.errorText}`); });
  page.on("request", (r) => { if (r.method() === "POST" && !r.url().includes("__nextjs") && !r.url().includes("_next")) page._posts.push(r.url()); });
  page.on("response", (r) => { if (r.request().resourceType() === "image") page._imgs.push({ url: r.url(), status: r.status() }); });
  return { ctx, page };
}

async function settle(page) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(35); }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

// ───────── 1. Route list from the sitemap ─────────
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
check("sitemap.xml lists routes for both locales", urls.length > 100 && urls.some((u) => u.startsWith("/en")) && urls.some((u) => u.startsWith("/ar")), `${urls.length} URLs`);

// ───────── 2. Crawl every route (desktop) ─────────
if (!skipCrawl) await section("crawl", async () => {
  const { ctx, page } = await newPage(DESKTOP);
  for (const u of urls) {
    page._errors = []; page._failed = []; page._imgs = [];
    const res = await page.goto(BASE + u, { waitUntil: "load" });
    await settle(page);
    const info = await page.evaluate(() => {
      const imgs = [...document.images];
      return {
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        title: document.title,
        h1: document.querySelectorAll("h1").length,
        hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.getAttribute("hreflang")),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
        brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        imgsNoAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        main: !!document.querySelector("main#main"),
      };
    });
    const badImgResponses = page._imgs.filter((r) => r.status >= 400);
    results.crawl.push({ url: u, status: res?.status(), ...info, consoleErrors: [...page._errors], failedRequests: [...page._failed], imageResponses: page._imgs.length, badImgResponses });
    const ok = res?.status() === 200 && info.h1 === 1 && !info.brokenImgs.length && !badImgResponses.length && !page._errors.length && !page._failed.length && !info.overflowX && info.imgsNoAlt === 0;
    if (!ok) console.log("  issue:", u, JSON.stringify({ s: res?.status(), h1: info.h1, broken: info.brokenImgs, bad: badImgResponses, err: page._errors.slice(0, 3), failed: page._failed.slice(0, 3), ox: info.overflowX, noAlt: info.imgsNoAlt }));
  }
  await ctx.close();
  const c = results.crawl;
  check("all routes return 200", c.every((r) => r.status === 200), `${c.filter((r) => r.status === 200).length}/${c.length}`);
  check("html lang/dir match locale", c.every((r) => (r.url.startsWith("/ar") ? r.lang === "ar" && r.dir === "rtl" : r.lang === "en" && r.dir === "ltr")));
  check("exactly one h1 per page", c.every((r) => r.h1 === 1), c.filter((r) => r.h1 !== 1).map((r) => r.url).join(", "));
  check("hreflang ar+en+x-default on every page", c.every((r) => ["ar", "en", "x-default"].every((h) => r.hreflang.includes(h))));
  check("canonical + og:image on every page", c.every((r) => r.canonical && r.ogImage));
  check("no broken images (naturalWidth=0)", c.every((r) => !r.brokenImgs.length), c.flatMap((r) => r.brokenImgs).slice(0, 5).join(", "));
  check("no image responses >= 400", c.every((r) => !r.badImgResponses.length), `${c.reduce((a, r) => a + r.imageResponses, 0)} image responses checked`);
  check("every <img> has an alt attribute", c.every((r) => r.imgsNoAlt === 0));
  check("no console errors on any route", c.every((r) => !r.consoleErrors.length), c.filter((r) => r.consoleErrors.length).map((r) => `${r.url}: ${r.consoleErrors[0]}`).slice(0, 5).join(" | "));
  check("no failed network requests", c.every((r) => !r.failedRequests.length), c.flatMap((r) => r.failedRequests).slice(0, 5).join(", "));
  check("no horizontal overflow at 1440", c.every((r) => !r.overflowX), c.filter((r) => r.overflowX).map((r) => r.url).join(", "));
});

// ───────── 3. Mobile overflow + menu (390) ─────────
await section("mobile", async () => {
  const { ctx, page } = await newPage(MOBILE);
  const mobilePaths = ["", "/about", "/products", "/products/ice-cream-mix", "/products/barista-cafe/coffee-latte-mocha-250ml", "/recipes", "/branches", "/distributors", "/export", "/careers", "/contact", "/brands"];
  const over = [];
  for (const l of ["ar", "en"]) for (const p of mobilePaths) {
    await page.goto(`${BASE}/${l}${p}`, { waitUntil: "load" });
    await settle(page);
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) over.push(`/${l}${p}`);
  }
  check("no horizontal overflow at 390 (24 pages)", !over.length, over.join(", "));
  // Mobile menu
  await page.goto(`${BASE}/ar`, { waitUntil: "load" });
  await page.getByRole("button", { name: "القائمة" }).click();
  const dlg = page.locator("dialog[open]");
  check("mobile menu opens as modal dialog", await dlg.isVisible());
  await page.keyboard.press("Escape");
  check("mobile menu closes with Escape", !(await page.locator("dialog[open]").count()));
  await page.getByRole("button", { name: "القائمة" }).click();
  await page.locator("dialog[open]").getByRole("link", { name: "الوصفات" }).click();
  await page.waitForURL("**/ar/recipes");
  check("mobile menu link navigates and closes", page.url().endsWith("/ar/recipes") && !(await page.locator("dialog[open]").count()));
  await ctx.close();
});

// ───────── 4. Desktop navigation, language switch, product flow ─────────
await section("desktop-nav", async () => {
  const { ctx, page } = await newPage(DESKTOP);
  for (const l of ["ar", "en"]) {
    await page.goto(`${BASE}/${l}`, { waitUntil: "load" });
    const nav = page.getByRole("navigation", { name: l === "ar" ? "التنقل الرئيسي" : "Primary navigation" }).first();
    const buttons = nav.locator("button[aria-expanded]");
    const nb = await buttons.count();
    let menuOk = true; const visited = [];
    for (let i = 0; i < nb; i++) {
      const b = buttons.nth(i);
      await b.click();
      if ((await b.getAttribute("aria-expanded")) !== "true") menuOk = false;
      const panel = page.locator(`#${await b.getAttribute("aria-controls")}`);
      const links = panel.locator("a");
      const nl = await links.count();
      for (let k = 0; k < nl; k++) {
        await page.goto(`${BASE}/${l}`, { waitUntil: "load" });
        await nav.locator("button[aria-expanded]").nth(i).click();
        const a = page.locator(`#${await b.getAttribute("aria-controls")} a`).nth(k);
        const href = await a.getAttribute("href");
        await a.click();
        await page.waitForURL(`**${href}`);
        visited.push(href);
        if (!page.url().endsWith(href)) menuOk = false;
      }
      await page.goto(`${BASE}/${l}`, { waitUntil: "load" });
    }
    const direct = nav.locator(":scope > ul > li > a");
    const nd = await direct.count();
    for (let k = 0; k < nd; k++) {
      await page.goto(`${BASE}/${l}`, { waitUntil: "load" });
      const a = nav.locator(":scope > ul > li > a").nth(k);
      const href = await a.getAttribute("href");
      await a.click();
      await page.waitForURL(`**${href}`);
      visited.push(href);
    }
    check(`[${l}] every desktop nav item and dropdown link navigates`, menuOk, `${visited.length} links: ${[...new Set(visited)].join(" ")}`);
    // dropdown keyboard: Escape closes and returns focus
    await page.goto(`${BASE}/${l}`, { waitUntil: "load" });
    const first = nav.locator("button[aria-expanded]").first();
    await first.focus(); await page.keyboard.press("Enter");
    const opened = (await first.getAttribute("aria-expanded")) === "true";
    await page.keyboard.press("Escape");
    check(`[${l}] dropdown opens with Enter, closes with Escape, focus returns`, opened && (await first.getAttribute("aria-expanded")) === "false" && (await first.evaluate((el) => el === document.activeElement)));
    // header contact CTA
    await page.getByRole("link", { name: l === "ar" ? "اتصل بنا" : "Contact us" }).first().click();
    await page.waitForURL(`**/${l}/contact`);
    check(`[${l}] header contact CTA works`, page.url().endsWith(`/${l}/contact`));
  }
  // Language switch keeps the page
  const pairs = [["/ar/products/nectar/apple-nectar-200ml", "/en/products/nectar/apple-nectar-200ml"], ["/en/about", "/ar/about"], ["/ar", "/en"]];
  let langOk = true;
  for (const [from, to] of pairs) {
    await page.goto(BASE + from, { waitUntil: "load" });
    await page.locator(`header a[hreflang]`).first().click();
    await page.waitForURL(`**${to}`);
    const dir = await page.evaluate(() => document.documentElement.dir);
    if (!page.url().endsWith(to) || dir !== (to.startsWith("/ar") ? "rtl" : "ltr")) langOk = false;
  }
  check("language switch keeps the current page and flips dir", langOk);
  // Category → product flow
  await page.goto(`${BASE}/ar/products`, { waitUntil: "load" });
  await page.locator('main a[href="/ar/products/barista-cafe"]').first().click();
  await page.waitForURL("**/ar/products/barista-cafe");
  const cards = await page.locator('main a[href^="/ar/products/barista-cafe/"]').count();
  await page.locator('main a[href^="/ar/products/barista-cafe/"]').first().click();
  await page.waitForURL("**/ar/products/barista-cafe/*");
  const h1 = await page.locator("h1").textContent();
  const hasTable = await page.locator("table.nutrition").count();
  check("category → product detail flow (barista-cafe)", cards === 6 && !!h1 && hasTable === 1, `${cards} cards, h1="${h1}", nutrition tables=${hasTable}`);
  await page.goto(`${BASE}/en/products/juices`, { waitUntil: "load" });
  const sub = await page.getByRole("navigation", { name: "Sub-categories" }).locator("a").count();
  await page.getByRole("navigation", { name: "Sub-categories" }).getByRole("link", { name: /Nectar/ }).click();
  await page.waitForURL("**/en/products/nectar");
  await page.locator('main a[href^="/en/products/nectar/"]').first().click();
  await page.waitForURL("**/en/products/nectar/*");
  check("juices → nectar sub-category → product flow (EN)", sub === 4 && /\/en\/products\/nectar\/.+/.test(page.url()), page.url());
  // Product search
  await page.goto(`${BASE}/ar/products`, { waitUntil: "load" });
  await page.locator("#product-search").fill("فستق");
  await page.waitForTimeout(300);
  const found = await page.locator('section[aria-labelledby="all-products"] li a').count();
  await page.locator("#product-search").fill("zzzz");
  await page.waitForTimeout(300);
  const none = await page.getByText("لا توجد منتجات مطابقة لبحثك.").isVisible();
  check("product search filters and shows empty state", found === 2 && none, `"فستق" → ${found} results`);
  // 404s
  const r404 = await page.goto(`${BASE}/ar/products/milk/does-not-exist`);
  const g404 = await page.goto(`${BASE}/some/unknown/path`);
  check("unknown product and unknown path return 404 pages", r404?.status() === 404 && g404?.status() === 404);
  await ctx.close();
});

// ───────── 5. Forms: invalid + valid, nothing is sent ─────────
await section("forms", async () => {
  const { ctx, page } = await newPage(DESKTOP);
  // Contact
  for (const l of ["ar", "en"]) {
    page._posts = [];
    await page.goto(`${BASE}/${l}/contact`, { waitUntil: "load" });
    await page.locator('form button[type="submit"]').click();
    const errs = await page.locator(".field-error").count();
    const alertFocused = await page.evaluate(() => document.activeElement?.getAttribute("role") === "alert");
    await page.fill("#f-name", "QA Test");
    await page.fill("#f-mobile", "+966500000000");
    await page.fill("#f-email", "not-an-email");
    await page.fill("#f-message", "QA message");
    await page.locator('form button[type="submit"]').click();
    const emailErr = await page.locator("#e-email").isVisible();
    await page.fill("#f-email", "qa@example.com");
    await page.locator('form button[type="submit"]').click();
    const panel = await page.getByTestId("form-not-sent").isVisible();
    const mailto = await page.getByTestId("form-not-sent").locator('a[href^="mailto:"]').last().getAttribute("href");
    check(`[${l}] contact form: 4 required errors, email validation, honest not-sent panel, no POST`, errs === 4 && alertFocused && emailErr && panel && mailto?.includes("QA%20message") && page._posts.length === 0, `errors=${errs}, posts=${page._posts.length}`);
    await page.getByRole("button", { name: l === "ar" ? "تعديل النموذج" : "Edit the form" }).click();
    check(`[${l}] contact form: edit returns to the form`, await page.locator("#f-name").isVisible());
  }
  // Export
  page._posts = [];
  await page.goto(`${BASE}/en/export`, { waitUntil: "load" });
  await page.locator('form button[type="submit"]').click();
  const exErrs = await page.locator(".field-error").count();
  await page.selectOption("#f-country", "JO");
  await page.fill("#f-company", "QA Co");
  await page.fill("#f-mobile", "+962790000000");
  await page.fill("#f-email", "qa@example.com");
  await page.fill("#f-products", "Nectar 200 ml");
  await page.locator('form button[type="submit"]').click();
  check("export form: 5 required errors then honest not-sent panel, no POST", exErrs === 5 && (await page.getByTestId("form-not-sent").isVisible()) && page._posts.length === 0, `errors=${exErrs}`);
  // Careers
  page._posts = [];
  await page.goto(`${BASE}/ar/careers`, { waitUntil: "load" });
  await page.locator('form button[type="submit"]').click();
  const cErrs = await page.locator(".field-error").count();
  await page.getByRole("button", { name: "إضافة" }).first().click();
  const rows = await page.locator('[role="group"][aria-label^="الخبرة المهنية"]').count();
  await page.getByRole("button", { name: "حذف" }).first().click();
  const rowsAfter = await page.locator('[role="group"][aria-label^="الخبرة المهنية"]').count();
  await page.selectOption("#f-department", "production");
  await page.fill("#f-fullName", "اختبار ضمان الجودة");
  await page.fill("#f-dob", "1990-01-01");
  await page.locator('input[name="gender"]').first().check();
  await page.selectOption("#f-nationality", "SA");
  await page.selectOption("#f-education", { index: 2 });
  await page.fill("#f-address", "الأحساء");
  await page.fill("#f-mobile", "+966500000000");
  await page.fill("#f-email", "qa@example.com");
  const tmpTxt = path.join(root, "test-results", "not-a-cv.txt");
  const tmpPdf = path.join(root, "test-results", "cv.pdf");
  fs.mkdirSync(path.dirname(tmpTxt), { recursive: true });
  fs.writeFileSync(tmpTxt, "text");
  fs.writeFileSync(tmpPdf, "%PDF-1.4\n%QA\n");
  await page.setInputFiles("#f-cv", tmpTxt);
  await page.check("#f-declaration");
  await page.locator('form button[type="submit"]').click();
  const fileErr = await page.locator("#e-cv").textContent();
  await page.setInputFiles("#f-cv", tmpPdf);
  await page.locator('form button[type="submit"]').click();
  check("careers form: required errors, add/remove experience rows, PDF-only check, honest not-sent panel, no POST",
    cErrs >= 10 && rows === 2 && rowsAfter === 1 && /PDF/.test(fileErr ?? "") && (await page.getByTestId("form-not-sent").isVisible()) && page._posts.length === 0,
    `errors=${cErrs}, rows ${rows}->${rowsAfter}, fileErr="${fileErr}"`);
  await ctx.close();
});

// ───────── 6. Motion: scroll sequence + reduced motion ─────────
await section("motion", async () => {
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/en`, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const heroOpacity = await page.evaluate(() => [...document.querySelectorAll("[data-enter]")].map((e) => +getComputedStyle(e).opacity));
  const state = await page.locator("ol[data-state]").getAttribute("data-state");
  const top = await page.evaluate(() => document.querySelector("ol[data-state]").getBoundingClientRect().top + window.scrollY);
  const samples = [];
  for (const off of [-900, -400, 0, 300, 700]) {
    await page.evaluate((y) => window.scrollTo(0, y), top + off);
    await page.waitForTimeout(900);
    samples.push(await page.evaluate(() => {
      const w = document.querySelector("[data-water]");
      const m = new DOMMatrix(getComputedStyle(w).transform);
      return { scaleY: +m.d.toFixed(2), reached: document.querySelectorAll("[data-year].is-reached").length };
    }));
    await page.screenshot({ path: path.join(shotDir, `scroll-timeline-en-1440-${samples.length}.png`) });
  }
  const mono = samples.every((s, i) => i === 0 || s.scaleY >= samples[i - 1].scaleY);
  check("hero entrance completes (all data-enter opacity 1)", heroOpacity.every((o) => o === 1), heroOpacity.join(","));
  check("irrigation timeline scrubs with scroll (scaleY rises, years light up)", state === "live" && mono && samples[0].scaleY < 0.2 && samples.at(-1).scaleY > 0.9 && samples.at(-1).reached === 4, JSON.stringify(samples));
  await ctx.close();

  const r = await newPage(DESKTOP, { reduced: true });
  await r.page.goto(`${BASE}/ar`, { waitUntil: "load" });
  await r.page.waitForTimeout(800);
  const ro = await r.page.evaluate(() => [...document.querySelectorAll("[data-enter]")].map((e) => +getComputedStyle(e).opacity));
  const rs = await r.page.locator("ol[data-state]").getAttribute("data-state");
  const reached = await r.page.locator("[data-year].is-reached").count();
  const floatAnim = await r.page.evaluate(() => getComputedStyle(document.querySelector(".float")).animationDuration);
  const counter = await r.page.locator("dl dd .tabular").first().textContent();
  // the campaign carousel has no visible controls (client request): under reduced motion the shown slide must not change
  const shown = () => r.page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute("aria-label");
  const before = await shown(); await r.page.waitForTimeout(6800);
  const pauseDisabled = before === (await shown());
  check("reduced motion: content visible, timeline static, counters final, carousel not auto-rotating", ro.every((o) => o === 1) && rs === "static" && reached === 4 && counter === "50" && pauseDisabled, `float animation-duration=${floatAnim}`);
  if (!skipShots) for (const l of ["ar", "en"]) {
    await r.page.goto(`${BASE}/${l}`, { waitUntil: "load" }); await settle(r.page);
    await r.page.screenshot({ path: path.join(shotDir, `${l}-home-1440-reduced-motion-full.png`), fullPage: true });
  }
  await r.ctx.close();

  const lp = await newPage(MOBILE);
  await lp.page.goto(`${BASE}/en`, { waitUntil: "load" });
  await lp.page.waitForTimeout(800);
  check("low-power path: touch phone gets static timeline", (await lp.page.locator("ol[data-state]").getAttribute("data-state")) === "static");
  await lp.ctx.close();
});

// ───────── 7. axe (WCAG 2.2 AA) on key pages ─────────
await section("axe", async () => {
  const { ctx, page } = await newPage(DESKTOP, { reduced: true });
  const pages = ["/ar", "/en", "/ar/products", "/en/products/ice-cream-mix", "/ar/products/hummus/hummus-135g", "/en/products/barista-cafe/coffee-latte-mocha-250ml", "/ar/about", "/en/branches", "/ar/distributors", "/en/contact", "/ar/careers", "/en/export", "/ar/recipes/oatmeal-cookies", "/en/brands"];
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: "load" });
    await settle(page);
    const a = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const v = a.violations.map((x) => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, sample: x.nodes[0]?.target?.join(" ") }));
    results.axe.push({ url: p, violations: v });
    if (v.length) console.log("  axe", p, JSON.stringify(v));
  }
  const serious = results.axe.flatMap((r) => r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${r.url}:${v.id}`));
  const any = results.axe.flatMap((r) => r.violations.map((v) => `${r.url}:${v.id}(${v.impact})`));
  check("axe: no serious/critical violations on 14 key pages", !serious.length, serious.join(", "));
  check("axe: no violations of any impact", !any.length, any.join(", "));
  await ctx.close();
});

// ───────── 8. Screenshots ─────────
if (!skipShots) await section("screenshots", async () => {
  const set = ["", "/about", "/products", "/products/ice-cream-mix", "/products/barista-cafe/coffee-latte-mocha-250ml", "/products/creams/qishta-1l", "/products/juices", "/recipes", "/recipes/lentil-soup-with-cream", "/brands", "/branches", "/distributors", "/export", "/careers", "/contact", "/products/wafer-biscuits"];
  for (const [vp, label] of [[DESKTOP, "1440"], [MOBILE, "390"]]) {
    const { ctx, page } = await newPage(vp);
    for (const l of ["ar", "en"]) for (const p of set) {
      await page.goto(`${BASE}/${l}${p}`, { waitUntil: "load" });
      await settle(page);
      await page.waitForTimeout(600);
      const name = `${l}-${(p || "/home").slice(1).replace(/\//g, "_")}-${label}`;
      await page.screenshot({ path: path.join(shotDir, `${name}.png`) });
      if (p === "" || label === "390" || p === "/about" || p.split("/").length > 3) {
        await page.screenshot({ path: path.join(shotDir, `${name}-full.png`), fullPage: true });
      }
      results.screenshots.push(name);
    }
    // open states
    await page.goto(`${BASE}/ar`, { waitUntil: "load" });
    if (vp.width < 768) { await page.getByRole("button", { name: "القائمة" }).click(); await page.waitForTimeout(300); await page.screenshot({ path: path.join(shotDir, `ar-menu-open-${label}.png`) }); }
    else { await page.locator("header nav button[aria-expanded]").nth(1).click(); await page.waitForTimeout(300); await page.screenshot({ path: path.join(shotDir, `ar-mega-menu-open-${label}.png`) }); }
    await page.goto(`${BASE}/en/contact`, { waitUntil: "load" });
    await page.locator('form button[type="submit"]').click(); await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(shotDir, `en-contact-errors-${label}.png`), fullPage: vp.width < 768 });
    await ctx.close();
  }
});

results.finishedAt = new Date().toISOString();
const failed = results.checks.filter((c) => !c.pass);
results.summary = { total: results.checks.length, passed: results.checks.length - failed.length, failed: failed.length };
fs.writeFileSync(path.join(root, `results-${round}.json`), JSON.stringify(results, null, 1));
console.log(`\n${results.summary.passed}/${results.summary.total} checks passed. Screenshots: ${shotDir}`);
await browser.close();
