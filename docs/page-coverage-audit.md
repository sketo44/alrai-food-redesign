# Page coverage audit

Each original page (AR / EN) → new route → status per locale. Status meanings: **done** = all content the live page has is present and working; **partial** = page built, but some live functionality or content is not replicated (reason given); **content missing** = the live page itself lacks content, so ours is thin by necessity. Per-URL detail for all 121 original URLs is in `url-inventory.md`. Verification: every route below returned HTTP 200 with one `<h1>`, correct `lang`/`dir`, hreflang, no console errors and no broken images in the QA crawl (see `qa-results.md`).

| Original page (AR · EN) | New route | AR | EN | Notes |
|---|---|---|---|---|
| `/` · `/en/` Home | `/ar` · `/en` | done | done | All live sections kept: about intro, vision/mission, 3 counters, category list, recipes, brands, branches teaser, 3 campaign banners (slider). Added: export/distributor panel, timeline. Newsletter not reproduced (no backend). |
| `/من-نحن/` · `/en/about-us/` About | `/{l}/about` | done | done | All 6 paragraphs, vision, mission, 2 features, counters, 1968–1990 timeline, original photos. EN "irrigation brand" corrected (editorial). |
| `/فروعنا/` · `/en/branches/` Branches | `/{l}/branches` | done | done | 9 branches + phones (tap to call) + original map image. |
| `/العلامات-التجارية/` · `/en/brands/` Brands | `/{l}/brands` | content missing | content missing | 6 logos as on live (AR/EN logo variants per locale). Live page has no brand text or links. |
| `/product/` · `/en/product/` Products archive | `/{l}/products` | done | done | Category tiles + searchable/filterable list of all 55 products (replaces WP product search). |
| `/products-category/<10 categories with products>/` | `/{l}/products/<slug>` | done | done | milk, dairy, juices (with sub-category nav), nectar, creams, barista-cafe, ice-cream-mix, tomato-paste, hummus, other-products. EN live categories were empty; EN now shows the full range. |
| Empty categories: عصير، شراب، ايس كريم مثلج، البسكويت الويفر (+ duplicate بسكويت الويفر) · EN drink, frozen-ice-cream | `/{l}/products/{juice,drink,frozen-ice-cream,wafer-biscuits}` | content missing | content missing | Routes kept with an honest "no published products yet" state; not shown in menus. |
| `/product/<slug>/` × 55 product pages | `/{l}/products/<category>/<slug>` | done / partial | partial | AR: packshot, size, description, ingredients, nutrition exactly as published. 35 products' nutrition tables suppressed (copied template, wrong data) and 2 malformed → content needed. EN: names are pack-artwork or editorial translations; ingredients/description shown in Arabic. |
| 4 legacy/test product pages (`حليب Test` etc.) | — | not migrated | — | Uncategorised duplicates/test data. |
| `/en/product/*` (6 entries) | mapped to the matching AR product's EN page | — | done | Live EN product data was incomplete/incorrect (Arabic nutrition, placeholder values). |
| `/recipe/<slug>/` × 3 · `/en/recipe/oatmeal-cookies(-2,-3,-4)/` | `/{l}/recipes`, `/{l}/recipes/<slug>` | content missing | content missing | Title, description and photo as published; live recipes have no ingredients or method. 2 EN descriptions are editorial translations. Added a recipes index (live site had none; recipes were reachable only from home). |
| `/التصدير/` · `/en/export/` Export request | `/{l}/export` | partial | partial | All fields and validation; **no submission backend** (honest not-sent panel + mailto). |
| `/الموزعين-خارج-المملكة/` · `/en/distributors/` | `/{l}/distributors` | done | done | 14 distributors grouped by country, tap-to-call. |
| `/انضم-إلينا/` · `/en/join-us/` Join us | `/{l}/careers` | partial | partial | All fields incl. repeatable experience rows, PDF check and declaration; **no backend / CV storage**. |
| `/اتصل-بنا/` · `/en/contact-us/` Contact | `/{l}/contact` | partial | partial | Contact details + form; no backend; placeholder "message type" field dropped. |
| `/greeting-cards/646/`, `/653/` | — | not migrated | — | Empty posts. |
| `/test/`, `/category/غير-مصنف/`, `/en/products-category/name/` | — | not migrated | — | WordPress test/default/junk entries. |
| (new) 404 | `/{l}/<unknown>` and any unmatched URL | done | done | Locale 404 + bilingual global 404. |
| (new) `sitemap.xml`, `robots.txt`, icons, OG image | root | done | done | 164 URLs with hreflang alternates. |

**Totals:** 82 route paths × 2 locales = 164 prerendered pages. Done: home, about, branches, products index, 10 category pages, distributors (both locales); partial: forms (backend), EN product pages (translation/label language), AR product pages lacking nutrition; content missing on the live site: brands text, recipes detail, empty categories.
