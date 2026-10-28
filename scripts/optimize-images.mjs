// Makes small WebP copies of every image the public page shows (profile
// photo, project screenshots, certificates, logos) at a few widths, and a
// manifest mapping each original URL to them. The originals stay in
// Firebase Storage; src/utils/images.js swaps them for these copies when the
// manifest knows the URL, so an image added after the last build still shows.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1600];

function collect(sections) {
  const urls = new Set();
  const add = (u) => typeof u === 'string' && u && !/\.(mp4|webm|pdf)(\?|$)/i.test(u) && urls.add(u);
  for (const s of sections) {
    const d = s.data || {};
    add(d.image);
    (d.projects || []).forEach((p) => (p.images || []).forEach(add));
    (d.certificates || []).forEach((c) => add(c.image));
    (d.experiences || []).forEach((e) => add(e.logo));
    (d.educationList || d.educations || []).forEach((e) => add(e.logo));
  }
  return [...urls];
}

async function load(url, buildDir, cacheDir) {
  if (!/^https?:\/\//.test(url)) {
    const local = join(buildDir, url.replace(/\\/g, '/').replace(/^\/+/, ''));
    return existsSync(local) ? readFileSync(local) : null;
  }
  const cached = join(cacheDir, createHash('sha1').update(url).digest('hex'));
  if (existsSync(cached)) return readFileSync(cached);
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!res?.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(cached, buf);
  return buf;
}

export async function optimizeImages(sections, { buildDir, cacheDir }) {
  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(join(buildDir, 'img'), { recursive: true });
  const manifest = {};
  let before = 0;
  let after = 0;

  for (const url of collect(sections)) {
    const input = await load(url, buildDir, cacheDir);
    if (!input) {
      console.warn(`optimize-images: could not load ${url.slice(0, 90)}`);
      continue;
    }
    let meta;
    try {
      meta = await sharp(input).metadata();
    } catch {
      console.warn(`optimize-images: not an image ${url.slice(0, 90)}`);
      continue;
    }
    const id = createHash('sha1').update(input).digest('hex').slice(0, 12);
    const widths = WIDTHS.filter((w) => w < meta.width);
    if (!widths.length || meta.width <= WIDTHS[0] * 1.2) widths.push(meta.width);
    const variants = [];
    for (const w of [...new Set(widths)]) {
      const name = `img/${id}-${w}.webp`;
      const out = join(buildDir, name);
      if (!existsSync(out)) {
        await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(out);
      }
      variants.push({ w, src: `/${name}`, bytes: readFileSync(out).length });
    }
    before += input.length;
    after += variants[Math.min(1, variants.length - 1)].bytes;
    manifest[url] = {
      width: meta.width,
      height: meta.height,
      src: variants[Math.min(1, variants.length - 1)].src,
      srcSet: variants.map((v) => `${v.src} ${v.w}w`).join(', '),
    };
  }

  writeFileSync(join(buildDir, 'img/manifest.json'), JSON.stringify(manifest));
  console.log(
    `optimize-images: ${Object.keys(manifest).length} images, ${(before / 1048576).toFixed(1)} MB originals -> ${(after / 1048576).toFixed(1)} MB at the default width`
  );
  return manifest;
}
