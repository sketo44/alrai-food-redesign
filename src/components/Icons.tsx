/** One small, consistent icon set (1.75 stroke, round caps), drawn for this project. */
type P = { className?: string; title?: string };
const base = (className?: string) => ({
  className,
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const Arrow = ({ className }: P) => (
  <svg {...base(`arrow ${className ?? ""}`)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Chevron = ({ className }: P) => (
  <svg {...base(className)}><path d="M6 9l6 6 6-6" /></svg>
);
export const Phone = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2" /></svg>
);
export const Mail = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const Pin = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const Menu = ({ className }: P) => (
  <svg {...base(className)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const Close = ({ className }: P) => (
  <svg {...base(className)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Globe = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>
);
export const Search = ({ className }: P) => (
  <svg {...base(className)}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>
);
export const Pause = ({ className }: P) => (
  <svg {...base(className)}><path d="M9 6v12M15 6v12" /></svg>
);
export const Play = ({ className }: P) => (
  <svg {...base(className)}><path d="M8 5l11 7-11 7z" /></svg>
);
export const Plus = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 12h14" /></svg>
);
export const Info = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);

/** Water drop + leaf: a simplified line mark echoing the logo, used as a divider ornament. */
export const DropLeaf = ({ className }: P) => (
  <svg {...base(className)} viewBox="0 0 32 32"><path d="M20 4c4 5 6 8.5 6 11.5a6 6 0 01-12 0C14 12.5 16 9 20 4z" /><path d="M13 28c-4-2-7-6.5-6.5-12.5C11 17 14 21 13 28z" /></svg>
);

const brandPath: Record<string, string> = {
  instagram: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-1.5h.01",
  snapchat: "M12 3c3 0 5 2.2 5 5.2v2.3l1.8-.5c.6 0 .8.7.3 1l-2 1c.7 1.8 2 3 3.6 3.5-.4.7-1.4 1-2.6 1.1l-.4 1.3c-1.2-.2-2.3 0-3.2.7-.8.6-1.6.9-2.5.9s-1.7-.3-2.5-.9c-.9-.7-2-.9-3.2-.7L5.9 17c-1.2-.1-2.2-.4-2.6-1.1C4.9 15.4 6.2 14.2 6.9 12.4l-2-1c-.5-.3-.3-1 .3-1l1.8.5V8.2C7 5.2 9 3 12 3z",
  x: "M4 4l16 16M20 4L4 20",
  tiktok: "M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.5 2.6 2.4 4.4 5 4.6",
};
export const Social = ({ id, className }: P & { id: string }) => (
  <svg {...base(className)}><path d={brandPath[id]} /></svg>
);
