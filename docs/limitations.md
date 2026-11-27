# Limitations (honest list)

## Not replicated (needs a backend or a client decision)
1. **Forms do not send anything.** Contact, export request and job application forms validate fully, then show a clearly labelled "Your form has not been sent" panel with the email address, phone number and a pre-filled `mailto:` link. The live site uses Gravity Forms (WordPress) with server-side storage and file upload; this static Next.js build has no form endpoint, no spam protection, no email delivery and no CV storage. To go live: connect a form service or an API route (e.g. email via SMTP/transactional provider, CV upload to private storage), add CAPTCHA/honeypot and a privacy notice.
2. **Newsletter signup** (live footer) is not reproduced: there is no mailing-list provider to connect to.
3. **WhatsApp button** is not reproduced: the live link `wa.me/0135975444` is a local landline number and does not open a WhatsApp chat. Needs the real WhatsApp number.
4. **Contact form "message type"** is omitted: its live options are placeholders (First/Second/Third option).
5. **Old-URL redirects** are not implemented. `docs/url-inventory.md` maps all 121 original URLs (Arabic-encoded paths) to new routes; turning it into `redirects()` entries (with percent-encoded Arabic sources) should be done when the domain is switched, and verified on the real host.
6. **Branch locator:** the static map image has been replaced by an interactive vector map (`BranchLocator`, see `docs/branch-locator-data.md`). The live site publishes only city + phone for each branch, so **every pin is a city reference point (Natural Earth / Wikidata), not a branch address**. The UI says so. The "Open in Google Maps" button searches for the city. To get exact pins, the client needs to supply each branch address or Maps link; then set `precision: "exact"` with the source in `src/content/network.ts`. Opening hours are not published and are not shown. `public/assets/branches/branches-map.png` is no longer referenced (kept, not deleted).
7. **Search** is client-side over products only (the live WordPress search also covered posts).
8. **CMS:** content now lives in typed data files (`src/content/*`), not in WordPress. Editors would need a CMS or Git workflow.

## Content gaps (left out of the pages, listed in content-inventory.md)
- Real nutrition tables for 35 products (the live tables are an identical copied template) and for Qishta 125/250 ml (malformed).
- Ingredients for the 25 ice-cream mixes, 6 cooking creams, 3 full-fat milks (new packs) and tomato purée.
- English product names (55 are editorial translations), English ingredients/label text (shown in Arabic on EN pages), EN recipe text for 2 of 3 recipes (editorial translations).
- Recipe ingredients/method and higher-resolution recipe photos (360×207 at source).
- Brand descriptions; a vector (SVG) logo — only a 160×70 PNG exists, which is slightly soft on high-density screens.
- History after 1990; reconciliation of "20+ branches" (counter) vs the 9 branches listed.
- Whether the two "مزيج آيس كريم حلوى القطن" entries are two variants.

## Editorial changes to live copy (pending approval)
- EN timeline 1990: "irrigation brand" → "AlRai brand".
- EN heading "Our message" → "Our mission".
- Category label "كريمات والقشطة" → EN "Creams & Qishta"; title-casing of EN category names.

## Not verified
- Production hosting, CDN, caching headers and real-network Core Web Vitals (only a local production build was measured; see qa-results.md).
- Screen-reader testing with NVDA/VoiceOver (automated axe + keyboard checks only).
- Safari/Firefox (QA ran in Google Chrome via Playwright).
- `SITE_URL` defaults to `https://alraifood.com` for canonical/hreflang/OG URLs; adjust `NEXT_PUBLIC_SITE_URL` for staging.
- Copyright/usage rights of photography already on the live site are assumed to belong to the client.

## Branch locator specifics
- On 390 px phones, Jeddah and Makkah sit ~9 px apart. Pointer and touch use nearest-pin hit testing, so both can be tapped; the city list is the equivalent larger target (WCAG 2.5.8). Map labels are hidden on phones; the tooltip and the sheet name the city.
- Mercator geometry from Natural Earth shows de-facto boundaries at 1:10m / 1:50m. It is not survey grade.
- The map path data (~44 KB raw) ships in the client bundle of the home and /branches pages.
- The bottom sheet is non-modal (the map stays usable behind it). It cannot be dragged down to dismiss; use the close button or Esc.
- Tested in Chrome only (Playwright, emulated touch); no real iOS/Android device or screen-reader pass.

## Known design/performance compromises
- Page weight is ~0.85–1.0 MB on first load (lab sample): four font families (Reem Kufi, Fraunces, IBM Plex Sans, IBM Plex Sans Arabic) plus 1000×1000 packshots. Trimming weights or dropping Fraunces would cut it.
- On 390 px phones the hero composition sits below the headline, and the "since 1968" badge overlaps the drop graphic.
- Tablet (768 px) layouts were not part of the scripted screenshot rounds.
- The dev server (`next dev`) shows the Next.js dev-tools badge; it is absent from the production build.
