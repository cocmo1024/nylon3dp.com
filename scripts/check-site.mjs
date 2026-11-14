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
// - database UX (B2): hub pages carry the build-time JSON payload for the
//   filter/sort island and one compare checkbox per entry; the comparison
//   tool pages carry their picker shell + payload; the B1-dropped
//   datasheet-note incidentals (± tolerances, unit conversions, laser
//   class) are restored verbatim on the entity pages
// - vendors & applications (B3): the vendor index carries an ItemList of
//   the 8 vendors; each vendor page's material/machine link counts match
//   the database (reverse references); the applications coverage matrix
//   renders with the two published drone guides linked; application pages
//   render their design-number block; material pages link back to the
//   application guides that recommend them
// - calculators (B4): the calculators index links both tools; the
//   refresh page renders the published definition, the formulas, the
//   defaults provenance and a worked example; the part-cost page's
//   grade payload and dropdown match the database's powder grades
//   (counts mirrored below), and the formula + disclaimer render
// - portal form (B4.5): the homepage renders the front-page anatomy
//   (lead story, news, ecosystem, depth, applications, data & tools)
//   with the live database counts and no article-stream heading; the
//   /news/ index renders its desk intro and the seeded item with an
//   ItemList; the Formnext lead feature renders with its sourced
//   claims labelled; sponsorship slots are disabled, so no
//   "Sponsored" text may appear anywhere in dist
// - i18n (B5): all six homepages render the portal anatomy (the six
//   data-section markers) with their locale's masthead headline; the
//   German database index pilot (/de/materials/, /de/machines/) pairs
//   hreflang with its English counterpart both ways — in the pages and
//   in the sitemap — carries the hub payload and German chrome, and a
//   Dataset JSON-LD under the localized URL
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
const EXPECTED_SITEMAP_URLS = 65; // 63 + B5: /de/materials/ + /de/machines/ (German database index pilot)
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

// --- database UX checks (B2) ---------------------------------------------
// Hub pages: the filter/sort island payload is serialised at build time
// (application/json, NOT ld+json), the static table exposes one row and
// one compare checkbox per entry, and rows are keyed by slug.
for (const [path, entries] of [['/materials/', 14], ['/machines/', 5]]) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (B2 hub check)`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('data-hub')) errors.push(`${path}: no [data-hub] island root`);
  const payloadMatch = html.match(/<script type="application\/json" data-hub-data>([\s\S]*?)<\/script>/);
  if (!payloadMatch) { errors.push(`${path}: no hub JSON payload script`); continue; }
  try {
    const payload = JSON.parse(payloadMatch[1]);
    const slugs = Object.keys(payload.rows ?? {});
    if (slugs.length !== entries) errors.push(`${path}: hub payload has ${slugs.length} rows, expected ${entries}`);
    for (const slug of slugs) {
      if (!html.includes(`data-slug="${slug}"`)) errors.push(`${path}: payload row ${slug} has no table row`);
      if (!html.includes(`class="cmp-check" value="${slug}"`)) errors.push(`${path}: no compare checkbox for ${slug}`);
    }
  } catch {
    errors.push(`${path}: hub JSON payload does not parse`);
  }
  if (!html.includes('data-no-matches')) errors.push(`${path}: no explicit no-matches state`);
}

// Comparison tool pages: picker shell (GET form with one checkbox per
// entry) + payload + result container must all be server-rendered.
for (const [path, entries] of [['/compare/materials/', 14], ['/compare/machines/', 5]]) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (B2 compare check)`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('data-compare')) errors.push(`${path}: no [data-compare] island root`);
  if (!html.includes('data-picker')) errors.push(`${path}: no picker form`);
  if (!html.includes('data-result')) errors.push(`${path}: no result container`);
  const checks = (html.match(/<input[^>]*name="sel"/g) || []).length;
  if (checks !== entries) errors.push(`${path}: picker has ${checks} checkboxes, expected ${entries}`);
  const payloadMatch = html.match(/<script type="application\/json" data-compare-data>([\s\S]*?)<\/script>/);
  if (!payloadMatch) { errors.push(`${path}: no compare JSON payload script`); continue; }
  try {
    const payload = JSON.parse(payloadMatch[1]);
    if ((payload.entries ?? []).length !== entries) {
      errors.push(`${path}: compare payload has ${(payload.entries ?? []).length} entries, expected ${entries}`);
    }
  } catch {
    errors.push(`${path}: compare JSON payload does not parse`);
  }
  if (!html.includes('does not publish')) errors.push(`${path}: missing "manufacturer does not publish" footnote`);
}

// --- datasheet-note incidentals restored (B2) -----------------------------
// B1 dropped these verbatim note fragments; B2 restores them on the
// entity pages (and only there — hubs/compare show structured values).
const NOTE_SPOT_CHECKS = [
  { path: '/materials/polymaker-polymide-pa6-cf/', values: ['±2.4', '±211'] },
  { path: '/materials/bambu-paht-cf/', values: ['±230'] },
  { path: '/machines/hp-jet-fusion-5200/', values: ['15 × 11.2 × 15 in'] },
  { path: '/machines/formlabs-fuse-1-plus-30w/', values: ['Class 1 laser product per EN 60825-1:2014'] },
  { path: '/machines/stratasys-h350/', values: ['5.07 gallon', '0.004 in'] },
];
for (const { path, values } of NOTE_SPOT_CHECKS) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (B2 note check)`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('Datasheet notes')) errors.push(`${path}: no "Datasheet notes" section`);
  for (const v of values) {
    if (!html.includes(v)) errors.push(`${path}: datasheet-note text "${v}" not restored`);
  }
}

// --- vendors & applications checks (B3) -----------------------------------
// Vendor index: ItemList JSON-LD listing all 8 vendor pages.
{
  const file = join(DIST, 'vendors', 'index.html');
  if (!existsSync(file)) errors.push('/vendors/: missing in dist (B3 vendor check)');
  else {
    const html = readFileSync(file, 'utf8');
    const blocks = parseLd(html, '/vendors/');
    const list = blocks.find((b) => b['@type'] === 'ItemList');
    if (!list) errors.push('/vendors/: no ItemList JSON-LD');
    else {
      if (list.numberOfItems !== 8) errors.push(`/vendors/: ItemList numberOfItems ${list.numberOfItems}, expected 8`);
      if ((list.itemListElement ?? []).length !== 8) errors.push('/vendors/: ItemList does not list 8 vendors');
      for (const item of list.itemListElement ?? []) {
        if (!String(item.url ?? '').startsWith(`${SITE}/vendors/`)) errors.push(`/vendors/: ItemList url ${item.url} is not a vendor page`);
      }
    }
  }
}
// Vendor pages: the material/machine entry links rendered must equal the
// database's reverse-reference counts for that vendor (mirrors the data
// layer; bump when a batch adds entries for a vendor).
const VENDOR_PRODUCT_COUNTS = {
  'eos': { materials: 3, machines: 2 },
  'hp': { materials: 1, machines: 1 },
  'formlabs': { materials: 3, machines: 1 },
  'stratasys': { materials: 0, machines: 1 },
  'basf-forward-am': { materials: 1, machines: 0 },
  'polymaker': { materials: 3, machines: 0 },
  'bambu-lab': { materials: 2, machines: 0 },
  'arkema': { materials: 1, machines: 0 },
};
for (const [slug, counts] of Object.entries(VENDOR_PRODUCT_COUNTS)) {
  const path = `/vendors/${slug}/`;
  const file = join(DIST, 'vendors', slug, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (B3 vendor check)`); continue; }
  const html = readFileSync(file, 'utf8');
  const matLinks = (html.match(/<a href="\/materials\/[a-z0-9-]+\/">/g) || []).length;
  const machLinks = (html.match(/<a href="\/machines\/[a-z0-9-]+\/">/g) || []).length;
  if (matLinks !== counts.materials) errors.push(`${path}: ${matLinks} material entry links, expected ${counts.materials}`);
  if (machLinks !== counts.machines) errors.push(`${path}: ${machLinks} machine entry links, expected ${counts.machines}`);
}
// Applications matrix: renders the taxonomy, links the drones hub and
// exactly the published guides.
{
  const file = join(DIST, 'applications', 'index.html');
  if (!existsSync(file)) errors.push('/applications/: missing in dist (B3 matrix check)');
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('matrix-table')) errors.push('/applications/: no coverage matrix table');
    for (const label of ['Drones &amp; UAV', 'Brackets &amp; mounts', 'Housings &amp; enclosures', 'Prosthetics &amp; orthotics']) {
      if (!html.includes(label)) errors.push(`/applications/: matrix axis label "${label}" not rendered`);
    }
    if (!html.includes('href="/applications/drones/"')) errors.push('/applications/: drones hub not linked');
    const guideLinks = (html.match(/status-live/g) || []).length;
    if (guideLinks !== 2) errors.push(`/applications/: ${guideLinks} published-guide cells, expected 2`);
    if (!html.includes('Planned')) errors.push('/applications/: no Planned cells rendered');
  }
}
// Application pages: the design-number block renders with its sourced
// values; the hub renders and links both guides.
const APP_SPOT_CHECKS = [
  { path: '/applications/drones/motor-mounts/', values: ['Design numbers', '0.6 mm', 'Recommended grades', 'EOS PA 3200 GF'] },
  { path: '/applications/drones/propeller-guards/', values: ['Design numbers', 'Propeller tip clearance', 'Formlabs Nylon 11'] },
];
for (const { path, values } of APP_SPOT_CHECKS) {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) { errors.push(`${path}: missing in dist (B3 application check)`); continue; }
  const html = readFileSync(file, 'utf8');
  if (!html.includes('design-numbers')) errors.push(`${path}: no design-numbers table`);
  for (const v of values) if (!html.includes(v)) errors.push(`${path}: expected content "${v}" not rendered`);
}
{
  const file = join(DIST, 'applications', 'drones', 'index.html');
  if (!existsSync(file)) errors.push('/applications/drones/: missing in dist (B3 hub check)');
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('href="/applications/drones/motor-mounts/"')) errors.push('/applications/drones/: motor-mounts guide not linked');
    if (!html.includes('href="/applications/drones/propeller-guards/"')) errors.push('/applications/drones/: propeller-guards guide not linked');
  }
}
// Material pages link back to the guides that recommend them.
{
  const file = join(DIST, 'materials', 'eos-pa-1101', 'index.html');
  if (!existsSync(file)) errors.push('/materials/eos-pa-1101/: missing in dist (B3 back-link check)');
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('href="/applications/drones/motor-mounts/"')) errors.push('/materials/eos-pa-1101/: no link to the motor-mounts guide');
    if (!html.includes('href="/applications/drones/propeller-guards/"')) errors.push('/materials/eos-pa-1101/: no link to the propeller-guards guide');
  }
}

// --- calculators (B4) ------------------------------------------------------
// Counts mirror the data layer (materials.ts): powder grades, and the
// subset whose structuredSpecs carry a printed-part density. Bump when
// a batch adds a powder grade or a density value.
const POWDER_GRADES_IN_DB = 9;
const POWDER_GRADES_WITH_DENSITY = 5;
{
  const file = join(DIST, 'calculators', 'index.html');
  if (!existsSync(file)) errors.push('/calculators/: missing in dist (B4 calculators check)');
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('href="/calculators/powder-refresh-ratio/"')) errors.push('/calculators/: refresh calculator not linked');
    if (!html.includes('href="/calculators/part-cost/"')) errors.push('/calculators/: part-cost estimator not linked');
    if (!html.includes('Methodology')) errors.push('/calculators/: methodology note missing');
  }
}
{
  const path = '/calculators/powder-refresh-ratio/';
  const file = join(DIST, 'calculators', 'powder-refresh-ratio', 'index.html');
  if (!existsSync(file)) errors.push(`${path}: missing in dist (B4 refresh check)`);
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('data-calc-refresh')) errors.push(`${path}: no [data-calc-refresh] island root`);
    if (!html.includes('proportion of new')) errors.push(`${path}: published refresh-ratio definition not quoted`);
    if (!html.includes('V = U × R ÷ (100 − R)')) errors.push(`${path}: target-mode formula not rendered`);
    if (!html.includes('R = V ÷ (U + V) × 100%')) errors.push(`${path}: actual-mode formula not rendered`);
    if (!html.includes('Pre-filled at 50%')) errors.push(`${path}: default-ratio provenance missing`);
    if (!html.includes('Worked example')) errors.push(`${path}: worked example missing`);
    if (!html.includes('Surplus aged powder (discard)')) errors.push(`${path}: worked-example surplus row missing`);
  }
}
{
  const path = '/calculators/part-cost/';
  const file = join(DIST, 'calculators', 'part-cost', 'index.html');
  if (!existsSync(file)) errors.push(`${path}: missing in dist (B4 cost check)`);
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('data-calc-cost')) errors.push(`${path}: no [data-calc-cost] island root`);
    const options = (html.match(/<option value="[a-z0-9-]+">/g) || []).length;
    if (options !== POWDER_GRADES_IN_DB) errors.push(`${path}: grade dropdown has ${options} options, expected ${POWDER_GRADES_IN_DB} powder grades`);
    const payloadMatch = html.match(/<script type="application\/json" data-calc-data>([\s\S]*?)<\/script>/);
    if (!payloadMatch) errors.push(`${path}: no calculator JSON payload script`);
    else {
      try {
        const payload = JSON.parse(payloadMatch[1]);
        const grades = payload.grades ?? [];
        if (grades.length !== POWDER_GRADES_IN_DB) errors.push(`${path}: payload has ${grades.length} grades, expected ${POWDER_GRADES_IN_DB}`);
        const withDensity = grades.filter((g) => g.density).length;
        if (withDensity !== POWDER_GRADES_WITH_DENSITY) errors.push(`${path}: payload has ${withDensity} grades with density, expected ${POWDER_GRADES_WITH_DENSITY}`);
        const withRefresh = grades.filter((g) => g.publishedRefresh).length;
        if (withRefresh !== 2) errors.push(`${path}: payload has ${withRefresh} grades with a published refresh figure, expected 2`);
      } catch {
        errors.push(`${path}: calculator JSON payload does not parse`);
      }
    }
    if (!html.includes('× (1 + w)')) errors.push(`${path}: allowance formula not rendered`);
    if (!html.includes('your powder price, your machine')) errors.push(`${path}: "estimates only" disclaimer missing`);
    if (!html.includes('Worked example')) errors.push(`${path}: worked example missing`);
    if (!html.includes('name="price"')) errors.push(`${path}: price input missing`);
    if (/<input[^>]*name="price"[^>]*\svalue=/.test(html)) errors.push(`${path}: price input carries a default value — prices are never defaulted`);
  }
}

// --- portal form (B4.5) ----------------------------------------------------
// Sponsorship slots are disabled (SPONSOR_SLOTS_ENABLED=false): nothing
// labelled "Sponsored" may reach the built site, anywhere.
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  if (html.includes('Sponsored')) errors.push(`${toUrlPath(f)}: contains "Sponsored" — ad slots must render nothing while disabled`);
}
// Homepage front-page anatomy: all six sections, the lead story, the
// live database counts, and no article-stream framing as the spine.
{
  const file = join(DIST, 'index.html');
  if (!existsSync(file)) errors.push('/: missing in dist (B4.5 portal check)');
  else {
    const html = readFileSync(file, 'utf8');
    for (const section of ['lead', 'news', 'ecosystem', 'depth', 'applications', 'data-tools']) {
      if (!html.includes(`data-section="${section}"`)) errors.push(`/: front-page section "${section}" missing`);
    }
    if (!html.includes('The nylon 3D printing industry hub')) errors.push('/: portal masthead headline missing');
    if (!html.includes('href="/guides/formnext-2026/"')) errors.push('/: lead story (Formnext 2026) not linked');
    if (!html.includes('Formnext 2026: the nylon watchlist')) errors.push('/: lead story headline missing');
    if (!html.includes('href="/news/"')) errors.push('/: news section not linked');
    if (!html.includes('href="/vendors/"')) errors.push('/: ecosystem (vendor directory) not linked');
    if (!html.includes('14 material grades · 5 machines · 8 vendors')) {
      errors.push('/: data & tools module does not state the database counts (14 grades · 5 machines · 8 vendors)');
    }
    if (html.includes("Editor's picks")) errors.push('/: contains an "Editor\u2019s picks" stream heading — the front page is a portal, not an article stream');
    if (html.includes('Featured grades')) errors.push('/: still carries the old "Featured grades" article-card section');
  }
}
// News index: desk intro + the seeded item + a parseable ItemList.
{
  const file = join(DIST, 'news', 'index.html');
  if (!existsSync(file)) errors.push('/news/: missing in dist (B4.5 news check)');
  else {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('Coverage begins with Formnext 2026')) errors.push('/news/: desk intro missing');
    if (!html.includes('no rumour roundups')) errors.push('/news/: desk intro (sourced, dated) missing');
    if (!html.includes('Formnext 2026: the nylon watchlist')) errors.push('/news/: seeded Formnext item not rendered');
    if (!html.includes('href="/guides/formnext-2026/"')) errors.push('/news/: seeded item not linked');
    if (!html.includes('datetime="2026-11-14"')) errors.push('/news/: seeded item date not rendered');
    const blocks = parseLd(html, '/news/');
    const list = blocks.find((b) => b['@type'] === 'ItemList');
    if (!list) errors.push('/news/: no ItemList JSON-LD');
    else {
      if (list.numberOfItems !== 1) errors.push(`/news/: ItemList numberOfItems ${list.numberOfItems}, expected 1 (seed)`);
      if (!String(list.itemListElement?.[0]?.url ?? '').endsWith('/guides/formnext-2026/')) {
        errors.push('/news/: ItemList first item is not the Formnext feature');
      }
    }
  }
}
// Lead feature page: the sourced preview renders, claims labelled.
{
  const path = '/guides/formnext-2026/';
  const file = join(DIST, 'guides', 'formnext-2026', 'index.html');
  if (!existsSync(file)) errors.push(`${path}: missing in dist (B4.5 lead check)`);
  else {
    const html = readFileSync(file, 'utf8');
    for (const v of ['the nylon watchlist', 'Hall 12.0', 'D71', 'Orgasol', 'claims are labelled as claims', 'up to 50%']) {
      if (!html.includes(v)) errors.push(`${path}: expected content "${v}" not rendered`);
    }
  }
}

// --- i18n portal + German hub pilot (B5) -----------------------------------
// All six homepages render the unified portal anatomy: the six section
// markers, in the locale's own masthead language (mirrors PORTAL_COPY).
const PORTAL_SECTIONS = ['lead', 'news', 'ecosystem', 'depth', 'applications', 'data-tools'];
const PORTAL_H1 = {
  en: 'The nylon 3D printing industry hub',
  de: 'Der Branchen-Hub für Nylon-3D-Druck',
  es: 'El centro del sector de la impresión 3D de nailon',
  pt: 'O centro do setor de impressão 3D de nylon',
  ja: 'ナイロン3Dプリント業界ハブ',
  zh: '尼龙3D打印行业中枢',
};
for (const [code, path] of Object.entries(HOME_CLUSTER)) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');
  if (!existsSync(file)) continue; // missing homepages already reported above
  const html = readFileSync(file, 'utf8');
  for (const section of PORTAL_SECTIONS) {
    if (!html.includes(`data-section="${section}"`)) {
      errors.push(`${path}: portal section "${section}" missing (B5 unified homepage)`);
    }
  }
  if (!html.includes(PORTAL_H1[code])) errors.push(`${path}: portal masthead headline (${code}) not rendered`);
  if (html.includes('Featured materials')) errors.push(`${path}: still carries the pre-B5 "Featured materials" home structure`);
}
// German database index pilot: each DE index pairs hreflang with its EN
// counterpart (en + de + x-default → EN), on both pages and in the
// sitemap; the DE pages carry the hub payload, German chrome and a
// Dataset JSON-LD under the localized URL.
for (const [base, entries] of [['/materials/', 14], ['/machines/', 5]]) {
  const pair = { en: SITE + base, de: `${SITE}/de${base}`, 'x-default': SITE + base };
  for (const path of [base, `/de${base}`]) {
    const file = join(DIST, path, 'index.html');
    if (!existsSync(file)) { errors.push(`${path}: missing in dist (B5 index-pair check)`); continue; }
    const html = readFileSync(file, 'utf8');
    const alts = new Map(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );
    for (const [lang, url] of Object.entries(pair)) {
      if (alts.get(lang) !== url) errors.push(`${path}: hreflang ${lang} = ${alts.get(lang)}, expected ${url}`);
    }
    if (alts.size !== 3) errors.push(`${path}: ${alts.size} alternate links, expected 3 (en/de/x-default)`);
    const block = sitemapXmlAll.split('<url>').find((b) => b.includes(`<loc>${SITE + path}</loc>`));
    if (!block) { errors.push(`sitemap: no <url> entry for ${path}`); continue; }
    const smAlts = new Map(
      [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );
    for (const [lang, url] of Object.entries(pair)) {
      if (smAlts.get(lang) !== url) errors.push(`sitemap ${path}: hreflang ${lang} = ${smAlts.get(lang)}, expected ${url}`);
    }
    if (smAlts.size !== 3) errors.push(`sitemap ${path}: ${smAlts.size} alternate links, expected 3`);
  }
  const dePath = `/de${base}`;
  const deFile = join(DIST, dePath, 'index.html');
  if (existsSync(deFile)) {
    const html = readFileSync(deFile, 'utf8');
    if (!html.includes('data-hub')) errors.push(`${dePath}: no [data-hub] island root`);
    if (!html.includes('Filter zurücksetzen')) errors.push(`${dePath}: German filter chrome (reset) not rendered`);
    if (!html.includes('Verfahren')) errors.push(`${dePath}: German filter chrome (process label) not rendered`);
    const payloadMatch = html.match(/<script type="application\/json" data-hub-data>([\s\S]*?)<\/script>/);
    if (!payloadMatch) errors.push(`${dePath}: no hub JSON payload script`);
    else {
      try {
        const payload = JSON.parse(payloadMatch[1]);
        const slugs = Object.keys(payload.rows ?? {});
        if (slugs.length !== entries) errors.push(`${dePath}: hub payload has ${slugs.length} rows, expected ${entries}`);
        if (!payload.ui?.countFiltered) errors.push(`${dePath}: hub payload carries no localised ui strings`);
      } catch {
        errors.push(`${dePath}: hub JSON payload does not parse`);
      }
    }
    const blocks = parseLd(html, dePath);
    const ds = blocks.find((b) => b['@type'] === 'Dataset');
    if (!ds) errors.push(`${dePath}: no Dataset JSON-LD`);
    else {
      if (ds.url !== `${SITE}${dePath}`) errors.push(`${dePath}: Dataset url ${ds.url}, expected ${SITE}${dePath}`);
      if (ds.creator?.['@id'] !== ORG_ID) errors.push(`${dePath}: Dataset creator @id ${ds.creator?.['@id']}, expected ${ORG_ID}`);
    }
  }
}

if (errors.length) {
  console.error(`check-site: ${errors.length} problem(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-site: OK — ${htmlFiles.length} HTML files, ${sitemapPaths.size} sitemap URLs, ${redirectsFrom.size} redirects`);
