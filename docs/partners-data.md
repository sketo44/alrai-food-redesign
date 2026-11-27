# Partner strip — data sources

Homepage section «منتجاتنا عند شركائنا» (`src/components/PartnersMarquee.tsx`).
Data: `retailPartners` and `distributors` in `src/content/network.ts`.

## Rule
A retail chain is listed only when there is published evidence that it sells AlRai products.
Each logo is the chain's own file from its official website, unedited.

## Retail chains inside the Kingdom — research, 2026-11-23

| Chain | Result | Evidence |
|---|---|---|
| Tamimi Markets | **Listed** | Search "Al Rai" on tamimimarkets.com: 16 products, brand "Al Rai", country Saudi Arabia. Products: cooking creams, béchamel, steak and Alfredo sauces, breakfast cream, whipping cream, Barista iced coffees (Latte, Mocha, Vanilla, Hazelnut & Vanilla, Caramel, Pistachio). Logo: `https://www.tamimimarkets.com/assets/icons/logo.png` → `public/assets/partners/tamimi-markets.png` (475×134 PNG). |
| Carrefour KSA | Not found | carrefourksa.com search "الري" and "alrai": no AlRai products (only "الريان" tuna). |
| Panda | Not found online | panda.sa search "الري" and "Al Rai": 31 unrelated results, none AlRai. Physical stores may still stock it; not verifiable. |
| Lulu | Could not check | The site redirects search pages to its home page. |
| Othaim | Could not check | Site search covers news, not products. |
| Danube | Could not check | Product search needs a delivery city first. |

**To add a chain:**
1. Confirm it sells AlRai, either from its own store page or from the company's records.
2. Save the chain's official logo in `public/assets/partners/`.
3. Add an entry to `retailPartners` with its source.

The strip picks it up automatically.

## Distributors outside the Kingdom
The 14 distributors come verbatim from the live site's distributors page. No logos are published for them,
so their cards show the registered name and country. When a distributor's logo is supplied, add a
`logo` to that entry and the card can show it the same way as the retail cards.

## Trademark note
Retailer logos are their owners' trademarks. Showing them as "where our products are sold" is common
practice, but it is worth confirming with each partner before going live.
