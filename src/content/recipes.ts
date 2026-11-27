/**
 * Recipes. Source: /recipe/* (AR) and /en/recipe/oatmeal-cookies/ (EN).
 * The live recipes contain only a title, a one-paragraph description and a photo:
 * no ingredients or method are published, so none are shown here (content needed).
 * EN text: only "Oatmeal cookies" exists on the live EN site. The other two EN entries
 * are editorial translations pending client approval (`enSource: "editorial"`).
 */
import type { Bi } from "@/lib/i18n";

export type Recipe = {
  slug: string;
  title: Bi;
  description: Bi;
  image: string;
  enSource: "live-site" | "editorial";
  source: string;
};

export const recipes: Recipe[] = [
  {
    slug: "lentil-soup-with-cream",
    title: { ar: "شوربة العدس بالكريمة", en: "Lentil Soup with Cream" },
    description: {
      ar: "شوربة العدس بالكريمة هي وصفة متكاملة تجمع بين الدفء، النكهة، والقيمة الغذائية العالية، مما يجعلها خيارًا شهيًا ومغذيًا لعائلتك في الشتاء",
      en: "Lentil soup with cream is a complete recipe that brings together warmth, flavour and high nutritional value, making it a delicious and nourishing choice for your family in winter.",
    },
    image: "/assets/recipes/lentil-soup-with-cream.jpg",
    enSource: "editorial",
    source: "https://alraifood.com/recipe/شوربة-العدس-بالكريمة/",
  },
  {
    slug: "yogurt-apple-cake",
    title: { ar: "كيك الزبادي بالتفاح", en: "Yogurt Apple Cake" },
    description: {
      ar: "استمتع بكيك الزبادي بالتفاح المليء بنكهة القرفة. وصفة سهلة ولذيذة، مثالية للحلويات في أيام الخريف.",
      en: "Enjoy a yogurt apple cake full of cinnamon flavour. An easy, delicious recipe, ideal for desserts on autumn days.",
    },
    image: "/assets/recipes/yogurt-apple-cake.jpg",
    enSource: "editorial",
    source: "https://alraifood.com/recipe/كيك-الزبادي-بالتفاح/",
  },
  {
    slug: "oatmeal-cookies",
    title: { ar: "بسكويت الشوفان", en: "Oatmeal cookies" },
    description: {
      ar: "استمتع ببسكويت الشوفان الشهي والصحي، يُعدّ خيارًا مثاليًا كوجبة خفيفة مع القهوة، حيث يمنحك طاقة تدوم طوال اليوم.",
      en: "Enjoy delicious and healthy oatmeal cookies, an ideal choice as a snack with coffee, as it gives you energy that lasts all day long.",
    },
    image: "/assets/recipes/oat-cookies.jpg",
    enSource: "live-site",
    source: "https://alraifood.com/recipe/بسكويت-الشوفان/",
  },
];

export const recipesIntro: Bi = {
  ar: "نوفر مجموعة من الوصفات الإبداعية التي يمكنكم تحضيرها باستخدام منتجات الري",
  en: "We provide a range of creative recipes that you can prepare using AlRai products",
};
