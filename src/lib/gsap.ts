"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Media conditions shared by every animated component. */
export const MOTION = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  /** Low-power path: touch-first small screens skip scrubbed scroll effects. */
  lowPower: "(hover: none) and (max-width: 767px)",
};

export const saveData = () =>
  typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

export { gsap, ScrollTrigger, useGSAP };
