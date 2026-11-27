"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

/**
 * Plays a short staggered entrance on children marked `data-enter`.
 * Without JS or with reduced motion, content is simply visible (see globals.css).
 * Only transform and opacity animate; the LCP heading is never hidden.
 */
export default function EnterOnLoad({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-enter]");
        gsap.fromTo(
          items,
          { opacity: 0, y: (i, el) => Number((el as HTMLElement).dataset.enterY ?? 28), rotate: (i, el) => Number((el as HTMLElement).dataset.enterRotate ?? 0) },
          { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.1, clearProps: "transform,rotate,animation" },
        );
      });
      mm.add(MOTION.reduce, () => {
        gsap.set("[data-enter]", { opacity: 1, clearProps: "animation" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
