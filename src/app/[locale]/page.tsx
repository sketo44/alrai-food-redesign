import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CategoryTile from "@/components/CategoryTile";
import { Arrow, DropLeaf, Phone } from "@/components/Icons";
import CampaignCarousel from "@/components/motion/CampaignCarousel";
import CountUp from "@/components/motion/CountUp";
import EnterOnLoad from "@/components/motion/EnterOnLoad";
import IrrigationTimeline from "@/components/motion/IrrigationTimeline";
import { SectionHead, TextLink } from "@/components/ui";
import { BrandShowcase } from "@/components/BrandShowcase";
import { BranchLocator } from "@/components/BranchLocator";
import PageCanvas from "@/components/PageCanvas";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { categories, products, productsIn } from "@/content/catalog";
import { company } from "@/content/company";
import { distributorCountries, distributors } from "@/content/network";
import { recipes, recipesIntro } from "@/content/recipes";
import { fmt, type Locale, ui } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return pageMeta(locale, "", "", company.intro[locale][0]);
}

const pick = (slug: string) => products.find((p) => p.slug === slug)!;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  const L = (p: string) => `/${locale}${p}`;
  const hero = [pick("coffee-latte-mocha-250ml"), pick("full-fat-milk-1l"), pick("orange-nectar-200ml")];
  const cats = categories.filter((c) => !c.parent && productsIn(c.slug).length > 0);
  const [lead, ...rest] = [...cats].sort((a, b) => productsIn(b.slug).length - productsIn(a.slug).length);

  return (
    <div className="bg-canvas-host relative isolate">
      {/* One continuous background behind every section (docs/background-art-direction.md) */}
      <PageCanvas />

      {/* ───────────── Hero ───────────── */}
      <EnterOnLoad>
        <section data-bg="hero" aria-labelledby="hero-title" className="relative isolate overflow-x-clip">
          {/* Client artwork (wheat, milk splash, blue wave); dissolves through the stats band below.
              One element, art-directed per breakpoint so a single right-sized image is preloaded:
              desktop = whole hero; mobile = re-framed behind the product composition only, never behind text. */}
          <div aria-hidden className="bg-art bg-art-hero inset-x-0 -bottom-[90px] h-[calc(min(100vw,38rem)*1.12+107px)] opacity-90 md:top-0 md:-bottom-[170px] md:h-auto md:opacity-100 ltr:-scale-x-100">
            <Image src="/hero-bg.webp" alt="" fill priority sizes="(max-width:767px) 1100px, 100vw" className="object-cover object-[left_bottom] md:object-[center_bottom]" />
          </div>
          <div className="wrap grid items-center gap-12 pb-16 pt-6 md:pt-10 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-12 lg:pb-20">
            <div className="lg:col-span-6">
              <p className="eyebrow" data-enter>{ui.home.heroEyebrow[locale]}</p>
              <h1 id="hero-title" className="mt-6 text-[length:var(--step-5)] text-blue-deep">
                {company.name[locale]}
              </h1>
              <p className="mt-6 max-w-xl font-display text-[length:var(--step-2)] leading-snug text-ink" data-enter>
                {company.tagline[locale]}
              </p>
              <p className="mt-5 max-w-xl text-muted" data-enter>{company.intro[locale][0]}</p>
              <div className="mt-9 flex flex-wrap gap-3" data-enter>
                <Link href={L("/products")} className="btn btn-primary">
                  {ui.home.heroCta[locale]} <Arrow className="size-5" />
                </Link>
                <Link href={L("/about")} className="btn btn-ghost">{ui.home.heroCta2[locale]}</Link>
              </div>
            </div>

            {/* Product composition: original packshots on white plates over the logo's water drop */}
            <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[38rem] lg:col-span-6">
              <svg aria-hidden viewBox="0 0 100 128" className="absolute start-1/2 top-0 h-full -translate-x-1/2 rtl:translate-x-1/2" data-enter data-enter-y="40">
                <defs>
                  <radialGradient id="drop-g" cx="35%" cy="62%" r="70%">
                    <stop offset="0" stopColor="#7fd0f2" />
                    <stop offset="0.45" stopColor="#00529b" />
                    <stop offset="1" stopColor="#003a70" />
                  </radialGradient>
                </defs>
                <path d="M50 2C50 2 94 52 94 84a44 44 0 0 1-88 0C6 52 50 2 50 2z" fill="url(#drop-g)" />
                <path d="M30 70c-4 10-4 22 4 32" fill="none" stroke="white" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute start-[4%] top-[30%] w-[38%]" data-enter data-enter-y="60" data-enter-rotate="-8">
                <div className="plate float aspect-[4/5] -rotate-6 rtl:rotate-6">
                  <Image src={hero[1].image!} alt={hero[1].name[locale]} fill priority sizes="(min-width:1024px) 18vw, 36vw" className="object-contain p-[6%]" />
                </div>
              </div>
              <div className="absolute end-[3%] top-[8%] w-[36%]" data-enter data-enter-y="60" data-enter-rotate="8">
                <div className="plate float float-delay aspect-[4/5] rotate-[5deg] rtl:-rotate-[5deg]">
                  <Image src={hero[2].image!} alt={hero[2].name[locale]} fill priority sizes="(min-width:1024px) 17vw, 34vw" className="object-contain p-[6%]" />
                </div>
              </div>
              <div className="absolute bottom-[3%] start-[30%] w-[44%]" data-enter data-enter-y="80">
                <div className="plate aspect-[4/5] shadow-[var(--shadow-lift)]">
                  <Image src={hero[0].image!} alt={hero[0].name[locale]} fill priority sizes="(min-width:1024px) 21vw, 42vw" className="object-contain p-[5%]" />
                </div>
              </div>
              <div className="absolute start-[1%] top-[2%] grid size-20 place-items-center md:start-auto md:top-auto md:end-[6%] md:bottom-[16%] rounded-full bg-milk text-center shadow-[var(--shadow-plate)] md:size-28" data-enter>
                <span className="leading-tight">
                  <span className="block text-[0.7rem] font-semibold text-leaf-ink">{locale === "ar" ? "منذ" : "Since"}</span>
                  <span className="display tabular block text-2xl text-blue-deep md:text-3xl">{company.founded}</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </EnterOnLoad>

      {/* ───────────── Stats ───────────── */}
      <section data-bg="stats" aria-label={ui.about.scaleTitle[locale]} className="relative border-y border-line bg-white/40 backdrop-blur-[2px]">
        <dl className="wrap grid grid-cols-3">
          {company.stats.map((s) => (
            <div key={s.label.en} className="flex flex-col-reverse gap-1 border-line px-2 py-6 text-sm not-first:border-s first:ps-0 sm:px-8 sm:py-8 sm:text-base">
              <dt className="text-muted">{s.label[locale]}</dt>
              <dd className="display text-[length:var(--step-4)] text-blue">
                <CountUp value={s.value} locale={locale} />
                <span className="text-leaf-ink">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────────── Who we are ───────────── */}
      <section data-bg="who" aria-labelledby="who" className="section relative isolate overflow-clip">
        {/* Client artwork, tank silhouette only: rises faintly above the real photos (illustrative) */}
        <div aria-hidden data-bg-parallax className="bg-art bg-art-about inset-x-0 top-0 hidden h-[760px] opacity-80 lg:block ltr:-scale-x-100">
          <div className="absolute right-0 top-0 aspect-[1916/821] h-full">
            <Image src="/about-bg.webp" alt="" fill sizes="(min-width:1024px) 1800px, 0px" className="object-cover" />
          </div>
        </div>
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="relative order-2 grid grid-cols-[1fr_1.15fr] gap-4 lg:order-1 lg:col-span-6">
            <div className="relative mt-16 aspect-[263/500] overflow-hidden rounded-[var(--radius-plate)]">
              <Image src="/assets/about/about-1.jpg" alt={locale === "ar" ? "مبنى بشعار الري" : "Building bearing the AlRai logo"} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
            </div>
            <div className="grid gap-4">
              <div className="relative aspect-[528/351] overflow-hidden rounded-[var(--radius-plate)]">
                <Image src="/assets/about/about-landscape.jpg" alt={locale === "ar" ? "خط تعبئة العصائر في المصنع" : "Juice filling line at the factory"} fill sizes="(min-width:1024px) 26vw, 52vw" className="object-cover" />
              </div>
              <div className="rounded-[var(--radius-plate)] bg-blue p-6 text-white">
                <p className="text-sm font-semibold text-drop-soft">{ui.about.vision[locale]}</p>
                <p className="mt-2 text-[length:var(--step-1)] font-semibold leading-snug">{company.vision[locale]}</p>
              </div>
              <div className="rounded-[var(--radius-plate)] bg-cream p-6">
                <p className="text-sm font-semibold text-leaf-ink">{ui.about.mission[locale]}</p>
                <p className="mt-2 text-[length:var(--step-1)] font-semibold leading-snug">{company.mission[locale]}</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <p className="eyebrow">{ui.home.whoTitle[locale]}</p>
            <h2 id="who" className="mt-3 text-[length:var(--step-4)]">{company.name[locale]}</h2>
            <p className="mt-6 text-[length:var(--step-1)] leading-relaxed">{company.intro[locale][1]}</p>
            <div className="mt-8"><TextLink href={L("/about")}>{ui.nav.about[locale]}</TextLink></div>
          </div>
        </div>
      </section>

      {/* ───────────── Products ───────────── */}
      <section data-bg="products" aria-labelledby="products" className="section">
        <div className="wrap">
          <SectionHead id="products" eyebrow={ui.home.productsEyebrow[locale]} title={company.tagline[locale]} action={<TextLink href={L("/products")}>{ui.nav.allProducts[locale]}</TextLink>} />
          <div className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            <div className="col-span-2 lg:row-span-2"><CategoryTile c={lead} locale={locale} big /></div>
            {rest.map((c) => (
              <CategoryTile key={c.slug} c={c} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Campaigns ───────────── */}
      <section data-bg="campaigns" aria-labelledby="campaigns" className="section pb-0">
        <div className="wrap">
          <h2 id="campaigns" className="text-[length:var(--step-3)]">{ui.home.campaignsTitle[locale]}</h2>
          <div className="mt-8"><CampaignCarousel locale={locale} /></div>
        </div>
      </section>

      {/* ───────────── Journey (signature) ───────────── */}
      <section data-bg="journey" aria-labelledby="journey" className="section relative isolate overflow-clip">
        {/* Client artwork, production-line vignette only: under the title column, away from the paragraphs */}
        <div aria-hidden data-bg-parallax className="bg-art bg-art-journey inset-x-0 top-1/4 hidden h-3/4 opacity-70 lg:block rtl:-scale-x-100">
          <div className="absolute left-0 top-0 aspect-[2000/780] h-[126.7%]">
            <Image src="/journey-bg.webp" alt="" fill sizes="(min-width:1024px) 2400px, 0px" className="object-cover" />
          </div>
        </div>
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow">{ui.home.storyEyebrow[locale]}</p>
              <h2 id="journey" className="mt-3 text-[length:var(--step-3)]">{company.timelineTitle[locale]}</h2>
              <DropLeaf className="mt-8 size-10 text-drop" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <IrrigationTimeline label={company.timelineTitle[locale]} entries={company.timeline.map((t) => ({ year: t.year, text: t[locale] }))} />
          </div>
        </div>
      </section>

      {/* ───────────── Recipes ───────────── */}
      <section data-bg="recipes" aria-labelledby="recipes" className="section">
        <div className="wrap">
          <SectionHead id="recipes" title={ui.home.recipesTitle[locale]} lead={recipesIntro[locale]} action={<TextLink href={L("/recipes")}>{ui.recipes.title[locale]}</TextLink>} />
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {recipes.map((r, k) => (
              <li key={r.slug} className={k === 1 ? "md:mt-16" : ""}>
                <Link href={L(`/recipes/${r.slug}`)} className="plate-link group block">
                  <div className="plate aspect-[360/207]">
                    <Image src={r.image} alt="" fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
                  </div>
                  <h3 className="mt-5 text-[length:var(--step-2)]">{r.title[locale]}</h3>
                  <p className="mt-2 line-clamp-2 text-muted">{r.description[locale]}</p>
                  <span className="mt-3 inline-flex items-center gap-2 font-semibold text-blue">{ui.recipes.readMore[locale]} <Arrow className="size-4" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Brands ───────────── */}
      <div data-bg="brands">
      <BrandShowcase locale={locale} headingId="brands" cta={{ href: L("/brands"), label: locale === "ar" ? "اكتشف العلامات" : "Explore the brands" }} />
      </div>

      {/* ───────────── Branches (interactive locator) ───────────── */}
      <div data-bg="branches" className="pb-[calc(var(--section)*0.6)] pt-[calc(var(--section)*0.75)]">
        <BranchLocator locale={locale} headingId="branches-title" title={ui.home.branchesTitle[locale]} cta={{ href: L("/branches"), label: ui.home.branchesCta[locale] }} />
      </div>

      {/* ───────────── Partners (auto-scrolling strip) ───────────── */}
      <PartnersMarquee locale={locale} />

      {/* ───────────── Export ───────────── */}
      <section data-bg="export" aria-label={ui.home.exportTitle[locale]} className="pb-[var(--section)]">
        <div className="wrap grid gap-4">
          <div className="on-dark relative overflow-hidden rounded-[var(--radius-plate)] bg-blue-deep p-7 text-white md:p-10 lg:col-span-5">
            <div aria-hidden className="drop-shape absolute -end-16 -top-16 size-64 bg-blue/60" />
            <p className="eyebrow relative !text-drop">{ui.home.exportEyebrow[locale]}</p>
            <h2 className="relative mt-3 text-[length:var(--step-3)]">{ui.home.exportTitle[locale]}</h2>
            <dl className="relative mt-8 grid grid-cols-2 gap-6">
              <div className="flex flex-col-reverse"><dt className="text-white/75">{ui.home.distributorsLabel[locale]}</dt><dd className="display tabular text-[length:var(--step-4)]">{fmt(distributors.length, locale)}</dd></div>
              <div className="flex flex-col-reverse"><dt className="text-white/75">{ui.home.countriesLabel[locale]}</dt><dd className="display tabular text-[length:var(--step-4)]">{fmt(distributorCountries.length, locale)}</dd></div>
            </dl>
            <div className="relative mt-10 flex flex-wrap gap-3">
              <Link href={L("/export")} className="btn btn-light">{ui.home.exportCta[locale]} <Arrow className="size-5" /></Link>
              <Link href={L("/distributors")} className="btn border border-white/30 text-white hover:border-white">{ui.nav.distributors[locale]}</Link>
            </div>
            <a href={company.phone.href} className="relative mt-8 inline-flex items-center gap-2 text-white/80 hover:text-white">
              <Phone className="size-4" /> <span className="ltr-num">{company.phone.display}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
