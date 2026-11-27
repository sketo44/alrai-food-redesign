# Alrai homepage — unified background system

Status: **implemented** (Stage Two, approved 2026-11-23). See section 9 for what was built and tested.
Sections 1–8 are the approved Stage One direction, kept as the specification.

Stage One was concept only. The concept is rendered by
injecting `qa/bg-system/concept.js` into the running page at screenshot time
(`node qa/bg-system/render-concept.mjs r3`), so it uses the real rendered layout and real section sizes.

Concept renders: `qa/bg-system/concept/r3/` (desktop 1440 and 1920, tablet 768, mobile 390 and 360, English 1440).
Before/after: `qa/bg-system/compare-desktop.webp`, `qa/bg-system/compare-mobile.webp` (left = proposed, right = current).

## 1. Visual audit (measured, Arabic, 1440 × 900)

| Section | Top / height (px) | Current background | Problem |
|---|---|---|---|
| Hero | 76 / 824 | `hero-bg.webp` (cover) | Strong art, but ends in a hard horizontal edge at the stats band |
| Stats | 900 / 189 | white 60% | Fine; sits on a seam |
| About (من نحن) | 1089 / 890 | `about-bg.webp` (cover) | Second wheat + second blue wave; hard bottom edge into pure white |
| Products | 1980 / 1540 | `#ffffff` | Cold white breaks the warm ivory page; abrupt change from About |
| Campaigns | 3519 / 753 | none | OK |
| Journey | 4273 / 935 | `journey-bg.webp` (cover) | Third wheat, third blue wave; production line sits behind the paragraphs; hard edges both ends |
| Recipes | 5208 / 1028 | flat `#f2ecdf` block | Hard cut top and bottom |
| Brands | 6236 / 1004 | own gradient + navy silk ribbon | Fourth wave; ribbon ends in a hard cut into the map section |
| Branches map | 7341 / 1040 | none | Good: clean, keep it that way |
| Export card | 8462 / 644 | none | OK |
| Footer | 9106 / 663 | navy | Straight cut from ivory to navy |

Mobile (390): the same seams. Also, in the hero the leaves and wheat sit behind the paragraph text.

Main issues: **4 visible seams**, **wheat repeated 3×**, **blue wave repeated 4×**, **one cold-white section**,
**decoration behind paragraphs** in Journey and on mobile Hero.

## 2. Direction

One continuous canvas behind the whole page instead of independent section backgrounds.
Roughly 80% calm ivory, 20% detail. The detail is concentrated at the top (hero), thins through
the middle, almost disappears around the interactive carousel and map, then returns to close into the footer.

**The story:** a single fine blue *thread* (the water in the Alrai drop) leaves the hero ribbon and passes behind the page.
It shows only where it crosses the empty space between two sections, and it fades in the gutters,
so it reads as one line moving behind the content rather than a border.
It surfaces with a different character at each crossing:

| Crossing | Treatment |
|---|---|
| About → Products | the only soft silk ribbon below the hero |
| Products → Campaigns | plain hairline |
| Campaigns → Journey | five fine parallel lines that converge on the **1968** marker (progress starts here) |
| Journey → Recipes | hairline + one botanical sprig (the only leaf motif below the hero) |
| Recipes → Brands | very faint |
| Brands, Map | none (carousel and map stay untouched) |
| Export → Footer | the thread returns and dives into a curved navy footer edge |

## 3. Section by section

| Section | Desktop | Mobile |
|---|---|---|
| Hero | `hero-bg.webp` kept as the one rich image; feathered so it dissolves through the stats band (no seam) + a soft blue light glow behind the products | Art starts below the buttons, so only the product composition sits over it; never behind text |
| About | Tank silhouette from `about-bg.webp` only, faint, rising above the real photos in the outer edge; 3 thin navy architectural arcs from the outer corner. Real photos untouched, the silhouette is clearly illustrative | No industrial art (text-heavy column) |
| Products | Calmest tone on the page (`#fcfbf7`), one white light glow, nothing behind cards | Same |
| Journey | Faint cool tone; production-line vignette from `journey-bg.webp` placed **under the title column**, away from paragraphs; directional lines into 1968 | Small faint production-line band at the outer edge of the heading |
| Recipes | Warm sand (`#f2e9d9`) with an extremely faint paper grain; edges feathered | Same, grain only |
| Brands | Existing gradient and navy silk ribbon kept; top and bottom feathered so they melt into the page | Same |
| Map | Plain ivory; no texture over geography | Same |
| Footer | Curved navy edge with one light-blue hairline instead of a straight cut | Gentler curve |

English mirrors every placement (the art is flipped with the layout).

## 4. Layers and assets

| # | Layer | Format | Weight | Loading |
|---|---|---|---|---|
| 1 | Tonal foundation: one vertical gradient with stops pinned to section positions | CSS | 0 KB | — |
| 2 | Light glows (hero, products, brands) | CSS radial gradients | 0 KB | — |
| 3 | `hero-bg.webp` (client art) | WebP 1672×941 | 47 KB | priority (above the fold) |
| 4 | `about-bg.webp` (client art; tank area only shown) | WebP 1916×821 | 44 KB | lazy |
| 5 | `journey-bg.webp` (client art; production-line area only shown) | WebP 2000×780 | 53 KB | lazy |
| 6 | Paper grain | inline SVG noise | <1 KB | — |
| 7 | Thread crossings, timeline lines, arcs, sprig, footer edge | inline SVG | ~3 KB | — |

Total added weight stays about the same as today (the three images are already shipped); no new dependencies, no WebGL.

Implementation plan (Stage Two): a `PageCanvas` component rendered once behind `<main>`. It measures
section anchors (`data-bg-anchor`) with a `ResizeObserver` and draws layers 1, 2, 6 and 7. Layers 3–5
become `next/image` elements with CSS masks, inside their own sections. Section background colours become
transparent. Rasters below the fold lazy-load. Naming: `bg-<section>-<element>` (for example `bg-journey-line`).

## 5. Motion (proposed, Stage Two)

- **Thread crossings:** each draws in once as it enters the viewport (GSAP stroke-dashoffset, 1.2s).
- **Hero glow, tank silhouette, production line:** slow parallax (±20–30px) on desktop only.
- **Timeline lines:** draw to the 1968 marker together with the existing timeline animation.
- **Never:** nothing loops, nothing moves behind paragraphs, and there is no scroll-jacking.
- **Reduced motion:** everything is static.
- **Mobile:** no parallax.

## 6. Review rounds (concept)

| Round | Found | Fixed |
|---|---|---|
| 1 | Continuous gutter line read as a border; About silhouette invisible behind photos; Journey lines ran behind paragraphs; Journey art landed on the wrong side (flip applied after mask); mobile Hero leaves behind text; 13px horizontal overflow | — |
| 2 | — | Crossing-only thread with faded tails; silhouette moved above the photos; lines re-aimed at 1968; mask/flip corrected; mobile art starts below buttons; overflow removed |
| 3 | Lines stopped short of the marker; arcs too faint | Endpoint on the marker; arcs strengthened. 0px overflow at 360 / 390 / 768 / 1440 / 1920 |

## 7. Internal scores (subjective design review, not measured)

| Category | Score | Note |
|---|---|---|
| Brand consistency | 9 | Only existing tokens and the client's own art |
| Visual cohesion | 9 | One canvas, no seams |
| Artistic sophistication | 8 | Restrained; the thread idea carries it, and the vector pieces are still simple |
| Background continuity | 9 | Every seam feathered |
| Text readability | 9 | Nothing behind paragraphs |
| Product visibility | 10 | Calmest zone behind products |
| Desktop composition | 9 | |
| Mobile composition | 8 | Middle of the page is plain; deliberately |
| Performance | 9 (estimated) | No new heavy assets; not yet measured |
| Accessibility | 9 (estimated) | All decorative / aria-hidden; contrast to be re-checked with axe in Stage Two |

**Weaknesses:**
- The About silhouette is very subtle; you may want it stronger.
- The three client images still carry their own wheat and waves; I mask them so each motif shows once, but a dedicated asset set would give finer control.
- The concept is static: motion is described, not shown.
- Tablet uses the desktop composition.

## 8. Decisions for you

1. Approve the direction as shown, or adjust it (more or less detail, a stronger About silhouette).
2. Keep using your three supplied images, masked as shown? (Recommended.) The alternative is to replace them with new vector-only art.

## 9. Stage Two — implementation (as built)

### How it works
- `src/components/PageCanvas.tsx` (client) is rendered once inside `.bg-canvas-host` on the homepage.
  It measures every `[data-bg="…"]` section with a `ResizeObserver` and paints, behind all content:
  - the tonal gradient;
  - the light glows;
  - the Recipes grain;
  - one inline SVG with the thread crossings, the timeline lead-in lines (they end on the timeline's water drop), the About arcs, the sprig and the curved navy footer edge.

  It fades in after measuring, is `aria-hidden` with no pointer events, and causes no layout shift.
- **Client artwork stays server-rendered inside its own section** (`next/image`, `.bg-art*` masks in `globals.css`):
  - **Hero:** one art-directed layer, preloaded. The `sizes` hint means phones download a 1100px image and desktops a full-width one. On desktop it covers the whole hero and fades through the stats band. On mobile it is re-framed behind the product composition, starting below the buttons.
  - **About:** tank silhouette only, at 1024px and up, on the photo side.
  - **Journey:** production-line vignette only, at 1024px and up, under the title. It is not shown on phone or tablet, where it would sit behind the years.
- Section fills (`bg-white`, `bg-cream`, `bg-white/60`) were removed so the canvas shows through. The stats band became `bg-white/40` with a light blur.
- The brand showcase keeps its own light field and ribbon, feathered into the canvas by `.bg-canvas-host .brand-showcase …` rules, so the `/brands` page is unchanged.
- **Motion** (GSAP, existing `@/lib/gsap`):
  - Each crossing draws in once when it reaches 85% of the viewport.
  - Slow ±24px parallax on the About and Journey art, at 1024px and up only.
  - All of it is skipped with reduced motion or Save-Data.

### Changes made while building
- Arcs moved to the photo side: in English they crossed the paragraph.
- Mobile Journey art dropped: it sat behind the heading.
- Journey art limited to 1024px and up: on tablet it sat behind the years.
- Lead-in lines start below the carousel controls.
- Journey and About use `overflow-clip` instead of `overflow-hidden`. `overflow-hidden` had broken the sticky timeline title; that bug was introduced earlier in this session.

### Two existing accessibility bugs fixed (found by the QA run)
- Brand carousel dots: their hit area was 10px. It is now 24px (WCAG 2.2 target size); they look the same.
- Map attribution line: its contrast was 3.85:1. Removing an opacity brings it to about 6:1.

### Review rounds (real page, `node qa/bg-system/render-impl.mjs <round>`, screenshots in `qa/bg-system/impl/`)

| Round | Findings | Result |
|---|---|---|
| i1 | Matches concept; arcs behind English text; mobile Journey art behind heading; lead-in lines behind carousel controls | Fixed |
| i2 | Tablet Journey art behind the year column | Fixed |
| i3 | Mobile hero image too soft; LCP regression traced to it (see below) | Fixed; final |

Every round, at 1440, 1920, 768, 390, 360 (Arabic) plus English at 1440 and 390, had:
- 0px horizontal overflow;
- 0 console errors;
- 0 failed requests;
- the same page heights as before.

### Tests
- `qa/test-branch-locator.mjs`: 92/92 (map interaction intact).
- `qa/test-brands.mjs`: all pass (drag, swipe, snap, dots, keyboard, reduced motion).
- `qa/run-qa.mjs`: 37/39 across 164 routes before the contrast fix. Both failures were that one contrast issue, now fixed and re-scanned: 0 violations on `/ar`, `/en`, `/ar/branches`, `/en/branches`. The full crawl was not re-run after the fix.
- `qa/bg-system/check-home.mjs`: 15/15. It covers:
  - axe WCAG 2.2 AA (0 violations);
  - CLS while scrolling (0.007–0.013);
  - decorative layers are hidden and never take clicks;
  - art images decode;
  - the sticky title works;
  - reduced motion is static.
- `npx tsc`, `npx eslint .`, `npm run build`: all clean.

### Performance (`qa/perf.mjs`, local production server, lab sample, not field data)
Baseline: `qa/bg-system/perf-before.json` is from before any background images existed (and before other changes made today). After: `qa/bg-system/perf-after.json`.

| Page | Profile | LCP before → after | CLS | Transfer |
|---|---|---|---|---|
| /ar | desktop | 632 → 1052 ms | 0 → 0 | 953 → 1140 KB |
| /en | desktop | 136 → 180 ms | 0 → 0 | 887 → 1074 KB |
| /ar | mobile, 4× CPU, ~1.6 Mbps | 1184 → 2140 ms | 0 → 0 | 906 → 1072 KB |
| /en | mobile, 4× CPU, ~1.6 Mbps | 1212 → 2128 ms | 0 → 0 | 855 → 1021 KB |

The LCP element is now the hero artwork instead of the H1. Before merging the hero layers, the lazy mobile copy pushed mobile LCP to 2.76 s. Preloading one right-sized image brought it to 2.14 s, inside the 2.5 s "good" threshold under this throttling.

### Known limitations
- **Browsers:** tested in Chrome only. Not yet checked in Safari or Firefox, or on real phones. `overflow-x: clip` and CSS masks need Safari 16+.
- **Visibility:** the About silhouette and the arcs are deliberately very faint.
- **Repeated motifs:** the client images still contain their own wheat and waves. Masks show each one once, but dedicated assets would give finer control.
- **Phone and tablet:** tablet (768–1023) uses the desktop canvas with the mobile-safe art rules; phones get the reduced composition.
- **Timing:** the canvas appears after hydration (fades in over 0.7 s). Before that, sections show the plain ivory page colour.
