// Writes the sections in a "Restore from File" JSON straight to Firestore —
// the same effect as the admin panel's Restore button (each section's fields
// are merged into its document). Uses the Firebase CLI login on this machine
// and saves a backup of every section first.
//
//   node scripts/content/restore-section.mjs content-updates/<file>.json
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const PROJECT = 'portfolio-8b0ca';
// The Firebase CLI's public OAuth client (firebase-tools lib/api.js).
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const file = process.argv[2];
if (!file) throw new Error('usage: restore-section.mjs <restore-file.json>');
const root = resolve(dirname(new URL(import.meta.url).pathname), '../..');

const cli = JSON.parse(readFileSync(join(homedir(), '.config/configstore/firebase-tools.json'), 'utf8'));
if (!cli.tokens?.refresh_token) throw new Error('not logged in: run `npx firebase-tools login`');
const token = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: cli.tokens.refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
  signal: AbortSignal.timeout(20000),
}).then((r) => r.json());
if (!token.access_token) throw new Error(`token: ${JSON.stringify(token).slice(0, 200)}`);
const headers = { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' };

const encode = (v) =>
  v === null || v === undefined ? { nullValue: null }
  : typeof v === 'boolean' ? { booleanValue: v }
  : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v })
  : typeof v === 'string' ? { stringValue: v }
  : Array.isArray(v) ? { arrayValue: { values: v.map(encode) } }
  : { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, encode(x)])) } };

const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/users/default-user/sections`;
const list = await fetch(`${base}?pageSize=100`, { headers, signal: AbortSignal.timeout(20000) }).then((r) => r.json());
if (!list.documents?.length) throw new Error(`list: ${JSON.stringify(list).slice(0, 200)}`);
mkdirSync(join(root, '.content'), { recursive: true });
const backup = join(root, `.content/firestore-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
writeFileSync(backup, JSON.stringify(list));
console.log(`backup: ${backup}`);

const { sections } = JSON.parse(readFileSync(resolve(file), 'utf8'));
for (const section of sections) {
  const doc = list.documents.find((d) => d.name.endsWith(`/${section.id}`))
    || list.documents.find((d) => d.fields?.type?.stringValue === section.type);
  if (!doc) throw new Error(`no document for section ${section.id}`);
  const fields = { ...section, lastUpdated: undefined };
  delete fields.lastUpdated;
  const mask = Object.keys(fields).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const res = await fetch(`https://firestore.googleapis.com/v1/${doc.name}?${mask}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(fields).map(([k, x]) => [k, encode(x)])) }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${section.id}: ${res.status} ${(await res.text()).slice(0, 300)}`);
  console.log(`updated ${doc.name.split('/').pop()} (${Object.keys(fields).join(', ')})`);
}
