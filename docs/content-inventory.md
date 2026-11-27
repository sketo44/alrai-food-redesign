# Content inventory (verified)

Only content actually read on alraifood.com on **2026-11-22** is listed here. Method: read-only HTTP fetch of every URL in the WordPress sitemaps plus the EN mirror (113 pages, all HTTP 200), the public WordPress REST API (`/wp-json/wp/v2/pages|product|recipe|products-category|media`, AR + EN) and the theme stylesheet. Raw captures are kept in `.audit/raw/` (`crawl.json` = text of every page, `products-extracted.json` = structured product fields, `rest-*.json`).

Where the site is silent, this file says **content needed**; the new pages leave such content out rather than inventing it.

Legend: **verbatim** = copied character for character · **editorial** = written or corrected for the redesign, pending client approval · **content needed** = missing on the live site.

## 1. Company facts (used site-wide; data file `src/content/company.ts`)

| Fact | Arabic (verbatim) | English | Source |
|---|---|---|---|
| Legal/brand name | الري للصناعات الغذائية | AlRai Food Industries (live EN) | header, footer, `<title>` |
| Logo wordmark | الري / AlRai | — | `wp-content/uploads/2025/01/logo.png` |
| Founded | 1968م، الأحساء، المنطقة الشرقية | 1968, Al-Ahsa, Eastern Province (live EN) | home "من نحن؟", /من-نحن/ |
| Founder / management | تحت إدارة محمد موسى بوخمسين | "under the management of Mohamed Mousa Bo Khamseen" (live EN) | home, about |
| Address | المملكة العربية السعودية - الأحساء | Saudi Arabia - Al-Ahsa (live EN) | footer, /اتصل-بنا/ |
| Email | alrai@alrai.com.sa | same | footer `mailto:` |
| Phone | 0135975444 | same; link uses `tel:+966135975444` (E.164 of the same number) | footer `tel:` |
| Years of experience | 50+ (`data-num="50"`) سنوات من الخبرة | Years of Experience | home + about counters |
| Production lines | 25+ خط إنتاج | Production Line | counters + about text "أكثر من 25 خط إنتاج" |
| Branches | 20+ فرع حول المملكة | Branches Across the Kingdom | counters. **Note:** the branches page lists 9 branches; the counter says 20+. Shown as published; client to confirm. |
| Sales staff | حوالي 600 موظف في المبيعات | around 600 employees in sales | about paragraph |
| Fleet | نحو 300 مركبة | about 300 vehicles | about paragraph |
| Vision | أن نصبح رواد في مجال الصناعات الغذائية | To become leaders in the food industry (live EN) | home, about |
| Mission | تقديم منتجات عالية الجودة بأسعار تنافسية | Providing high quality products at competitive prices. (live EN). Heading "Our message" on the live EN site is shown as **"Our mission"** (editorial correction of رسالتنا). | home, about |
| Tagline | نكهات طبيعية وجودة لا تضاهى! | Natural flavors and unmatched quality! (live EN) | home "منتجاتنا" heading |
| Socials | Instagram @alraifoodsa, Snapchat @alraifoods, X @alraifoodsa, TikTok @alraifoodsa | — | footer icons (tracking query strings removed) |
| WhatsApp | live link `https://wa.me/0135975444` | — | floating button. **Not reproduced**: wa.me needs an international mobile number; 0135975444 is a landline in local format. **content needed:** WhatsApp number. |

### About page body (verbatim AR, live EN)
Four paragraphs (health & standards · development · team · 25 lines/600 staff/300 vehicles), "مميزات مصنع الري" (2 features) and the timeline. All stored verbatim in `company.ts`.

### Timeline (/من-نحن/)
| Year | Arabic (verbatim) | EN |
|---|---|---|
| 1968 | تأسست شركة الري للصناعات الغذائية في مدينة الأحساء، كشركة متخصصة في تصنيع وتوزيع العصائر | live EN |
| 1970 | التوسع الأولي عن طريق زيادة الإنتاج وتطوير خطوط التصنيع لتلبية الطلب المحلي المتزايد على العصائر ومنتجات الحليب | live EN |
| 1980 | تنويع المنتجات عن طريق إضافة منتجات جديدة وتطوير التعبئة والتغليف لتتناسب مع معايير الأسواق الحديثة | live EN |
| 1990 | التصدير والانفتاح عن طريق التصدير إلى دول الخليج وتعزيز الهوية التجارية وزيادة شهرة علامة الري في المنطقة | live EN, with **"the irrigation brand" → "the AlRai brand"** (editorial: الري was machine-translated literally) |

No events after 1990 are published: **content needed** if the client wants a longer history.

## 2. Branches (/فروعنا/, /en/branches/) — `src/content/network.ts`
9 rows, verbatim: الأحساء 0538640124 · الرياض 0531639424 · الدمام 0533733340 · جدة 0534692924 · المدينة المنورة 0536695924 · مكة 0534692924 · حفر الباطن 0530165924 · خميس مشيط 0533016224 · تبوك 0581783902. EN city names from the live EN page. Jeddah and Makkah share one number on the live site (kept). Addresses, opening hours and map coordinates: **content needed** (the live page has only city + phone; the map is a static image `1-1.png`).

## 3. Distributors outside the Kingdom (/الموزعين-خارج-المملكة/, /en/distributors/)
14 distributors, verbatim AR and EN names, locations and phone numbers (Jordan 2, Palestine 1, UAE 2, Yemen 1, Oman 2, Bahrain 2, Qatar 2, Iraq 1, Kuwait 1). The "14 distributors · 9 countries" counts shown on the site are computed from this list. EN spellings such as "DIARY" (for dairy) are kept verbatim.

## 4. Brands (/العلامات-التجارية/)
Six logo images, no text, no links: alrai, lunait, fwakeh, raioo (+EN variant), alora (+EN variant), r-zero. Names used as alt text were **read from the logo artwork**: الري/AlRai, لونيت/LUNAIT, فواكه (Fwakeh: AR-only logo; Latin spelling is the file name), رايو/RAIO, الورا/Alora, R-ZERO. Brand descriptions, product ranges per brand, links: **content needed**.

## 5. Recipes (/recipe/*) — `src/content/recipes.ts`
| Recipe | AR description | EN | Image |
|---|---|---|---|
| شوربة العدس بالكريمة | verbatim | **editorial translation** (no EN on live site) | 3.jpg (360×207) |
| كيك الزبادي بالتفاح | verbatim | **editorial translation** | 2-1.jpg (360×207) |
| بسكويت الشوفان | verbatim | live EN "Oatmeal cookies" (the live EN site has 4 identical copies) | 1-1.jpg (360×207) |

Ingredients, quantities, method, prep time, which AlRai products are used: **content needed** (none published). Higher-resolution recipe photos: **content needed**.

## 6. Forms (Gravity Forms on the live site)
| Form | Live fields (verbatim labels) | Redesign |
|---|---|---|
| Contact (/اتصل-بنا/) | الاسم بالكامل · رقم الجوال · البريد الالكتروني · نوع الرسالة (options: الخيار الاول / الخيار الثانى / الخيار الثالث) · نص الرسالة | Same fields **except "message type"**, whose options are unfinished placeholders: **content needed** (real categories). |
| Export (/التصدير/) | الدولة (full country list) · اسم الشركة · رقم الجوال (مع مفتاح الدولة) · البريد الالكتروني · المنتج/ المنتجات المهتم بها | Same fields. Country names generated with `Intl.DisplayNames` from ISO codes (same list, localised). |
| Join us (/انضم-إلينا/) | القسم (11 departments, verbatim bilingual labels) · الخبرة المهنية (repeatable: مسمى الوظيفة / اسم الشركة / المدة) · الاسم الثلاثي · تاريخ الميلاد · الجنس · الجنسية · أعلى مؤهل تعليمي (7 options) · عنوانك الحالي · رقم الجوال · البريد · السيرة الذاتية (PDF, 5 MB, 1 file) · إقرار (verbatim declaration) | Same fields and rules; DOB as one date input instead of three number boxes. |
| Newsletter (footer) | email field | **Not reproduced** (no mailing service; see limitations). |

## 7. Product catalogue
Taxonomy (REST `products-category`, AR): 15 terms. With products: الحليب 3 · الألبان 3 · العصائر 5 (via نكتار) · نكتار 5 · كريمات والقشطة 9 · باريستا كافيه 6 · مزيج الايس كريم 25 · معجون الطماطم 2 · حمص 1 · منتجات أخرى 1. Empty: عصير, شراب, ايس كريم مثلج, البسكويت الويفر, بسكويت الويفر (duplicate). EN taxonomy has 12 terms, 10 with zero products, plus a junk term "name".

Category EN labels: live EN labels are lower-case or partial ("barista cafe", "Creams", "dairy"); the redesign uses title-case labels and "Creams & Qishta" (editorial) for كريمات والقشطة.

**Product names in English:** the live EN site has English names for only 3 products ("milk 200 ml", "Milk 125 ml", "Tomato Paste"). 30 EN names were read from the English printed on the pack artwork (§9); the other 25 are **editorial translations** of the Arabic names. Each is flagged with `nameEnSource` in `products.json`. Arabic names are verbatim, and the EN product page also shows the Arabic name.

**Ingredients / description text** exists in Arabic only. On EN pages it is shown in Arabic (`lang="ar" dir="rtl"`) with the note "Label text as published in Arabic" — not machine-translated, because it is regulatory label text.

**Nutrition tables:** 18 products have a real table (published verbatim; row labels and units translated with a fixed glossary on EN pages). **35 products** (all 25 ice-cream mixes, 6 cooking creams, 3 full-fat milks, tomato purée) carry an *identical* table on the live site — the nectar template (40 kcal, 0 g fat, "فيتامين بي" …) — which cannot be correct for milk or cream. Those tables are **suppressed** in the redesign: **content needed** (real nutrition per product). Qishta 125 ml and 250 ml have a malformed one-cell table (the ingredients text pasted into the table): **content needed**.

**Legacy/test products not migrated:** 4 uncategorised entries (`حليب Test` and three older "حليب كامل الدسم 1 لتر" duplicates, IDs 118/130/131/132), not linked from any category page.

**Two "مزيج آيس كريم حلوى القطن" products** have the same name and different packshots (blue and pink packs). Both are kept with the same name; slugs `ice-cream-mix-cotton-candy` and `-2`. Client to confirm whether these are two variants.

### Product table (55 products, generated from `src/content/products.json`)
| # | Category | Arabic name (verbatim) | EN name | EN source | Size | Description | Ingredients | Nutrition | Image | Live URL path |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | milk | حليب كامل الدسم 1 لتر | Full Fat Milk 1 L | editorial | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | full-fat-milk-1l.jpg | /product/حليب-كامل-الدسم-1-لتر-5/ |
| 2 | milk | حليب كامل الدسم 125 مل | Full Fat Milk 125 ml | editorial | 125 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | full-fat-milk-125ml.jpg | /product/حليب-كامل-الدسم-125-مل/ |
| 3 | milk | حليب كامل الدسم 200 مل | Full Fat Milk 200 ml | editorial | 200 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | full-fat-milk-200ml.jpg | /product/حليب-كامل-الدسم-200-مل/ |
| 4 | hummus | حمص 135 جم | Hummus 135 g | editorial | 135 جم | — | yes | published (11 rows) | hummus-135g.jpg | /product/حمص/ |
| 5 | creams | قشطة 1 لتر | Qishta 1 L | editorial | 1 لتر | — | yes | published (13 rows) | qishta-1l.jpg | /product/قشطة-1-لتر/ |
| 6 | creams | قشطة 125 مل | Qishta 125 ml | editorial | 125 مل | — | yes | **content needed** (empty/malformed on live site) | qishta-125ml.jpg | /product/قشطة-125-مل/ |
| 7 | creams | قشطة 250 مل | Qishta 250 ml | editorial | 250 مل | — | yes | **content needed** (empty/malformed on live site) | qishta-250ml.jpg | /product/قشطة-250-مل/ |
| 8 | other-products | كاتشب 5 كغ | Ketchup 5 kg | editorial | 5 كغ | — | yes | published (11 rows) | ketchup-5kg.jpg | /product/كاتشب-5-كغ/ |
| 9 | creams | كريمة الطبخ الفرنسية 1 لتر | French Cooking Cream 1 L | editorial | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | french-cooking-cream-1l.jpg | /product/كريمة-الطبخ-الفرنسية-1-لتر/ |
| 10 | creams | كريمة الطبخ الفرنسية 250 مل | French Cooking Cream 250 ml | editorial | 250 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | french-cooking-cream-250ml.jpg | /product/كريمة-الطبخ-الفرنسية-250-مل/ |
| 11 | creams | كريمة الطبخ الفرنسية 500 مل | French Cooking Cream 500 ml | editorial | 500 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | french-cooking-cream-500ml.jpg | /product/كريمة-الطبخ-الفرنسية-500-مل/ |
| 12 | creams | كريمة الطبخ باستا 1 لتر | Pasta Cooking Cream 1 L | editorial | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | pasta-cooking-cream-1l.jpg | /product/كريمة-الطبخ-باستا-1-لتر/ |
| 13 | creams | كريمة الطبخ باستا 250 مل | Pasta Cooking Cream 250 ml | editorial | 250 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | pasta-cooking-cream-250ml.jpg | /product/كريمة-الطبخ-باستا-250-مل/ |
| 14 | creams | كريمة الطبخ باستا 500 مل | Pasta Cooking Cream 500 ml | editorial | 500 مل | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | pasta-cooking-cream-500ml.jpg | /product/كريمة-الطبخ-باستا-500-مل/ |
| 15 | barista-cafe | كوفي لاتيه أورجينال 250 مل | Coffee Latte Original 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-original-250ml.jpg | /product/كوفي-لاتيه-أورجينال-250-مل/ |
| 16 | barista-cafe | كوفي لاتيه بندق و فانيلا 250 مل | Coffee Latte Hazelnut & Vanilla 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-hazelnut-vanilla-250ml.jpg | /product/كوفي-لاتيه-بندق-و-فانيلا-250-مل/ |
| 17 | barista-cafe | كوفي لاتيه فانيلا 250 مل | Coffee Latte Vanilla 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-vanilla-250ml.jpg | /product/كوفي-لاتيه-فانيلا-250-مل/ |
| 18 | barista-cafe | كوفي لاتيه فستق 250 مل | Coffee Latte Pistachio 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-pistachio-250ml.jpg | /product/كوفي-لاتيه-فستق-250-مل/ |
| 19 | barista-cafe | كوفي لاتيه كراميل 250 مل | Coffee Latte Caramel 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-caramel-250ml.jpg | /product/كوفي-لاتيه-كراميل-250-مل/ |
| 20 | barista-cafe | كوفي لاتيه موكا 250 مل | Coffee Latte Mocha 250 ml | pack artwork | 250 مل | — | yes | published (14 rows) | coffee-latte-mocha-250ml.jpg | /product/كوفي-لاتيه-موكا-250-مل/ |
| 21 | dairy | لبن بالزبدة 450 مل | Laban with Butter 450 ml | editorial | 450 مل | — | yes | published (13 rows) | laban-with-butter-450ml.jpg | /product/لبن-بالزبدة-450-مل/ |
| 22 | dairy | لبن بالزبدة 900 مل | Laban with Butter 900 ml | editorial | 900 مل | — | yes | published (13 rows) | laban-with-butter-900ml.jpg | /product/لبن-بالزبدة-900-مل/ |
| 23 | dairy | لبن 180 مل | Laban 180 ml | editorial | 180مل | — | yes | published (13 rows) | laban-180ml.png | /product/لبن-180-مل/ |
| 24 | ice-cream-mix | مزيج آيس كريم البطيخ الأصفر | Ice Cream Mix – Cantaloupe | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-yellow-melon.jpg | /product/مزيج-آيس-كريم-البطيخ-الأصفر/ |
| 25 | ice-cream-mix | مزيج آيس كريم البطيخ | Ice Cream Mix – Watermelon | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-watermelon.jpg | /product/مزيج-آيس-كريم-البطيخ/ |
| 26 | ice-cream-mix | مزيج آيس كريم البندق | Ice Cream Mix – Hazelnut | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-hazelnut.jpg | /product/مزيج-آيس-كريم-البندق/ |
| 27 | ice-cream-mix | مزيج آيس كريم التوت | Ice Cream Mix – Berry | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-berry.jpg | /product/مزيج-آيس-كريم-التوت/ |
| 28 | ice-cream-mix | مزيج آيس كريم الزعفران | Ice Cream Mix – Saffron | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-saffron.jpg | /product/مزيج-آيس-كريم-الزعفران/ |
| 29 | ice-cream-mix | مزيج آيس كريم الفانيليا السوداء | Ice Cream Mix – Black Vanilla | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-black-vanilla.jpg | /product/مزيج-آيس-كريم-الفانيليا-السوداء/ |
| 30 | ice-cream-mix | مزيج آيس كريم الفستق | Ice Cream Mix – Pistachio | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-pistachio.jpg | /product/مزيج-آيس-كريم-الفستق/ |
| 31 | ice-cream-mix | مزيج آيس كريم المانجو | Ice Cream Mix – Mango | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-mango.jpg | /product/مزيج-آيس-كريم-المانجو/ |
| 32 | ice-cream-mix | مزيج آيس كريم بترسكوتش | Ice Cream Mix – Butterscotch | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-butterscotch.jpg | /product/مزيج-آيس-كريم-بترسكوتش/ |
| 33 | ice-cream-mix | مزيج آيس كريم بسكويت | Ice Cream Mix – Biscuit | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-biscuit.jpg | /product/مزيج-آيس-كريم-بسكويت/ |
| 34 | ice-cream-mix | مزيج آيس كريم بوظة عربية | Ice Cream Mix – Arabic Booza | editorial | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-arabic-booza.jpg | /product/مزيج-آيس-كريم-بوظة-عربية/ |
| 35 | ice-cream-mix | مزيج آيس كريم تشيزكيك | Ice Cream Mix – Cheesecake | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-cheesecake.jpg | /product/مزيج-آيس-كريم-تشيزكيك/ |
| 36 | ice-cream-mix | مزيج آيس كريم تيراميسو | Ice Cream Mix – Tiramisu | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-tiramisu.jpg | /product/مزيج-آيس-كريم-تيراميسو/ |
| 37 | ice-cream-mix | مزيج آيس كريم حلوى القطن | Ice Cream Mix – Cotton Candy | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-cotton-candy-2.jpg | /product/مزيج-آيس-كريم-حلوى-القطن-2/ |
| 38 | ice-cream-mix | مزيج آيس كريم حلوى القطن | Ice Cream Mix – Cotton Candy | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-cotton-candy.jpg | /product/مزيج-آيس-كريم-حلوى-القطن/ |
| 39 | ice-cream-mix | مزيج آيس كريم ريد بيري | Ice Cream Mix – Raspberry | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-red-berry.jpg | /product/مزيج-آيس-كريم-ريد-بيري/ |
| 40 | ice-cream-mix | مزيج آيس كريم ريد فلفت | Ice Cream Mix – Red Velvet | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-red-velvet.jpg | /product/مزيج-آيس-كريم-ريد-فلفت/ |
| 41 | ice-cream-mix | مزيج آيس كريم شوكولاتة | Ice Cream Mix – Chocolate | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-chocolate.jpg | /product/مزيج-آيس-كريم-شوكولاتة/ |
| 42 | ice-cream-mix | مزيج آيس كريم فانيلا | Ice Cream Mix – Vanilla | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-vanilla.jpg | /product/مزيج-آيس-كريم-فانيلا/ |
| 43 | ice-cream-mix | مزيج آيس كريم فراولة | Ice Cream Mix – Strawberry | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-strawberry.jpg | /product/مزيج-آيس-كريم-فراولة/ |
| 44 | ice-cream-mix | مزيج آيس كريم قهوة سعودية | Ice Cream Mix – Saudi Coffee | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-saudi-coffee.jpg | /product/مزيج-آيس-كريم-قهوة-سعودية/ |
| 45 | ice-cream-mix | مزيج آيس كريم قهوة | Ice Cream Mix – Coffee | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-coffee.jpg | /product/مزيج-آيس-كريم-قهوة/ |
| 46 | ice-cream-mix | مزيج آيس كريم كراميل | Ice Cream Mix – Caramel | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-caramel.jpg | /product/مزيج-آيس-كريم-كراميل/ |
| 47 | ice-cream-mix | مزيج آيس كريم كوكيز | Ice Cream Mix – Cookies | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-cookies.jpg | /product/مزيج-آيس-كريم-كوكيز/ |
| 48 | ice-cream-mix | مزيج آيس كريم مستكا | Ice Cream Mix – Mastic | pack artwork | 1 لتر | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | ice-cream-mix-mastic.jpg | /product/مزيج-آيس-كريم-مستكا/ |
| 49 | tomato-paste | معجون طماطم | Tomato Paste | editorial | 135 جم | — | yes | published (11 rows) | tomato-paste.jpg | /product/معجون-طماطم/ |
| 50 | nectar | نكتار الأناناس 200 مل | Pineapple Nectar 200 ml | editorial | 200 مل | — | yes | published (12 rows) | pineapple-nectar-200ml.jpg | /product/نكتار-الأناناس-200-مل/ |
| 51 | nectar | نكتار البرتقال 200 مل | Orange Nectar 200 ml | editorial | 200 مل | — | yes | published (12 rows) | orange-nectar-200ml.jpg | /product/نكتار-البرتقال-200-مل/ |
| 52 | nectar | نكتار التفاح 200 مل | Apple Nectar 200 ml | editorial | 200 مل | — | yes | published (12 rows) | apple-nectar-200ml.jpg | /product/نكتار-التفاح-200-مل/ |
| 53 | nectar | نكتار الكوكتيل 200 مل | Cocktail Nectar 200 ml | editorial | 200 مل | — | yes | published (12 rows) | cocktail-nectar-200ml.jpg | /product/نكتار-الكوكتيل-200-مل/ |
| 54 | nectar | نكتار المانجو 200 مل | Mango Nectar 200 ml | editorial | 200 مل | — | yes | published (12 rows) | mango-nectar-200ml.jpg | /product/نكتار-المانجو-200-مل/ |
| 55 | tomato-paste | هريس الطماطم | Tomato Purée | editorial | 135 جم | — | **content needed** | **suppressed** (identical template copied across 35 products) → content needed | tomato-puree.jpg | /product/هريس-الطماطم/ |

## 8. Interface copy written for the redesign (editorial)
Section headings and helper text that did not exist on the live site, stored in `src/lib/i18n.ts` (`ui`): hero eyebrow "الأحساء · منذ 1968" (built from verified facts), "قصتنا / Our story", "من حملاتنا / From our campaigns", "المسيرة / The journey", "خارج المملكة / Beyond the Kingdom", "حجم الري اليوم / AlRai today", product-search labels, form validation messages, the honest "form not sent" panel, 404 text and the empty-category message. No business claims are made in this copy.

## 9. English names verified on pack artwork
The ice-cream-mix packs and the Coffee Latte packs/banner print the flavour in English. Those names were read from the images and used verbatim; two differ from a literal translation of the Arabic title: **ريد بيري → "Raspberry"** (pack) and **البطيخ الأصفر → "Cantaloupe"** (pack). Arabic Booza (label not legible in the crop), milks, laban, creams, nectars, hummus, tomato and ketchup remain editorial translations.
