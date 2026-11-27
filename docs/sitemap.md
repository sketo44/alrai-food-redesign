# Sitemaps

## 1. Original site (alraifood.com, audited 2026-11-22)

WordPress theme "alrai" with WPML (AR default at `/`, EN at `/en/`), Gravity Forms, Breadcrumb NavXT. Menu structure as rendered in the header:

```
الرئيسية (Home)                     /                 · /en/
عن الشركة (About the company)
├─ من نحن (About us)                /من-نحن/           · /en/about-us/
└─ فروعنا (Branches)                /فروعنا/            · /en/branches/
المنتجات (Products)                 /product/          · /en/product/
├─ الألبان (Dairy)                  /products-category/الألبان/        (3 products)
├─ الحليب (Milk)                    /products-category/الحليب/         (3)
├─ العصائر (Juices)                 /products-category/العصائر/        (5 via sub-categories)
│  ├─ عصير (Juice)                  (0)
│  ├─ نكتار (Nectar)                (5)
│  └─ شراب (Drink)                  (0)
├─ كريمات والقشطة (Creams)          (9)
├─ باريستا كافيه (Barista Café)     (6)
├─ معجون الطماطم (Tomato paste)      (2)
├─ حمص (Hummus)                     (1)
├─ مزيج الايس كريم (Ice-cream mix)   (25)
├─ ايس كريم مثلج (Frozen ice cream)  (0)
├─ البسكويت الويفر (Wafer biscuits)  (0; duplicate term بسكويت الويفر also 0)
└─ منتجات أخرى (Other products)     (1)
    └─ product pages               /product/<arabic-slug>/  (59 published; 55 categorised + 4 legacy/test)
التصدير (Export request form)        /التصدير/          · /en/export/
الموزعين خارج المملكة (Distributors)  /الموزعين-خارج-المملكة/ · /en/distributors/
العلامات التجارية (Brands)           /العلامات-التجارية/ · /en/brands/
انضم إلينا (Join us, job form)        /انضم-إلينا/        · /en/join-us/
اتصل بنا (Contact form)               /اتصل-بنا/          · /en/contact-us/
(not in menu) الوصفات (Recipes)      /recipe/<slug>/    (3 AR; EN: 4 copies of "Oatmeal cookies")
(not in menu) greeting cards         /greeting-cards/646/, /653/ (empty)
(not in menu) test post              /test/
```

EN mirror: menus exist but most EN product categories are empty ("There are no products."); only 6 EN product entries exist, several with Arabic data.

## 2. New site (this redesign)

Next.js App Router, locale prefix on every route, identical slugs in both languages.

```
/                       → 302 to /ar
/{ar|en}                Home
/{ar|en}/about          About us (story, numbers, vision/mission, features, 1968–1990 timeline)
/{ar|en}/branches       Branches across the Kingdom (9 cities, call links)
/{ar|en}/brands         Brands (6 logos)
/{ar|en}/products       All products: category tiles + searchable, filterable catalogue (55)
/{ar|en}/products/<category>            9 categories with products + juice/drink/frozen-ice-cream/wafer-biscuits (honest empty state)
/{ar|en}/products/<category>/<product>  55 product pages (packshot, size, description, ingredients, nutrition)
/{ar|en}/recipes        Recipes index
/{ar|en}/recipes/<slug> 3 recipe pages
/{ar|en}/export         Export request (form, no backend)
/{ar|en}/distributors   14 distributors in 9 countries
/{ar|en}/careers        Join us (job application form, no backend)
/{ar|en}/contact        Contact details + contact form (no backend)
/sitemap.xml  /robots.txt  /icon.png  /apple-icon.png
(any unknown URL)       bilingual 404
```

Route count: 82 paths × 2 locales = 164 prerendered pages (all listed in /sitemap.xml with hreflang alternates).

Primary navigation: About (About us · Branches · Brands) · Products (mega menu of the 10 categories with products) · Recipes · Export (Export request · Distributors) · Join us · [Contact us button] · language switch (keeps the current page).
