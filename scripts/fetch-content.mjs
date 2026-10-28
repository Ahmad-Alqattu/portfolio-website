// Fetches the public portfolio sections from Firestore at build time, the
// same way an anonymous visitor's browser reads them (public read rules +
// the public web API key), and writes them as plain JSON. Every build-time
// artifact (prerendered pages, sitemap, llms.txt, markdown pages) is
// generated from this one snapshot.
//
// Usage: node scripts/fetch-content.mjs [outFile]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const outFile = resolve(root, process.argv[2] || '.content/sections.json');

function loadEnv() {
  const env = { ...process.env };
  const file = resolve(root, '.env');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2];
    }
  }
  return env;
}

// Firestore REST returns typed values ({ stringValue: 'x' }); turn them back
// into what the web SDK's doc.data() would give the app.
function fromValue(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('referenceValue' in v) return v.referenceValue;
  if ('geoPointValue' in v) return v.geoPointValue;
  if ('bytesValue' in v) return v.bytesValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return fromFields(v.mapValue.fields || {});
  throw new Error(`Unknown Firestore value: ${JSON.stringify(v).slice(0, 80)}`);
}

function fromFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromValue(v)]));
}

export async function fetchSections() {
  const env = loadEnv();
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    throw new Error('VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_API_KEY are required (.env or environment)');
  }

  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/default-user/sections`;
  const docs = [];
  let pageToken = '';
  do {
    const url = `${base}?pageSize=100&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`Firestore read failed: ${res.status} ${await res.text()}`);
    const body = await res.json();
    docs.push(...(body.documents || []));
    pageToken = body.nextPageToken || '';
  } while (pageToken);

  const sections = docs.map((d) => ({ id: d.name.split('/').pop(), ...fromFields(d.fields || {}) }));
  sections.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  if (!sections.length) throw new Error('Firestore returned no sections; refusing to build an empty site');
  return sections;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sections = await fetchSections();
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(sections, null, 2));
  console.log(`fetch-content: ${sections.length} sections -> ${outFile}`);
}
