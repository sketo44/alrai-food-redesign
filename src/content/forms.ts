/**
 * Form option lists, verbatim from the live Gravity Forms on /انضم-إلينا/ and /en/join-us/.
 * The live contact form's "message type" options are placeholders ("الخيار الاول / الثانى /
 * الثالث"), so that field is not reproduced (see docs/limitations.md).
 */
import type { Bi } from "@/lib/i18n";

export const departments: { value: string; label: Bi }[] = [
  { value: "sales", label: { ar: "المبيعات - sales", en: "المبيعات - sales" } },
  { value: "hr", label: { ar: "الموارد البشرية - hr", en: "الموارد البشرية - hr" } },
  { value: "marketing", label: { ar: "التسويق - marketing", en: "التسويق - marketing" } },
  { value: "production", label: { ar: "الانتاج - production", en: "الانتاج - production" } },
  { value: "maintenance", label: { ar: "الصيانة - maintenance", en: "الصيانة - maintenance" } },
  { value: "workshop", label: { ar: "الورشة - workshop", en: "الورشة - workshop" } },
  { value: "shipping", label: { ar: "الشحن - shipping", en: "الشحن - shipping" } },
  { value: "warehouse", label: { ar: "المستودع - warehouse", en: "المستودع - warehouse" } },
  { value: "purchasing", label: { ar: "المشتريات - purchasing", en: "المشتريات - purchasing" } },
  { value: "export", label: { ar: "التصدير - export", en: "التصدير - export" } },
  { value: "security", label: { ar: "الأمن - security", en: "الأمن - security" } },
];

export const education: Bi[] = [
  { ar: "لا يوجد مؤهل تعليمي", en: "No educational qualification" },
  { ar: "ثانوية عامة", en: "High school" },
  { ar: "شهادة مهنية", en: "Professional Certificate" },
  { ar: "دبلوم", en: "Diploma" },
  { ar: "درجه البكالوريوس", en: "Bachelor's degree" },
  { ar: "الماجستير", en: "Masters" },
  { ar: "درجة الدكتوراه", en: "Doctorate" },
];

export const declaration: Bi = {
  ar: "أقر بأن المعلومات الواردة في هذا الطلب صحيحة على حد علمي. وأتفهم بأن تزوير المعلومات هو سبب لرفض توظيفي، أفوض شركة الري للصناعات الغذائية بطلب وتلقي المزيد من المعلومات حول عملي السابق ومؤهلاتي. كما أنني أفوض (شركة الري للصناعات الغذائية) بتخزين وحفظ السيرة الذاتية الخاصة بي للتقدم على الوظائف الشاغرة في المستقبل.",
  en: "I hereby declare that the information contained in this application is true to the best of my knowledge. I understand that falsification of information is grounds for refusal of employment. I hereby authorize AlRai Food Industries Company to request and receive further information regarding my previous work and qualifications. I also authorize AlRai Food Industries Company to store and retain my CV for future application for vacancies.",
};

/** ISO 3166 region codes; names are rendered with Intl.DisplayNames in the visitor's locale. */
export const countryCodes = (
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS " +
  "MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS " +
  "RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW " +
  "TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW"
).split(" ");
