// Keeps the live page's <head> in step with the route as the visitor
// scrolls or switches language. The prerendered HTML already ships the
// right tags for its URL; this only rewrites them in place afterwards,
// from the same builder (src/seo/site.js) so the two never disagree.
import { pageMeta } from '../seo/site';

function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

const meta = (attr, key) => () => {
  const el = document.createElement('meta');
  el.setAttribute(attr, key);
  return el;
};

export function updateDocumentMeta(sections, pathname) {
  if (!sections?.length) return;
  const m = pageMeta(sections, pathname);

  document.title = m.title;
  upsert('meta[name="description"]', meta('name', 'description'), { content: m.description });
  upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), { href: m.canonical });
  for (const a of m.alternates) {
    upsert(
      `link[rel="alternate"][hreflang="${a.hreflang}"]`,
      () => Object.assign(document.createElement('link'), { rel: 'alternate', hreflang: a.hreflang }),
      { href: a.href }
    );
  }
  upsert('link[rel="alternate"][type="text/markdown"]', () => Object.assign(document.createElement('link'), { rel: 'alternate', type: 'text/markdown' }), { href: m.markdown });

  const og = { 'og:title': m.title, 'og:description': m.description, 'og:url': m.canonical, 'og:image': m.ogImage, 'og:locale': m.ogLocale, 'og:locale:alternate': m.ogLocaleAlternate };
  Object.entries(og).forEach(([k, v]) => upsert(`meta[property="${k}"]`, meta('property', k), { content: v }));
  const tw = { 'twitter:title': m.title, 'twitter:description': m.description, 'twitter:image': m.ogImage };
  Object.entries(tw).forEach(([k, v]) => upsert(`meta[name="${k}"]`, meta('name', k), { content: v }));
}
