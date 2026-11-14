// Build-side payload builders for the B2 database UX (hub filtering /
// sorting islands and the comparison tool). Everything here runs at
// build time: the values come from `structuredSpecs` — never from parsing
// display strings — and are serialised into the page as JSON for the
// client islands in lib/hub-client.ts and lib/compare-client.ts.
//
// Sort/filter keys only: a derived figure (build-envelope product, layer
// thickness normalised to µm) may be used to ORDER or FILTER rows, but it
// is never printed as a specification — the tables print exactly the
// values the hub pages already render from the data layer.

import type { Material } from '../data/materials';
import type { Machine } from '../data/machines';
import { pickSpec, buildVolumeString } from './specs';

const ORIENT_PREF = ['XY', 'X-Y', 'X'];

const pickVal = (
  specs: Material['structuredSpecs'] | Machine['structuredSpecs'],
  key: string,
  opts?: Parameters<typeof pickSpec>[2],
): number | null => pickSpec(specs, key, opts)?.value ?? null;

/** Filler filter category. The category follows the manufacturer's own
 * filler description: EOS PA 3200 GF is glass BEADS (per EOS), the
 * Formlabs GF grade's form is unspecified by Formlabs so it stays GF. */
export type FillerCategory = 'Unfilled' | 'GF' | 'CF' | 'GB';
export function fillerCategory(m: Material): FillerCategory {
  if (!m.filler) return 'Unfilled';
  if (/carbon/i.test(m.filler)) return 'CF';
  if (/bead/i.test(m.filler)) return 'GB';
  if (/glass/i.test(m.filler)) return 'GF';
  return 'Unfilled';
}

export interface MaterialHubRow {
  /** Filter values (exact-match selects). */
  f: { process: string; polymer: string; form: string; vendor: string; filler: FillerCategory };
  /** Sort values keyed by column; null sorts last. Strings compare as text. */
  s: Record<string, number | string | null>;
  /** Headline specs for the numeric threshold filters (same picks as the printed columns). */
  ts: number | null;
  hdt: number | null;
}

export function materialHubRow(m: Material): MaterialHubRow {
  const ts = pickVal(m.structuredSpecs, 'tensileStrength', { orientations: ORIENT_PREF });
  const hdt = pickVal(m.structuredSpecs, 'hdt', { noteIncludes: '1.8 MPa' });
  return {
    f: {
      process: m.processSlug,
      polymer: m.basePolymer,
      form: m.form,
      vendor: m.vendorSlug,
      filler: fillerCategory(m),
    },
    s: {
      name: m.name,
      manufacturer: m.manufacturer,
      polymer: m.basePolymer,
      form: m.form,
      process: m.process,
      tensileStrength: ts,
      tensileModulus: pickVal(m.structuredSpecs, 'tensileModulus', { orientations: ORIENT_PREF }),
      elongationAtBreak: pickVal(m.structuredSpecs, 'elongationAtBreak', { orientations: ORIENT_PREF }),
      hdt,
      density: pickVal(m.structuredSpecs, 'density'),
    },
    ts,
    hdt,
  };
}

export interface MachineHubRow {
  f: { process: string; vendor: string };
  s: Record<string, number | string | null>;
  /** Build envelope X×Y×Z in litres (filter threshold only, never printed). */
  envelopeL: number | null;
}

export function machineHubRow(m: Machine): MachineHubRow {
  const x = pickVal(m.structuredSpecs, 'buildVolumeX');
  const y = pickVal(m.structuredSpecs, 'buildVolumeY');
  const z = pickVal(m.structuredSpecs, 'buildVolumeZ');
  const envelopeMm3 = x !== null && y !== null && z !== null ? x * y * z : null;
  const layer = pickSpec(m.structuredSpecs, 'layerThickness');
  // Normalise the layer sort key to µm (HP states 0.08 mm; others µm).
  const layerUm = layer ? (layer.unit === 'mm' ? layer.value * 1000 : layer.value) : null;
  return {
    f: { process: m.processSlug, vendor: m.vendorSlug },
    s: {
      name: m.name,
      manufacturer: m.manufacturer,
      process: m.process,
      buildVolume: envelopeMm3,
      capacity: pickVal(m.structuredSpecs, 'buildVolumeCapacity'),
      layerThickness: layerUm,
      laserPower: pickVal(m.structuredSpecs, 'laserPower'),
    },
    envelopeL: envelopeMm3 !== null ? envelopeMm3 / 1_000_000 : null,
  };
}

// --- comparison payloads ---------------------------------------------------

export interface CompareEntry {
  slug: string;
  name: string;
  manufacturer: string;
  quickAnswer: string;
  /** Identity rows rendered above the spec union (label -> value). */
  identity: { label: string; value: string }[];
  /** Full structured spec set (the comparison shows ALL of them). */
  specs: Material['structuredSpecs'];
  /** Synthesised build-volume string for machines; null for materials. */
  buildVolume: string | null;
}

export function materialCompareEntry(m: Material): CompareEntry {
  return {
    slug: m.slug,
    name: m.name,
    manufacturer: m.manufacturer,
    quickAnswer: m.quickAnswer,
    identity: [
      { label: 'Manufacturer', value: m.manufacturer },
      { label: 'Polymer', value: m.basePolymer },
      { label: 'Form', value: m.form },
      { label: 'Process', value: m.process },
      { label: 'Filler', value: m.filler ?? 'Unfilled' },
    ],
    specs: m.structuredSpecs,
    buildVolume: null,
  };
}

export function machineCompareEntry(m: Machine): CompareEntry {
  const technology = m.specs.find((s) => s.label === 'Technology')?.value ?? m.process;
  return {
    slug: m.slug,
    name: m.name,
    manufacturer: m.manufacturer,
    quickAnswer: m.quickAnswer,
    identity: [
      { label: 'Manufacturer', value: m.manufacturer },
      { label: 'Process', value: m.process },
      { label: 'Technology', value: technology },
    ],
    specs: m.structuredSpecs,
    buildVolume: buildVolumeString(m),
  };
}
