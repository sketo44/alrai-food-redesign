"use client";

import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Counts from 0 to `value` once, when scrolled into view. The final number is in the
 * server HTML (SEO / no-JS / reduced motion); the animation only rewrites it on the client.
 */
export default function CountUp({ value, locale, className }: { value: number; locale: "ar" | "en"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US").format(Math.round(n));
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const state = { n: 0 };
        el.textContent = format(0);
        const tween = gsap.to(state, {
          n: value,
          duration: 1.6,
          ease: "power3.out",
          paused: true,
          onUpdate: () => { el.textContent = format(state.n); },
        });
        const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
        return () => { st.kill(); tween.kill(); el.textContent = format(value); };
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {format(value)}
    </span>
  );
}
