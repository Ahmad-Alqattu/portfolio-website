// One-off content update (2026-10-29): the sections other than projects.
// Builds a restore file from the current Firestore snapshot.
//
//   node scripts/content/2026-10-29-sections.mjs  ->  content-updates/2026-10-29-sections.json
//
// Changes:
//   - intro: new profile photo
//   - contact: dialable phone number, bilingual location, one spelling of the name
//   - experience: the company's official name, Mowazze and the OCR work, the
//     Arabic terms used in the projects ("مكوّنة من وحدات", "الفوترة")
//   - capabilities: an AI item; "مبنية على المخططات"
//   - skills: no duplicates, categories that match the work, missing tools
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '../..');
const sections = JSON.parse(readFileSync(resolve(root, '.content/sections.json'), 'utf8'));
const section = (type) => {
  const s = sections.find((x) => x.type === type);
  if (!s) throw new Error(`no ${type} section`);
  const copy = structuredClone(s);
  delete copy.lastUpdated;
  return copy;
};

// --- intro -------------------------------------------------------------------------

// New profile photo (Al-Ameen Technologies booth, suit), served from public/.
const intro = section('intro');
intro.data.image = 'profile/ahmad.webp';

// --- contact -----------------------------------------------------------------------

const footer = section('footerAndLinks');
footer.data.contactInfo.phone = '+970 59 868 2679';
footer.data.contactInfo.location = { en: 'Ramallah, Palestine', ar: 'رام الله، فلسطين' };
footer.data.copyrightText = 'Ahmad Al-Qattu';

// --- experience ----------------------------------------------------------------------

const experience = section('experience');
const alameen = experience.data.experiences.find((e) => /ameen/i.test(e.company?.en || e.company));
if (!alameen) throw new Error('Al-Ameen experience not found');
alameen.company = { en: 'Al-Ameen Technologies', ar: 'شركة الأمين للتقنيات' };
alameen.details = {
  en: 'I build and maintain production software: enterprise web platforms, mobile apps, APIs and integrations, and the deployments behind them. Recent work includes a modular public-sector water-management platform (laboratories, water resources, distribution, wastewater, GIS, licensing, billing and notifications, all built on shared services, forms and workflows), Mowazze, a van-sales SaaS with an offline-first mobile app, and municipal e-services and their mobile apps. I take projects from client requirements through implementation, testing and release, and stay on for production support.',
  ar: 'أطوّر برمجيات تعمل في بيئة الإنتاج وأصونها، وتشمل منصات ويب مؤسسية، وتطبيقات هاتف، وواجهات API، وتكاملات، وعمليات النشر الخاصة بها. ويشمل عملي الأخير منصة لإدارة المياه في القطاع العام مكوّنة من وحدات (المختبرات، وموارد المياه، والتوزيع، والصرف الصحي، ونظم المعلومات الجغرافية، والترخيص، والفوترة، والإشعارات)، مبنية على خدمات ونماذج ومسارات عمل مشتركة، ومنصة «موزّع» للبيع المتنقل مع تطبيق هاتف يعمل دون اتصال، والخدمات البلدية الإلكترونية وتطبيقاتها على الهاتف. وأتولّى المشروع من متطلبات العميل إلى التنفيذ والاختبار والإصدار، ثم دعم الإنتاج.',
};
// Mowazze first: it is the product he owned end to end. One verb form throughout
// (base form in English, verbal noun in Arabic).
alameen.responsibilities = [
  {
    en: 'Build Mowazze end to end: a .NET 10 modular monolith that isolates each organization with PostgreSQL row-level security, an offline-first React Native app and a React owner dashboard.',
    ar: 'بناء منصة «موزّع» من البداية إلى النهاية: نظام Modular Monolith على ‎.NET 10 يعزل بيانات كل مؤسسة عبر أمان مستوى الصفوف (Row-Level Security) في PostgreSQL، مع تطبيق React Native يعمل دون اتصال، ولوحة تحكم للمالك مبنية بـReact.',
  },
  {
    en: 'Build full-stack enterprise modules with ASP.NET Core, Entity Framework Core, PostgreSQL, React and TypeScript.',
    ar: 'تطوير وحدات مؤسسية متكاملة (Full-Stack) باستخدام ASP.NET Core وEntity Framework Core وPostgreSQL وReact وTypeScript.',
  },
  {
    en: 'Design and implement reusable platform building blocks: workflows, configurable services and forms, licensing, billing rules, document generation, permissions, audit logging and integrations.',
    ar: 'تصميم وتنفيذ مكوّنات مشتركة قابلة لإعادة الاستخدام: مسارات العمل، والخدمات والنماذج القابلة للتهيئة، والترخيص، وقواعد الفوترة، وإنشاء المستندات، والصلاحيات، وسجلات التدقيق، والتكاملات.',
  },
  {
    en: 'Develop data-intensive, GIS-enabled modules for laboratories, water resources, distribution, wastewater and operational monitoring.',
    ar: 'تطوير وحدات كثيفة البيانات تدعم نظم المعلومات الجغرافية للمختبرات وموارد المياه والتوزيع والصرف الصحي والمراقبة التشغيلية.',
  },
  {
    en: 'Build and release cross-platform municipal mobile apps with React Native and Expo, serving seven municipalities from one codebase.',
    ar: 'تطوير وإصدار تطبيقات بلدية متعددة المنصات باستخدام React Native وExpo، تخدم سبع بلديات من قاعدة برمجية واحدة.',
  },
  {
    en: 'Train a compact OCR model (PyTorch CRNN) that reads the numbers on scanned land-archive folder covers for indexing.',
    ar: 'تدريب نموذج صغير للتعرّف الضوئي (OCR) مبني على CRNN بـPyTorch، يقرأ الأرقام من أغلفة مجلدات أرشيف الأراضي الممسوح ضوئيًا لفهرستها.',
  },
  {
    en: 'Work directly with clients to refine requirements, diagnose production issues, deploy releases and support what ships.',
    ar: 'العمل مباشرة مع العملاء لتحديد المتطلبات وتشخيص مشكلات الإنتاج ونشر الإصدارات ودعم ما يُطلق منها.',
  },
];

// --- capabilities ----------------------------------------------------------------------

const capabilities = section('capabilities');
const list = capabilities.data.capabilities;
const cap = (re) => {
  const c = list.find((x) => re.test(x.title?.en));
  if (!c) throw new Error(`capability ${re} not found`);
  return c;
};
cap(/Front Ends/).description = {
  en: 'I build responsive, bilingual interfaces with React, TypeScript, Vite, Material UI and Tailwind CSS, with reusable components driven by data schemas.',
  ar: 'أبني واجهات متجاوبة وثنائية اللغة باستخدام React وTypeScript وVite وMaterial UI وTailwind CSS، مع مكوّنات قابلة لإعادة الاستخدام مبنية على مخططات البيانات.',
};
cap(/APIs/).description = {
  en: 'I design and integrate secure REST APIs and service-to-service workflows on ASP.NET Core, with authentication and authorization, legacy-system integrations and event-driven patterns.',
  ar: 'أصمم وأربط واجهات REST API آمنة وتكاملات بين الأنظمة باستخدام ASP.NET Core، مع المصادقة والصلاحيات، والتكامل مع الأنظمة القديمة، والأنماط القائمة على الأحداث.',
};
// Same term as the Mowazze line in experience ("offline-first" / "يعمل دون اتصال").
cap(/Mobile/).description = {
  en: 'I build cross-platform mobile applications with React Native, Expo and Flutter, including offline-first flows, bilingual interfaces and app-store release workflows.',
  ar: 'أطوّر تطبيقات هاتف متعددة المنصات باستخدام React Native وExpo وFlutter، بما يشمل العمل دون اتصال، والواجهات ثنائية اللغة، وتجهيز الإصدارات للمتاجر.',
};
cap(/Ship/).description = {
  en: 'I work with Git, Docker, Linux, CI/CD pipelines and IIS, handle production releases, and trace issues across the application and infrastructure to their root cause.',
  ar: 'أعمل مع Git وDocker وLinux وخطوط CI/CD وIIS، وأتولّى النشر إلى بيئة الإنتاج، وأتتبّع المشكلات في التطبيق والبنية التحتية حتى أصل إلى سببها الفعلي.',
};
const nextId = Math.max(...list.map((c) => Number(c.id) || 0)) + 1;
const nextOrder = Math.max(...list.map((c) => Number(c.order) || 0)) + 1;
if (!list.some((c) => /AI/.test(c.title?.en))) {
  list.push({
    id: nextId,
    order: nextOrder,
    active: true,
    title: { en: 'Apply AI Where It Pays Off', ar: 'توظيف الذكاء الاصطناعي حيث يفيد فعلًا' },
    description: {
      en: 'I train small task-specific models such as OCR for scanned archives, add assistants that answer from a product’s own documentation, and build tooling around AI coding agents — picking the model or tool by accuracy, speed and cost.',
      ar: 'أدرّب نماذج صغيرة لمهام محددة مثل التعرّف الضوئي في الأرشيف الممسوح ضوئيًا، وأضيف مساعدين أذكياء يجيبون من توثيق المنتج نفسه، وأبني أدوات حول وكلاء البرمجة بالذكاء الاصطناعي، وأختار النموذج أو الأداة حسب الدقة والسرعة والتكلفة.',
    },
  });
}

// --- skills ----------------------------------------------------------------------------

const skills = section('skills');
const s = (en, ar = en) => ({ en, ar });
skills.data.skillsList = {
  'Back-End': [
    s('ASP.NET Core'), s('.NET Aspire'), s('Entity Framework Core'), s('REST APIs'), s('OpenIddict'), s('YARP'),
    s('Java'), s('Spring Boot'), s('Javalin'), s('Python'), s('Django'), s('PHP'),
  ],
  'Front-End': [
    s('React'), s('TypeScript'), s('JavaScript'), s('Vite'), s('Material UI'), s('Tailwind CSS'),
    s('MapLibre GL JS'), s('HTML'), s('CSS'),
  ],
  Mobile: [s('React Native'), s('Expo'), s('Flutter'), s('Kotlin (Jetpack Compose)'), s('Android (Java)')],
  Databases: [
    s('PostgreSQL'), s('PostGIS'), s('Microsoft SQL Server'), s('MySQL'), s('Firebase / Firestore'), s('Redis / Valkey'),
  ],
  'AI & Data': [s('PyTorch'), s('OCR (CRNN)'), s('Power BI')],
  'Tools & Other': [s('Git'), s('Docker'), s('Linux'), s('GitHub Actions'), s('Playwright'), s('IIS'), s('JavaFX (desktop)')],
};

// ---------------------------------------------------------------------------------------

const out = resolve(root, 'content-updates/2026-10-29-sections.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ timestamp: new Date().toISOString(), sections: [intro, footer, experience, capabilities, skills] }, null, 2));
console.log(`wrote ${out}`);
