// Build-side data for the calculators (rebuild batch B4):
// /calculators/powder-refresh-ratio/ and /calculators/part-cost/.
//
// The calculators read the SAME data layer as the database pages
// (blueprint: 工具读同一数据层) — the part-cost grade list is derived
// from MATERIALS at build time, and densities come from
// `structuredSpecs` via pickSpec, never from parsing display strings.
//
// Prices are NOT part of this site's data (the database cites
// manufacturer datasheets, which do not fix a market price), so no
// price default exists anywhere in the calculators: the visitor types
// their own powder price. The only numeric defaults are the refresh
// figures this site already publishes from manufacturer documents —
// see PUBLISHED_REFRESH below, each with its on-site source.

import { MATERIALS, type Material } from '../data/materials';
import { pickSpec } from './specs';

export interface CalcGrade {
  slug: string;
  name: string;
  manufacturer: string;
  process: string;
  /** Printed-part density from the grade's structuredSpecs, or null
   * when the manufacturer value is not in the database. Note: bulk /
   * apparent powder density is a different quantity and is never used
   * here — Arkema's 0.49 g/cm³ apparent density is therefore NOT a
   * density for this tool. */
  density: { value: number; unit: string; basis: string } | null;
  /** Manufacturer refresh figure published on this site, if any. */
  publishedRefresh: { ratio: number; basis: string } | null;
}

/** Refresh ratios stated in manufacturer documents and already
 * published on the grades' own pages of this site. Every other grade's
 * manufacturer figure is not in the database, so the tools say so
 * instead of borrowing one of these. */
export const PUBLISHED_REFRESH: Record<string, { ratio: number; basis: string }> = {
  'formlabs-nylon-12-gf-powder': {
    ratio: 50,
    basis:
      'Formlabs specifies a standard refresh rate of 50% virgin powder for Nylon 12 GF Powder (and allows up to 70% when troubleshooting defects) — see the grade page.',
  },
  'arkema-rilsan-invent-pa11': {
    ratio: 50,
    basis:
      'Arkema states a low refreshing factor for Rilsan Invent PA11 — typically 50%, roughly half virgin powder in the blend — see the grade page.',
  },
};

export const POWDER_GRADES: CalcGrade[] = MATERIALS.filter((m) => m.form === 'Powder').map(
  (m: Material) => {
    const d = pickSpec(m.structuredSpecs, 'density');
    return {
      slug: m.slug,
      name: m.name,
      manufacturer: m.manufacturer,
      process: m.process,
      density: d
        ? { value: d.value, unit: d.unit, basis: [d.standard, d.note].filter(Boolean).join(' · ') }
        : null,
      publishedRefresh: PUBLISHED_REFRESH[m.slug] ?? null,
    };
  },
);

/** The refresh ratio pre-filled in both tools, with its provenance.
 * 50% is the only figure this site publishes from manufacturer
 * documents (the two cases above); the tools label it as such and
 * tell the visitor to replace it with their own grade's figure. */
export const DEFAULT_REFRESH = {
  ratio: 50,
  provenance:
    'Pre-filled at 50% because that is the manufacturer figure this site publishes — Formlabs’ standard refresh rate for Nylon 12 GF Powder and Arkema’s typical factor for Rilsan Invent PA11. If your grade’s datasheet states a different ratio, use that one.',
};
