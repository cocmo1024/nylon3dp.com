// Post-build checks on dist/. Fails (exit 1) on any problem.
// - every HTML page: one <h1>, <title> (<= 70 chars), meta description 50-160 chars, canonical = own URL
// - every internal link points to a built page or file (or a _redirects source)
// - every sitemap URL exists and is not noindex; every indexable page is in the sitemap
// - llms.txt, llms-full.txt and robots.txt exist in dist
// - i18n pilot: the 5 localized homepages exist, each with the right <html lang>,
//   a self-referencing canonical and the full 7-entry hreflang cluster (also on
//   the English homepage); total sitemap URL count matches EXPECTED_SITEMAP_URLS
// - structured data: /materials/ and /machines/ carry a Dataset JSON-LD whose
//   creator @id is the site Organization @id; the materials Dataset entry
//   count equals the number of material entries linked from the index table
// - rendering switch (B1): spot-checked entity pages render a .spec-table
//   containing known structured values with their units
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://nylon3dp.com';
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const toUrlPath = (f) => {
  const rel = '/' + relative(DIST, f).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};
const exists = (path) => {
  const clean = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (clean === '') return true;
  const p = join(DIST, clean);
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};

const redirectsFrom = new Set(
  readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.split(/\s+/)[0]),
);

// Sitemap: @astrojs/sitemap emits sitemap-index.xml referencing sitemap-0.xml (and more).
const sitemapPaths = new Set();
let sitemapXmlAll = '';
const indexXml = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
const childSitemaps = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
if (!childSitemaps.length) errors.push('sitemap-index.xml: no child sitemaps listed');
for (const child of childSitemaps) {
  const childPath = join(DIST, child);
  if (!existsSync(childPath)) { errors.push(`sitemap-index.xml: missing child ${child}`); continue; }
  const xml = readFileSync(childPath, 'utf8');
  sitemapXmlAll += xml;
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapPaths.add(m[1].replace(SITE, ''));
}

for (const f of ['llms.txt', 'llms-full.txt', 'robots.txt']) {
  if (!existsSync(join(DIST, f))) errors.push(`dist: missing ${f}`);
}

const indexable = new Set();
for (const f of htmlFiles) {
  const path = toUrlPath(f);
  const html = readFileSync(f, 'utf8');
  const where = `${path}:`;
  if (path === '/404.html') continue;
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${where} has ${h1} <h1>`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&amp;/g, '&');
  if (!title) errors.push(`${where} missing <title>`);
  else if (title.length > 70) errors.push(`${where} title ${title.length} chars: ${title}`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) errors.push(`${where} missing description`);
  else if (desc.length > 160 || desc.length < 50) errors.push(`${where} description ${desc.length} chars`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canon !== SITE + path) errors.push(`${where} canonical ${canon}`);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex) indexable.add(path);
  if (noindex && sitemapPaths.has(path)) errors.push(`${where} noindex but in sitemap`);
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('//')) continue;
    if (!exists(href) && !redirectsFrom.has(href.split('?')[0])) errors.push(`${where} broken link ${href}`);
  }
}

for (const p of sitemapPaths) if (!exists(p)) errors.push(`sitemap: ${p} does not exist`);
for (const p of indexable) if (!sitemapPaths.has(p)) errors.push(`sitemap: indexable page ${p} missing`);
for (const line of readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'))) {
  const target = line.split(/\s+/)[1];
  if (target && target.startsWith('/') && !exists(target)) errors.push(`_redirects: target ${target} does not exist`);
}

// --- i18n pilot checks -------------------------------------------------
// Homepage cluster: en at the root plus de/es/pt/ja/zh homepages.
const EXPECTED_SITEMAP_URLS = 43; // 37 English URLs + 5 localized homepages + Arkema Rilsan Invent PA11
if (sitemapPaths.size !== EXPECTED_SITEMAP_URLS) {
  errors.push(`sitemap: expected ${EXPECTED_SITEMAP_URLS} URLs, got ${sitemapPaths.size}`);
}
const HOME_CLUSTER = { en: '/', de: '/de/', es: '/es/', pt: '/pt/', ja: '/ja/', zh: '/zh/' };
const HOME_HTML_LANG = { en: 'en', de: 'de', es: 'es', pt: 'pt', ja: 'ja', zh: 'zh-CN' };
for (const [code, path] of Object.entries(HOME_CLUSTER)) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: localized homepage missing in dist`); continue; }
  const html = readFileSync(file, 'utf8');
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  if (lang !== HOME_HTML_LANG[code]) errors.push(`${path}: html lang "${lang}", expected "${HOME_HTML_LANG[code]}"`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canon !== SITE + path) errors.push(`${path}: canonical ${canon}, expected ${SITE + path}`);
  const alts = new Map(
    [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );
  for (const [c, p] of Object.entries(HOME_CLUSTER)) {
    if (alts.get(c) !== SITE + p) errors.push(`${path}: hreflang ${c} = ${alts.get(c)}, expected ${SITE + p}`);
  }
  if (alts.get('x-default') !== SITE + '/') errors.push(`${path}: hreflang x-default = ${alts.get('x-default')}, expected ${SITE}/`);
  if (alts.size !== 7) errors.push(`${path}: ${alts.size} alternate links, expected 7`);
  // The sitemap entry for this homepage must carry the same 7 alternates.
  const block = sitemapXmlAll.split('<url>').find((b) => b.includes(`<loc>${SITE + path}</loc>`));
  if (!block) { errors.push(`sitemap: no <url> entry for ${path}`); continue; }
  const smAlts = new Map(
    [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );
  for (const [c, p] of Object.entries(HOME_CLUSTER)) {
    if (smAlts.get(c) !== SITE + p) errors.push(`sitemap ${path}: hreflang ${c} = ${smAlts.get(c)}, expected ${SITE + p}`);
  }
  if (smAlts.get('x-default') !== SITE + '/') errors.push(`sitemap ${path}: hreflang x-default = ${smAlts.get('x-default')}, expected ${SITE}/`);
  if (smAlts.size !== 7) errors.push(`sitemap ${path}: ${smAlts.size} alternate links, expected 7`);
}

// --- structured data checks (GEO plan item 5) ---------------------------
// Both database index pages must carry a Dataset JSON-LD whose creator is
// the site Organization (@id), and the materials Dataset entry count must
// match the number of material cards actually rendered on the page.
const ORG_ID = `${SITE}/#organization`;
const parseLd = (html, where) => {
  const blocks = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { blocks.push(JSON.parse(m[1])); } catch { errors.push(`${where} unparseable JSON-LD block`); }
  }
  return blocks;
};
for (const path of ['/materials/', '/machines/']) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (Dataset check)`); continue; }
  const html = readFileSync(file, 'utf8');
  const blocks = parseLd(html, path);
  const org = blocks.find((b) => b['@type'] === 'Organization');
  if (!org) errors.push(`${path}: no Organization JSON-LD`);
  else if (org['@id'] !== ORG_ID) errors.push(`${path}: Organization @id ${org['@id']}, expected ${ORG_ID}`);
  const ds = blocks.find((b) => b['@type'] === 'Dataset');
  if (!ds) { errors.push(`${path}: no Dataset JSON-LD`); continue; }
  if (ds.creator?.['@id'] !== ORG_ID) {
    errors.push(`${path}: Dataset creator @id ${ds.creator?.['@id']}, expected ${ORG_ID}`);
  }
  if (path === '/materials/') {
    const entries = (html.match(/<a href="\/materials\/[a-z0-9-]+\/">/g) || []).length;
    const stated = ds.description?.match(/for (\d+) nylon 3D printing materials/)?.[1];
    if (!stated) errors.push('/materials/: Dataset description states no entry count');
    else if (Number(stated) !== entries) {
      errors.push(`/materials/: Dataset states ${stated} materials, index table links ${entries} entries`);
    }
  }
}

// --- structured-spec rendering (B1 rendering switch) --------------------
// Entity pages must render their spec table FROM structuredSpecs: the
// table exists and known structured value+unit pairs appear in it.
const SPEC_SPOT_CHECKS = [
  { path: '/materials/eos-pa-2200/', values: ['48 MPa', '42 MPa', '1650 MPa'] },
  { path: '/materials/arkema-rilsan-invent-pa11/', values: ['46 µm', '0.49 g/cm³', '45 MPa'] },
  { path: '/machines/hp-jet-fusion-5200/', values: ['380 mm', '284 mm', '0.08 mm'] },
];
for (const { path, values } of SPEC_SPOT_CHECKS) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (spec rendering check)`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('class="spec-table"')) errors.push(`${path}: no .spec-table rendered`);
  for (const v of values) {
    if (!html.includes(v)) errors.push(`${path}: structured value "${v}" not rendered`);
  }
}

if (errors.length) {
  console.error(`check-site: ${errors.length} problem(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-site: OK — ${htmlFiles.length} HTML files, ${sitemapPaths.size} sitemap URLs, ${redirectsFrom.size} redirects`);
