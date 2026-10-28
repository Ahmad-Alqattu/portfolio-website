// One-off content update (2026-10-28): builds a "Restore from File" JSON for
// the admin panel from the current Firestore snapshot. Only the projects
// section is in the file, so restoring it leaves every other section alone.
//
//   node scripts/content/2026-10-28-projects.mjs   ->  content-updates/2026-10-28-projects.json
//
// Changes:
//   - add "Mowazze" (van-sales distribution SaaS) and "PocketForge"
//   - merge "eMunicipality" into "E-Municipality Platform" (the old entry is
//     kept but set inactive)
//   - water platform: current architecture + the offline field app
//   - land settlement archiving: the OCR model for folder covers
//   - order: production work first, academic projects last
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '../..');
const sections = JSON.parse(readFileSync(resolve(root, '.content/sections.json'), 'utf8'));
const projectsSection = sections.find((s) => s.type === 'projects');
const projects = projectsSection.data.projects.map((p) => ({ ...p }));
const byName = (en) => {
  const p = projects.find((x) => (x.name?.en || x.name) === en);
  if (!p) throw new Error(`project not found: ${en}`);
  return p;
};

// --- updated entries -----------------------------------------------------------

const water = byName('Enterprise Water Management Platform');
water.description = {
  en: 'A modular national platform for water-sector operations: laboratories, water resources, distribution, wastewater, GIS and licensing behind one gateway, with an offline field app.',
  ar: 'منصة وطنية معيارية لعمليات قطاع المياه: المختبرات وموارد المياه والتوزيع والصرف الصحي وGIS والترخيص خلف بوابة واحدة، مع تطبيق ميداني يعمل بدون إنترنت.',
};
water.fullDescription = {
  en: 'Designing and building a modular enterprise platform for public-sector water operations. Each domain — LIMS, water resources, supply and distribution, wastewater treatment, GIS, licensing, billing and notifications — is its own module behind a shared gateway with single sign-on and two-factor authentication, and modules share platform services: dynamic services and forms, workflow-driven processing, document generation, audit trails and outbox-based integrations.\n\nStack: .NET 10 with .NET Aspire and a YARP gateway, ASP.NET Core, Entity Framework Core, PostgreSQL/PostGIS, React 19 and TypeScript, MapLibre GL JS, Docker.\n\nField app: an offline-first React Native (Expo) companion for staff working on site — sampling, meter reading, surveys and damage assessment — that records on the device and syncs when a connection returns.\n\nKey focus: reusable platform capabilities, secure workflows, data integrity, and modules that integrate cleanly as the platform grows.',
  ar: 'أصمّم وأبني منصة مؤسسية معيارية لعمليات قطاع المياه في الجهات العامة. كل مجال — المختبرات LIMS، وموارد المياه، والتزويد والتوزيع، ومحطات معالجة الصرف الصحي، وGIS، والترخيص، والرسوم، والإشعارات — وحدة مستقلة خلف بوابة مشتركة بدخول موحّد وتحقق بخطوتين، وتتشارك الوحدات خدمات المنصة: الخدمات والنماذج الديناميكية، ومسارات العمل، وتوليد الوثائق، وسجل التدقيق، والتكاملات المبنية على Outbox.\n\nالتقنيات: ‎.NET 10 مع ‎.NET Aspire وبوابة YARP، وASP.NET Core، وEntity Framework Core، وPostgreSQL/PostGIS، وReact 19 وTypeScript، وMapLibre GL JS، وDocker.\n\nالتطبيق الميداني: تطبيق React Native (Expo) يعمل بدون إنترنت أولًا لموظفي الميدان — أخذ العينات، وقراءة العدادات، والمسوحات، وتقييم الأضرار — يحفظ على الجهاز ويزامن عند عودة الاتصال.\n\nالتركيز الأساسي: قدرات مشتركة قابلة لإعادة الاستخدام، ومسارات عمل آمنة، وسلامة البيانات، ووحدات تتكامل بوضوح مع نمو المنصة.',
};

water.images = [
  ...(water.images || []),
  'projects/water/01.webp', // licensing: service catalog
  'projects/water/02.webp', // service builder
  'projects/water/03.webp', // service builder: location fields
];

const emun = byName('E-Municipality Platform');
const emunWeb = byName('eMunicipality');
emun.name = { en: 'E-Municipality Platform', ar: 'منصة البلديات الإلكترونية' };
emun.description = {
  en: 'Digital municipal services for citizens and staff: a web portal, native mobile apps for seven municipalities from one codebase, and the staff workflow system behind them.',
  ar: 'خدمات بلدية رقمية للمواطنين والموظفين: بوابة ويب، وتطبيقات موبايل أصلية لسبع بلديات من قاعدة كود واحدة، ونظام مسارات العمل للموظفين خلفها.',
};
emun.fullDescription = {
  en: 'Develop and maintain an e-government platform used by Palestinian municipalities so citizens can apply for, pay for and follow municipal services online.\n\nMobile: a white-label React Native app (Expo, Hermes, EAS builds) shipped on Google Play for Tulkarm, Yabad, Aqqaba, Azzun, Alkum, Huwwara and Tarqumia — one codebase, with each municipality’s branding, services and configuration as a build flavor.\n\nWeb: the citizen portal and PWA (React, Material UI) on a .NET 8 REST API with Entity Framework Core and JWT authentication, integrated with the municipalities’ existing systems over SOAP/WCF, plus the staff side built on ASP.NET MVC with a configurable workflow engine for processing requests.\n\nAlso: service-request tracking, PDF documents, bilingual Arabic/English, and the release pipeline for Android and iOS.',
  ar: 'أطوّر وأصون منصة حكومة إلكترونية تستخدمها بلديات فلسطينية ليقدّم المواطنون طلبات الخدمات البلدية ويدفعوا رسومها ويتابعوها إلكترونيًا.\n\nالموبايل: تطبيق React Native موحّد (Expo وHermes وبناء EAS) منشور على Google Play لبلديات طولكرم ويعبد وعقابا وعزون وكفر اللبد (الكوم) وحوارة وترقوميا — قاعدة كود واحدة، وهوية كل بلدية وخدماتها وإعداداتها نسخة بناء خاصة بها.\n\nالويب: بوابة المواطن وتطبيق PWA ‏(React وMaterial UI) على REST API مبني بـ‎.NET 8 وEntity Framework Core ومصادقة JWT، مع تكامل مع أنظمة البلديات القائمة عبر SOAP/WCF، إضافة إلى جانب الموظفين المبني على ASP.NET MVC مع محرّك مسارات عمل قابل للضبط لمعالجة الطلبات.\n\nوأيضًا: تتبع طلبات الخدمات، وتوليد ملفات PDF، ودعم العربية والإنجليزية، ومسار إصدار تطبيقات Android وiOS.',
};
emun.link = [
  'https://eservice.mtulkarm.com/',
  'https://play.google.com/store/apps/details?id=com.mtulkarm.eservice.twa',
  'https://play.google.com/store/apps/details?id=ps.yabad.twa',
  'https://play.google.com/store/apps/details?id=ps.aqqaba.emun',
  'https://play.google.com/store/apps/details?id=org.azzoun.emun',
  'https://play.google.com/store/apps/details?id=org.alkum.emun',
  'https://play.google.com/store/apps/details?id=com.alameenapps.howwara',
  'https://play.google.com/store/apps/details?id=org.tarqumia_city.eservice.twa',
];
emun.images = [
  'projects/emunicipality/01.webp',
  'projects/emunicipality/02.webp',
  ...(emun.images || []),
  ...(emunWeb.images || []),
  'projects/emunicipality/03.webp',
  'projects/emunicipality/04.webp',
];
emunWeb.active = false; // merged into "E-Municipality Platform"

const land = byName('Land Settlement Archiving');
land.description = {
  en: 'Automation, desktop tools and a small OCR model for digitizing land-settlement archives.',
  ar: 'أدوات أتمتة وتطبيقات مكتبية ونموذج OCR صغير لرقمنة أرشيف تسوية الأراضي.',
};
land.fullDescription = {
  en: 'Built Python automation to process Excel files for a land-settlement archiving initiative, focusing on data cleaning, extraction and validation, and JavaFX desktop utilities for auditing scanned PDFs, merging files and supporting archive-quality workflows.\n\nOCR: trained a compact CRNN model (about one million parameters, PyTorch) that reads the request, basin and parcel numbers from scanned folder covers, so files can be indexed without typing them in. Benchmarked it against general-purpose vision models on accuracy, speed and cost per page before choosing it for the pipeline.',
  ar: 'بنيت أدوات أتمتة باستخدام Python لمعالجة ملفات Excel ضمن مشروع لأرشفة تسوية الأراضي، مع التركيز على تنظيف البيانات واستخراجها والتحقق منها، وتطبيقات JavaFX مكتبية لتدقيق ملفات PDF الممسوحة ضوئيًا ودمجها ودعم إجراءات ضبط جودة الأرشيف.\n\nالتعرّف الضوئي OCR: درّبت نموذج CRNN صغيرًا (حوالي مليون معامل، PyTorch) يقرأ أرقام الطلب والحوض والقطعة من جلود الملفات الممسوحة، فتُفهرس الملفات بدون إدخال يدوي. وقارنته بنماذج الرؤية العامة من حيث الدقة والسرعة وتكلفة الصفحة قبل اعتماده في مسار العمل.',
};

// --- new entries ------------------------------------------------------------------

const nextId = Math.max(...projects.map((p) => Number(p.id) || 0)) + 1;

const mowazze = {
  id: nextId,
  active: true,
  name: { en: 'Mowazze — Van-Sales Distribution SaaS', ar: 'موزّع — منصة البيع المتنقل للموزعين' },
  description: {
    en: 'A SaaS for distributors: sell, collect and close the day from a phone that works offline, while the owner follows every van from the web.',
    ar: 'منصة اشتراكات للموزعين: بيع وتحصيل وتسكير اليوم من موبايل يعمل بدون إنترنت، وصاحب المؤسسة يتابع كل سيارة من الويب.',
  },
  fullDescription: {
    en: 'Designed and built a van-sales product for independent distributors and distribution companies. On the phone, a distributor loads stock, sells in cash or on credit, collects payments, records returns and expenses, and closes the day with a cash count that shows the difference against what the system expects. On the web, the owner manages the warehouse, loads each van and reads every distributor’s sales, collections and closing differences.\n\nArchitecture: a .NET 10 modular monolith with Entity Framework Core and PostgreSQL, where every organization is isolated by row-level security and the app connects with a database role that cannot bypass it. Balances and stock are never edited by hand — they are computed from ledgers of movements. The mobile app (React Native, Expo) works fully offline: records get device-generated UUIDv7 ids and per-van invoice numbering, so re-syncing never duplicates and two offline vans never collide. Owner web app in React, Vite and Tailwind; shared TypeScript contract between them.\n\nAlso: subscription plans with a free trial, an Arabic in-app guide with an AI assistant that answers from it, Excel/PDF reports, and a Google Play release.',
    ar: 'صمّمت وبنيت منتجًا للبيع المتنقل للموزعين المستقلين ومؤسسات التوزيع. على الموبايل يحمّل الموزّع البضاعة، ويبيع نقدًا أو آجلًا، ويحصّل الدفعات، ويسجّل المرتجعات والمصاريف، ويسكّر يومه بعدّ النقد فيظهر الفرق عن المتوقع. وعلى الويب يدير صاحب المؤسسة المخزن، ويحمّل كل سيارة، ويقرأ مبيعات كل موزّع وتحصيله وفروقات تسكيره.\n\nالمعمارية: Modular Monolith على ‎.NET 10 مع Entity Framework Core وPostgreSQL، وكل مؤسسة معزولة بـRow-Level Security والتطبيق يتصل بحساب قاعدة بيانات لا يستطيع تجاوز العزل. الأرصدة والمخزون لا تُعدَّل يدويًا بل تُحسب من دفاتر الحركات. تطبيق الموبايل (React Native وExpo) يعمل بالكامل بدون إنترنت: كل سجل يأخذ معرّف UUIDv7 من الجهاز وترقيم فواتير خاصًا بكل سيارة، فإعادة المزامنة لا تكرّر شيئًا ولا يتصادم موزّعان يعملان بدون اتصال. تطبيق المالك على الويب بـReact وVite وTailwind، مع عقد TypeScript مشترك بينهما.\n\nوأيضًا: خطط اشتراك مع تجربة مجانية، ودليل استخدام عربي داخل التطبيق مع مساعد ذكي يجيب منه، وتقارير Excel وPDF، ونشر على Google Play.',
  },
  link: [
    'https://distribution.alameenapps.com',
    'https://play.google.com/store/apps/details?id=com.alameenapps.distribution',
  ],
  images: [
    'projects/distribution/01.webp',
    'projects/distribution/02.webp',
    'projects/distribution/03.webp',
    'projects/distribution/04.webp',
    'projects/distribution/05.webp',
  ],
  videos: [],
};

const pocketforge = {
  id: nextId + 1,
  active: true,
  name: { en: 'PocketForge — AI Dev Workstation on Android', ar: 'بوكيت فورج — بيئة تطوير ذكية على الموبايل' },
  description: {
    en: 'A research prototype that turns an Android phone into a local AI coding workstation: agent sessions, tool approvals, and Android builds on the device.',
    ar: 'نموذج بحثي يحوّل هاتف Android إلى بيئة تطوير ذكية محلية: جلسات وكيل برمجي، وموافقة على الأدوات، وبناء تطبيقات Android على الجهاز نفسه.',
  },
  fullDescription: {
    en: 'An exploration of how far a phone can go as a development machine. The app runs AI coding-agent sessions on the device with a Linux-like toolchain, asks the user before each command or file change, and can install the Android SDK, build an app, sign the release and install or share it — all on the phone. Tools are exposed to the agent over MCP.\n\nBuilt in Kotlin with Jetpack Compose; the core is a tested Kotlin/JVM library, verified end-to-end on a real Android 16 device.\n\nStatus: proof of concept.',
    ar: 'تجربة لمعرفة إلى أي حد يمكن أن يكون الهاتف جهاز تطوير. يشغّل التطبيق جلسات وكيل برمجي ذكي على الجهاز مع أدوات شبيهة بـLinux، ويطلب موافقة المستخدم قبل كل أمر أو تعديل ملف، ويستطيع تثبيت Android SDK وبناء تطبيق وتوقيع الإصدار وتثبيته أو مشاركته — كله على الهاتف. والأدوات متاحة للوكيل عبر MCP.\n\nمبني بـKotlin وJetpack Compose، والنواة مكتبة Kotlin/JVM مختبرة، وتم التحقق منه من البداية للنهاية على جهاز Android 16 حقيقي.\n\nالحالة: نموذج أولي.',
  },
  link: [],
  images: ['projects/pocketforge/01.webp', 'projects/pocketforge/02.webp'],
  videos: [],
};

projects.push(mowazze, pocketforge);

// --- copy edits after review (Codex, DeepSeek, GLM) ------------------------------
// Formal Arabic instead of dialect, EN/AR saying the same thing, short
// descriptions within 50–170 characters, no filler.

const edits = {
  'Enterprise Water Management Platform': {
    description: {
      en: 'A modular national platform for water-sector operations: labs, water resources, distribution, wastewater, GIS and licensing behind one gateway, with an offline field app.',
      ar: 'منصة وطنية مكوّنة من وحدات لقطاع المياه: المختبرات وموارد المياه والتوزيع والصرف الصحي ونظم المعلومات الجغرافية والترخيص خلف بوابة واحدة، مع تطبيق ميداني يعمل دون اتصال.',
    },
    fullDescription: {
      en: 'I design and build a modular enterprise platform for public-sector water operations. Each domain — laboratories (LIMS), water resources, supply and distribution, wastewater treatment, GIS, licensing, billing and notifications — is its own module behind a shared gateway with single sign-on and two-factor authentication. The modules share platform services: configurable services and forms, workflow-driven processing, document generation, audit trails and outbox-based integrations.\n\nStack: .NET 10 with .NET Aspire and a YARP gateway, ASP.NET Core, Entity Framework Core, PostgreSQL/PostGIS, React 19 and TypeScript, MapLibre GL JS, Docker.\n\nField app: an offline-first React Native (Expo) companion for staff on site — sampling, meter reading, surveys and damage assessment. It saves records on the device and syncs them when the connection returns.\n\nFocus: shared platform capabilities, secure workflows and data integrity, so a new domain is added as a module instead of a separate system.',
      ar: 'أصمّم وأبني منصة مؤسسية مكوّنة من وحدات لعمليات قطاع المياه في الجهات العامة. لكل مجال وحدة مستقلة — المختبرات (LIMS)، وموارد المياه، والتزويد والتوزيع، ومعالجة مياه الصرف الصحي، ونظم المعلومات الجغرافية (GIS)، والترخيص، والفوترة، والإشعارات — خلف بوابة واحدة تدعم تسجيل الدخول الموحّد والتحقق بخطوتين. وتتشارك الوحدات خدمات المنصة: خدمات ونماذج قابلة للضبط، ومعالجة قائمة على مسارات العمل، وتوليد الوثائق، وسجل التدقيق، وتكاملات مبنية على نمط Outbox.\n\nالتقنيات: ‎.NET 10 مع ‎.NET Aspire وبوابة YARP، وASP.NET Core، وEntity Framework Core، وPostgreSQL/PostGIS، وReact 19 وTypeScript، وMapLibre GL JS، وDocker.\n\nالتطبيق الميداني: تطبيق مصاحب مبني بـReact Native (Expo) يعمل دون اتصال لموظفي الميدان — أخذ العينات، وقراءة العدادات، والمسوحات، وتقييم الأضرار. يحفظ السجلات على الجهاز ويزامنها عند عودة الاتصال.\n\nالتركيز: قدرات مشتركة للمنصة، ومسارات عمل آمنة، وسلامة البيانات، بحيث يُضاف أي مجال جديد كوحدة لا كنظام منفصل.',
    },
  },
  'Mowazze — Van-Sales Distribution SaaS': {
    name: { en: 'Mowazze — Van-Sales Distribution SaaS', ar: 'موزّع — منصة البيع المتنقل للموزّعين' },
    description: {
      en: 'A van-sales SaaS for distributors: sell, collect and close out the day offline on a phone, while the owner reviews each van’s sales and cash on the web.',
      ar: 'منصة سحابية بالاشتراك للموزّعين: البيع والتحصيل وإقفال اليوم من هاتف يعمل دون اتصال، ويراجع صاحب المؤسسة مبيعات كل مركبة ونقدها عبر الويب.',
    },
    fullDescription: {
      en: 'Designed and built a van-sales product for independent distributors and distribution companies. On the phone, a distributor loads stock, sells in cash or on credit, collects payments, records returns and expenses, and closes out the day with a cash count that shows the difference from what the system expects. On the web, the owner manages the warehouse, loads each van and reviews every distributor’s sales, collections and closing differences.\n\nArchitecture: a .NET 10 modular monolith with Entity Framework Core and PostgreSQL. Each organization is isolated by row-level security, and the application connects with a database role that cannot bypass it. Balances and stock are never edited by hand — they are computed from ledgers of movements. The mobile app (React Native, Expo) works fully offline: every record gets a device-generated UUIDv7 ID and each van has its own invoice numbering, so re-syncing never creates duplicates and two offline vans never issue the same invoice number. The owner web app uses React, Vite and Tailwind, with a TypeScript contract shared by the mobile and web apps.\n\nAlso: subscription plans with a free trial, an in-app Arabic guide with an AI assistant that answers based on it, Excel/PDF reports, and a Google Play release.',
      ar: 'صمّمت وبنيت منتجًا للبيع المتنقل للموزّعين المستقلين وشركات التوزيع. على الهاتف يحمّل الموزّع البضاعة، ويبيع نقدًا أو بالأجل، ويحصّل الدفعات، ويسجّل المرتجعات والمصروفات، ثم يُقفل يومه بجرد النقد فيظهر الفرق عن القيمة المتوقعة في النظام. وعبر الويب يدير صاحب المؤسسة المستودع، ويحمّل كل مركبة، ويراجع مبيعات كل موزّع وتحصيلاته وفروقات إقفاله.\n\nالمعمارية: Modular Monolith على ‎.NET 10 مع Entity Framework Core وPostgreSQL. كل مؤسسة معزولة بأمان مستوى الصفوف (Row-Level Security)، ويتصل التطبيق بحساب قاعدة بيانات لا يستطيع تجاوز هذا العزل. لا تُعدَّل الأرصدة والمخزون يدويًا، بل تُحسب من دفاتر الحركات. ويعمل تطبيق الهاتف (React Native وExpo) دون اتصال بالكامل: يحصل كل سجل على معرّف UUIDv7 يولّده الجهاز، ولكل مركبة ترقيم فواتير خاص بها، فلا تُنشئ إعادة المزامنة سجلات مكرّرة، ولا تصدر مركبتان تعملان دون اتصال رقم الفاتورة نفسه. وتطبيق المالك على الويب مبني بـReact وVite وTailwind، مع عقد TypeScript مشترك بين تطبيقي الهاتف والويب.\n\nوأيضًا: خطط اشتراك مع فترة تجريبية مجانية، ودليل استخدام عربي داخل التطبيق مع مساعد ذكي يجيب من محتواه، وتقارير Excel وPDF، وإصدار منشور على Google Play.',
    },
  },
  'E-Municipality Platform': {
    description: {
      en: 'Digital municipal services for citizens and staff: a web portal, branded mobile apps for seven municipalities from one codebase, and the staff workflow system.',
      ar: 'خدمات بلدية رقمية للمواطنين والموظفين: بوابة ويب، وتطبيقات هاتف تحمل هويات سبع بلديات من قاعدة شيفرة واحدة، ونظام مسارات العمل للموظفين.',
    },
    fullDescription: {
      en: 'I develop and maintain an e-government platform used by Palestinian municipalities, so citizens can apply for municipal services, pay fees and track their requests online.\n\nMobile: one React Native codebase (Expo, Hermes, EAS builds), published on Google Play for Tulkarm, Yabad, Aqqaba, Azzun, Al-Kum, Huwwara and Tarqumia. Each municipality gets its own build with its branding, services and settings.\n\nWeb: the citizen portal and PWA (React, Material UI) run on a .NET 8 REST API with Entity Framework Core and JWT authentication, and integrate with the municipalities’ existing systems over SOAP/WCF. Staff process requests in an ASP.NET MVC system with a configurable workflow engine.\n\nAlso: service-request tracking, PDF document generation, Arabic and English support, and the release pipeline for Android and iOS.',
      ar: 'أطوّر وأصون منصة حكومة إلكترونية تستخدمها بلديات فلسطينية، ليقدّم المواطنون طلبات الخدمات البلدية ويسدّدوا رسومها ويتابعوها إلكترونيًا.\n\nالهاتف: قاعدة شيفرة واحدة بـReact Native (Expo وHermes وبناءات EAS)، منشورة على Google Play لبلديات طولكرم ويعبد وعقابا وعزون والكوم وحوارة وترقوميا. ولكل بلدية نسخة بناء خاصة بهويتها وخدماتها وإعداداتها.\n\nالويب: بوابة المواطن وتطبيق PWA ‏(React وMaterial UI) يعملان على REST API مبني بـ‎.NET 8 وEntity Framework Core ومصادقة JWT، ويتكاملان مع أنظمة البلديات القائمة عبر SOAP/WCF. ويعالج الموظفون الطلبات في نظام مبني على ASP.NET MVC مع محرّك مسارات عمل قابل للضبط.\n\nوأيضًا: تتبع طلبات الخدمات، وتوليد مستندات PDF، ودعم العربية والإنجليزية، ومسار إصدار تطبيقات Android وiOS.',
    },
  },
  'Refugee Data Center': {
    description: {
      en: 'A web platform for managing refugee data, programs, allocations, disbursements, grants, projects and approval workflows.',
      ar: 'منصة ويب لإدارة بيانات اللاجئين وبرامجهم والمخصصات والصرف والمنح والمشاريع ومسارات الموافقة.',
    },
    fullDescription: {
      en: 'Refugee Data Center (funded by UNDP)\nA web platform for managing refugee data, financial allocations, disbursements, projects, grants and events. I worked on the approval workflows, step tracking and task dashboards; modernized the React and Material UI interfaces; introduced schema-driven forms; and improved lookups, attachments and the Arabic right-to-left experience. I also contributed to the .NET, Entity Framework Core and PostgreSQL backend and its JWT-secured APIs, with role-based permissions and error handling.',
      ar: 'مركز بيانات اللاجئين (بدعم من UNDP)\nمنصة ويب لإدارة بيانات اللاجئين والمخصصات المالية والصرف والمشاريع والمنح والفعاليات. عملت على مسارات الموافقة وتتبع المراحل ولوحات المهام، وحدّثت واجهات React وMaterial UI، وأدخلت نماذج مبنية على المخططات (Schema)، وحسّنت حقول البحث والاختيار والمرفقات وتجربة الواجهة العربية من اليمين إلى اليسار. كما ساهمت في الواجهة الخلفية المبنية على ‎.NET وEntity Framework Core وPostgreSQL وواجهات API المحمية بـJWT، مع الصلاحيات حسب الأدوار ومعالجة الأخطاء.',
    },
  },
  'Operation & Maintenance': {
    name: { en: 'Operations & Maintenance Dashboard', ar: 'لوحة متابعة التشغيل والصيانة' },
    description: {
      en: 'A bilingual operations and maintenance dashboard with workflow forms, searchable tables, file uploads and role-based access.',
      ar: 'لوحة تحكم ثنائية اللغة للتشغيل والصيانة، مع نماذج لمسارات العمل وجداول قابلة للبحث ورفع ملفات وصلاحيات حسب الأدوار.',
    },
    fullDescription: {
      en: 'Developed a React operations-and-maintenance dashboard with reusable Material UI components and schema-driven forms built with React Hook Form. Built Axios-based hooks for data fetching and error handling, added bilingual Arabic/English responsive layouts, and implemented searchable, paginated tables, file uploads, input validation and role-protected routes.',
      ar: 'طوّرت لوحة تحكم للتشغيل والصيانة مبنية بـReact، مع مكوّنات Material UI قابلة لإعادة الاستخدام ونماذج مبنية على المخططات باستخدام React Hook Form. وبنيت Hooks قابلة لإعادة الاستخدام فوق Axios لجلب البيانات ومعالجة الأخطاء، ودعمت العربية والإنجليزية بواجهات متجاوبة، وأضفت جداول قابلة للبحث ومقسّمة إلى صفحات، ورفع الملفات، والتحقق من صحة المدخلات، ومسارات محمية حسب الأدوار.',
    },
  },
  'Land Settlement Archiving': {
    description: {
      en: 'Python automation, JavaFX desktop tools and a compact OCR model for digitizing land-settlement archives.',
      ar: 'أدوات أتمتة بـPython وتطبيقات سطح مكتب بـJavaFX ونموذج صغير للتعرّف الضوئي على الحروف لرقمنة أرشيف تسوية الأراضي.',
    },
    fullDescription: {
      en: 'Built Python automation that cleans, extracts and validates Excel data for a land-settlement archiving initiative, and JavaFX desktop utilities that audit and merge scanned PDFs to support archive quality control.\n\nOCR: trained a compact CRNN model (about one million parameters, PyTorch) that reads the request, basin and parcel numbers from scanned folder covers, so files can be indexed without typing them in. Benchmarked it against general-purpose vision models on accuracy, speed and cost per page before choosing it for the pipeline.',
      ar: 'بنيت أدوات أتمتة بـPython تنظّف بيانات Excel وتستخرجها وتتحقق منها ضمن مشروع لأرشفة تسوية الأراضي، وتطبيقات سطح مكتب بـJavaFX لتدقيق ملفات PDF الممسوحة ضوئيًا ودمجها لدعم ضبط جودة الأرشيف.\n\nالتعرّف الضوئي على الحروف (OCR): درّبت نموذج CRNN صغيرًا (نحو مليون معامل، PyTorch) يقرأ أرقام الطلب والحوض والقطعة من أغلفة الملفات الممسوحة ضوئيًا، فتُفهرس الملفات دون إدخال يدوي. وقارنته بنماذج الرؤية العامة من حيث الدقة والسرعة وتكلفة الصفحة قبل اعتماده في مسار المعالجة.',
    },
  },
  'PocketForge — AI Dev Workstation on Android': {
    name: { en: 'PocketForge — AI Dev Workstation on Android', ar: 'بوكيت فورج — بيئة تطوير بالذكاء الاصطناعي على Android' },
    description: {
      en: 'A research prototype for AI-assisted coding on an Android phone: coding-agent sessions, approval before each command, and Android builds on the device.',
      ar: 'نموذج بحثي للبرمجة بمساعدة الذكاء الاصطناعي على هاتف Android: جلسات وكيل برمجي، وموافقة قبل كل أمر، وبناء تطبيقات Android على الجهاز نفسه.',
    },
    fullDescription: {
      en: 'An exploration of how far a phone can go as a development machine. The app runs AI coding-agent sessions on the device with a Linux-like toolchain, asks the user before each command or file change, and can install the Android SDK, build an app, sign the release and install or share it — all on the phone. Tools are exposed to the agent over MCP.\n\nBuilt in Kotlin with Jetpack Compose; the core is a tested Kotlin/JVM library, verified end-to-end on a real Android 16 device.\n\nStatus: proof of concept.',
      ar: 'تجربة لمعرفة إلى أي حد يمكن أن يكون الهاتف جهاز تطوير. يشغّل التطبيق على الجهاز جلسات وكيل برمجي يعمل بالذكاء الاصطناعي ضمن سلسلة أدوات شبيهة ببيئة Linux، ويطلب موافقة المستخدم قبل كل أمر أو تعديل للملفات، ويستطيع تثبيت Android SDK وبناء تطبيق وتوقيع الإصدار وتثبيته أو مشاركته، وكل ذلك على الهاتف. والأدوات متاحة للوكيل عبر بروتوكول MCP.\n\nمبني بـKotlin وJetpack Compose، ونواته مكتبة Kotlin/JVM مختبرة، وجرى التحقق منه بالكامل على جهاز Android 16 حقيقي.\n\nالحالة: نموذج أولي.',
    },
  },
  'Twitter Clone': {
    name: { en: 'Twitter Clone', ar: 'تطبيق يحاكي Twitter' },
    description: {
      en: 'A Twitter-style microblogging app with authentication, posting, reposting and following.',
      ar: 'تطبيق تدوين قصير على غرار Twitter، يدعم تسجيل الدخول والنشر وإعادة النشر والمتابعة.',
    },
    fullDescription: {
      en: 'Developed a Twitter clone with Javalin, Pebble, HTMX, Bootstrap and PostgreSQL. Implemented authentication, posting, reposting and following, a responsive interface, Docker containerization, and automated tests including Selenide-based integration tests.',
      ar: 'طوّرت تطبيقًا يحاكي Twitter باستخدام Javalin وPebble وHTMX وBootstrap وPostgreSQL. شمل العمل المصادقة والنشر وإعادة النشر والمتابعة، وواجهة متجاوبة، وتشغيل التطبيق داخل Docker، واختبارات آلية منها اختبارات تكامل باستخدام Selenide.',
    },
  },
  Rahlaty: {
    description: {
      en: 'A Flutter mobile app for local tours: booking, itineraries, personalized suggestions and group messaging.',
      ar: 'تطبيق Flutter للجولات المحلية: الحجز، وبرامج الرحلات، والاقتراحات المخصّصة، والمراسلة الجماعية.',
    },
    fullDescription: {
      en: 'Built Rahlaty, a Flutter mobile app for local tours and bookings. It includes tour booking, itinerary planning, personalized suggestions, user profiles, an admin panel for tours and bookings, group messaging for each tour, Firebase/Firestore data storage and weather API integration.',
      ar: 'بنيت تطبيق «رحلتي» باستخدام Flutter للجولات المحلية والحجوزات. يتضمن حجز الجولات، وتخطيط برامج الرحلات، والاقتراحات المخصّصة، والملفات الشخصية للمستخدمين، ولوحة إدارة للجولات والحجوزات، ومراسلة جماعية لكل جولة، وتخزين البيانات في Firebase/Firestore، والتكامل مع واجهة برمجية (API) لبيانات الطقس.',
    },
  },
  'PHP / SQL Task Manager': {
    description: {
      en: 'A university task-management web application demonstrating CRUD operations and role-based access.',
      ar: 'تطبيق ويب جامعي لإدارة المهام يطبّق عمليات CRUD والصلاحيات حسب الأدوار.',
    },
    fullDescription: {
      en: 'Built a university task-management web application that demonstrates CRUD operations. Users can create, view, update and delete tasks through a PHP backend and a SQL database, with role-based access control.',
      ar: 'بنيت تطبيق ويب جامعيًا لإدارة المهام يطبّق عمليات CRUD. يتيح للمستخدمين إنشاء المهام وعرضها وتعديلها وحذفها عبر واجهة خلفية مبنية بـPHP وقاعدة بيانات SQL، مع صلاحيات حسب الأدوار.',
    },
  },
  'Arabic 3-Gram Word Prediction': {
    name: { en: 'Arabic Next-Word Prediction (Trigram)', ar: 'التنبؤ بالكلمة التالية في النص العربي' },
    description: {
      en: 'An Arabic next-word prediction app built on a trigram (3-gram) language model.',
      ar: 'تطبيق للتنبؤ بالكلمة التالية في النص العربي باستخدام نموذج لغوي ثلاثي (3-gram).',
    },
    fullDescription: {
      en: 'Built an Arabic next-word prediction application in Java and JavaFX using a trigram language model. Users enter partial text and get likely next-word suggestions with their probabilities in an interactive desktop interface.',
      ar: 'بنيت تطبيقًا للتنبؤ بالكلمة التالية في النص العربي باستخدام Java وJavaFX ونموذج لغوي ثلاثي (3-gram). يكتب المستخدم نصًا جزئيًا فيحصل على اقتراحات للكلمة التالية مع احتمالاتها عبر واجهة سطح مكتب تفاعلية.',
    },
  },
  'Dijkstra Network Routing': {
    fullDescription: {
      en: 'Built an interactive JavaFX application that visualizes Dijkstra’s shortest-path algorithm. Users select source and destination nodes, and the application computes and displays the lowest-cost path and its total cost.',
      ar: 'بنيت تطبيقًا تفاعليًا بـJavaFX يوضّح خوارزمية Dijkstra لإيجاد أقصر مسار. يختار المستخدم عقدتي البداية والوجهة، ثم يحسب التطبيق المسار الأقل تكلفة ويعرضه مع تكلفته الإجمالية.',
    },
  },
  'Library Management System': {
    description: {
      en: 'A desktop library system in Java, JavaFX and MySQL for members, books, lending, returns and invoicing.',
      ar: 'نظام سطح مكتب لإدارة مكتبة مبني بـJava وJavaFX وMySQL، يشمل الأعضاء والكتب والإعارة والإرجاع والفواتير.',
    },
    fullDescription: {
      en: 'Built a library-management system with Java, JavaFX and MySQL covering employees, members, publishers, books, lending and returns, invoicing and operational statistics in a desktop interface.',
      ar: 'بنيت نظامًا لإدارة مكتبة باستخدام Java وJavaFX وMySQL يشمل الموظفين والأعضاء والناشرين والكتب وعمليات الإعارة والإرجاع والفواتير والإحصاءات التشغيلية، عبر واجهة لسطح المكتب.',
    },
  },
  'Ramallah A* Pathfinding': {
    fullDescription: {
      en: 'Built a JavaFX map application demonstrating A* pathfinding on real-world geography. Users choose a source and destination, and the application computes the shortest route and shows the path distance, an estimated travel time and the memory used by the search.',
      ar: 'بنيت تطبيق خرائط بـJavaFX يوضّح خوارزمية A* لإيجاد المسارات على بيانات جغرافية حقيقية. يختار المستخدم نقطة البداية والوجهة، فيحسب التطبيق أقصر طريق ويعرض المسافة وزمن الرحلة التقديري والذاكرة التي استهلكها البحث.',
    },
  },
};

for (const [en, fields] of Object.entries(edits)) Object.assign(byName(en), fields);
for (const p of projects) {
  if (Array.isArray(p.link)) p.link = p.link.filter((l) => typeof l === 'string' && l.trim());
  for (const f of ['description']) {
    for (const l of ['en', 'ar']) {
      const n = p[f]?.[l]?.length ?? 0;
      if (p.active !== false && (n < 50 || n > 170)) throw new Error(`${p.name.en} ${f}.${l}: ${n} chars (want 50–170)`);
    }
  }
}

// --- order: production work first, academic last --------------------------------

const order = [
  'Enterprise Water Management Platform',
  'Mowazze — Van-Sales Distribution SaaS',
  'E-Municipality Platform',
  'Refugee Data Center',
  'Operations & Maintenance Dashboard',
  'Land Settlement Archiving',
  'PocketForge — AI Dev Workstation on Android',
  'Twitter Clone',
  'Rahlaty',
  'PHP / SQL Task Manager',
  'Arabic Next-Word Prediction (Trigram)',
  'Dijkstra Network Routing',
  'Library Management System',
  'Ramallah A* Pathfinding',
  'eMunicipality',
];
for (const p of projects) {
  const i = order.indexOf(p.name?.en || p.name);
  if (i < 0) throw new Error(`no order for ${p.name?.en}`);
  p.order = i + 1;
}
projects.sort((a, b) => a.order - b.order);

const updated = { ...projectsSection, data: { ...projectsSection.data, projects } };
delete updated.lastUpdated;

const out = resolve(root, 'content-updates/2026-10-28-projects.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ timestamp: new Date().toISOString(), sections: [updated] }, null, 2));
console.log(`wrote ${out}: ${projects.filter((p) => p.active !== false).length} active projects`);
