"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { campaigns } from "@/content/brands";
import type { Locale } from "@/lib/i18n";

const label = {
  slide: { ar: "الحملة", en: "Campaign" },
  of: { ar: "من", en: "of" },
  region: { ar: "حملات الري", en: "AlRai campaigns" },
};

/**
 * The live home slider's three original campaign banners, crossfading. No visible controls
 * (client request). Auto-rotation pauses on hover and keyboard focus, and never runs under
 * reduced motion or while the tab is hidden.
 */
export default function CampaignCarousel({ locale }: { locale: Locale }) {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const n = campaigns.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (hover || reduced) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % n);
    }, 6000);
    return () => window.clearInterval(id);
  }, [hover, reduced, n]);

  const auto = !reduced;

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label.region[locale]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setHover(false); }}
      className="relative"
    >
      <div className="relative aspect-[1920/661] overflow-hidden rounded-[var(--radius-plate)] bg-cream shadow-[var(--shadow-plate)]" aria-live={auto ? "off" : "polite"}>
        {campaigns.map((c, k) => {
          const img = <Image src={c.src} alt={c.alt[locale]} fill sizes="(min-width: 1360px) 1360px, 100vw" className="object-cover" />;
          return (
            <div
              key={c.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${label.slide[locale]} ${k + 1} ${label.of[locale]} ${n}`}
              aria-hidden={k !== i}
              inert={k !== i}
              className={`campaign-slide absolute inset-0 ${k === i ? "opacity-100" : "opacity-0"}`}
            >
              {c.link ? <Link href={`/${locale}/products/${c.link}`} className="block size-full">{img}</Link> : img}
            </div>
          );
        })}
      </div>
    </div>
  );
}
