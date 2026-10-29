// One-off content fixes (2026-10-29), from the site review:
//   - footer CV link -> the current resume (same file as the intro button)
//   - experience dates localized ("حتى الآن", "حزيران – آب"); Equiptal was 2024
//   - one Arabic term for "computer" (الحاسوب)
//
//   node scripts/content/2026-10-29-fixes.mjs  ->  content-updates/2026-10-29-fixes.json
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

const intro = sections.find((s) => s.type === 'intro');
const footer = section('footerAndLinks');
footer.data.cvLink = intro.data.cvLink;

const experience = section('experience');
const byCompany = (re) => {
  const e = experience.data.experiences.find((x) => re.test(x.company?.en || x.company));
  if (!e) throw new Error(`experience ${re} not found`);
  return e;
};
const setPeriod = (e, period) => {
  e.period = period;
  e.duration = period;
};
setPeriod(byCompany(/ameen/i), { en: '2023 – Present', ar: '2023 – حتى الآن' });
setPeriod(byCompany(/equiptal/i), { en: 'June – August 2024', ar: 'حزيران – آب 2024' });

const education = section('education');
const fixComputer = (v) => (typeof v === 'string' ? v.replace(/الحاسب الآلي/g, 'الحاسوب') : v);
for (const list of [education.data.educationList, education.data.educations]) {
  for (const e of list || []) {
    for (const el of e.electives || []) if (el && typeof el === 'object') el.ar = fixComputer(el.ar);
    for (const k of ['details', 'degree', 'major', 'description']) if (e[k] && typeof e[k] === 'object') e[k].ar = fixComputer(e[k].ar);
  }
}

const out = resolve(root, 'content-updates/2026-10-29-fixes.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ timestamp: new Date().toISOString(), sections: [footer, experience, education] }, null, 2));
console.log(`wrote ${out}`);
