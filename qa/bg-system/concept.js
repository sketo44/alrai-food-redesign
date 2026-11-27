/* STAGE ONE CONCEPT ONLY — injected into the running page by qa/bg-system/render-concept.mjs at
 * screenshot time. It does not touch the project source. It reads the real rendered section
 * positions, hides the three current per-section background images, makes section fills
 * transparent and paints ONE continuous canvas behind the whole page. */
(function concept() {
  const W = document.documentElement.clientWidth;
  const mobile = W < 768;
  const docH = document.documentElement.scrollHeight;
  const rtl = document.documentElement.dir === "rtl";
  const q = (s) => document.querySelector(s);
  const box = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, h: r.height, mid: r.top + scrollY + r.height / 2 }; };
  const S = {
    hero: box(q("section[aria-labelledby=hero-title]")),
    stats: box(q("main section:nth-of-type(2)")),
    who: box(q("section[aria-labelledby=who]")),
    products: box(q("section[aria-labelledby=products]")),
    campaigns: box(q("section[aria-labelledby=campaigns]")),
    journey: box(q("section[aria-labelledby=journey]")),
    recipes: box(q("section[aria-labelledby=recipes]")),
    brands: box(q("section.brand-showcase")),
    branches: box(q("section[aria-labelledby=branches-title]")),
    footer: box(q("footer")),
  };
  const wrapL = q("main .wrap").getBoundingClientRect().left;
  const gut = Math.max(10, wrapL / 2); // centre of the side gutter
  const xS = rtl ? W - gut : gut; // "start" gutter (right in Arabic)
  const xE = rtl ? gut : W - gut;

  /* 1 ─ strip the current per-section backgrounds (concept only) */
  const css = document.createElement("style");
  css.textContent = `
    html{background:#faf7f0} body{background:transparent!important}
    img[src*="hero-bg.webp"],img[src*="about-bg.webp"],img[src*="journey-bg.webp"]{display:none!important}
    main section{background-color:transparent!important}
    main section:nth-of-type(2){background:rgb(255 255 255 / .38)!important;backdrop-filter:blur(2px)}
    .brand-showcase>div[aria-hidden]>div:first-child{-webkit-mask:linear-gradient(transparent,#000 22%,#000 70%,transparent);mask:linear-gradient(transparent,#000 22%,#000 70%,transparent);opacity:.85}
    .brand-showcase>div[aria-hidden]>svg{-webkit-mask:linear-gradient(#000 30%,transparent 96%);mask:linear-gradient(#000 30%,transparent 96%);opacity:.75}
    #bgc{position:absolute;inset:0 0 auto 0;height:${docH}px;z-index:-1;pointer-events:none;overflow:hidden}
    #bgc>*{position:absolute;left:0;width:100%}
  `;
  document.head.appendChild(css);

  const c = document.createElement("div");
  c.id = "bgc";
  c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  const layer = (top, h, style) => { const d = document.createElement("div"); d.style.cssText = `top:${top}px;height:${h}px;${style}`; c.appendChild(d); return d; };

  /* 2 ─ tonal foundation: one vertical gradient, stops pinned to real section positions */
  const stops = [
    [0, "#faf7f0"], [S.hero.bottom - 120, "#faf7f0"],
    [S.who.mid, "#f6f1e6"],                                   // warmer, corporate
    [S.products.top + 220, "#fcfbf7"], [S.products.bottom - 220, "#fcfbf7"], // calmest, near-white
    [S.journey.top + 80, "#f3f4f4"], [S.journey.bottom - 120, "#f2f3f5"],    // cool hint: progress
    [S.recipes.top + 140, "#f2e9d9"], [S.recipes.bottom - 160, "#f2e9d9"],   // warm editorial sand
    [S.brands.top + 260, "#f7f5f0"],
    [S.branches.top + 120, "#faf7f0"], [S.footer.top - 260, "#faf7f0"],
    [S.footer.top, "#efe9dd"],
  ];
  layer(0, docH, `background:linear-gradient(to bottom,${stops.map(([y, col]) => `${col} ${Math.round(y)}px`).join(",")})`);

  /* 3 ─ atmospheric light (radial glows, no hard edges) */
  const glow = (cx, cy, rx, ry, col) => layer(0, docH, `background:radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px,${col},transparent)`);
  glow(rtl ? W * 0.28 : W * 0.72, S.hero.top + S.hero.h * 0.42, W * 0.42, S.hero.h * 0.55, "rgb(215 238 250 / .55)");
  glow(rtl ? W * 0.8 : W * 0.2, S.products.top + 260, W * 0.5, 420, "rgb(255 255 255 / .9)");
  glow(W * 0.5, S.brands.top + S.brands.h * 0.45, W * 0.55, S.brands.h * 0.5, "rgb(255 255 255 / .75)");

  /* 4 ─ client-supplied raster art, used ONCE each, feathered so no rectangle edge shows */
  const art = (src, top, h, pos, size, mask, extra = "") => layer(top, h,
    `background:url(${src}) ${pos}/${size} no-repeat;-webkit-mask:${mask};mask:${mask};${extra}`);
  if (!mobile) {
    // Hero: the full illustration, fading out across the stats band (no seam at hero bottom)
    art("/hero-bg.webp", S.hero.top, S.hero.h + 170, "center bottom 170px", "cover",
      "linear-gradient(#000 72%,transparent)", rtl ? "" : "transform:scaleX(-1)");
    // About: the faint storage-tank silhouette rises from behind the real photos (tops visible
    // in the section's top padding and the outer gutter). Positions are written for the
    // unflipped layer; the flip for English is applied after the mask, so they stay valid.
    art("/about-bg.webp", S.who.top - 30, 760, "right top", "auto 760px",
      "radial-gradient(ellipse 30% 62% at 90% 30%,#000 35%,transparent)", `opacity:.8;${rtl ? "" : "transform:scaleX(-1)"}`);
    // Journey: the production-line vignette under the title column (away from paragraphs).
    // Drawn at the left of the layer, then flipped in Arabic so it lands under the title.
    art("/journey-bg.webp", S.journey.top + S.journey.h * 0.25, S.journey.h * 0.75, "left top", `auto ${S.journey.h * 0.95}px`,
      "radial-gradient(ellipse 24% 46% at 14% 38%,#000 25%,transparent)", `opacity:.7;${rtl ? "transform:scaleX(-1)" : ""}`);
  } else {
    // Mobile: hero art re-framed on the splash + leaves corner, lighter, ends before the stats
    // starts below the buttons: only the product composition sits over the art, never text
    const heroArtTop = q("section[aria-labelledby=hero-title] .btn").getBoundingClientRect().bottom + scrollY + 30;
    art("/hero-bg.webp", heroArtTop, S.hero.bottom - heroArtTop + 90, "left bottom 90px", `auto ${(S.hero.bottom - heroArtTop) * 1.05}px`,
      "linear-gradient(transparent,#000 22%,#000 80%,transparent)", `opacity:.9;${rtl ? "" : "transform:scaleX(-1)"}`);
    // Journey: production line as a faint band beside the heading (outer edge only)
    art("/journey-bg.webp", S.journey.top - 20, 420, "left top", "auto 380px",
      "radial-gradient(ellipse 34% 40% at 8% 42%,#000 15%,transparent)", `opacity:.3;${rtl ? "transform:scaleX(-1)" : ""}`);
  }

  /* 5 ─ recipes: subtle paper grain, feathered top and bottom */
  const noise = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .42 0 0 0 0 .3 0 0 0 0 .18 0 0 0 .55 0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>')}")`;
  layer(S.recipes.top - 120, S.recipes.h + 240, `background:${noise};opacity:.16;-webkit-mask:linear-gradient(transparent,#000 20%,#000 80%,transparent);mask:linear-gradient(transparent,#000 20%,#000 80%,transparent)`);

  /* 6 ─ the storytelling thread: ONE vector line that weaves down the page through the side
   *     gutters and the empty padding between sections. Each crossing has its own character. */
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${docH}`);
  svg.setAttribute("width", W); svg.setAttribute("height", docH);
  svg.style.cssText = "top:0;height:" + docH + "px";
  c.appendChild(svg);
  svg.innerHTML = `<defs>
    <linearGradient id="thread" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${docH}">
      <stop offset="0" stop-color="#43b7ea" stop-opacity="0"/>
      <stop offset="${(S.who.top / docH).toFixed(3)}" stop-color="#43b7ea" stop-opacity=".55"/>
      <stop offset="${(S.journey.bottom / docH).toFixed(3)}" stop-color="#00529b" stop-opacity=".45"/>
      <stop offset="${((S.brands.top + 200) / docH).toFixed(3)}" stop-color="#00529b" stop-opacity=".12"/>
      <stop offset="${((S.branches.bottom - 100) / docH).toFixed(3)}" stop-color="#00529b" stop-opacity=".04"/>
      <stop offset="${((S.footer.top - 60) / docH).toFixed(3)}" stop-color="#00529b" stop-opacity=".5"/>
    </linearGradient>
    <linearGradient id="silk" x1="0" x2="1"><stop offset="0" stop-color="#7fd0f2" stop-opacity="0"/><stop offset=".5" stop-color="#7fd0f2" stop-opacity=".22"/><stop offset="1" stop-color="#00529b" stop-opacity="0"/></linearGradient>
    <linearGradient id="fadeX" x1="0" x2="1"><stop offset="0" stop-color="#00529b" stop-opacity="0"/><stop offset=".35" stop-color="#00529b" stop-opacity=".22"/><stop offset="1" stop-color="#00529b" stop-opacity="0"/></linearGradient>
  </defs>`;
  const P = (d, attrs) => { const p = document.createElementNS(svgNS, "path"); p.setAttribute("d", d); for (const k in attrs) p.setAttribute(k, attrs[k]); svg.appendChild(p); return p; };
  const cross = (x0, y0, x1, y1) => { const k = (y1 - y0) * 0.55; return `C ${x0} ${y0 + k} ${x1} ${y1 - k} ${x1} ${y1}`; };

  // gaps = empty padding between neighbouring sections' content
  const gA = [S.who.bottom - 150, S.products.top + 110];           // about → products
  const gB = [S.products.bottom - 110, S.campaigns.top + 90];       // products → campaigns
  const gC = [S.journey.top + 10, S.journey.top + 150];             // campaigns → journey
  const gD = [S.journey.bottom - 130, S.recipes.top + 120];         // journey → recipes
  const gE = [S.recipes.bottom - 110, S.brands.top + 60];           // recipes → brands
  const gF = [S.branches.bottom - 60, S.footer.top - 300];         // map → export card

  // A crossing: the thread surfaces from the gutter, swings across the empty gap between two
  // sections and sinks into the opposite gutter. Its ends fade, so it reads as one line passing
  // behind the sections rather than a border drawn down the page.
  let gid = 0;
  const crossing = (g, from, to, op, w = "1.2", tail = 240) => {
    const id = "cg" + gid++, y0 = g[0] - tail, y1 = g[1] + tail;
    const lg = document.createElementNS(svgNS, "linearGradient");
    lg.setAttribute("id", id); lg.setAttribute("gradientUnits", "userSpaceOnUse");
    lg.setAttribute("x1", 0); lg.setAttribute("x2", 0); lg.setAttribute("y1", y0); lg.setAttribute("y2", y1);
    lg.innerHTML = `<stop offset="0" stop-color="#43b7ea" stop-opacity="0"/><stop offset=".35" stop-color="#2f8fd0" stop-opacity="${op}"/><stop offset=".65" stop-color="#00529b" stop-opacity="${op}"/><stop offset="1" stop-color="#00529b" stop-opacity="0"/>`;
    svg.querySelector("defs").appendChild(lg);
    P(`M ${from} ${y0} L ${from} ${g[0]} ${cross(from, g[0], to, g[1])} L ${to} ${y1}`, { fill: "none", stroke: `url(#${id})`, "stroke-width": w });
  };

  if (!mobile) {
    // a — the thread: one line, seen only where it crosses between sections, fading out near
    //     the interactive brand carousel and the map, returning to lead into the footer
    crossing(gA, xS, xE, 0.6);
    crossing(gB, xE, xS, 0.45);
    crossing(gD, xE, xS, 0.5);
    crossing(gE, xS, xE, 0.25, "1", 160);
    crossing([gF[0], S.footer.top - 70], xE, W * 0.5, 0.55, "1.2", 200);

    // About: three architectural arcs from the outer corner below the text (corporate, quiet)
    for (let i = 0; i < 3; i++) {
      const r = 360 + i * 90, cx = rtl ? -40 : W + 40, cy = S.who.bottom + 40;
      P(`M ${cx + (rtl ? r : -r)} ${cy} A ${r} ${r} 0 0 ${rtl ? 0 : 1} ${cx} ${cy - r}`,
        { fill: "none", stroke: "#0a2540", "stroke-opacity": (0.16 - i * 0.04).toFixed(3), "stroke-width": "1" });
    }
    // b — crossing A: a soft milk-blue silk ribbon (the only wide ribbon below the hero)
    const yA = (gA[0] + gA[1]) / 2;
    P(`M 0 ${yA + 70} C ${W * 0.3} ${yA - 60} ${W * 0.62} ${yA + 110} ${W} ${yA - 40} L ${W} ${yA + 10} C ${W * 0.62} ${yA + 150} ${W * 0.3} ${yA - 10} 0 ${yA + 120} Z`, { fill: "url(#silk)" });
    // c — crossing C: five fine parallel lines sweep in from the outer edge through the empty
    //     top padding and converge on the first timeline marker (1968): progress starts here.
    const jy = q("section[aria-labelledby=journey]");
    let first = null;
    for (const el of jy.querySelectorAll("p")) if (el.textContent.trim() === "1968") { first = el.getBoundingClientRect(); break; }
    const tx = first ? (rtl ? first.right + 52 : first.left - 52) : W * 0.6;   // the marker sits beside the year
    const ty = first ? first.top + scrollY - 2 : gC[1];
    for (let i = 0; i < 5; i++) {
      const o = (i - 2) * 11;
      P(`M ${rtl ? W + 10 : -10} ${S.campaigns.bottom - 70 + o * 2} C ${rtl ? W * 0.82 : W * 0.18} ${S.campaigns.bottom - 30 + o} ${rtl ? tx + 140 : tx - 140} ${ty - 30 + o * 0.4} ${tx} ${ty}`,
        { fill: "none", stroke: "#2f8fd0", "stroke-opacity": i === 2 ? ".45" : ".18", "stroke-width": i === 2 ? "1.3" : "0.8" });
    }
  } else {
    // Mobile: no gutter lines (gutters are 16px); the thread appears only as short crossings
    crossing(gA, W + 10, -10, 0.5, "1.1", 60);
    crossing(gD, -10, W + 10, 0.45, "1.1", 60);
    crossing([gF[0], S.footer.top - 50], W + 10, W * 0.5, 0.5, "1.1", 60);
    const yA = (gA[0] + gA[1]) / 2;
    P(`M 0 ${yA + 40} C ${W * 0.35} ${yA - 30} ${W * 0.65} ${yA + 60} ${W} ${yA - 20} L ${W} ${yA + 10} C ${W * 0.65} ${yA + 90} ${W * 0.35} ${yA} 0 ${yA + 70} Z`, { fill: "url(#silk)" });
  }

  // d — one botanical sprig where the thread enters Recipes (the only leaf motif below the hero)
  const sx = mobile ? (rtl ? 28 : W - 28) : xS, sy = mobile ? S.recipes.top + 60 : gD[1] - 10;
  const leaf = (a, l) => `<path d="M0 0 C ${l * 0.35} ${-l * 0.32} ${l * 0.8} ${-l * 0.26} ${l} 0 C ${l * 0.8} ${l * 0.26} ${l * 0.35} ${l * 0.32} 0 0Z" transform="rotate(${a})"/>`;
  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("transform", `translate(${sx} ${sy}) scale(${rtl ? -1 : 1} 1) rotate(-70)`);
  g.setAttribute("fill", "none"); g.setAttribute("stroke", "#2ebb68"); g.setAttribute("stroke-opacity", ".42"); g.setAttribute("stroke-width", "1");
  g.innerHTML = `<path d="M0 0 C 30 -6 70 -4 120 10"/>` +
    [[18, -38, 26], [40, 32, 24], [62, -34, 22], [84, 30, 20], [104, -26, 16]]
      .map(([x, a, l]) => `<g transform="translate(${x} ${x * 0.05})">${leaf(a, l)}</g>`).join("");
  svg.appendChild(g);

  // e — footer: a curved navy edge rising out of the page instead of a straight cut
  const fy = S.footer.top;
  P(`M 0 ${fy + 2} C ${W * 0.28} ${fy - (mobile ? 40 : 70)} ${W * 0.62} ${fy + 10} ${W} ${fy - (mobile ? 50 : 96)} L ${W} ${fy + 2} Z`, { fill: "#04203d" });
  P(`M 0 ${fy - 14} C ${W * 0.28} ${fy - (mobile ? 56 : 90)} ${W * 0.62} ${fy - 8} ${W} ${fy - (mobile ? 66 : 116)}`, { fill: "none", stroke: "#43b7ea", "stroke-opacity": ".35", "stroke-width": "1" });

  return { W, docH, mobile, sections: S };
})();
