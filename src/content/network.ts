/**
 * Branches (source: /فروعنا/ and /en/branches/) and distributors outside the Kingdom
 * (source: /الموزعين-خارج-المملكة/ and /en/distributors/). Verbatim, read 2026-11-22.
 */
import type { Bi } from "@/lib/i18n";

/**
 * Map pin for a branch.
 * - `exact`: a branch location verified from a published source (none exist yet: the live
 *   branches pages list only city + phone, re-checked 2026-11-23).
 * - `city`: the pin sits on the city's reference point, NOT the branch address. The UI must
 *   say so. `source` names the public dataset the city point came from.
 * - `null` on the branch: the city could not be placed; it is listed without a pin.
 */
export type BranchPin = { lat: number; lon: number; precision: "exact" | "city"; source: string };
export type Branch = { id: string; city: Bi; phone: string; pin: BranchPin | null };

// City reference points. Natural Earth 10m populated places (public domain), attribute
// latitude/longitude, read from ne_10m_populated_places_simple.geojson on 2026-11-23.
// Khamis Mushait is not in that dataset; its point is Wikidata Q759381 P625 (CC0).
const NE = (name: string, id: number) => `Natural Earth 10m populated places: "${name}" (ne_id ${id})`;
const city = (lat: number, lon: number, source: string): BranchPin => ({ lat, lon, precision: "city", source });

export const branches: Branch[] = [
  // Al-Ahsa is a governorate; Natural Earth's point for its principal city, Al-Hufuf, is used.
  { id: "al-ahsa", city: { ar: "الأحساء", en: "Al-Ahsa" }, phone: "0538640124", pin: city(25.348749, 49.585593, NE("Hofuf / Al Hufuf", 1159146455)) },
  { id: "riyadh", city: { ar: "الرياض", en: "Riyadh" }, phone: "0531639424", pin: city(24.642779, 46.770796, NE("Riyadh", 1159151581)) },
  { id: "dammam", city: { ar: "الدمام", en: "Dammam" }, phone: "0533733340", pin: city(26.430138, 50.097725, NE("Dammam", 1159136389)) },
  { id: "jeddah", city: { ar: "جدة", en: "Jeddah" }, phone: "0534692924", pin: city(21.518835, 39.217252, NE("Jeddah", 1159151277)) },
  { id: "madinah", city: { ar: "المدينة المنورة", en: "Medina" }, phone: "0536695924", pin: city(24.501935, 39.578057, NE("Medina", 1159149443)) },
  { id: "makkah", city: { ar: "مكة", en: "Mecca" }, phone: "0534692924", pin: city(21.431967, 39.818094, NE("Makkah", 1159151279)) },
  { id: "hafar-al-batin", city: { ar: "حفر الباطن", en: "Hafar Al-Batin" }, phone: "0530165924", pin: city(28.433651, 45.960078, NE("Hafar al Batin", 1159136393)) },
  { id: "khamis-mushait", city: { ar: "خميس مشيط", en: "Khamis Mushayt" }, phone: "0533016224", pin: city(18.3, 42.733333, "Wikidata Q759381 (Khamis Mushait), property P625") },
  { id: "tabuk", city: { ar: "تبوك", en: "Tabuk" }, phone: "0581783902", pin: city(28.383835, 36.554967, NE("Tabuk", 1159149445)) },
];

/** Google Maps search for the verified city (no exact branch address is published). */
export const branchMapsHref = (b: Branch, locale: "ar" | "en") =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locale === "ar" ? `${b.city.ar}، المملكة العربية السعودية` : `${b.city.en}, Saudi Arabia`,
  )}`;

export const branchTel = (phone: string) => `tel:+966${phone.replace(/^0/, "")}`;

export type Distributor = { name: Bi; location: Bi; country: Bi; phone: string };

const JO = { ar: "الأردن", en: "Jordan" };
const PS = { ar: "فلسطين", en: "Palestine" };
const AE = { ar: "الإمارات", en: "UAE" };
const YE = { ar: "اليمن", en: "Yemen" };
const OM = { ar: "سلطنة عمان", en: "Sultanate of Oman" };
const BH = { ar: "البحرين", en: "Bahrain" };
const QA = { ar: "قطر", en: "Qatar" };
const IQ = { ar: "العراق", en: "Iraq" };
const KW = { ar: "الكويت", en: "Kuwait" };

export const distributors: Distributor[] = [
  { name: { ar: "شركة رجائي ومحمد عيسى الملك للتجارة", en: "Rajai and Mohammed Issa Al-Malik Trading Company" }, location: { ar: "ماركا الشمالية، عمان، الأردن", en: "North Marka, Amman, Jordan" }, country: JO, phone: "+962795331130" },
  { name: { ar: "شركة البدوي العالمية للاستيراد والتصدير", en: "Al-Badawi International Import & Export Company" }, location: { ar: "سبسطية، نابلس، فلسطين", en: "Sebastia, Nablus, Palestine" }, country: PS, phone: "+970569888839" },
  { name: { ar: "شركة مزارع الخليج العربي لمنتجات الالبان والاغذية", en: "Arabian Gulf Farms Company for Dairy and Food Products" }, location: { ar: "وادي النصر، عمان، الأردن", en: "Wadi Al-Nasr, Amman, Jordan" }, country: JO, phone: "+962797326759" },
  { name: { ar: "مجموعة المعروف الغذائية", en: "AL Marouf Food Group" }, location: { ar: "المنطقة الصناعية 18، الشارقة، الإمارات", en: "Industrial Area 18, Sharjah, UAE" }, country: AE, phone: "+971556809594" },
  { name: { ar: "شركة الجيلاني للتجارة والاستيراد", en: "Al-Jilani Trading and Import Company" }, location: { ar: "شبوة، اليمن", en: "Shabwa, Yemen" }, country: YE, phone: "+967777263318" },
  { name: { ar: "بدائع التفوق ش م م", en: "Badaa Al-Tafaweq LLC" }, location: { ar: "ولاية نزوى، المنطقة الداخلية، سلطنة عمان", en: "Nizwa, Ad Dakhiliyah Region, Sultanate of Oman" }, country: OM, phone: "+96892166717" },
  { name: { ar: "جوفا للأغذية ش.م.م", en: "Jufa Foods LLC" }, location: { ar: "ولاية بوشر، مسقط، سلطنة عمان", en: "Bawshar, Muscat, Sultanate of Oman" }, country: OM, phone: "+96891241196" },
  { name: { ar: "كي اند كي انتربراز للتجارة ذ.م.م.", en: "K&K Enterprises Trading W.L.L." }, location: { ar: "سترة، المنامة، البحرين", en: "Sitra, Manama, Bahrain" }, country: BH, phone: "+97336894800" },
  { name: { ar: "مركز كيرلا للمواد الغذائية", en: "Kerala Foodstuff Centre" }, location: { ar: "الدوحة، قطر", en: "Doha, Qatar" }, country: QA, phone: "+97477603003" },
  { name: { ar: "شركة برج الروابي للتجارة العامة", en: "BURJ AL-RAWABI FOR GENERAL TRADE" }, location: { ar: "بغداد، العراق", en: "Baghdad, IRAQ" }, country: IQ, phone: "+9647805777778" },
  { name: { ar: "شركة مجموعة القيصر العالمية للمواد الغذائية", en: "Al Qaisar International Foodstuff Group Company" }, location: { ar: "الشويخ، الكويت", en: "Shuwaikh, Kuwait" }, country: KW, phone: "+96597972707" },
  { name: { ar: "شركة صفين للمواد الغذائية ذ.م.م", en: "Safeen Foodstuff Co. W.L.L" }, location: { ar: "بوري، الشمالية، البحرين", en: "Buri, Northern, Bahrain" }, country: BH, phone: "+97333334668" },
  { name: { ar: "اولمارت للتجارة", en: "ALL MART TRADING" }, location: { ar: "الوكرة، قطر", en: "Wakrah, QATAR" }, country: QA, phone: "+97450344233" },
  { name: { ar: "تايستفل فينترس لتجارة منتجات الألبان - ذ.م.م", en: "TASTEFUL VENTURES DIARY PRODUCTS TRADING LLC" }, location: { ar: "أبو ظبي، الإمارات", en: "Abu Dhabi, UAE" }, country: AE, phone: "+971558863532" },
];

export const distributorCountries = Array.from(new Map(distributors.map((d) => [d.country.en, d.country])).values());

/**
 * Retail chains inside the Kingdom where AlRai products are on sale. Only chains with
 * published evidence are listed, each with where it was checked and when. Logos are the
 * chain's own file from its official website.
 * Checked 2026-11-23 and NOT found online: Carrefour KSA (search "الري" / "alrai": none),
 * Panda (search "الري" / "Al Rai": none). Could not be checked online: Lulu, Othaim, Danube.
 */
export type RetailPartner = { name: Bi; logo: string; width: number; height: number; source: string };
export const retailPartners: RetailPartner[] = [
  {
    name: { ar: "أسواق التميمي", en: "Tamimi Markets" },
    logo: "/assets/partners/tamimi-markets.png",
    width: 475,
    height: 134,
    source: "https://www.tamimimarkets.com/search?q=Al%20Rai (16 AlRai products: creams, sauces, iced coffee; checked 2026-11-23). Logo: tamimimarkets.com/assets/icons/logo.png",
  },
];
