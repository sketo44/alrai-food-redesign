# Art direction and design system

## Concept
**"The channel from the oasis."** الري literally means *irrigation*, the company was founded in Al-Ahsa (the Kingdom's great date-palm oasis) and its logo is a water drop beside a green leaf. The site treats water as the organising idea: one blue channel that carries the story from 1968 forward, clean milk-white surfaces for the products, and the drop shape as the recurring graphic device.

- **Feel:** fresh, assured, generous. **Not:** discount-supermarket loud, generic "AI landing page", corporate-cold.
- **Primary job:** show the full range clearly (55 products, 10 categories) and route trade visitors to export, distributors, branches and contact; secondary: careers.

## Brand constants preserved
- Logo: original `logo.png` (160×70, the only logo file the site has) used unaltered. Favicon/app icon cropped from the drop-and-leaf mark in the original Coffee Latte banner, no redraw.
- Colours sampled from the live theme CSS: **blue `#00529b`** (31 uses) and **green `#2ebb68`** (52 uses); the logo's water-drop cyan is sampled from the artwork.
- Names in both scripts as published: الري للصناعات الغذائية / AlRai Food Industries.
- Product packshots: original 1000×1000 images, shown on white "plates" exactly as photographed (no cut-outs, no recolouring, no AI packaging).

## Typography
| Role | Arabic | Latin | Why |
|---|---|---|---|
| Display | **Reem Kufi** 500–700 | **Fraunces** 500–700 | Kufi geometry echoes the rounded strokes of the الري wordmark; Fraunces gives the English side a warm, editorial food voice instead of a default grotesk. |
| Text / UI | **IBM Plex Sans Arabic** 400–700 | **IBM Plex Sans** 400–600 | A matched pair with the same skeleton, so mixed AR/EN lines (product names, numbers) sit together. |

The live site uses *Bahij TheSansArabic*, a commercial font whose licence we cannot verify, so it is **not** copied. All four families are Google Fonts (OFL), self-hosted by `next/font`.

Arabic rules: size +6–10 %, line height 1.85 for body, 1.3 for display, `letter-spacing: 0` forced, no uppercase or italics, no character splitting in animation. Western digits throughout (as on the live site), numbers and phone numbers isolated `dir="ltr"`.

Fluid type scale (`--step--1` … `--step-5`, `clamp()`), redefined under `:lang(ar)`.

## Colour roles (tokens in `src/app/globals.css` `@theme`)
| Token | Value | Role |
|---|---|---|
| `ink` | #0a2540 | text (14.5:1 on milk) |
| `blue` | #00529b | brand, primary buttons, links (7.3:1 on milk) |
| `blue-deep` / `blue-night` | #003a70 / #04203d | dark panels, footer |
| `drop` / `drop-soft` | #43b7ea / #d7eefa | water accents (decorative, or on dark only) |
| `leaf` / `leaf-ink` | #2ebb68 / #15703c | brand green decorative / text-safe green (5.75:1 on milk) |
| `milk` / `cream` | #faf7f0 / #f2ecdf | page / surfaces |
| `sand` | #ddcfb2 | hairlines, inactive states (never text). Unreached timeline years use #7d8a98 (3.3:1, large text) |
| `muted` | #53606f | secondary text (6.0:1 on milk) |
| tones | sun, berry, coffee, tomato, sky, leaf | per-category tint for tiles (from the packaging palettes) |

## Layout grammar
12-column grid, max 1360 px, gutter `clamp(1rem, 2.6vw, 3rem)`. Asymmetry by offsetting text and image columns (7/5, 6/6 with the image column breaking the baseline), one oversized tile per grid, staggered recipe cards. Section rhythm from `--section` (72–144 px). One radius language (28 px plates, pills for controls), one shadow pair (`plate`, `lift`), one 1.75-stroke icon set drawn for the project.

## Imagery
Original assets only (see `asset-manifest.json`): packshots on white plates, the 3 home campaign banners shown whole in a crossfading carousel (their text is baked in, so they are not cropped), factory/building photography in tall rounded frames, the original branches map. Recipe photos are only 360×207 at source, so they are never shown wider than ~55 vw.

## Motion personality
Calm and fluid, like water: long ease-outs (`expo.out`, 0.7–1.1 s) for entrances, 160–280 ms for UI feedback. Engine: **GSAP + ScrollTrigger** (one engine), CSS for hover/press.
- Hero: plates rise and settle with a slight rotation; two plates float 10 px on a 7 s loop.
- Counters: count up once when they enter view; the final number is in the HTML.
- **Signature moment — the irrigation timeline:** a channel fills with water (scrubbed to scroll) and each year lights up as the water reaches it, with a drop riding the water line.
- Campaign carousel: 6 s crossfade, pauses on hover/focus, pause button (WCAG 2.2.2).
- `prefers-reduced-motion`: no entrance, no float, no scrub (timeline shown complete), counters static, carousel does not auto-rotate. Low-power path: touch phones ≤767 px and Save-Data get the static timeline.

## Anti-list (avoided on purpose)
No purple/blue gradients or aurora blobs; no glassmorphism; no centred hero with gradient headline + two buttons + logo marquee; no row of three identical icon cards; no invented stats, testimonials, certifications or "trusted by" walls; no fade-up-on-every-section; no stock 3D blobs; no WebGL (not justified: products are flat cartons with printed labels and we have no 3D models; a fake 3D pack would alter packaging).
