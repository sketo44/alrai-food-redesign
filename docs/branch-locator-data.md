# Branch locator: geometry and coordinate sources

Component: `src/components/BranchLocator.tsx` (home "فروعنا حول المملكة" section and `/[locale]/branches`).

## Map geometry (boundary regions)

The map's interactive targets are **administrative boundaries**, not pins. Each branch city is drawn as its governorate's real boundary polygon. City points stay on the map only as small secondary markers and labels.

| Layer | Source | Licence |
|---|---|---|
| 147 governorates (ADM2): Saudi outline, governorate borders, 8 of the 9 branch regions | geoBoundaries gbOpen `SAU-ADM2-3984122` (OpenStreetMap-derived, build Dec 2023). Vendored: `scripts/data/geoBoundaries-SAU-ADM2.geojson` + `.meta.json` | CC BY-SA 2.0; data © OpenStreetMap contributors |
| Dammam governorate | OpenStreetMap relation 12399708 "محافظة الدمام", fetched via Nominatim 2026-11-23. Vendored: `scripts/data/osm-relation-12399708-dammam.geojson`. That geoBoundaries release has no polygon for Dammam; it is a hole in the Eastern Region. With Dammam added, total area matches the 13 regions to within 0.02%. | ODbL; © OpenStreetMap contributors |
| 13 regions (ADM1) | geoBoundaries `SAU-ADM1`, simplified. Used only to group governorates by region, so region borders can be drawn heavier. | ODbL |
| Neighbouring land (context) | Natural Earth admin-0, 1:50m, via `world-atlas` | Public domain |

**Pipeline** (`node scripts/build-ksa-map.mjs` → `src/content/ksa-map.generated.ts`, ~170 KB):

1. GeoJSON → TopoJSON (`topojson-server`), so neighbouring governorates share arcs.
2. Topology-preserving simplification (`topojson-simplify`, keeps 4% of vertices), so no gaps or overlaps open between neighbours.
3. Mercator projection (`d3-geo`), with path strings written out.

The browser receives only the path strings: the country outline, governorate borders, region borders and the 9 `BRANCH_REGIONS`, each with its own bbox and source. The build tools are devDependencies only.

**Branch → boundary mapping**:

| Branch | Boundary used |
|---|---|
| Al-Ahsa | Al Ahsa Governorate |
| Riyadh | Riyadh |
| Dammam | OSM 12399708 |
| Jeddah | Jiddah |
| Medina | Al Madinah Al Munawwarah |
| Mecca | Makkah Al Mukarramah |
| Hafar Al-Batin | Hafar Al Batin Governorate |
| Khamis Mushayt | Khamis Mushayt |
| Tabuk | Tabuk |

QA confirms that each city point (below) falls inside its own boundary and inside no other.

**To upgrade the data later**:
1. Replace the files in `scripts/data/`.
2. Adjust `BRANCH_UNITS` in the script.
3. Re-run the script.

The component reads `BRANCH_REGIONS` by branch id and needs no change.

**Caveats**:
- These are OpenStreetMap-derived boundaries, not an official survey.
- For Riyadh, Makkah, Madinah and Tabuk the unit is the city's own administrative area.
- Jeddah, Makkah and Dammam are small at national scale. The details panel adds a zoomed inset of the selected boundary.
- The map shows an attribution line under the legend.

## Branch data and coordinates

Branch facts (city + phone) come only from the live branches pages, `https://alraifood.com/فروعنا/` and `https://alraifood.com/en/branches/`, read 2026-11-22 and re-checked 2026-11-23. Neither page publishes an address, opening hours, a map link or coordinates. The only Google Maps embed on the site (contact page) points to the company itself (AlRai Food Industries, Al-Ahsa). It is not tied to any branch, so it was **not** used as a branch location.

So **no branch has a verified exact location**. The shaded area is the city's administrative boundary, and the dot is the city's reference point from a public dataset. The data (`precision: "city"`) and the UI ("City location" tooltip, plus a note in the panel) both say that the pin marks the city, not the branch address.

| # | City (AR / EN) | Phone (live site) | Lat, Lon | Coordinate source | Status |
|---|---|---|---|---|---|
| 1 | الأحساء / Al-Ahsa | 0538640124 | 25.348749, 49.585593 | Natural Earth 10m populated places, "Hofuf / Al Hufuf" (ne_id 1159146455): the principal city of Al-Ahsa governorate | Approximate (city) |
| 2 | الرياض / Riyadh | 0531639424 | 24.642779, 46.770796 | Natural Earth, "Riyadh" (ne_id 1159151581) | Approximate (city) |
| 3 | الدمام / Dammam | 0533733340 | 26.430138, 50.097725 | Natural Earth, "Dammam" (ne_id 1159136389) | Approximate (city) |
| 4 | جدة / Jeddah | 0534692924 | 21.518835, 39.217252 | Natural Earth, "Jeddah" (ne_id 1159151277) | Approximate (city) |
| 5 | المدينة المنورة / Medina | 0536695924 | 24.501935, 39.578057 | Natural Earth, "Medina" (ne_id 1159149443) | Approximate (city) |
| 6 | مكة / Mecca | 0534692924 | 21.431967, 39.818094 | Natural Earth, "Makkah" (ne_id 1159151279) | Approximate (city) |
| 7 | حفر الباطن / Hafar Al-Batin | 0530165924 | 28.433651, 45.960078 | Natural Earth, "Hafar al Batin" (ne_id 1159136393) | Approximate (city) |
| 8 | خميس مشيط / Khamis Mushayt | 0533016224 | 18.3, 42.733333 | Wikidata Q759381 "Khamis Mushait", P625 (CC0). This city is not in Natural Earth. | Approximate (city) |
| 9 | تبوك / Tabuk | 0581783902 | 28.383835, 36.554967 | Natural Earth, "Tabuk" (ne_id 1159149445) | Approximate (city) |

Natural Earth values are the `latitude`/`longitude` attributes of `ne_10m_populated_places_simple.geojson` (nvkelso/natural-earth-vector, master), read 2026-11-23. No branch is unverified, but the data type supports `pin: null`, which lists a branch without a pin and labels it "Location unverified".

**Google Maps button**: `https://www.google.com/maps/search/?api=1&query=<city>, Saudi Arabia` (the Arabic city name on `/ar`). The button runs a search for the verified city and never links to a guessed pin. Its accessible name says it is a city search.

**Counter**: the site's "20+ branches" counter does not match the 9 branches it lists. The locator shows "9 branches listed on the site" and adds no branches of its own.
