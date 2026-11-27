import { Fraunces, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";

/** Latin display: a soft optical serif with warmth for an editorial food voice. */
export const displayLatin = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-latin",
  display: "swap",
});

/** Arabic display: geometric Kufi, echoing the rounded strokes of the الري wordmark. */
export const displayArabic = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  variable: "--font-display-ar",
  display: "swap",
});

export const sansLatin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-latin",
  display: "swap",
});

export const sansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-ar",
  display: "swap",
});

export const fontVars = [displayLatin.variable, displayArabic.variable, sansLatin.variable, sansArabic.variable].join(" ");
