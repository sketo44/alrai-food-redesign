// Used only for the static GitHub Pages preview (GITHUB_PAGES=1).
// Static hosting has no image optimizer, so images are served as-is with the repo's base path.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function staticLoader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `${base}${src}` : src;
}
