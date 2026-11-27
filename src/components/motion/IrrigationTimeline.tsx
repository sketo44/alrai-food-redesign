"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION, saveData, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type TimelineEntry = { year: number; text: string };

/**
 * Signature moment. الري means "irrigation": a water channel runs down the company's
 * history and fills as you scroll, and each year lights up when the water reaches it.
 * Reduced motion, Save-Data and touch phones get the finished state with no scrubbing.
 * The channel and the falling drop end exactly on the centre of the last year's marker.
 */

/** Distance from the top of the list to the centre of the last year's marker. */
function channelEnd(root: HTMLElement) {
  const markers = root.querySelectorAll<HTMLElement>("[data-marker]");
  const m = markers[markers.length - 1];
  if (!m) return root.offsetHeight;
  const r = m.getBoundingClientRect();
  return r.top + r.height / 2 - root.getBoundingClientRect().top;
}
export default function IrrigationTimeline({ entries, label }: { entries: TimelineEntry[]; label: string }) {
  const ref = useRef<HTMLOListElement>(null);

  // Size the channel (and the water inside it) so it stops on the last marker, in every mode.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const size = () => {
      const h = Math.max(0, channelEnd(root) - 8); // channels start 8px (top-2) below the list top
      root.querySelectorAll<HTMLElement>("[data-channel]").forEach((el) => { el.style.height = `${h}px`; });
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const water = root.querySelector<HTMLElement>("[data-water]");
      const drop = root.querySelector<HTMLElement>("[data-drop]");
      const items = gsap.utils.toArray<HTMLElement>("[data-year]", root);
      const mm = gsap.matchMedia();

      const finish = () => {
        root.dataset.state = "static";
        items.forEach((el) => el.classList.add("is-reached"));
      };

      mm.add({ ok: MOTION.ok, low: MOTION.lowPower }, (ctx) => {
        const { ok, low } = ctx.conditions as { ok: boolean; low: boolean };
        if (!ok || low || saveData()) {
          finish();
          return;
        }
        root.dataset.state = "live";
        items.forEach((el) => el.classList.remove("is-reached"));
        gsap.set(water, { scaleY: 0 });
        gsap.to(water, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            // finishes as the last marker reaches the line where years light up (62%)
            end: () => `top+=${channelEnd(root)} 62%`,
            invalidateOnRefresh: true,
            scrub: 0.6,
            onUpdate: (self) => {
              if (drop) gsap.set(drop, { y: 8 + self.progress * (channelEnd(root) - 8) });
            },
          },
        });
        items.forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 62%", onEnter: () => el.classList.add("is-reached"), onLeaveBack: () => el.classList.remove("is-reached") });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} aria-label={label} data-state="static" className="group/tl relative grid gap-14 ps-12 md:gap-20 md:ps-20">
      {/* Channel */}
      <span aria-hidden data-channel className="absolute inset-y-2 start-[11px] w-[3px] rounded-full bg-sand/70 md:start-[27px]" />
      <span aria-hidden data-channel data-water className="absolute inset-y-2 start-[11px] w-[3px] origin-top rounded-full bg-gradient-to-b from-drop via-blue to-blue md:start-[27px]" />
      <span aria-hidden data-drop className="absolute start-[3px] top-0 hidden md:start-[19px] group-data-[state=live]/tl:block">
        <svg width="20" height="26" viewBox="0 0 20 26" className="-translate-y-1/2 drop-shadow-[0_4px_8px_rgb(0_82_155/0.45)]">
          <path d="M10 1C14.5 7.5 19 12 19 16.5a9 9 0 01-18 0C1 12 5.5 7.5 10 1z" fill="var(--color-drop)" stroke="white" strokeWidth="1.5" />
        </svg>
      </span>
      {entries.map((e) => (
        <li key={e.year} data-year className="is-reached group/y relative grid gap-3 md:grid-cols-[minmax(10rem,16rem)_1fr] md:gap-10">
          <span aria-hidden data-marker className="absolute -start-12 top-[0.6em] size-[25px] rounded-full border-[3px] border-sand bg-milk transition-colors duration-500 group-[.is-reached]/y:border-blue group-[.is-reached]/y:bg-drop md:-start-20 md:size-[57px] md:top-[0.1em] md:border-[3px]" />
          <p className="display tabular text-[length:var(--step-4)] text-[#7d8a98] transition-colors duration-700 group-[.is-reached]/y:text-blue">{e.year}</p>
          <p className="max-w-xl pt-2 text-[length:var(--step-1)] leading-relaxed text-ink/85 md:pt-4">{e.text}</p>
        </li>
      ))}
    </ol>
  );
}
