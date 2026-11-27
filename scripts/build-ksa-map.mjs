/**
 * Build-time generator for the branch-locator map geometry.
 *
 *   node scripts/build-ksa-map.mjs
 *
 * Sources (vendored in scripts/data/, see docs/branch-locator-data.md):
 * - Governorates (ADM2): geoBoundaries gbOpen SAU-ADM2-3984122 (OpenStreetMap-derived,
 *   CC BY-SA 2.0, data © OpenStreetMap contributors). 147 units.
 * - Dammam governorate is the one unit missing from that release (a hole in the Eastern
 *   Region); it comes from OpenStreetMap relation 12399708 "محافظة الدمام" (ODbL), read via
 *   Nominatim on 2026-11-23.
 * - Regions (ADM1): geoBoundaries SAU-ADM1 (simplified), used ONLY to group governorates by
 *   region so region borders can be drawn heavier than governorate borders.
 * - Neighbouring land (context only): Natural Earth countries-50m via world-atlas (public domain).
 *
 * Pipeline: GeoJSON -> TopoJSON (shared arcs) -> topology-preserving simplification -> d3-geo
 * geoMercator fitted to Saudi Arabia -> SVG path strings. Because neighbouring governorates
 * share arcs, simplification never opens gaps or overlaps between them.
 *
 * To swap in better GIS data later: replace the files in scripts/data/ and update BRANCH_UNITS
 * (branch id -> feature) below; the component reads only the generated module.
 * Output: src/content/ksa-map.generated.ts (do not edit by hand).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { geoArea, geoBounds, geoCentroid, geoContains, geoGraticule, geoMercator, geoPath } from "d3-geo";
import { feature, merge, mesh } from "topojson-client";
import { topology } from "topojson-server";
import { presimplify, quantile, simplify } from "topojson-simplify";

const require = createRequire(import.meta.url);
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(p, "utf8"));

// d3-geo is spherical: exterior rings must be clockwise. GeoJSON (RFC 7946) is the opposite,
// so any feature whose area comes out larger than a hemisphere is reversed.
function wind(f) {
  if (geoArea(f) <= 2 * Math.PI) return f;
  const rev = (poly) => poly.map((ring) => [...ring].reverse());
  const g = f.geometry;
  g.coordinates = g.type === "Polygon" ? rev(g.coordinates) : g.coordinates.map(rev);
  return f;
}

/** Branch id -> how to find its boundary. `name` is the geoBoundaries shapeName. */
const BRANCH_UNITS = {
  "al-ahsa": { name: "Al Ahsa Governorate" },
  riyadh: { name: "Riyadh" },
  dammam: { osm: "scripts/data/osm-relation-12399708-dammam.geojson" },
  jeddah: { name: "Jiddah" },
  madinah: { name: "Al Madinah Al Munawwarah" },
  makkah: { name: "Makkah Al Mukarramah" },
  "hafar-al-batin": { name: "Hafar Al Batin Governorate" },
  "khamis-mushait": { name: "Khamis Mushayt" },
  tabuk: { name: "Tabuk" },
};

const adm2 = json(here("./data/geoBoundaries-SAU-ADM2.geojson")).features.map(wind);
const adm1 = json(here("./data/geoBoundaries-SAU-ADM1_simplified.geojson")).features.map(wind);
const govs = adm2.map((f) => ({ type: "Feature", id: f.properties.shapeID, properties: { name: f.properties.shapeName }, geometry: f.geometry }));

for (const [id, u] of Object.entries(BRANCH_UNITS)) {
  if (u.osm) {
    const f = wind(json(here(`../${u.osm}`)).features[0]);
    govs.push({ type: "Feature", id: `osm-${id}`, properties: { name: f.properties.name, branch: id, source: "osm" }, geometry: f.geometry });
  } else {
    const g = govs.find((x) => x.properties.name === u.name);
    if (!g) throw new Error(`governorate "${u.name}" not found`);
    g.properties.branch = id;
  }
}

// Region (ADM1) of each governorate, by a representative point.
for (const g of govs) {
  const c = geoCentroid(g);
  let r = adm1.find((a) => geoContains(a, c));
  if (!r) r = adm1.find((a) => geoContains(a, g.geometry.type === "Polygon" ? g.geometry.coordinates[0][0] : g.geometry.coordinates[0][0][0]));
  g.properties.region = r ? r.properties.shapeName : "?";
}

// TopoJSON + topology-preserving simplification.
let topo = topology({ gov: { type: "FeatureCollection", features: govs } }, 1e6);
topo = presimplify(topo);
topo = simplify(topo, quantile(topo, +(process.env.Q ?? 0.04)));
const geoms = topo.objects.gov.geometries;
const country = merge(topo, geoms);

const W = 1000;
const PAD = 36;
const proj = geoMercator().fitWidth(W - 2 * PAD, country);
const [[x0, y0], [, y1]] = geoPath(proj).bounds(country);
const H = Math.ceil(y1 - y0 + 2 * PAD);
proj.translate([proj.translate()[0] + PAD - x0, proj.translate()[1] + PAD - y0]);
proj.clipExtent([[-20, -20], [W + 20, H + 20]]);
const path = geoPath(proj).digits(1);

const region = (g) => g.properties.region;
const govLines = path(mesh(topo, topo.objects.gov, (a, b) => a !== b && region(a) === region(b)));
const regionLines = path(mesh(topo, topo.objects.gov, (a, b) => a !== b && region(a) !== region(b)));
const ksa = path(country);

const regions = Object.keys(BRANCH_UNITS).map((id) => {
  const g = geoms.find((x) => x.properties.branch === id);
  const f = feature(topo, g);
  const [[bx0, by0], [bx1, by1]] = geoPath(proj).bounds(f);
  const [[lo0, la0], [lo1, la1]] = geoBounds(f);
  return {
    id,
    d: path(f),
    bbox: [bx0, by0, bx1 - bx0, by1 - by0].map((v) => +v.toFixed(1)),
    source: g.properties.source === "osm"
      ? "OpenStreetMap relation 12399708 (محافظة الدمام), ODbL"
      : `geoBoundaries SAU-ADM2-3984122 "${g.properties.name}" (OpenStreetMap, CC BY-SA 2.0)`,
    lonLatBounds: [lo0, la0, lo1, la1].map((v) => +v.toFixed(3)),
  };
});

const hi = json(require.resolve("world-atlas/countries-50m.json"));
const neighbours = feature(hi, hi.objects.countries).features
  .filter((f) => f.id !== "682")
  .map((f) => path(f))
  .filter((d) => d && d.length > 0)
  .join("");
const graticule = path(geoGraticule().step([2, 2])());

const out = `/* AUTO-GENERATED by scripts/build-ksa-map.mjs. Do not edit by hand.
 * Boundaries: geoBoundaries SAU-ADM2-3984122 (OpenStreetMap-derived, CC BY-SA 2.0) plus
 * OpenStreetMap relation 12399708 for Dammam (ODbL). Data © OpenStreetMap contributors.
 * Neighbouring land: Natural Earth (public domain) via world-atlas.
 * Topology-preserving simplification (topojson-simplify); projection d3-geo geoMercator. */

export const KSA_VIEWBOX = { w: ${W}, h: ${H} } as const;

/** d3 geoMercator parameters used to draw the paths (translate in viewBox units). */
export const KSA_PROJECTION = { scale: ${proj.scale()}, translate: [${proj.translate()[0]}, ${proj.translate()[1]}] as const } as const;

/** Same maths as d3 geoMercator (no rotation, no centre): [lon, lat] -> viewBox [x, y]. */
export function projectKsa(lon: number, lat: number): [number, number] {
  const r = Math.PI / 180;
  const { scale: k, translate: [tx, ty] } = KSA_PROJECTION;
  return [k * lon * r + tx, ty - k * Math.log(Math.tan(Math.PI / 4 + (lat * r) / 2))];
}

/** Country outline (union of all governorates). */
export const KSA_PATH = ${JSON.stringify(ksa)};
/** Borders between governorates of the same region. */
export const GOVERNORATE_LINES_PATH = ${JSON.stringify(govLines)};
/** Borders between the 13 administrative regions. */
export const REGION_LINES_PATH = ${JSON.stringify(regionLines)};
export const NEIGHBOURS_PATH = ${JSON.stringify(neighbours)};
export const GRATICULE_PATH = ${JSON.stringify(graticule)};

export type BranchRegion = {
  /** Branch id in src/content/network.ts */
  id: string;
  /** Administrative boundary of the branch city's governorate, as an SVG path. */
  d: string;
  /** [x, y, w, h] in viewBox units. */
  bbox: readonly [number, number, number, number];
  source: string;
  lonLatBounds: readonly [number, number, number, number];
};

export const BRANCH_REGIONS: readonly BranchRegion[] = ${JSON.stringify(regions, null, 1)};
`;
const target = here("../src/content/ksa-map.generated.ts");
writeFileSync(target, out);
console.log(`wrote viewBox ${W}x${H}, ${(out.length / 1024).toFixed(1)} KB; ksa ${ksa.length}, govLines ${govLines.length}, regionLines ${regionLines.length}, neighbours ${neighbours.length}`);
for (const r of regions) console.log(r.id, r.bbox.join(" "), r.d.length);
const unassigned = govs.filter((g) => g.properties.region === "?").map((g) => g.properties.name);
if (unassigned.length) console.log("no region for:", unassigned.join(", "));
