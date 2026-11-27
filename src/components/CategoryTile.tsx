import Image from "next/image";
import Link from "next/link";
import { type Category, coverFor, productsIn } from "@/content/catalog";
import { type Locale, ui } from "@/lib/i18n";
import { Arrow } from "./Icons";

export const toneBg: Record<Category["tone"], string> = {
  milk: "bg-[#eef3f8]",
  sky: "bg-drop-soft",
  leaf: "bg-[#e3f1e6]",
  sun: "bg-[#fbecc8]",
  berry: "bg-[#f7e1ea]",
  coffee: "bg-[#ecdccd]",
  tomato: "bg-[#f8ddd8]",
};

/** Category tile: a tinted field with the category's first original packshot on a white plate. */
export default function CategoryTile({ c, locale, big = false, priority }: { c: Category; locale: Locale; big?: boolean; priority?: boolean }) {
  const count = productsIn(c.slug).length;
  const cover = coverFor(c.slug);
  return (
    <Link
      href={`/${locale}/products/${c.slug}`}
      className={`plate-link group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-plate)] p-4 md:p-6 ${toneBg[c.tone]} ${big ? "min-h-[22rem] md:min-h-[34rem]" : "min-h-[11.5rem] md:min-h-[17rem]"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`${big ? "text-[length:var(--step-3)]" : "text-[length:var(--step-1)] md:text-[length:var(--step-2)]"}`}>{c.name[locale]}</h3>
          <p className="mt-1 text-sm text-ink/70">
            <span className="tabular">{count}</span> {ui.products.count[locale]}
          </p>
        </div>
        <span className="hidden size-11 shrink-0 md:inline-flex items-center justify-center rounded-full bg-white/80 text-ink transition-colors group-hover:bg-blue group-hover:text-white">
          <Arrow className="size-5" />
        </span>
      </div>
      {cover && (
        <div className={`plate relative mt-4 w-full flex-1 overflow-hidden md:mt-5 ${big ? "min-h-[14rem]" : "min-h-[9rem] md:min-h-[11.5rem]"}`}>
          <Image
            src={cover}
            alt=""
            fill
            sizes={big ? "(min-width: 1024px) 36vw, 80vw" : "(min-width: 1024px) 20vw, 45vw"}
            priority={priority}
            className={`object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.05] motion-reduce:transition-none ${big ? "p-[5%]" : "p-[3%]"}`}
          />
        </div>
      )}
    </Link>
  );
}
