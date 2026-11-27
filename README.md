# Al Rai Food — website redesign

Bilingual (Arabic RTL / English) redesign of alraifood.com, built with Next.js, React, TypeScript, Tailwind CSS and GSAP.
This is a design preview; it is not the live company website.

## Run locally
```
npm install
npm run dev      # http://localhost:3210
```

## Live preview
Every push to `main` builds a static copy and publishes it to GitHub Pages
(`.github/workflows/pages.yml`). The preview is marked noindex so search engines skip it.

## Notes
- Content sources and rules: `docs/`
- Partner strip data and sources: `docs/partners-data.md`
- QA scripts: `qa/` (Playwright + axe)
