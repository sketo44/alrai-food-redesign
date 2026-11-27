# QA results

**Date:** 2026-11-22 · **Browser:** Google Chrome (installed channel) driven by Playwright 1.65.1 · **Target:** local production build (`next build` + `next start -p 3211`) · **Viewports:** desktop 1440×900, mobile 390×844 (isMobile + touch) · **Script:** `qa/run-qa.mjs` (raw results `qa/results-round{1,2,3}.json`, logs `qa/round*.log`).

## Final result (round 3): **39 / 39 checks passed**

| # | Check | Scope | Result |
|---|---|---|---|
| 1 | sitemap.xml lists routes for both locales | 164 URLs | PASS |
| 2 | Every route returns 200 | 164/164 (82 paths × AR/EN) | PASS |
| 3 | `html lang`/`dir` match locale (ar/rtl, en/ltr) | 164 | PASS |
| 4 | Exactly one `<h1>` per page | 164 | PASS |
| 5 | hreflang ar + en + x-default | 164 | PASS |
| 6 | canonical + og:image | 164 | PASS |
| 7 | Broken images (`naturalWidth === 0`) | every `<img>` on 164 pages | PASS (0) |
| 8 | Image HTTP responses ≥ 400 | 1,003 image responses | PASS (0) |
| 9 | Every `<img>` has `alt` | 164 | PASS |
| 10 | Console errors / page errors | 164 | PASS (0) |
| 11 | Failed network requests | 164 | PASS (0) |
| 12 | Horizontal overflow @1440 | 164 | PASS |
| 13 | Horizontal overflow @390 | 24 pages (12 × AR/EN) | PASS |
| 14–16 | Mobile menu: opens as modal dialog, Escape closes, link navigates and closes | AR | PASS |
| 17, 20 | Every desktop nav item and dropdown link navigates | 17 links × AR, EN | PASS |
| 18, 21 | Dropdown: Enter opens, Escape closes, focus returns | AR, EN | PASS |
| 19, 22 | Header "Contact us" CTA | AR, EN | PASS |
| 23 | Language switch keeps the page and flips dir | 3 pairs incl. a product page | PASS |
| 24 | Category → product detail (barista-cafe: 6 cards, nutrition table) | AR | PASS |
| 25 | Juices → Nectar sub-category → product | EN | PASS |
| 26 | Product search ("فستق" → 2) and empty state | AR | PASS |
| 27 | Unknown product and unknown URL → 404 | — | PASS |
| 28–31 | Contact form: 4 required errors, error summary focused, email validation, honest not-sent panel, mailto pre-filled, **0 POST requests**, edit returns | AR, EN | PASS |
| 32 | Export form: 5 required errors → not-sent panel, 0 POST | EN | PASS |
| 33 | Careers form: 11 required errors, add/remove experience rows (2→1), non-PDF rejected, not-sent panel, 0 POST | AR | PASS |
| 34 | Hero entrance completes (all 9 animated elements end at opacity 1) | EN | PASS |
| 35 | Irrigation timeline scrubs with scroll: scaleY 0 → 0.24 → 0.65 → 0.96 → 1.0, years reached 0 → 1 → 3 → 4 → 4 | EN 1440 | PASS |
| 36 | Reduced motion: content visible, timeline static/complete, counters at final value, carousel not auto-rotating, CSS animations neutralised | AR | PASS |
| 37 | Low-power path: touch phone gets the static timeline | EN 390 | PASS |
| 38–39 | axe-core (wcag2a/aa, 21a/aa, 22aa): **0 violations of any impact** | 14 key pages (home ×2, products, category, 2 products, about, branches, distributors, contact, careers, export, recipe, brands) | PASS |

Scroll-sequence screenshots: `qa/screenshots/round3/scroll-timeline-en-1440-{1..5}.png`.

## Build, typecheck, lint (final)
| Command | Result |
|---|---|
| `npx tsc --noEmit` | exit 0, no errors (`.audit/typecheck-final.log`) |
| `npx eslint .` (next core-web-vitals + typescript) | exit 0, 0 problems (`.audit/lint-final.log`) |
| `npx next build` (Next 16.4.6, Turbopack) | exit 0 — "Compiled successfully", "Generating static pages (170/170)"; all 164 locale pages prerendered as SSG plus sitemap, robots, icons (`.audit/build-final.log`) |

## Performance sample (lab, not Lighthouse) — `qa/perf.mjs`, `qa/perf-results.json`
Local production server, so TTFB is unrealistically low. Mobile profile = 390 px, 4× CPU slowdown, 150 ms latency, 1.6 Mbps down.
| Page | Desktop LCP | Mobile-throttled LCP | CLS | LCP element | Transfer (3.5 s window) |
|---|---|---|---|---|---|
| /ar | 632 ms | 1,184 ms | 0 | H1 | 953 / 906 KB |
| /en | 136 ms | 1,212 ms | 0 | H1 | 887 / 855 KB |
| /ar/products | 208 ms | 1,908 ms | 0 | product image | 1,010 / 942 KB |
| /en/products/…/coffee-latte-mocha-250ml | 128 ms | 1,672 ms | 0 | packshot | 854 / 831 KB |
The LCP element is never animated (the hero H1 is excluded from the entrance). Transfer weight is mostly fonts (4 families) and packshots; see limitations.

## Refinement rounds log

### Round 1 — baseline (`qa/screenshots/round1/`, `qa/round1-part1-crawl.log`, `qa/round1.log`)
Result: crawl section 11/12 + interaction sections 24/28 (the first full run aborted on a test-selector bug, so it was re-run with `--skip-crawl`).
Failures and critique → fixes:
1. **React hydration error #418** on export and careers pages (country names from `Intl.DisplayNames` differ between Node and Chrome ICU) → country lists now render client-only via `useSyncExternalStore`.
2. **axe serious:** vision label `drop` cyan on brand blue (contrast) → `drop-soft`; contact details used `<dl>` with wrapped items → semantic list. Also "+" counter suffix in brand green (2.3:1) → text-safe green.
3. **Mobile menu link** did not close the dialog reliably → links close the `<dialog>` on click.
4. Visual: the hero "drop" (rotated rounded square) read as an arrow/house → replaced with a true teardrop SVG with gradient and highlight.
5. Visual: About lead paragraph set in Reem Kufi display was hard to read in Arabic → text face, medium weight.
6. Visual: long page titles (e.g. "List of distributors outside the Kingdom") ran to 4 lines → automatic step-down for titles over 26 characters.
7. Visual/mobile: 11 full-width category tiles made a very long phone page → 2-column grid on phones, smaller tiles; arrow chip hidden on mobile.
8. Content: product detail labelled the category "Products" → "Category"; English flavour names checked against pack artwork (Red Berry → **Raspberry**, Yellow Melon → **Cantaloupe**).
9. Skip link could appear in full-page captures above the sticky header → clip-path hidden until focused.
10. QA script hardening: section-level error capture, `main`-scoped selectors.

### Round 2 (`qa/screenshots/round2/`, `qa/round2.log`) — 38 / 39
- All 164 routes clean (no console errors, no broken images), axe 0 violations.
- **FAIL:** EN contact form — focus did not move to the error summary (focus was set in `requestAnimationFrame` before React committed). → Focus now moves in an effect after commit (error summary or not-sent panel).
Visual critique → fixes:
1. Mobile category tiles had large empty tinted areas → shorter tiles, larger plates.
2. Mobile stats stacked into three tall rows → one 3-column row.
3. Vision/mission statements in Kufi display were cramped in narrow cards → text face, semibold.
4. Products index tiles at 5 columns cramped Arabic names → 4 columns.

### Round 3 — final (`qa/screenshots/round3/`, `qa/round3.log`) — **39 / 39**
Re-screenshotted all 16 page types × AR/EN × 1440/390 (+ full-page captures, mega-menu and mobile-menu open states, form error state, reduced-motion full pages, timeline scroll stops). Remaining visual notes (not fixed, judged acceptable): on 390 px the hero composition sits below the headline and the "since 1968" badge partly overlaps the drop; recipe photos are soft because the source files are 360×207.

## Not run / not verified
- Lighthouse, WebPageTest or field (CrUX) data; Safari and Firefox; real devices; screen readers (NVDA/VoiceOver). Tablet 768 px was not captured in the scripted rounds (desktop 1440 and mobile 390 as requested).
- Form delivery: there is no backend, so only the honest "not sent" path exists and was tested.

## Branch locator (2026-11-23), `qa/test-branch-locator.mjs`

Command: `node qa/test-branch-locator.mjs [baseUrl]`, run in Google Chrome via Playwright. Final runs: **103/103 on the production build** (`next start -p 3212`, log in `qa/branch-locator-results.log`) and **103/103 on the dev server** (:3210).
Coverage: desktop 1440×900 and mobile 390×844 (touch), AR + EN, on the home page; /branches AR + EN; tablet 768 AR; a reduced-motion pass.
- Marker accuracy: each pin's rendered centre is compared with an independent d3-geo `geoMercator` projection of its coordinate (parsed from `network.ts`), mapped through the SVG's screen CTM. Max error is 0.02 px at every size. Every city point also lies inside the drawn Saudi outline (`isPointInFill`).
- Hover tooltip + pin enlarge; click to select (panel, list and drop marker in sync); the close Jeddah/Makkah pins resolve correctly (mouse and touch); list click selects the pin; panel next/prev wraps without a reload; Google Maps + tel hrefs correct for all 9 branches in both locales (target=_blank, rel=noopener).
- Keyboard: ArrowDown and ArrowLeft (RTL) / ArrowRight (LTR) move focus and selection, Home/End work, one tab stop in the list, Tab reaches the pins with a visible 3 px outline, focus shows the tooltip, Enter selects.
- Mobile: the sheet is hidden until a selection; tapping a pin opens it (role=dialog, focus inside); the selected pin stays visible above the sheet, because the map scrolls when a list item is tapped; the close button closes it and returns focus to the pin; Esc closes it.
- Reduced motion: no entrance animation, no idle pulse, the drop is instantly visible, no ripple, no sheet transition.
- axe (WCAG 2.0/2.1/2.2 A+AA tags) on the section with a branch selected: 0 violations (AR + EN desktop only; mobile and tablet were not axe-scanned). No console errors or failed requests, and no horizontal overflow, in any run.
- `npx tsc --noEmit` exit 0 · `npx eslint .` exit 0 · `npm run build` exit 0 (170/170 static pages).

Critique → fixes, round 1:
1. A hydration mismatch (float last-bit differences between Node and Chrome in projected positions) → positions rounded to fixed decimals.
2. The bottom sheet rendered under the next section → removed `isolation: isolate` from the section (it trapped the sheet's z-index).
3. The left column (heading + list + panel) was taller than the map, so the panel fell below it → heading moved to a full-width row above, list and panel beside the map, `grid-rows-[auto_auto_1fr]`.
4. Sea and land were hard to tell apart → sea is now a pale blue, neighbours sand, Saudi Arabia white with a soft shadow.
5. The Arabian Gulf label was hidden behind the Dammam label → moved; the Riyadh and Al-Ahsa labels collided at 768 px → Riyadh's label moved to the west side.
6. On the phone, the sheet hid the tapped pin → map scrolls into view above the sheet.
7. The sheet title was not focusable during its entrance (GSAP autoAlpha set visibility:hidden) → opacity-only stagger.
8. AR panel arrows pointed the wrong way (the icon was mirrored twice) → physical arrow icons.
9. The mobile list truncated "المدينة المنورة" → names wrap.

Screenshots (`qa/screenshots/branch-locator/`): desktop-{ar,en}-default, desktop-{ar,en}-selected-tooltip, desktop-{ar,en}-keyboard-focus, desktop-ar-reduced-motion-selected, mobile-{ar,en}-default, mobile-{ar,en}-sheet-open, tablet-ar-selected.
Not run for this component: Safari/Firefox, real devices, screen readers, Lighthouse.
