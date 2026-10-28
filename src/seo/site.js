// Single source of truth for everything crawlers and AI agents read:
// per-page <head> tags, JSON-LD, sitemap.xml, llms.txt / llms-full.txt and
// the markdown version of every page. Pure functions over the sections
// array, so the same code runs in the browser (documentMeta) and in Node at
// build time (scripts/prerender.mjs) — no window, no React, no Firebase.
import { localize } from '../utils/localize.js';

export const BASE_URL = 'https://ahmadalqatu.com';
export const LANGS = ['en', 'ar'];
export const DEFAULT_LANG = 'en';

const ROLE = { en: 'Full-Stack Software Engineer', ar: 'مهندس برمجيات Full-Stack' };
const FALLBACK_NAME = { en: 'Ahmad Al-Qattu', ar: 'أحمد القطو' };
// Spellings people search for; surfaced to search engines via JSON-LD.
const NAME_VARIANTS = [
  'أحمد لؤي أمين القطو', 'احمد لؤي امين القطو', 'أحمد القطو', 'احمد القطو',
  'Ahmad Luay Ameen Alqatu', 'Ahmad Luay Alqattu', 'Ahmad Alqattu', 'Ahmad Alqatu',
  'Ahmad Qattu', 'Ahmad Qatu', 'Ahmad Al-Qatu',
];

// ---------------------------------------------------------------------------
// URLs. English lives at the root, Arabic under /ar. The intro section is
// the homepage, so its own path is "/about" only as an alias.

export function langFromPath(pathname = '/') {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
}

export function stripLang(pathname = '/') {
  if (pathname === '/ar') return '/';
  if (pathname.startsWith('/ar/')) return pathname.slice(3) || '/';
  return pathname || '/';
}

export function withLang(path, lang) {
  const p = stripLang(path);
  if (lang !== 'ar') return p;
  return p === '/' ? '/ar' : `/ar${p}`;
}

export const absoluteUrl = (path) => `${BASE_URL}${path === '/' ? '/' : path}`;

const isIntro = (section) => (section.type || '').toLowerCase() === 'intro';

export function sectionPath(section) {
  return isIntro(section) ? '/about' : `/${section.id}`;
}

// Sections that render on the public page (mirrors MainComponent's filter).
export function publicSections(sections = []) {
  return sections
    .filter((s) => s.active !== false && s.visible !== false && s.type !== 'footerAndLinks')
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

const getSection = (sections, type) => sections.find((s) => (s.type || s.id) === type);

// ---------------------------------------------------------------------------
// Text helpers

const L = (field, lang) => {
  const v = localize(field, lang);
  return typeof v === 'string' ? v.trim() : '';
};

export function truncate(text, max = 158) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length).trim()}…`;
}

const active = (list) =>
  (Array.isArray(list) ? list : [])
    .filter((x) => x && x.active !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

const firstLink = (item) => {
  const links = Array.isArray(item.link) ? item.link : [item.link];
  return links.find((l) => typeof l === 'string' && /^https?:\/\//.test(l)) || '';
};

const httpsOnly = (u) => (typeof u === 'string' && /^https?:\/\//.test(u) ? u : '');

function person(sections, lang) {
  const intro = getSection(sections, 'intro') || {};
  const footer = getSection(sections, 'footerAndLinks') || {};
  const social = footer.data?.socialLinks || {};
  return {
    name: L(intro.name, lang) || FALLBACK_NAME[lang],
    altName: L(intro.name, lang === 'ar' ? 'en' : 'ar') || FALLBACK_NAME[lang === 'ar' ? 'en' : 'ar'],
    role: L(intro.data?.subtitle, lang) || ROLE[lang],
    summary: L(intro.content, lang),
    highlight: L(intro.data?.highlight, lang),
    image: httpsOnly(intro.data?.image),
    cv: httpsOnly(intro.data?.cvLink) || httpsOnly(footer.data?.cvLink),
    email: footer.data?.contactInfo?.email || '',
    location: footer.data?.contactInfo?.location || '',
    sameAs: [
      social.githubEnabled !== false && httpsOnly(social.github),
      social.linkedinEnabled !== false && httpsOnly(social.linkedin),
      social.facebookEnabled && httpsOnly(social.facebook),
    ].filter(Boolean),
  };
}

// ---------------------------------------------------------------------------
// Pages

// Every URL the site serves publicly, in both languages.
export function listPages(sections) {
  const pages = [];
  for (const lang of LANGS) {
    pages.push({ path: withLang('/', lang), basePath: '/', lang, section: null });
    for (const s of publicSections(sections)) {
      // /about is only an alias of the homepage: served, but canonical to "/".
      pages.push({ path: withLang(sectionPath(s), lang), basePath: sectionPath(s), lang, section: s, alias: isIntro(s) });
    }
  }
  return pages;
}

export function pageMeta(sections, pathname) {
  const lang = langFromPath(pathname);
  const basePath = stripLang(pathname);
  const p = person(sections, lang);
  const section =
    basePath === '/'
      ? null
      : publicSections(sections).find((s) => sectionPath(s) === basePath || `/${s.id}` === basePath) || null;

  const siteTitle = `${p.name} — ${p.role}`;
  let title = siteTitle;
  let description = truncate(p.summary || p.highlight || siteTitle);

  if (section && !isIntro(section)) {
    const sTitle = L(section.title, lang);
    title = `${sTitle} — ${p.name}`;
    // Short intros get the section's own items appended, so every page
    // has a description long enough to be used as the search snippet.
    const own = L(section.content, lang);
    const summary = sectionSummary(section, lang);
    description = truncate((own && own.length >= 90) || !summary ? own || description : [own, summary].filter(Boolean).join(' '));
  }

  const canonicalBase = section && !isIntro(section) ? sectionPath(section) : '/';
  const path = withLang(canonicalBase, lang);

  return {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    title,
    description,
    path,
    canonical: absoluteUrl(path),
    markdown: absoluteUrl(markdownPath(path)),
    alternates: [
      ...LANGS.map((l) => ({ hreflang: l, href: absoluteUrl(withLang(canonicalBase, l)) })),
      { hreflang: 'x-default', href: absoluteUrl(withLang(canonicalBase, DEFAULT_LANG)) },
    ],
    ogImage: `${BASE_URL}/og/${lang}.jpg`,
    ogLocale: lang === 'ar' ? 'ar_PS' : 'en_US',
    ogLocaleAlternate: lang === 'ar' ? 'en_US' : 'ar_PS',
    siteName: p.name,
    jsonLd: jsonLd(sections, lang, section, path),
  };
}

// A one-line summary for sections whose own "content" is empty.
function sectionSummary(section, lang) {
  const d = section.data || {};
  switch (section.type) {
    case 'projects':
      return active(d.projects).map((x) => L(x.name, lang)).filter(Boolean).join(', ');
    case 'experience':
      return active(d.experiences).map((x) => `${L(x.title, lang)} — ${L(x.company, lang)}`).join('; ');
    case 'education':
      return active(d.educationList || d.educations)
        .map((x) => `${L(x.major, lang)} — ${L(x.institution, lang)}`)
        .join('; ');
    case 'certificates':
      return active(d.certificates).map((x) => L(x.name, lang)).join(', ');
    default:
      return '';
  }
}

// ---------------------------------------------------------------------------
// JSON-LD

function jsonLd(sections, lang, section, path) {
  const p = person(sections, lang);
  const personId = `${BASE_URL}/#person`;
  const skills = getSection(sections, 'skills')?.data?.skillsList || {};
  const experience = active(getSection(sections, 'experience')?.data?.experiences);
  const education = active(
    getSection(sections, 'education')?.data?.educationList || getSection(sections, 'education')?.data?.educations
  );

  const personNode = {
    '@type': 'Person',
    '@id': personId,
    name: p.name,
    alternateName: [...new Set([p.altName, ...NAME_VARIANTS])].filter((n) => n !== p.name),
    knowsLanguage: ['en', 'ar'],
    jobTitle: p.role,
    description: p.summary || undefined,
    url: absoluteUrl(withLang('/', lang)),
    image: p.image || undefined,
    email: p.email ? `mailto:${p.email}` : undefined,
    sameAs: p.sameAs.length ? p.sameAs : undefined,
    knowsAbout: Object.values(skills)
      .flat()
      .map((s) => L(s, 'en'))
      .filter(Boolean),
    worksFor: experience[0] && L(experience[0].company, lang)
      ? { '@type': 'Organization', name: L(experience[0].company, lang) }
      : undefined,
    alumniOf: education
      .map((e) => L(e.institution, lang))
      .filter(Boolean)
      .map((name) => ({ '@type': 'CollegeOrUniversity', name })),
  };

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: `${BASE_URL}/`,
      name: p.name,
      inLanguage: ['en', 'ar'],
      publisher: { '@id': personId },
    },
    personNode,
  ];

  if (!section || isIntro(section)) {
    graph.push({
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl(path)}#page`,
      url: absoluteUrl(path),
      name: `${p.name} — ${p.role}`,
      inLanguage: lang,
      mainEntity: { '@id': personId },
      isPartOf: { '@id': `${BASE_URL}/#website` },
    });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: p.name, item: absoluteUrl(withLang('/', lang)) },
        { '@type': 'ListItem', position: 2, name: L(section.title, lang), item: absoluteUrl(path) },
      ],
    });
    if (section.type === 'projects') {
      graph.push({
        '@type': 'ItemList',
        name: L(section.title, lang),
        itemListElement: active(section.data?.projects).map((proj, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: L(proj.name, lang),
            description: truncate(L(proj.description, lang) || L(proj.fullDescription, lang), 300) || undefined,
            url: firstLink(proj) || undefined,
            image: httpsOnly((proj.images || [])[0]) || undefined,
            creator: { '@id': personId },
          },
        })),
      });
    }
  }

  return JSON.parse(JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }));
}

// ---------------------------------------------------------------------------
// <head> HTML (used by the prerenderer)

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function headTags(meta) {
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<link rel="canonical" href="${esc(meta.canonical)}">`,
    ...meta.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}">`),
    `<link rel="alternate" type="text/markdown" href="${esc(meta.markdown)}">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:site_name" content="${esc(meta.siteName)}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(meta.canonical)}">`,
    `<meta property="og:image" content="${esc(meta.ogImage)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="${meta.ogLocale}">`,
    `<meta property="og:locale:alternate" content="${meta.ogLocaleAlternate}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${esc(meta.ogImage)}">`,
    `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.join('\n    ');
}

// ---------------------------------------------------------------------------
// sitemap.xml

export function sitemapXml(sections, lastmod) {
  const urls = listPages(sections).filter((p) => p.lang === DEFAULT_LANG && !p.alias);
  const body = urls
    .map((page) => {
      const alts = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absoluteUrl(withLang(page.basePath, l))}"/>`
      ).join('\n');
      return LANGS.map(
        (l) =>
          `  <url>\n    <loc>${absoluteUrl(withLang(page.basePath, l))}</loc>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(page.basePath)}"/>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${page.basePath === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
      ).join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// Markdown (agents)

export function markdownPath(path) {
  return path === '/' ? '/index.md' : `${path}.md`;
}

const LABELS = {
  en: { contact: 'Contact', links: 'Links', cv: 'Resume (PDF)', other: 'Other language', site: 'Website', responsibilities: 'Responsibilities' },
  ar: { contact: 'التواصل', links: 'روابط', cv: 'السيرة الذاتية (PDF)', other: 'اللغة الأخرى', site: 'الموقع', responsibilities: 'المسؤوليات' },
};

function sectionMarkdown(section, lang) {
  const d = section.data || {};
  const out = [];
  const content = L(section.content, lang);
  if (content && !isIntro(section)) out.push(content, '');

  switch (section.type) {
    case 'intro': {
      if (L(d.highlight, lang)) out.push(`**${L(d.highlight, lang)}**`, '');
      if (content) out.push(content, '');
      break;
    }
    case 'capabilities':
      for (const c of active(d.capabilities)) out.push(`- **${L(c.title, lang)}** — ${L(c.description, lang)}`);
      break;
    case 'skills':
      for (const [group, items] of Object.entries(d.skillsList || {})) {
        out.push(`- **${group}:** ${(items || []).map((i) => L(i, lang)).filter(Boolean).join(', ')}`);
      }
      break;
    case 'projects':
      for (const proj of active(d.projects)) {
        out.push(`### ${L(proj.name, lang)}`, '');
        const desc = L(proj.fullDescription, lang) || L(proj.description, lang);
        if (desc) out.push(desc, '');
        const links = (Array.isArray(proj.link) ? proj.link : [proj.link]).filter((l) => httpsOnly(l));
        if (links.length) out.push(`${LABELS[lang].links}: ${links.map((l) => `<${l}>`).join(' · ')}`, '');
      }
      break;
    case 'experience':
      for (const e of active(d.experiences)) {
        const when = L(e.period, lang) || L(e.duration, lang);
        const where = [L(e.company, lang), L(e.location, lang)].filter(Boolean).join(', ');
        out.push(`### ${L(e.title, lang)} — ${where}${when ? ` (${when})` : ''}`, '');
        if (L(e.details, lang)) out.push(L(e.details, lang), '');
        const resp = (Array.isArray(e.responsibilities) ? e.responsibilities : []).map((r) => L(r, lang)).filter(Boolean);
        if (resp.length) out.push(...resp.map((r) => `- ${r}`), '');
      }
      break;
    case 'education':
      for (const e of active(d.educationList || d.educations)) {
        const when = L(e.duration, lang) || e.years || '';
        out.push(`### ${[L(e.degree, lang), L(e.major, lang)].filter(Boolean).join(' — ')} — ${L(e.institution, lang)}${when ? ` (${when})` : ''}`, '');
        if (L(e.details, lang)) out.push(L(e.details, lang), '');
      }
      break;
    case 'certificates':
      for (const c of active(d.certificates)) {
        const name = L(c.name, lang);
        const link = httpsOnly(c.link);
        out.push(`- ${link ? `[${name}](${link})` : name}${L(c.issuer, lang) ? ` — ${L(c.issuer, lang)}` : ''}${c.issueDate ? ` (${c.issueDate})` : ''}`);
      }
      break;
    default:
      break;
  }
  return out.join('\n').trim();
}

function contactMarkdown(sections, lang) {
  const p = person(sections, lang);
  const lines = [`## ${LABELS[lang].contact}`, ''];
  if (p.email) lines.push(`- Email: <mailto:${p.email}>`);
  for (const url of p.sameAs) lines.push(`- <${url}>`);
  if (p.cv) lines.push(`- [${LABELS[lang].cv}](${p.cv})`);
  if (p.location) lines.push(`- ${p.location}`);
  return lines.join('\n');
}

// Full page as markdown. For the homepage that's every section; a section
// URL gets just that section plus the contact block.
export function pageMarkdown(sections, pathname) {
  const meta = pageMeta(sections, pathname);
  const lang = meta.lang;
  const p = person(sections, lang);
  const basePath = stripLang(pathname);
  const list = publicSections(sections);
  const found = basePath === '/' ? null : list.find((s) => sectionPath(s) === basePath);
  const only = found && !isIntro(found) ? found : null;
  const other = meta.alternates.find((a) => a.hreflang === (lang === 'ar' ? 'en' : 'ar'));

  const parts = [
    `# ${only && !isIntro(only) ? `${L(only.title, lang)} — ${p.name}` : `${p.name} — ${p.role}`}`,
    '',
    `> ${meta.description}`,
    '',
    `${LABELS[lang].site}: <${meta.canonical}> · ${LABELS[lang].other}: <${other.href.replace(/\/?$/, '')}${other.href.endsWith('/') ? 'index.md' : '.md'}>`,
    '',
  ];
  for (const s of only ? [only] : list) {
    parts.push(`## ${L(s.title, lang)}`, '', sectionMarkdown(s, lang), '');
  }
  parts.push(contactMarkdown(sections, lang), '');
  return parts.join('\n').replace(/\n{3,}/g, '\n\n');
}

// https://llmstxt.org — a short index pointing agents at the markdown pages.
export function llmsTxt(sections) {
  const en = person(sections, 'en');
  const list = publicSections(sections);
  const link = (path, lang) => absoluteUrl(markdownPath(withLang(path, lang)));
  return [
    `# ${en.name} (${en.altName})`,
    '',
    `> ${en.role}. ${truncate(en.summary, 300)}`,
    '',
    'Bilingual personal portfolio (English at /, Arabic at /ar). Every page has a plain-markdown twin at the same URL with `.md` appended (the homepage is /index.md); the full content of the site in both languages is in /llms-full.txt.',
    '',
    '## Pages (English)',
    '',
    `- [Overview](${link('/', 'en')}): everything on one page`,
    ...list.filter((s) => !isIntro(s)).map((s) => `- [${L(s.title, 'en')}](${link(sectionPath(s), 'en')}): ${truncate(L(s.content, 'en') || sectionSummary(s, 'en'), 120)}`),
    '',
    '## Pages (Arabic)',
    '',
    `- [نظرة عامة](${link('/', 'ar')})`,
    ...list.filter((s) => !isIntro(s)).map((s) => `- [${L(s.title, 'ar')}](${link(sectionPath(s), 'ar')})`),
    '',
    '## Contact',
    '',
    ...(en.email ? [`- Email: ${en.email}`] : []),
    ...en.sameAs.map((u) => `- ${u}`),
    ...(en.cv ? [`- [Resume (PDF)](${en.cv})`] : []),
    '',
    '## Optional',
    '',
    `- [Full content, both languages](${BASE_URL}/llms-full.txt)`,
    `- [Sitemap](${BASE_URL}/sitemap.xml)`,
    '',
  ].join('\n');
}

export function llmsFullTxt(sections) {
  return `${pageMarkdown(sections, '/')}\n---\n\n${pageMarkdown(sections, '/ar')}`;
}
