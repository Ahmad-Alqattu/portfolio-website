// Fails (exit 1) when the prerendered build regresses on what crawlers,
// agents and first-time visitors depend on:
//   - every page: real text in the HTML, title, description, canonical,
//     hreflang en/ar/x-default, og:image, valid JSON-LD, markdown twin
//   - sitemap.xml, llms.txt, llms-full.txt, robots.txt present
//   - JavaScript needed for first paint stays under the gzip budget
//
// Usage: node scripts/check-site.mjs   (after `npm run build`)
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { listPages, markdownPath } from '../src/seo/site.js';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const build = join(root, 'build');
const FIRST_LOAD_JS_BUDGET_KB = 200;
const MIN_TEXT_CHARS = 1500;

const problems = [];
const fail = (msg) => problems.push(msg);
const read = (rel) => readFileSync(join(build, rel), 'utf8');

const sections = JSON.parse(readFileSync(join(root, '.content/sections.json'), 'utf8'));
const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

for (const page of listPages(sections)) {
  const file = fileFor(page.path);
  if (!existsSync(join(build, file))) {
    fail(`${page.path}: missing ${file}`);
    continue;
  }
  const html = read(file);
  const tag = (re) => html.match(re)?.[1];
  const title = tag(/<title>([^<]*)<\/title>/);
  const desc = tag(/<meta name="description" content="([^"]*)"/);
  const lang = tag(/<html lang="([^"]+)"/);

  if (!title || title.length < 10 || title.length > 70) fail(`${page.path}: title length ${title?.length ?? 0} (want 10–70)`);
  if (!desc || desc.length < 50 || desc.length > 170) fail(`${page.path}: description length ${desc?.length ?? 0} (want 50–170)`);
  if (lang !== page.lang) fail(`${page.path}: <html lang="${lang}">, expected ${page.lang}`);
  if (!/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail(`${page.path}: no canonical`);
  for (const h of ['en', 'ar', 'x-default']) {
    if (!html.includes(`hreflang="${h}"`)) fail(`${page.path}: no hreflang ${h}`);
  }
  if (!/<meta property="og:image" content="https:\/\/[^"]+"/.test(html)) fail(`${page.path}: no og:image`);
  if (!/<meta name="twitter:card"/.test(html)) fail(`${page.path}: no twitter:card`);
  const ld = tag(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  try {
    if (!JSON.parse(ld)['@graph']?.length) fail(`${page.path}: empty JSON-LD`);
  } catch {
    fail(`${page.path}: invalid or missing JSON-LD`);
  }

  const body = html.split('<div id="root">')[1]?.split('<script>window.__INITIAL_DATA__')[0] || '';
  const text = body.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length < MIN_TEXT_CHARS) fail(`${page.path}: only ${text.length} chars of text in the HTML`);

  if (!existsSync(join(build, markdownPath(page.path).slice(1)))) fail(`${page.path}: missing markdown twin`);
}

for (const f of ['sitemap.xml', 'llms.txt', 'llms-full.txt', 'robots.txt', '404.html', 'app.html', 'og/en.jpg', 'og/ar.jpg']) {
  if (!existsSync(join(build, f))) fail(`missing ${f}`);
}
if (existsSync(join(build, '404.html')) && !read('404.html').includes('noindex')) fail('404.html is indexable');

// First-load JS: the entry script plus everything it modulepreloads.
const index = read('index.html');
const scripts = [
  ...index.matchAll(/<script type="module"[^>]*src="([^"]+)"/g),
  ...index.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g),
].map((m) => m[1]);
const firstLoadKb = scripts.reduce((sum, src) => sum + gzipSync(readFileSync(join(build, src))).length, 0) / 1024;
if (firstLoadKb > FIRST_LOAD_JS_BUDGET_KB) {
  fail(`first-load JS ${firstLoadKb.toFixed(1)} KB gzip > budget ${FIRST_LOAD_JS_BUDGET_KB} KB`);
}

if (problems.length) {
  console.error(`check-site: ${problems.length} problem(s)\n - ${problems.join('\n - ')}`);
  process.exit(1);
}
console.log(`check-site: OK — ${listPages(sections).length} pages, first-load JS ${firstLoadKb.toFixed(1)} KB gzip (budget ${FIRST_LOAD_JS_BUDGET_KB})`);
