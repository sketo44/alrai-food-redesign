/**
 * Company facts. Every string here was read on alraifood.com (AR + EN) on 2026-11-22.
 * Sources are noted per block. EN strings come from the live /en/ pages unless marked
 * `editorial` (a correction or translation by the redesign team, pending client approval).
 * See docs/content-inventory.md for the full source list.
 */
import type { Bi } from "@/lib/i18n";

export const company = {
  name: { ar: "الري للصناعات الغذائية", en: "AlRai Food Industries" } as Bi,
  shortName: { ar: "الري", en: "AlRai" } as Bi,
  // Source: home + /من-نحن/ + /en/about-us/
  founded: 1968,
  city: { ar: "الأحساء", en: "Al-Ahsa" } as Bi,
  address: { ar: "المملكة العربية السعودية - الأحساء", en: "Saudi Arabia - Al-Ahsa" } as Bi,
  email: "alrai@alrai.com.sa",
  phone: { display: "0135975444", href: "tel:+966135975444" },
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/alraifoodsa/" },
    { id: "snapchat", label: "Snapchat", href: "https://www.snapchat.com/@alraifoods" },
    { id: "x", label: "X", href: "https://x.com/alraifoodsa" },
    { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@alraifoodsa" },
  ],
  tagline: { ar: "نكهات طبيعية وجودة لا تضاهى!", en: "Natural flavors and unmatched quality!" } as Bi,
  intro: {
    ar: [
      "تأسست الري للصناعات الغذائية عام 1968م في مدينة الأحساء بالمنطقة الشرقية للمملكة العربية السعودية تحت إدارة محمد موسى بوخمسين.",
      "سرعان ما تطورت شركة الري للصناعات الغذائية مع السنين من مصنع صغير لمنتجات الألبان لتصبح في أيامنا هذه أحد أهم المصانع السعودية التي تتيح تشكيلة متنوعة من المنتجات، وهي تحتل اليوم مركزًا بين أهم المنتجين والمصدرين للعصائر ومنتجات الحليب في المملكة.",
    ],
    en: [
      "Al-Rai Food Industries was established in 1968 in Al-Ahsa, Eastern Province of the Kingdom of Saudi Arabia, under the management of Mohamed Mousa Bo Khamseen.",
      "The company quickly developed over the years from a small dairy products factory to become one of the most important Saudi factories offering a wide variety of products. Today, it holds a leading position among the top producers and exporters of juices and dairy products in the Kingdom.",
    ],
  },
  aboutMore: {
    ar: [
      "إيمانًا منا بالصحة الجيدة والنظام الغذائي الصحيح، تعتمد شركة الري للصناعات الغذائية في مختلف منتجاتها أعلى معايير الحماية والصحة والقيم الغذائية، فهي تقدم منتجات ذات نوعية عالية وخدمات تلبي حاجات وصحة وأذواق ورغبات الزبائن.",
      "نحن نتطلع للتطور أكثر مع الوقت بغية تلبية طلبات عملائنا المتزايدة مع الحفاظ على نفس معايير نوعية الإنتاج العالية.",
      "إن مسيرة الري الناجحة ما كانت لتتحقق لولا العمل الدؤوب والالتزام من فريق عملها، والحفاظ على أعلى معايير التصنيع من حيث التكنولوجيا والجودة والخدمات.",
      "الري للصناعات الغذائية، مع أكثر من 25 خط إنتاج وحوالي 600 موظف في المبيعات، وأسطول توزيع من نحو 300 مركبة، تغطي جغرافيا جميع أنحاء المملكة وتعمل بلا هوادة لتحقيق طموح الحصول على نسبة أكبر من حصص السوق في البلدان المحيطة.",
    ],
    en: [
      "Believing in good health and proper nutrition, Al-Rai Food Industries adheres to the highest standards of safety, health, and nutritional values in all its products. It offers high-quality products and services that meet the needs, health, tastes, and desires of its customers.",
      "We aim for further development over time in order to meet the increasing demands of our clients while maintaining the same high production standards.",
      "The success of Al-Rai’s journey would not have been achieved without the hard work and commitment of its team, along with maintaining the highest manufacturing standards in terms of technology and services.",
      "With more than 25 production lines and around 600 employees in sales, along with a distribution fleet of about 300 vehicles, Al-Rai covers all regions of the Kingdom and works tirelessly to achieve its ambition of securing a larger market share in the surrounding countries.",
    ],
  },
  vision: { ar: "أن نصبح رواد في مجال الصناعات الغذائية", en: "To become leaders in the food industry" } as Bi,
  mission: { ar: "تقديم منتجات عالية الجودة بأسعار تنافسية", en: "Providing high quality products at competitive prices." } as Bi,
  features: [
    {
      ar: "العمل الجاد لفريقنا والإلتزام وإحترام أعلى المعايير في الإنتاج والتكنولوجيا والخدمات",
      en: "Our team's hard work, commitment and respect for the highest standards in production, technology and services.",
    },
    {
      ar: "تغذية وخدمات عالية الجودة تستجيب لإحتياجات عملائنا وصحتهم وأذواقهم ورغباتهم",
      en: "High quality nutrition and services that respond to our customers' needs, health, tastes and desires.",
    },
  ] as Bi[],
  // Counters: home + about (data-num attributes 50 / 25 / 20, rendered with "+")
  stats: [
    { value: 50, suffix: "+", label: { ar: "سنوات من الخبرة", en: "Years of Experience" } as Bi },
    { value: 25, suffix: "+", label: { ar: "خط إنتاج", en: "Production Lines" } as Bi },
    { value: 20, suffix: "+", label: { ar: "فرع حول المملكة", en: "Branches Across the Kingdom" } as Bi },
  ],
  // From the about paragraph ("حوالي 600 موظف في المبيعات" / "نحو 300 مركبة")
  scale: [
    { value: 600, prefix: { ar: "حوالي", en: "around" } as Bi, label: { ar: "موظف في المبيعات", en: "employees in sales" } as Bi },
    { value: 300, prefix: { ar: "نحو", en: "about" } as Bi, label: { ar: "مركبة في أسطول التوزيع", en: "vehicles in the distribution fleet" } as Bi },
  ],
  timelineTitle: { ar: "أكثر من 50 عام من الخبرة في مجال الصناعات الغذائية", en: "Over 50 years of experience in the food industry" } as Bi,
  // Source: /من-نحن/ timeline. EN 1990 entry: "irrigation brand" corrected to "AlRai brand" (editorial).
  timeline: [
    {
      year: 1968,
      ar: "تأسست شركة الري للصناعات الغذائية في مدينة الأحساء، كشركة متخصصة في تصنيع وتوزيع العصائر",
      en: "AlRai Food Industries Company was established in Al-Ahsa city, as a company specialized in manufacturing and distributing juices",
    },
    {
      year: 1970,
      ar: "التوسع الأولي عن طريق زيادة الإنتاج وتطوير خطوط التصنيع لتلبية الطلب المحلي المتزايد على العصائر ومنتجات الحليب",
      en: "Initial expansion by increasing production and developing manufacturing lines to meet the growing local demand for juices and dairy products.",
    },
    {
      year: 1980,
      ar: "تنويع المنتجات عن طريق إضافة منتجات جديدة وتطوير التعبئة والتغليف لتتناسب مع معايير الأسواق الحديثة",
      en: "Diversify products by adding new products and developing packaging to match the standards of modern markets.",
    },
    {
      year: 1990,
      ar: "التصدير والانفتاح عن طريق التصدير إلى دول الخليج وتعزيز الهوية التجارية وزيادة شهرة علامة الري في المنطقة",
      en: "Export and openness by exporting to the Gulf countries and enhancing the commercial identity and increasing the fame of the AlRai brand in the region",
    },
  ],
  credit: { ar: "شركة تسوق لتقنية المعلومات", en: "Tasawk for Information Technology", href: "https://tasawk.com.sa" },
} as const;
