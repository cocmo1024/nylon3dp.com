// Data-layer validation gate (rebuild batch B0). Runs BEFORE the build in
// `npm run verify` and fails loudly (exit 1) on any violation:
//
//   (a) schema / required-field completeness for every entity
//       (materials, machines, vendors, processes, applications + matrix)
//   (b) relation integrity — every vendorSlug / processSlug /
//       supportedMaterials / relatedApplications reference resolves; every
//       manufacturer string maps to exactly one vendor; each entity's
//       processSlug is the canonical mapping of its legacy `process` string
//   (c) CONSERVATION — for every material and machine, the multiset of
//       structuredSpecs values must be a subset of the numbers extractable
//       from that entry's legacy property/spec strings (label+value+note).
//       This is what proves the B0 migration added, rounded, converted or
//       dropped NOTHING: a structured value that does not appear verbatim
//       in the legacy strings (in the same multiplicity) fails the build.
//   (d) collection counts (bump EXPECTED when a batch adds entities)
//
// How the TS data modules are loaded: this repo has no esbuild package
// (Astro 7 builds with rolldown), but TypeScript itself is a devDependency,
// so the validator compiles src/data/*.ts to CommonJS in a temp dir with
// the repo's own tsc and requires the output. tsc type errors also fail
// the gate, which makes the interfaces part of the schema check.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILES = ['materials.ts', 'machines.ts', 'vendors.ts', 'processes.ts', 'applications.ts', 'types.ts'];
const EXPECTED = { materials: 16, machines: 8, vendors: 9, processes: 4 };
const PROCESS_SLUG_BY_LEGACY = { SLS: 'sls', 'SLS (Fuse series)': 'sls', MJF: 'mjf', SAF: 'saf', FDM: 'fdm' };

const errors = [];
const err = (m) => errors.push(m);

// --- compile + load -------------------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), 'nylon-data-'));
let data;
try {
  execFileSync(
    join(ROOT, 'node_modules', '.bin', 'tsc'),
    [
      ...DATA_FILES.map((f) => join('src', 'data', f)),
      '--outDir', tmp,
      '--module', 'commonjs',
      '--target', 'es2022',
      '--moduleResolution', 'node',
      '--skipLibCheck',
      '--strict',
      '--ignoreConfig',
      '--ignoreDeprecations', '6.0',
    ],
    { cwd: ROOT, stdio: 'pipe' },
  );
  const require = createRequire(join(tmp, 'load.js'));
  data = {
    MATERIALS: require(join(tmp, 'materials.js')).MATERIALS,
    MACHINES: require(join(tmp, 'machines.js')).MACHINES,
    VENDORS: require(join(tmp, 'vendors.js')).VENDORS,
    PROCESSES: require(join(tmp, 'processes.js')).PROCESSES,
    APPLICATIONS: require(join(tmp, 'applications.js')).APPLICATIONS,
    APPLICATION_INDUSTRIES: require(join(tmp, 'applications.js')).APPLICATION_INDUSTRIES,
    APPLICATION_PART_FAMILIES: require(join(tmp, 'applications.js')).APPLICATION_PART_FAMILIES,
    APPLICATION_MATRIX: require(join(tmp, 'applications.js')).APPLICATION_MATRIX,
  };
} catch (e) {
  console.error('validate-data: tsc failed to compile the data modules:');
  console.error(String(e.stdout ?? e.message));
  process.exit(1);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const { MATERIALS, MACHINES, VENDORS, PROCESSES, APPLICATIONS, APPLICATION_INDUSTRIES, APPLICATION_PART_FAMILIES, APPLICATION_MATRIX } = data;

// --- helpers ---------------------------------------------------------------
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isHttps = (v) => isStr(v) && v.startsWith('https://');
function checkStr(obj, field, where) {
  if (!isStr(obj[field])) err(`${where}: missing/empty string field "${field}"`);
}
function checkSources(obj, where) {
  if (!Array.isArray(obj.sources) || !obj.sources.length) err(`${where}: sources must be a non-empty array`);
  else for (const s of obj.sources) {
    if (!isStr(s.label)) err(`${where}: a source has no label`);
    if (!isHttps(s.url)) err(`${where}: source URL is not HTTPS: ${s.url}`);
  }
}
function checkSpecs(specs, where) {
  if (!Array.isArray(specs) || !specs.length) { err(`${where}: structuredSpecs must be a non-empty array`); return; }
  for (const s of specs) {
    if (!isStr(s.key)) err(`${where}: a structured spec has no key`);
    if (!isStr(s.label)) err(`${where} spec ${s.key}: no label`);
    if (typeof s.value !== 'number' || !Number.isFinite(s.value)) err(`${where} spec ${s.key}: value is not a finite number (${s.value})`);
    if (!isStr(s.unit)) err(`${where} spec ${s.key}: no unit`);
    for (const f of ['standard', 'orientation', 'note']) {
      if (s[f] !== undefined && !isStr(s[f])) err(`${where} spec ${s.key}: "${f}" must be a non-empty string when present`);
    }
  }
}
function uniqueSlugs(list, where) {
  const seen = new Set();
  for (const e of list) {
    if (!isStr(e.slug)) err(`${where}: an entry has no slug`);
    else if (seen.has(e.slug)) err(`${where}: duplicate slug "${e.slug}"`);
    seen.add(e.slug);
  }
  return seen;
}

// --- (d) counts -------------------------------------------------------------
for (const [key, list] of [['materials', MATERIALS], ['machines', MACHINES], ['vendors', VENDORS], ['processes', PROCESSES]]) {
  if (list.length !== EXPECTED[key]) err(`counts: expected ${EXPECTED[key]} ${key}, got ${list.length} (bump EXPECTED in validate-data.mjs when a batch adds entities)`);
}

// --- (a) schema ---------------------------------------------------------------
const vendorSlugs = uniqueSlugs(VENDORS, 'vendors');
for (const v of VENDORS) {
  const w = `vendor ${v.slug}`;
  for (const f of ['name', 'hqCountry', 'intro']) checkStr(v, f, w);
  if (!isHttps(v.officialSite)) err(`${w}: officialSite is not HTTPS: ${v.officialSite}`);
  if (!['material', 'machine', 'both'].includes(v.type)) err(`${w}: type "${v.type}" not in material|machine|both`);
  if (v.claimStatus !== undefined && !['unclaimed', 'claimed'].includes(v.claimStatus)) {
    err(`${w}: claimStatus "${v.claimStatus}" not in unclaimed|claimed`);
  }
  if (v.listingTier !== undefined && !['standard', 'enhanced', 'sponsored'].includes(v.listingTier)) {
    err(`${w}: listingTier "${v.listingTier}" not in standard|enhanced|sponsored`);
  }
  if (v.founded !== undefined && (!Number.isInteger(v.founded) || v.founded < 1600 || v.founded > 2026)) {
    err(`${w}: founded "${v.founded}" is not a plausible year`);
  }
  checkSources(v, w);
}

const processSlugs = uniqueSlugs(PROCESSES, 'processes');
const PROCESS_NUMERIC_FIELDS = ['minWallThicknessVertical', 'minWallThicknessHorizontal', 'minHoleDiameter', 'minEscapeHoleDiameter', 'layerThickness'];
for (const p of PROCESSES) {
  const w = `process ${p.slug}`;
  for (const f of ['name', 'fullName', 'family', 'fusionMechanism', 'quickAnswer', 'isotropyNote']) checkStr(p, f, w);
  if (p.supportNeeded !== undefined && typeof p.supportNeeded !== 'boolean') err(`${w}: supportNeeded must be boolean`);
  for (const f of PROCESS_NUMERIC_FIELDS) {
    const fv = p[f];
    if (fv === undefined) continue;
    if (typeof fv.value !== 'number' || !Number.isFinite(fv.value)) err(`${w}.${f}: value is not a finite number`);
    if (!isStr(fv.unit)) err(`${w}.${f}: no unit`);
    if (!isStr(fv.sourceLabel)) err(`${w}.${f}: no sourceLabel (numeric process fields must carry their source)`);
    if (!isHttps(fv.sourceUrl)) err(`${w}.${f}: sourceUrl is not HTTPS: ${fv.sourceUrl}`);
  }
  checkSources(p, w);
}

const materialSlugs = uniqueSlugs(MATERIALS, 'materials');
for (const m of MATERIALS) {
  const w = `material ${m.slug}`;
  for (const f of ['name', 'manufacturer', 'vendorSlug', 'basePolymer', 'form', 'process', 'processSlug', 'quickAnswer']) checkStr(m, f, w);
  if (!['Powder', 'Filament'].includes(m.form)) err(`${w}: form "${m.form}" not in Powder|Filament`);
  for (const f of ['intro', 'processing', 'properties', 'applications', 'faqs']) {
    if (!Array.isArray(m[f]) || !m[f].length) err(`${w}: "${f}" must be a non-empty array`);
  }
  if (!Array.isArray(m.relatedApplications)) err(`${w}: relatedApplications must be an array`);
  checkSpecs(m.structuredSpecs, w);
  checkSources(m, w);
}

const machineSlugs = uniqueSlugs(MACHINES, 'machines');
for (const mc of MACHINES) {
  const w = `machine ${mc.slug}`;
  for (const f of ['name', 'manufacturer', 'vendorSlug', 'process', 'processSlug', 'quickAnswer']) checkStr(mc, f, w);
  for (const f of ['intro', 'specs', 'notes', 'faqs']) {
    if (!Array.isArray(mc[f]) || !mc[f].length) err(`${w}: "${f}" must be a non-empty array`);
  }
  if (!Array.isArray(mc.supportedMaterials)) err(`${w}: supportedMaterials must be an array`);
  checkSpecs(mc.structuredSpecs, w);
  checkSources(mc, w);
}

const industrySlugs = uniqueSlugs(APPLICATION_INDUSTRIES, 'application industries');
const partFamilySlugs = uniqueSlugs(APPLICATION_PART_FAMILIES, 'application part families');
for (const cell of APPLICATION_MATRIX) {
  const w = `application matrix cell ${cell.industry}×${cell.partFamily}`;
  if (!industrySlugs.has(cell.industry)) err(`${w}: unknown industry slug`);
  if (!partFamilySlugs.has(cell.partFamily)) err(`${w}: unknown part-family slug`);
  if (!['candidate', 'in-progress', 'published'].includes(cell.status)) err(`${w}: bad status "${cell.status}"`);
}
const applicationSlugs = uniqueSlugs(APPLICATIONS, 'applications');
for (const a of APPLICATIONS) {
  const w = `application ${a.slug}`;
  if (!industrySlugs.has(a.industry)) err(`${w}: unknown industry "${a.industry}"`);
  if (!partFamilySlugs.has(a.partFamily)) err(`${w}: unknown part family "${a.partFamily}"`);
  for (const f of ['title', 'quickAnswer']) checkStr(a, f, w);
  if (!Array.isArray(a.intro) || !a.intro.length) err(`${w}: "intro" must be a non-empty array`);
  for (const f of ['selectionReasoning', 'designNumbers', 'failureModes', 'economicsVsConventional', 'faqs']) {
    if (!Array.isArray(a[f]) || !a[f].length) err(`${w}: "${f}" must be a non-empty array (the unique kernel is mandatory)`);
  }
  if (!Array.isArray(a.recommendedMaterials) || !a.recommendedMaterials.length) err(`${w}: "recommendedMaterials" must be a non-empty array`);
  if (!Array.isArray(a.processes) || !a.processes.length) err(`${w}: "processes" must be a non-empty array`);
  for (const s of a.recommendedMaterials ?? []) if (!materialSlugs.has(s)) err(`${w}: recommendedMaterials references unknown material "${s}"`);
  for (const s of a.processes ?? []) if (!processSlugs.has(s)) err(`${w}: processes references unknown process "${s}"`);
  checkSources(a, w);
}
// Matrix <-> application consistency (B3): a 'published' cell corresponds
// to exactly one application entry, and every application entry's cell is
// marked 'published'. Candidate/in-progress cells must have no entry.
{
  const cellKey = (industry, partFamily) => `${industry}×${partFamily}`;
  const appsByCell = new Map();
  for (const a of APPLICATIONS) {
    const k = cellKey(a.industry, a.partFamily);
    if (appsByCell.has(k)) err(`applications: two entries for matrix cell ${k}`);
    appsByCell.set(k, a);
  }
  const publishedCells = new Set();
  for (const cell of APPLICATION_MATRIX) {
    if (cell.status !== 'published') continue;
    const k = cellKey(cell.industry, cell.partFamily);
    publishedCells.add(k);
    if (!appsByCell.has(k)) err(`application matrix: cell ${k} is 'published' but has no application entry`);
  }
  for (const [k, a] of appsByCell) {
    if (!publishedCells.has(k)) err(`application ${a.slug}: cell ${k} is not marked 'published' in the matrix`);
  }
}

// --- (b) relation integrity ---------------------------------------------------
const vendorBySlug = new Map(VENDORS.map((v) => [v.slug, v]));
const manufacturerToVendors = new Map();
function checkEntityRelations(e, kind) {
  const w = `${kind} ${e.slug}`;
  if (!vendorSlugs.has(e.vendorSlug)) err(`${w}: vendorSlug "${e.vendorSlug}" does not resolve to a vendor`);
  else if (vendorBySlug.get(e.vendorSlug).name !== e.manufacturer) {
    err(`${w}: manufacturer "${e.manufacturer}" does not match vendor ${e.vendorSlug} ("${vendorBySlug.get(e.vendorSlug).name}")`);
  }
  if (!manufacturerToVendors.has(e.manufacturer)) manufacturerToVendors.set(e.manufacturer, new Set());
  manufacturerToVendors.get(e.manufacturer).add(e.vendorSlug);
  const expectedProcess = PROCESS_SLUG_BY_LEGACY[e.process];
  if (expectedProcess === undefined) err(`${w}: legacy process string "${e.process}" has no canonical processSlug mapping`);
  else if (e.processSlug !== expectedProcess) err(`${w}: processSlug "${e.processSlug}", expected "${expectedProcess}" for legacy process "${e.process}"`);
  if (!processSlugs.has(e.processSlug)) err(`${w}: processSlug "${e.processSlug}" does not resolve to a process`);
}
for (const m of MATERIALS) {
  checkEntityRelations(m, 'material');
  for (const s of m.relatedApplications) if (!applicationSlugs.has(s)) err(`material ${m.slug}: relatedApplications references unknown application "${s}"`);
}
for (const mc of MACHINES) {
  checkEntityRelations(mc, 'machine');
  for (const s of mc.supportedMaterials) if (!materialSlugs.has(s)) err(`machine ${mc.slug}: supportedMaterials references unknown material "${s}"`);
}
// Material <-> application back-references must agree (B3): a material is
// listed on an application page (recommendedMaterials) exactly when the
// application is listed on the material page (relatedApplications).
{
  const materialBySlug = new Map(MATERIALS.map((m) => [m.slug, m]));
  for (const a of APPLICATIONS) {
    for (const s of a.recommendedMaterials) {
      const m = materialBySlug.get(s);
      if (m && !m.relatedApplications.includes(a.slug)) {
        err(`relations: application ${a.slug} recommends material ${s}, but the material's relatedApplications does not link back`);
      }
    }
  }
  for (const m of MATERIALS) {
    for (const s of m.relatedApplications) {
      const a = APPLICATIONS.find((x) => x.slug === s);
      if (a && !a.recommendedMaterials.includes(m.slug)) {
        err(`relations: material ${m.slug} lists application ${s}, but the application does not recommend the material`);
      }
    }
  }
}
for (const [manufacturer, set] of manufacturerToVendors) {
  if (set.size !== 1) err(`relations: manufacturer "${manufacturer}" maps to ${set.size} vendors (${[...set].join(', ')}), expected exactly 1`);
}
const referencedVendors = new Set([...MATERIALS, ...MACHINES].map((e) => e.vendorSlug));
for (const v of VENDORS) if (!referencedVendors.has(v.slug)) err(`relations: vendor ${v.slug} is not referenced by any material or machine`);

// --- (c) conservation -----------------------------------------------------------
const extractNumbers = (strings) => {
  const multiset = new Map();
  for (const s of strings) {
    for (const match of String(s).matchAll(/-?\d+(?:\.\d+)?/g)) {
      const n = Number(match[0]);
      multiset.set(n, (multiset.get(n) ?? 0) + 1);
    }
  }
  return multiset;
};
let conservationPass = 0;
let totalSpecs = 0;
function checkConservation(e, legacyEntries, kind) {
  const where = `${kind} ${e.slug}`;
  const pool = extractNumbers(legacyEntries.flatMap((p) => [p.label, p.value, p.note ?? '']));
  let ok = true;
  for (const s of e.structuredSpecs) {
    totalSpecs++;
    const left = pool.get(s.value) ?? 0;
    if (left <= 0) {
      err(`${where}: CONSERVATION — structured spec ${s.key}=${s.value} ${s.unit} does not appear (with this multiplicity) in the legacy strings`);
      ok = false;
    } else pool.set(s.value, left - 1);
  }
  if (ok) { conservationPass++; console.log(`  conservation ${where}: PASS (${e.structuredSpecs.length} structured specs)`); }
}
for (const m of MATERIALS) checkConservation(m, m.properties, 'material');
for (const mc of MACHINES) checkConservation(mc, mc.specs, 'machine');

// --- verdict ---------------------------------------------------------------------
if (errors.length) {
  console.error(`validate-data: ${errors.length} problem(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(
  `validate-data: OK — ${MATERIALS.length} materials, ${MACHINES.length} machines, ${VENDORS.length} vendors, ` +
  `${PROCESSES.length} processes, ${APPLICATIONS.length} applications (${APPLICATION_MATRIX.length} matrix cells); ` +
  `conservation PASS ${conservationPass}/${MATERIALS.length + MACHINES.length} entities, ${totalSpecs} structured specs`,
);
