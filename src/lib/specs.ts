// Rendering helpers for the structured data layer (rebuild batch B1).
//
// Spec tables on entity pages render FROM `structuredSpecs` (the values
// B0 parsed verbatim out of the legacy free-text strings). Legacy rows
// that have NO structured counterpart — ranges ("280–300 °C"), composite
// text ("100 °C for 10 h") and pure-text rows ("Technology") — are
// returned by the fallback helpers below and rendered verbatim after the
// structured groups, so nothing the manufacturer published disappears.
//
// Coverage is decided per legacy row by mapping its label to the
// structured spec KEY it was parsed into (see the maps below — they are
// exhaustive over the labels present in the B0 data layer; a new legacy
// label without a mapping simply falls back to verbatim rendering).

import type { StructuredSpec } from '../data/types';
import type { Material } from '../data/materials';
import type { Machine } from '../data/machines';

/** Numbers render exactly as stored: 48 -> "48", 0.08 -> "0.08", 2 -> "2". */
export const fmtVal = (v: number): string => String(v);

export const fmtSpec = (s: StructuredSpec): string => `${fmtVal(s.value)} ${s.unit}`;

/** Standard and note joined for the last table column. */
export const specBasis = (s: StructuredSpec): string =>
  [s.standard, s.note].filter(Boolean).join(' · ');

export interface SpecGroup {
  key: string;
  label: string;
  specs: StructuredSpec[];
}

/** Group specs by key, preserving first-appearance order (the data order
 * follows the manufacturer's own datasheet order). The group label is the
 * first spec's label (e.g. "Ultimate tensile strength"). */
export function groupSpecs(specs: StructuredSpec[]): SpecGroup[] {
  const groups: SpecGroup[] = [];
  const byKey = new Map<string, SpecGroup>();
  for (const s of specs) {
    let g = byKey.get(s.key);
    if (!g) {
      g = { key: s.key, label: s.label, specs: [] };
      byKey.set(s.key, g);
      groups.push(g);
    }
    g.specs.push(s);
  }
  return groups;
}

// --- legacy-row -> structured-key coverage maps ---------------------------

const MATERIAL_KEY_BY_BASE_LABEL: Record<string, string> = {
  'Tensile strength': 'tensileStrength',
  'Ultimate tensile strength': 'tensileStrength',
  'Tensile strength at break': 'tensileStrength',
  'Tensile modulus': 'tensileModulus',
  "Young's modulus": 'tensileModulus',
  'Elongation at break': 'elongationAtBreak',
  Density: 'density',
  'Melting temperature': 'meltingTemperature',
  'Glass content': 'fillerContent',
  'Flexural modulus': 'flexuralModulus',
  'Notched Izod impact strength': 'impactStrength',
  Hardness: 'hardness',
  'Particle size, median': 'particleSizeD50',
  'Apparent density': 'apparentDensity',
  'Bio-based carbon content': 'bioBasedCarbonContent',
};

function materialRowKey(label: string): string | null {
  if (/^HDT @/.test(label) || label === 'Heat deflection temperature') return 'hdt';
  const base = label.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return MATERIAL_KEY_BY_BASE_LABEL[base] ?? null;
}

/** Legacy material property rows with no structured counterpart. */
export function materialFallbackRows(m: Material): Material['properties'] {
  const keys = new Set(m.structuredSpecs.map((s) => s.key));
  return m.properties.filter((p) => {
    const k = materialRowKey(p.label);
    return k === null || !keys.has(k);
  });
}

function machineRowKey(row: Machine['specs'][number]): string | null {
  if (/build (volume|size)/i.test(row.label)) {
    // "380 × 284 × 380 mm" was parsed into the three axis specs; a bare
    // capacity figure ("19.2 L") into buildVolumeCapacity.
    return row.value.includes('×') ? 'buildVolumeX' : 'buildVolumeCapacity';
  }
  if (row.label === 'Layer thickness') return 'layerThickness';
  if (row.label === 'Laser') return 'laserPower';
  return null; // 'Technology' and anything new: verbatim text row
}

/** Legacy machine spec rows with no structured counterpart. */
export function machineFallbackRows(m: Machine): Machine['specs'] {
  const keys = new Set(m.structuredSpecs.map((s) => s.key));
  return m.specs.filter((row) => {
    const k = machineRowKey(row);
    return k === null || !keys.has(k);
  });
}

// --- datasheet-note incidentals (B2 decision) ------------------------------
// B1's rendering switch dropped three classes of note text that live in
// the NOTES of legacy rows which DO have a structured counterpart (so the
// fallback rows above never see them): ± tolerances in filament property
// notes, imperial conversions in machine build/layer notes, and the Fuse
// laser's "Class 1 …" phrase. Decision (B2): those incidentals stay OUT
// of the hub tables and the comparison tool (which show structured values
// only), but they are manufacturer-published text, so entity pages restore
// them verbatim in a "Datasheet notes" section via the derivations below.
// The derivations are pattern-based and exhaustive over the current data:
// tolerances are the only ± figures in covered material notes; on the
// machine side the only covered notes carrying a standalone "in"/"gallon"
// conversion or a "Class N" phrase are the ones B1 dropped — notes that
// were carried into structured specs ("Per EOS system data sheet",
// "Single specified value, per Formlabs", …) match none of the patterns.

export interface NoteRow {
  label: string;
  text: string;
}

const TOLERANCE_RE = /±\s*\d+(?:\.\d+)?/g;

/** ± tolerance figures from covered material property notes, verbatim. */
export function materialNoteRows(m: Material): NoteRow[] {
  const keys = new Set(m.structuredSpecs.map((s) => s.key));
  const rows: NoteRow[] = [];
  for (const p of m.properties) {
    const k = materialRowKey(p.label);
    if (k === null || !keys.has(k) || !p.note) continue;
    const tolerances = p.note.match(TOLERANCE_RE);
    if (tolerances?.length) rows.push({ label: p.label, text: tolerances.join(', ') });
  }
  return rows;
}

/** Conversion / laser-class note text from covered machine spec rows. */
export function machineNoteRows(m: Machine): NoteRow[] {
  const keys = new Set(m.structuredSpecs.map((s) => s.key));
  const rows: NoteRow[] = [];
  for (const row of m.specs) {
    const k = machineRowKey(row);
    if (k === null || !keys.has(k) || !row.note) continue;
    if (/\bClass\s*\d/.test(row.note) || /\bin\b/.test(row.note) || /\bgallon\b/.test(row.note)) {
      rows.push({ label: row.label, text: row.note });
    }
  }
  return rows;
}

// --- index-page column picks ----------------------------------------------

/** Pick one representative spec for a database-index column: prefer a
 * specimen orientation from `orientations`, then a note containing
 * `noteIncludes`, then the first spec with the key. */
export function pickSpec(
  specs: StructuredSpec[],
  key: string,
  opts: { orientations?: string[]; noteIncludes?: string } = {},
): StructuredSpec | undefined {
  const withKey = specs.filter((s) => s.key === key);
  if (!withKey.length) return undefined;
  if (opts.orientations) {
    for (const o of opts.orientations) {
      const hit = withKey.find((s) => s.orientation === o);
      if (hit) return hit;
    }
  }
  if (opts.noteIncludes) {
    const hit = withKey.find((s) => s.note?.includes(opts.noteIncludes!));
    if (hit) return hit;
  }
  return withKey[0];
}

/** "380 × 284 × 380" from a machine's buildVolumeX/Y/Z specs, or null. */
export function buildVolumeString(m: Machine): string | null {
  const x = m.structuredSpecs.find((s) => s.key === 'buildVolumeX');
  const y = m.structuredSpecs.find((s) => s.key === 'buildVolumeY');
  const z = m.structuredSpecs.find((s) => s.key === 'buildVolumeZ');
  if (!x || !y || !z) return null;
  return `${fmtVal(x.value)} × ${fmtVal(y.value)} × ${fmtVal(z.value)}`;
}
