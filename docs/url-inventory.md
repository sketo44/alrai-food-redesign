# URL inventory: alraifood.com → redesign

Every URL found on the live site (WordPress sitemaps `wp-sitemap-*.xml`, menus, page links, REST API listings and the EN language switcher), crawled read-only on 2026-11-22, mapped to its route in the new site. `/ar` is the default locale; `/` redirects to `/ar`.

- Original URLs: **121** (AR 90, EN 31)
- Mapped (done): **112** · Not migrated (empty/test/legacy): **9** · Unmapped: **0**

The new site uses the same ASCII slugs in both languages, so each AR/EN pair differs only by the locale prefix. A redirect map from the old Arabic-encoded URLs is **not** implemented yet (see limitations.md); this table is its source.

| # | Original URL | Live page title | New route | Status |
|---|---|---|---|---|
| 1 | https://alraifood.com/ | الري للصناعات الغذائية | `/ar` | done |
| 2 | https://alraifood.com/category/غير-مصنف/ |  | `—` | not migrated (empty default blog category) |
| 3 | https://alraifood.com/greeting-cards/646/ | الري للصناعات الغذائية | `—` | not migrated (empty greeting-card post, no content) |
| 4 | https://alraifood.com/greeting-cards/653/ | الري للصناعات الغذائية | `—` | not migrated (empty greeting-card post, no content) |
| 5 | https://alraifood.com/product/ | المنتجات | `/ar/products` | done |
| 6 | https://alraifood.com/product/حليب-كامل-الدسم-1-لتر-2/ | حليب Test | `/ar/products/milk (suggested redirect)` | not migrated: legacy/test entry "حليب Test" |
| 7 | https://alraifood.com/product/حليب-كامل-الدسم-1-لتر-3/ | حليب كامل الدسم 1 لتر | `/ar/products/milk (suggested redirect)` | not migrated: legacy/test entry "حليب كامل الدسم 1 لتر" |
| 8 | https://alraifood.com/product/حليب-كامل-الدسم-1-لتر-4/ | حليب كامل الدسم 1 لتر | `/ar/products/milk (suggested redirect)` | not migrated: legacy/test entry "حليب كامل الدسم 1 لتر" |
| 9 | https://alraifood.com/product/حليب-كامل-الدسم-1-لتر-5/ | حليب كامل الدسم  1 لتر | `/ar/products/milk/full-fat-milk-1l` | done |
| 10 | https://alraifood.com/product/حليب-كامل-الدسم-1-لتر/ | حليب كامل الدسم 1 لتر | `/ar/products/milk (suggested redirect)` | not migrated: legacy/test entry "حليب كامل الدسم 1 لتر" |
| 11 | https://alraifood.com/product/حليب-كامل-الدسم-125-مل/ | حليب كامل الدسم  125 مل | `/ar/products/milk/full-fat-milk-125ml` | done |
| 12 | https://alraifood.com/product/حليب-كامل-الدسم-200-مل/ | حليب كامل الدسم  200 مل | `/ar/products/milk/full-fat-milk-200ml` | done |
| 13 | https://alraifood.com/product/حمص/ | حمص 135 جم | `/ar/products/hummus/hummus-135g` | done |
| 14 | https://alraifood.com/product/قشطة-1-لتر/ | قشطة 1 لتر | `/ar/products/creams/qishta-1l` | done |
| 15 | https://alraifood.com/product/قشطة-125-مل/ | قشطة 125 مل | `/ar/products/creams/qishta-125ml` | done |
| 16 | https://alraifood.com/product/قشطة-250-مل/ | قشطة 250 مل | `/ar/products/creams/qishta-250ml` | done |
| 17 | https://alraifood.com/product/كاتشب-5-كغ/ | كاتشب 5 كغ | `/ar/products/other-products/ketchup-5kg` | done |
| 18 | https://alraifood.com/product/كريمة-الطبخ-الفرنسية-1-لتر/ | كريمة الطبخ الفرنسية 1 لتر | `/ar/products/creams/french-cooking-cream-1l` | done |
| 19 | https://alraifood.com/product/كريمة-الطبخ-الفرنسية-250-مل/ | كريمة الطبخ الفرنسية 250 مل | `/ar/products/creams/french-cooking-cream-250ml` | done |
| 20 | https://alraifood.com/product/كريمة-الطبخ-الفرنسية-500-مل/ | كريمة الطبخ الفرنسية 500 مل | `/ar/products/creams/french-cooking-cream-500ml` | done |
| 21 | https://alraifood.com/product/كريمة-الطبخ-باستا-1-لتر/ | كريمة الطبخ باستا 1 لتر | `/ar/products/creams/pasta-cooking-cream-1l` | done |
| 22 | https://alraifood.com/product/كريمة-الطبخ-باستا-250-مل/ | كريمة الطبخ باستا 250 مل | `/ar/products/creams/pasta-cooking-cream-250ml` | done |
| 23 | https://alraifood.com/product/كريمة-الطبخ-باستا-500-مل/ | كريمة الطبخ باستا 500 مل | `/ar/products/creams/pasta-cooking-cream-500ml` | done |
| 24 | https://alraifood.com/product/كوفي-لاتيه-أورجينال-250-مل/ | كوفي لاتيه أورجينال 250 مل | `/ar/products/barista-cafe/coffee-latte-original-250ml` | done |
| 25 | https://alraifood.com/product/كوفي-لاتيه-بندق-و-فانيلا-250-مل/ | كوفي لاتيه بندق و فانيلا 250 مل | `/ar/products/barista-cafe/coffee-latte-hazelnut-vanilla-250ml` | done |
| 26 | https://alraifood.com/product/كوفي-لاتيه-فانيلا-250-مل/ | كوفي لاتيه فانيلا 250 مل | `/ar/products/barista-cafe/coffee-latte-vanilla-250ml` | done |
| 27 | https://alraifood.com/product/كوفي-لاتيه-فستق-250-مل/ | كوفي لاتيه فستق 250 مل | `/ar/products/barista-cafe/coffee-latte-pistachio-250ml` | done |
| 28 | https://alraifood.com/product/كوفي-لاتيه-كراميل-250-مل/ | كوفي لاتيه كراميل 250 مل | `/ar/products/barista-cafe/coffee-latte-caramel-250ml` | done |
| 29 | https://alraifood.com/product/كوفي-لاتيه-موكا-250-مل/ | كوفي لاتيه موكا 250 مل | `/ar/products/barista-cafe/coffee-latte-mocha-250ml` | done |
| 30 | https://alraifood.com/product/لبن-180-مل/ | لبن 180 مل | `/ar/products/dairy/laban-180ml` | done |
| 31 | https://alraifood.com/product/لبن-بالزبدة-450-مل/ | لبن بالزبدة 450 مل | `/ar/products/dairy/laban-with-butter-450ml` | done |
| 32 | https://alraifood.com/product/لبن-بالزبدة-900-مل/ | لبن بالزبدة 900 مل | `/ar/products/dairy/laban-with-butter-900ml` | done |
| 33 | https://alraifood.com/product/مزيج-آيس-كريم-البطيخ-الأصفر/ | مزيج آيس كريم البطيخ الأصفر | `/ar/products/ice-cream-mix/ice-cream-mix-yellow-melon` | done |
| 34 | https://alraifood.com/product/مزيج-آيس-كريم-البطيخ/ | مزيج آيس كريم البطيخ | `/ar/products/ice-cream-mix/ice-cream-mix-watermelon` | done |
| 35 | https://alraifood.com/product/مزيج-آيس-كريم-البندق/ | مزيج آيس كريم البندق | `/ar/products/ice-cream-mix/ice-cream-mix-hazelnut` | done |
| 36 | https://alraifood.com/product/مزيج-آيس-كريم-التوت/ | مزيج آيس كريم التوت | `/ar/products/ice-cream-mix/ice-cream-mix-berry` | done |
| 37 | https://alraifood.com/product/مزيج-آيس-كريم-الزعفران/ | مزيج آيس كريم الزعفران | `/ar/products/ice-cream-mix/ice-cream-mix-saffron` | done |
| 38 | https://alraifood.com/product/مزيج-آيس-كريم-الفانيليا-السوداء/ | مزيج آيس كريم الفانيليا السوداء | `/ar/products/ice-cream-mix/ice-cream-mix-black-vanilla` | done |
| 39 | https://alraifood.com/product/مزيج-آيس-كريم-الفستق/ | مزيج آيس كريم الفستق | `/ar/products/ice-cream-mix/ice-cream-mix-pistachio` | done |
| 40 | https://alraifood.com/product/مزيج-آيس-كريم-المانجو/ | مزيج آيس كريم المانجو | `/ar/products/ice-cream-mix/ice-cream-mix-mango` | done |
| 41 | https://alraifood.com/product/مزيج-آيس-كريم-بترسكوتش/ | مزيج آيس كريم بترسكوتش | `/ar/products/ice-cream-mix/ice-cream-mix-butterscotch` | done |
| 42 | https://alraifood.com/product/مزيج-آيس-كريم-بسكويت/ | مزيج آيس كريم بسكويت | `/ar/products/ice-cream-mix/ice-cream-mix-biscuit` | done |
| 43 | https://alraifood.com/product/مزيج-آيس-كريم-بوظة-عربية/ | مزيج آيس كريم بوظة عربية | `/ar/products/ice-cream-mix/ice-cream-mix-arabic-booza` | done |
| 44 | https://alraifood.com/product/مزيج-آيس-كريم-تشيزكيك/ | مزيج آيس كريم تشيزكيك | `/ar/products/ice-cream-mix/ice-cream-mix-cheesecake` | done |
| 45 | https://alraifood.com/product/مزيج-آيس-كريم-تيراميسو/ | مزيج آيس كريم تيراميسو | `/ar/products/ice-cream-mix/ice-cream-mix-tiramisu` | done |
| 46 | https://alraifood.com/product/مزيج-آيس-كريم-حلوى-القطن-2/ | مزيج آيس كريم حلوى القطن | `/ar/products/ice-cream-mix/ice-cream-mix-cotton-candy-2` | done |
| 47 | https://alraifood.com/product/مزيج-آيس-كريم-حلوى-القطن/ | مزيج آيس كريم حلوى القطن | `/ar/products/ice-cream-mix/ice-cream-mix-cotton-candy` | done |
| 48 | https://alraifood.com/product/مزيج-آيس-كريم-ريد-بيري/ | مزيج آيس كريم ريد بيري | `/ar/products/ice-cream-mix/ice-cream-mix-red-berry` | done |
| 49 | https://alraifood.com/product/مزيج-آيس-كريم-ريد-فلفت/ | مزيج آيس كريم ريد فلفت | `/ar/products/ice-cream-mix/ice-cream-mix-red-velvet` | done |
| 50 | https://alraifood.com/product/مزيج-آيس-كريم-شوكولاتة/ | مزيج آيس كريم شوكولاتة | `/ar/products/ice-cream-mix/ice-cream-mix-chocolate` | done |
| 51 | https://alraifood.com/product/مزيج-آيس-كريم-فانيلا/ | مزيج آيس كريم فانيلا | `/ar/products/ice-cream-mix/ice-cream-mix-vanilla` | done |
| 52 | https://alraifood.com/product/مزيج-آيس-كريم-فراولة/ | مزيج آيس كريم فراولة | `/ar/products/ice-cream-mix/ice-cream-mix-strawberry` | done |
| 53 | https://alraifood.com/product/مزيج-آيس-كريم-قهوة-سعودية/ | مزيج آيس كريم قهوة سعودية | `/ar/products/ice-cream-mix/ice-cream-mix-saudi-coffee` | done |
| 54 | https://alraifood.com/product/مزيج-آيس-كريم-قهوة/ | مزيج آيس كريم قهوة | `/ar/products/ice-cream-mix/ice-cream-mix-coffee` | done |
| 55 | https://alraifood.com/product/مزيج-آيس-كريم-كراميل/ | مزيج آيس كريم كراميل | `/ar/products/ice-cream-mix/ice-cream-mix-caramel` | done |
| 56 | https://alraifood.com/product/مزيج-آيس-كريم-كوكيز/ | مزيج آيس كريم كوكيز | `/ar/products/ice-cream-mix/ice-cream-mix-cookies` | done |
| 57 | https://alraifood.com/product/مزيج-آيس-كريم-مستكا/ | مزيج آيس كريم مستكا | `/ar/products/ice-cream-mix/ice-cream-mix-mastic` | done |
| 58 | https://alraifood.com/product/معجون-طماطم/ | معجون طماطم | `/ar/products/tomato-paste/tomato-paste` | done |
| 59 | https://alraifood.com/product/نكتار-الأناناس-200-مل/ | نكتار الأناناس 200 مل | `/ar/products/nectar/pineapple-nectar-200ml` | done |
| 60 | https://alraifood.com/product/نكتار-البرتقال-200-مل/ | نكتار البرتقال 200 مل | `/ar/products/nectar/orange-nectar-200ml` | done |
| 61 | https://alraifood.com/product/نكتار-التفاح-200-مل/ | نكتار التفاح 200 مل | `/ar/products/nectar/apple-nectar-200ml` | done |
| 62 | https://alraifood.com/product/نكتار-الكوكتيل-200-مل/ | نكتار الكوكتيل 200 مل | `/ar/products/nectar/cocktail-nectar-200ml` | done |
| 63 | https://alraifood.com/product/نكتار-المانجو-200-مل/ | نكتار المانجو 200 مل | `/ar/products/nectar/mango-nectar-200ml` | done |
| 64 | https://alraifood.com/product/هريس-الطماطم/ | هريس الطماطم | `/ar/products/tomato-paste/tomato-puree` | done |
| 65 | https://alraifood.com/products-category/الألبان/ | الألبان | `/ar/products/dairy` | done |
| 66 | https://alraifood.com/products-category/البسكويت-الويفر/ |  | `/ar/products/wafer-biscuits` | done |
| 67 | https://alraifood.com/products-category/الحليب/ | الحليب | `/ar/products/milk` | done |
| 68 | https://alraifood.com/products-category/العصائر/ | العصائر | `/ar/products/juices` | done |
| 69 | https://alraifood.com/products-category/ايس-كريم-مثلج/ |  | `/ar/products/frozen-ice-cream` | done |
| 70 | https://alraifood.com/products-category/باريستا-كافيه/ | باريستا كافيه | `/ar/products/barista-cafe` | done |
| 71 | https://alraifood.com/products-category/بسكويت-الويفر/ |  | `/ar/products/wafer-biscuits` | done |
| 72 | https://alraifood.com/products-category/حمص/ | حمص | `/ar/products/hummus` | done |
| 73 | https://alraifood.com/products-category/شراب/ |  | `/ar/products/drink` | done |
| 74 | https://alraifood.com/products-category/عصير/ |  | `/ar/products/juice` | done |
| 75 | https://alraifood.com/products-category/كريمات-والقشطة/ | كريمات والقشطة | `/ar/products/creams` | done |
| 76 | https://alraifood.com/products-category/مزيج-الايس-كريم/ | مزيج الايس كريم | `/ar/products/ice-cream-mix` | done |
| 77 | https://alraifood.com/products-category/معجون-الطماطم/ | معجون الطماطم | `/ar/products/tomato-paste` | done |
| 78 | https://alraifood.com/products-category/منتجات-أخرى/ | منتجات أخرى | `/ar/products/other-products` | done |
| 79 | https://alraifood.com/products-category/نكتار/ | نكتار | `/ar/products/nectar` | done |
| 80 | https://alraifood.com/recipe/بسكويت-الشوفان/ | بسكويت الشوفان | `/ar/recipes/oatmeal-cookies` | done |
| 81 | https://alraifood.com/recipe/شوربة-العدس-بالكريمة/ | شوربة العدس بالكريمة | `/ar/recipes/lentil-soup-with-cream` | done |
| 82 | https://alraifood.com/recipe/كيك-الزبادي-بالتفاح/ | كيك الزبادي بالتفاح | `/ar/recipes/yogurt-apple-cake` | done |
| 83 | https://alraifood.com/test/ |  | `—` | not migrated (WordPress test post) |
| 84 | https://alraifood.com/اتصل-بنا/ | اتصل بنا | `/ar/contact` | done |
| 85 | https://alraifood.com/التصدير/ | التصدير | `/ar/export` | done |
| 86 | https://alraifood.com/العلامات-التجارية/ | العلامات التجارية | `/ar/brands` | done |
| 87 | https://alraifood.com/الموزعين-خارج-المملكة/ | الموزعين خارج المملكة | `/ar/distributors` | done |
| 88 | https://alraifood.com/انضم-إلينا/ | انضم إلينا | `/ar/careers` | done |
| 89 | https://alraifood.com/فروعنا/ | فروعنا | `/ar/branches` | done |
| 90 | https://alraifood.com/من-نحن/ | من نحن | `/ar/about` | done |
| 91 | https://alraifood.com/en/ | الري للصناعات الغذائية | `/en` | done |
| 92 | https://alraifood.com/en/about-us/ | about us | `/en/about` | done |
| 93 | https://alraifood.com/en/branches/ | Branches | `/en/branches` | done |
| 94 | https://alraifood.com/en/brands/ | Brands | `/en/brands` | done |
| 95 | https://alraifood.com/en/contact-us/ | Contact us | `/en/contact` | done |
| 96 | https://alraifood.com/en/distributors/ | Distributors | `/en/distributors` | done |
| 97 | https://alraifood.com/en/export/ | Export | `/en/export` | done |
| 98 | https://alraifood.com/en/join-us/ | Join us | `/en/careers` | done |
| 99 | https://alraifood.com/en/product/ | Products | `/en/products` | done |
| 100 | https://alraifood.com/en/product/milk-125-ml/ | Milk 125 ml | `/en/products/milk/full-fat-milk-125ml` | done (EN product data on live site incomplete; see content-inventory) |
| 101 | https://alraifood.com/en/product/milk-200-ml/ | milk 200 ml | `/en/products/milk/full-fat-milk-200ml` | done (EN product data on live site incomplete; see content-inventory) |
| 102 | https://alraifood.com/en/product/tomato-paste/ | Tomato Paste | `/en/products/tomato-paste/tomato-paste` | done (EN product data on live site incomplete; see content-inventory) |
| 103 | https://alraifood.com/en/product/whole-milk-1-liter-3/ | milk 200 ml | `/en/products/milk/full-fat-milk-200ml` | done (EN product data on live site incomplete; see content-inventory) |
| 104 | https://alraifood.com/en/product/لبن-180-مل-2/ | لبن 180 مل | `/en/products/dairy/laban-180ml` | done (EN product data on live site incomplete; see content-inventory) |
| 105 | https://alraifood.com/en/product/لبن-180-مل/ | لبن 180 مل | `/en/products/dairy/laban-180ml` | done (EN product data on live site incomplete; see content-inventory) |
| 106 | https://alraifood.com/en/products-category/barista-cafe/ | barista cafe | `/en/products/barista-cafe` | done |
| 107 | https://alraifood.com/en/products-category/creams/ | Creams | `/en/products/creams` | done |
| 108 | https://alraifood.com/en/products-category/dairy/ | dairy | `/en/products/dairy` | done |
| 109 | https://alraifood.com/en/products-category/drink/ | Drink | `/en/products/drink` | done |
| 110 | https://alraifood.com/en/products-category/frozen-ice-cream/ | frozen ice cream | `/en/products/frozen-ice-cream` | done |
| 111 | https://alraifood.com/en/products-category/hummus/ | hummus | `/en/products/hummus` | done |
| 112 | https://alraifood.com/en/products-category/ice-cream/ | Ice cream mix | `/en/products/ice-cream-mix` | done |
| 113 | https://alraifood.com/en/products-category/juices/ | Juices | `/en/products/juices` | done |
| 114 | https://alraifood.com/en/products-category/milk/ | Milk | `/en/products/milk` | done |
| 115 | https://alraifood.com/en/products-category/name/ |  | `—` | not migrated (junk EN term "name", no products) |
| 116 | https://alraifood.com/en/products-category/other-products/ | Other products | `/en/products/other-products` | done |
| 117 | https://alraifood.com/en/products-category/tomato-paste/ | tomato paste | `/en/products/tomato-paste` | done |
| 118 | https://alraifood.com/en/recipe/oatmeal-cookies-2/ | Oatmeal cookies | `/en/recipes/oatmeal-cookies` | done (duplicate of oatmeal-cookies on live EN site; merged) |
| 119 | https://alraifood.com/en/recipe/oatmeal-cookies-3/ | Oatmeal cookies | `/en/recipes/oatmeal-cookies` | done (duplicate of oatmeal-cookies on live EN site; merged) |
| 120 | https://alraifood.com/en/recipe/oatmeal-cookies-4/ | Oatmeal cookies | `/en/recipes/oatmeal-cookies` | done (duplicate of oatmeal-cookies on live EN site; merged) |
| 121 | https://alraifood.com/en/recipe/oatmeal-cookies/ | Oatmeal cookies | `/en/recipes/oatmeal-cookies` | done |
