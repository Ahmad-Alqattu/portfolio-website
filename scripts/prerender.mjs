// Turns the built SPA in build/ into real HTML pages that search engines and
// AI agents can read without running JavaScript.
//
// For every public URL (both languages) it loads the built app in headless
// Chromium with the Firestore snapshot injected as window.__INITIAL_DATA__,
// waits until every section has rendered, and writes the resulting markup
// with that page's own <head> (title, description, canonical, hreflang, OG,
// JSON-LD from src/seo/site.js). It also writes sitemap.xml, llms.txt,
// llms-full.txt, a .md twin of every page, OG share images, 404.html and an
// empty app shell for the admin screens.
//
// Usage: node scripts/prerender.mjs [--offline]   (--offline reuses .content/sections.json)
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { fetchSections } from './fetch-content.mjs';
import { optimizeImages } from './optimize-images.mjs';
import {
  listPages, pageMeta, headTags, sitemapXml, llmsTxt, llmsFullTxt, pageMarkdown, markdownPath, publicSections,
} from '../src/seo/site.js';
import { localize } from '../src/utils/localize.js';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const buildDir = resolve(root, 'build');
const contentFile = resolve(root, '.content/sections.json');
const offline = process.argv.includes('--offline');

const write = (rel, body) => {
  const file = join(buildDir, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
};

// --- content -----------------------------------------------------------------

let sections;
if (offline && existsSync(contentFile)) {
  sections = JSON.parse(readFileSync(contentFile, 'utf8'));
} else {
  sections = await fetchSections();
  mkdirSync(dirname(contentFile), { recursive: true });
  writeFileSync(contentFile, JSON.stringify(sections, null, 2));
}

const shellPath = join(buildDir, 'index.html');
const shell = existsSync(join(buildDir, 'app.html'))
  ? readFileSync(join(buildDir, 'app.html'), 'utf8') // re-run on an already prerendered build
  : readFileSync(shellPath, 'utf8');
if (!shell.includes('<!-- seo:start') || !shell.includes('<!-- seo:end -->')) {
  throw new Error('build/index.html has no <!-- seo:start --> … <!-- seo:end --> block');
}
// The admin screens are client-only; they get the untouched shell.
write('app.html', shell);

const images = await optimizeImages(sections, { buildDir, cacheDir: resolve(root, '.content/img-cache') });

// --- static server over build/ (unknown paths fall back to the shell) ---------

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.woff2': 'font/woff2',
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(buildDir, url);
  if (file.startsWith(buildDir) && existsSync(file) && statSync(file).isFile() && url !== '/index.html') {
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
    return;
  }
  res.writeHead(200, { 'content-type': TYPES['.html'] });
  res.end(shell);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

// --- browser -------------------------------------------------------------------

async function launch() {
  const executablePath = process.env.PRERENDER_CHROME;
  try {
    return await chromium.launch(executablePath ? { executablePath } : {});
  } catch (err) {
    // Local machines often have Chrome but not Playwright's own build.
    return chromium.launch({ channel: 'chrome' }).catch(() => {
      throw err;
    });
  }
}
const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await context.addInitScript(({ data, imgs }) => {
  window.__INITIAL_DATA__ = data;
  window.__IMAGES__ = imgs;
}, { data: sections, imgs: images });
// Firestore/auth/analytics never load in the prerenderer (navigator.webdriver),
// but block them anyway so a stray request can't hang the run.
await context.route(/firestore\.googleapis\.com|identitytoolkit|google-analytics|googletagmanager/, (r) => r.abort());

const expectedIds = publicSections(sections).map((s) => s.id);

async function render(path, { notFound = false } = {}) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(origin + path, { waitUntil: 'load', timeout: 60000 });

  if (notFound) {
    await page.waitForSelector('[data-not-found]', { timeout: 30000 });
  } else {
    await page.waitForFunction(
      (ids) => ids.every((id) => document.getElementById(id)),
      expectedIds,
      { timeout: 30000 }
    );
    // Walk down the page so lazy-loaded blocks and scroll-in animations
    // reach their final state before the snapshot.
    await page.evaluate(async () => {
      const step = Math.max(300, window.innerHeight * 0.6);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      await new Promise((r) => setTimeout(r, 1200));
      window.scrollTo(0, 0);
      // Let the scroll-spy settle back on the first section.
      await new Promise((r) => setTimeout(r, 800));
    });
  }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  if (errors.length) throw new Error(`${path}: page errors: ${errors.join(' | ')}`);

  const snapshot = await page.evaluate(() => {
    // Emotion inserts its production styles with insertRule, which leaves
    // the <style> tags empty in the DOM; copy the rules out as text.
    const styles = [...document.querySelectorAll('style[data-emotion]')]
      .map((el) => {
        const css = el.sheet ? [...el.sheet.cssRules].map((r) => r.cssText).join('') : el.textContent;
        return css ? `<style data-emotion="${el.getAttribute('data-emotion')}" data-prerender>${css}</style>` : '';
      })
      .join('');
    return { root: document.getElementById('root').innerHTML, styles };
  });
  await page.close();
  return snapshot;
}

function assemble(meta, snapshot) {
  const start = shell.indexOf('<!-- seo:start');
  const end = shell.indexOf('<!-- seo:end -->') + '<!-- seo:end -->'.length;
  const data = JSON.stringify(sections).replace(/</g, '\\u003c');
  const imgs = JSON.stringify(images).replace(/</g, '\\u003c');
  let html = `${shell.slice(0, start)}${meta ? headTags(meta) : '<title>404</title>\n    <meta name="robots" content="noindex">'}${shell.slice(end)}`;
  html = html.replace(/<html[^>]*>/, `<html lang="${meta?.lang || 'en'}" dir="${meta?.dir || 'ltr'}">`);
  html = html.replace('</head>', `    ${snapshot.styles}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${snapshot.root}</div>\n    <script>window.__INITIAL_DATA__=${data};window.__IMAGES__=${imgs}</script>`);
  return html;
}

// /projects -> projects.html, /ar -> ar.html, / -> index.html; firebase.json's
// cleanUrls serves them without the extension.
const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

const pages = listPages(sections);
let count = 0;
for (const page of pages) {
  const snap = await render(page.path);
  const meta = pageMeta(sections, page.path);
  write(fileFor(page.path), assemble(meta, snap));
  write(markdownPath(page.path).slice(1), pageMarkdown(sections, page.path));
  count += 1;
}
write('404.html', assemble(null, await render('/__not-found__', { notFound: true })));

// --- OG share images (1200x630), one per language -------------------------------

const intro = sections.find((s) => s.type === 'intro') || {};
for (const lang of ['en', 'ar']) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  const name = localize(intro.name, lang) || 'Ahmad Al-Qattu';
  const role = localize(intro.data?.subtitle, lang) || '';
  const highlight = localize(intro.data?.highlight, lang) || '';
  // setContent pages are about:blank, so a public/ path needs the local origin.
  const image = intro.data?.image || '';
  const photo = !image || /^https?:\/\//.test(image) ? image : `${origin}/${image.replace(/^\/+/, '')}`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  await page.setContent(`<!doctype html><html dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><body style="margin:0">
    <div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;display:flex;align-items:center;gap:64px;
      font-family:system-ui,'Segoe UI','Noto Sans Arabic',sans-serif;color:#0f1f14;
      background:radial-gradient(circle at 85% 15%,#c8e6c9 0,transparent 45%),linear-gradient(135deg,#f4faf4,#e3f2e4)">
      ${photo ? `<img src="${esc(photo)}" style="width:300px;height:300px;border-radius:50%;object-fit:cover;border:10px solid #fff;box-shadow:0 20px 60px rgba(46,125,50,.25)">` : ''}
      <div style="flex:1">
        <div style="font-size:30px;font-weight:600;color:#2e7d32;margin-bottom:18px">${esc(role)}</div>
        <div style="font-size:76px;font-weight:800;line-height:1.05;margin-bottom:28px">${esc(name)}</div>
        <div style="font-size:32px;line-height:1.35;color:#33473a">${esc(highlight)}</div>
        <div style="font-size:26px;color:#2e7d32;margin-top:40px;font-weight:600">ahmadalqatu.com</div>
      </div>
    </div></body></html>`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  write(`og/${lang}.jpg`, await page.screenshot({ type: 'jpeg', quality: 86 }));
  await page.close();
}

await browser.close();
server.close();

// --- files for crawlers and agents --------------------------------------------

const lastmod = sections.map((s) => s.lastUpdated).filter(Boolean).sort().pop()?.slice(0, 10)
  || new Date().toISOString().slice(0, 10);
write('sitemap.xml', sitemapXml(sections, lastmod));
write('llms.txt', llmsTxt(sections));
write('llms-full.txt', llmsFullTxt(sections));

console.log(`prerender: ${count} pages, 404.html, app.html, ${count} .md, sitemap.xml, llms.txt, llms-full.txt, og/{en,ar}.jpg`);
