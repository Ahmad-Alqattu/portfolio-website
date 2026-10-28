// Keeps <title>, the canonical <link>, and the description <meta> in sync
// with the current route. This is a client-rendered SPA with no
// server-side rendering, so every route otherwise serves the exact same
// static HTML — including a canonical tag that always points at the
// homepage. That tells search engines every other route is a duplicate of
// "/", which is why Search Console reports them as discovered/crawled but
// never indexed. Updating these tags after mount at least gives Google (it
// does execute JS before deciding whether to index) an accurate signal.

export const SITE_NAME = 'Ahmad Al-Qattu';
export const BASE_URL = 'https://ahmadalqatu.com';
export const DEFAULT_TITLE = 'Ahmad Al-Qattu - احمد لؤي امين القطو - Software Engineer Portfolio';
export const DEFAULT_DESCRIPTION =
  'Ahmad Al-Qattu - احمد لؤي امين القطو | Software Engineer & Web Developer specializing in React, Java, Python, JavaScript, TypeScript. Portfolio showcasing innovative software solutions, full-stack development projects, and modern web applications. Expert in building scalable applications with cutting-edge technologies.';

function setMetaTag(selector, createEl, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = createEl();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function updateDocumentMeta({ path, title, description }) {
  document.title = title || DEFAULT_TITLE;

  const canonicalUrl = `${BASE_URL}${path === '/' ? '/' : path}`;
  setMetaTag(
    'link[rel="canonical"]',
    () => {
      const link = document.createElement('link');
      link.rel = 'canonical';
      return link;
    },
    'href',
    canonicalUrl
  );

  setMetaTag(
    'meta[property="og:url"]',
    () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      return meta;
    },
    'content',
    canonicalUrl
  );

  setMetaTag(
    'meta[name="description"]',
    () => {
      const meta = document.createElement('meta');
      meta.name = 'description';
      return meta;
    },
    'content',
    description || DEFAULT_DESCRIPTION
  );
}
