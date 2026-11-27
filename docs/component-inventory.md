# Component inventory

All components are **original code written for this project** (no copied UI-kit source). The only third-party runtime code is listed in §3. Licences were checked against the WEBCRAFT resource catalog (verified 2026-11-22) and the packages' own `package.json`/LICENSE files in `node_modules`.

## 1. Components

| Component | File | Type | Library | Notes |
|---|---|---|---|---|
| `SiteHeader` | `src/components/SiteHeader.tsx` | client | — | Sticky header that turns solid on scroll; desktop disclosure menus (About, Products mega menu, Export) with `aria-expanded`/`aria-controls`, Escape + outside-click close and focus return; language switch that keeps the current path; mobile menu as a native `<dialog>` (modal, focus-trapped by the browser, Escape closes). |
| `SiteFooter` | `src/components/SiteFooter.tsx` | server | — | Quick links, product categories (only those with products), contact block, social links, oversized wordmark texture. |
| `Breadcrumbs`, `PageHero`, `SectionHead`, `ProductCard`, `TextLink` | `src/components/ui.tsx` | server | — | Shared page furniture. `PageHero` has milk / cream / blue variants. |
| `CategoryTile` | `src/components/CategoryTile.tsx` | server | — | Tinted tile with the category's original packshot on a white plate; tone per category. |
| `ProductBrowser` | `src/components/ProductBrowser.tsx` | client | — | Search (AR + EN names and sizes) and radio-chip category filter over all 55 products, live result count (`role=status`), empty state with reset. Replaces the live site's WordPress product search. |
| `EnterOnLoad` | `src/components/motion/EnterOnLoad.tsx` | client | GSAP | Staggered hero entrance for `[data-enter]` children, transform/opacity only; CSS fallback reveals content after 2.5 s if JS fails; nothing hidden under reduced motion. |
| `CountUp` | `src/components/motion/CountUp.tsx` | client | GSAP ScrollTrigger | Counts once on enter; final value is server-rendered. |
| `IrrigationTimeline` | `src/components/motion/IrrigationTimeline.tsx` | client | GSAP ScrollTrigger | **Signature moment.** Scroll-scrubbed water channel (scaleY) with a riding drop; years light up via per-item triggers. Static complete state for reduced motion, touch phones ≤767 px and Save-Data. |
| `CampaignCarousel` | `src/components/motion/CampaignCarousel.tsx` | client | — (CSS transitions) | The 3 original home banners; crossfade, `aria-roledescription` carousel/slide, inert hidden slides, pause/play button, dot buttons, pauses on hover/focus/hidden tab; no auto-rotation under reduced motion. |
| `ContactForm` | `src/components/forms/ContactForm.tsx` | client | — | Mirrors live fields (minus the placeholder "message type"). |
| `ExportForm` | `src/components/forms/ExportForm.tsx` | client | — | Mirrors the live export request. |
| `CareersForm` | `src/components/forms/CareersForm.tsx` | client | — | Mirrors the live job application: repeatable experience rows (add/remove), PDF ≤ 5 MB check, declaration. |
| form kit: `useHonestForm`, `Field`, `ErrorSummary`, `NotSentPanel`, `useCountries` | `src/components/forms/shared.tsx` | client | — | Custom validation with an error summary that receives focus and links to fields; `aria-invalid`/`aria-describedby` wiring; **honest "not sent" panel** (no fake success) offering email, phone and a pre-filled `mailto:`; country names from `Intl.DisplayNames`, rendered client-side to avoid ICU hydration mismatches. |
| `BranchLocator` | `src/components/BranchLocator.tsx` (+ `src/content/ksa-map.generated.ts`, `scripts/build-ksa-map.mjs`) | client | GSAP | Interactive branch map for "فروعنا حول المملكة" (home + /branches). It replaces the static map image. Vector Saudi map from Natural Earth, projected with d3-geo Mercator at build time; pins are projected with the same parameters. Pins are real buttons; a nearest-pin pointer hit test (26 px) keeps close cities such as Jeddah and Makkah separately reachable on phones. City list = radiogroup (roving tabindex; arrows, Home/End). The details panel is inline at md+ and a non-modal bottom sheet below 768 px (Esc/close, focus moves into it and returns to the trigger, map scrolls above it). GSAP: staggered pin drop-in on first view, water-drop marker + ripple + glow on select, staggered panel content. Reduced motion: everything is instant, the idle pulse is off, and the pulse also pauses off-screen. Sources: `docs/branch-locator-data.md`. |
| `Icons` | `src/components/Icons.tsx` | server | — | One 24 px, 1.75-stroke icon set drawn for the project (arrows mirror in RTL; brand/social glyphs are simplified outlines, not the platforms' official marks). |
| Route `not-found` + `global-not-found` | `src/app/[locale]/not-found.tsx`, `src/app/global-not-found.tsx` | — | — | Locale 404 and a bilingual global 404. |

## 2. Approved WEBCRAFT resources: what was considered and why (not) used

| Resource | Decision | Reason |
|---|---|---|
| **GSAP + ScrollTrigger + @gsap/react** | **Used** (primary and only animation engine) | Needed for the scrubbed timeline and scroll-triggered counters; `gsap.matchMedia()` gives clean reduced-motion / low-power branches. |
| Motion (motion.dev) | Not used | One engine per project; GSAP covers everything here. |
| React Bits | Not used | Its text effects split characters (breaks Arabic joining) or depend on extra engines (Motion/OGL); a simple counter was cheaper to write than to vendor and restyle. |
| Magic UI | Not used | Its marketing effects (marquee, globe, shimmer) are exactly the generic patterns on the anti-list. |
| Aceternity UI | Not used | Same reason; also its licence forbids redistributing source, which would complicate handing over a template. |
| Skiper UI | Not used | Free components require visible attribution; nothing needed justified it. |
| ThreeUI | Not used | Licence not verifiable (treated as paid/proprietary); 3D not justified. |
| Animmaster Lib | Not used | Paid download, not supplied by the client. |
| shadcn/ui primitives | Not used | The only complex primitives needed (menu, modal) are covered by native `<dialog>` and small disclosure buttons; avoiding Radix keeps the bundle lean. |
| Three.js / R3F | Not used | No 3D models exist; a fabricated 3D pack would alter packaging. No WebGL means no mobile fallback is needed. |
| Lenis | Not used | Native scroll keeps anchors, find-in-page and accessibility intact. |

## 3. Third-party packages (runtime and tooling)

| Package | Version | Use | Licence |
|---|---|---|---|
| next | 16.4.6 | framework | MIT |
| react / react-dom | 19.x | UI runtime | MIT |
| gsap | 3.15.1 | animation | GSAP Standard License ("no charge" licence incl. all plugins, commercial use allowed; not allowed in competing no-code builders) |
| @gsap/react | 2.1.x | `useGSAP` hook | GSAP Standard License |
| tailwindcss / @tailwindcss/postcss | 4.3.5 | styling | MIT |
| typescript | 6.x | types | Apache-2.0 |
| eslint / eslint-config-next | 9.x / 16.4.6 | lint | MIT |
| playwright | 1.65.1 | QA automation (dev only) | Apache-2.0 |
| @axe-core/playwright | 4.x | accessibility scan (dev only) | MPL-2.0 |
| world-atlas | 2.0.2 | Natural Earth TopoJSON for the branch map (build-time only, devDependency) | ISC (data: public domain) |
| d3-geo / topojson-client | 3.1.2 / 3.1.0 | build-time projection and path generation (`scripts/build-ksa-map.mjs`) and the QA projection check (devDependencies) | ISC |
| sharp (transitive, via next) | 0.35 | image optimisation; also used once to crop the favicon/OG image | Apache-2.0 |

Fonts: Reem Kufi, Fraunces, IBM Plex Sans, IBM Plex Sans Arabic — all SIL Open Font License, via `next/font/google` (self-hosted at build).

Images: all from alraifood.com (client-owned), see `asset-manifest.json`. No stock, no AI-generated imagery.
