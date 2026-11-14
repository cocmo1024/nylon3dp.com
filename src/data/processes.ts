// Process database (rebuild batch B0 — formalised entity).
// The four processes that already have pages on this site. Comparison
// fields are recorded ONLY where a value is already published on this
// site with a manufacturer/guideline source (see `sources` and the
// per-field sourceLabel/sourceUrl); a field that cannot be tied to an
// on-site sourced value stays absent rather than being estimated.
// Narrative text is carried over from the published process pages.

import type { DataSource } from './types';

/** A numeric comparison field, always with its source attached. */
export interface ProcessFieldValue {
  value: number;
  unit: string;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface Process {
  slug: string;
  name: string;
  fullName: string;
  family: 'Powder-bed fusion' | 'Material extrusion';
  /** Short description of the fusing mechanism, from the published process page. */
  fusionMechanism: string;
  /** The process page's published quick answer. */
  quickAnswer: string;
  /** Recorded only where the published process page states it explicitly. */
  supportNeeded?: boolean;
  supportNote?: string;
  /** Design minimums / characteristic values published on this site, with sources. */
  minWallThicknessVertical?: ProcessFieldValue;
  minWallThicknessHorizontal?: ProcessFieldValue;
  minHoleDiameter?: ProcessFieldValue;
  minEscapeHoleDiameter?: ProcessFieldValue;
  layerThickness?: ProcessFieldValue;
  /** Qualitative isotropy statement, from the published pages. */
  isotropyNote: string;
  sources: DataSource[];
}

const FORMLABS_SLS_GUIDE: DataSource = {
  label: 'Formlabs — SLS Design Guide, Fuse Series (March 2023), as published in this site’s SLS & MJF design guide',
  url: 'https://formlabs-media.formlabs.com/rs/060-UIG-504/images/WP-EN-fuse-series-sls-design-guide.pdf',
};

export const PROCESSES: Process[] = [
  {
    slug: 'sls',
    name: 'SLS',
    fullName: 'Selective Laser Sintering',
    family: 'Powder-bed fusion',
    fusionMechanism:
      'A laser scans each cross-section over a heated bed of nylon powder, sintering one layer at a time; the surrounding unfused powder supports the part.',
    quickAnswer:
      'SLS builds parts by scanning a laser over a heated bed of nylon powder, sintering one cross-section at a time. The surrounding powder supports the part, so SLS prints complex, functional PA12 and PA11 parts with no support structures — it is the benchmark process for strong, end-use nylon components.',
    supportNeeded: false,
    supportNote:
      'No support structures: the unfused powder surrounding the part supports it throughout the build (SLS process page FAQ).',
    minWallThicknessVertical: {
      value: 0.6,
      unit: 'mm',
      note: 'Vertical walls, supported and unsupported features; Formlabs SLS design guide for the Fuse series (Nylon 12 Powder)',
      sourceLabel: FORMLABS_SLS_GUIDE.label,
      sourceUrl: FORMLABS_SLS_GUIDE.url,
    },
    minWallThicknessHorizontal: {
      value: 0.3,
      unit: 'mm',
      note: 'Horizontal walls, supported and unsupported features; Formlabs SLS design guide for the Fuse series (Nylon 12 Powder)',
      sourceLabel: FORMLABS_SLS_GUIDE.label,
      sourceUrl: FORMLABS_SLS_GUIDE.url,
    },
    minHoleDiameter: {
      value: 1.0,
      unit: 'mm',
      note: 'Holes below 1.0 mm diameter may close off during the build (Formlabs SLS design guide)',
      sourceLabel: FORMLABS_SLS_GUIDE.label,
      sourceUrl: FORMLABS_SLS_GUIDE.url,
    },
    minEscapeHoleDiameter: {
      value: 3.5,
      unit: 'mm',
      note: 'At least two escape holes per enclosed cavity, so unfused powder can be removed (Formlabs SLS design guide)',
      sourceLabel: FORMLABS_SLS_GUIDE.label,
      sourceUrl: FORMLABS_SLS_GUIDE.url,
    },
    isotropyNote:
      'Near-isotropic in strength terms, but direction-dependent ductility is the rule in manufacturer datasheets: e.g. EOS PA 2200 lists 18% strain at break in XY versus 4% in Z. Design so critical loads and flexing run in-plane.',
    sources: [FORMLABS_SLS_GUIDE],
  },
  {
    slug: 'mjf',
    name: 'MJF',
    fullName: 'Multi Jet Fusion',
    family: 'Powder-bed fusion',
    fusionMechanism:
      'Inkjet arrays print fusing and detailing agents onto nylon powder and an infrared lamp fuses the printed areas, a whole layer in fixed passes.',
    quickAnswer:
      'MJF is HP’s powder-bed fusion process: inkjet arrays print fusing and detailing agents onto nylon powder, and an infrared lamp fuses the printed areas. It produces PA12, PA11 and glass-bead-filled parts with fine detail, consistent properties and fast layer times — the main alternative to SLS for production nylon parts.',
    supportNeeded: false,
    supportNote:
      'No support structures: like SLS, the powder bed supports the parts (MJF process page FAQ).',
    isotropyNote:
      'Positioned by HP as near-isotropic: the current HP PA 12 data sheet lists the same tensile strength and modulus for XY and Z, although elongation still drops from 18% (XY) to 10% (Z). Feature minimums are published by HP in its own MJF design documentation, so no MJF design minimum is recorded here.',
    sources: [
      {
        label: 'HP Technical Data Sheet — HP 3D High Reusability PA 12 (doc. 4AA8-5029ENW)',
        url: 'https://www8.hp.com/h20195/v2/GetDocument.aspx?docname=4AA8-5029ENW',
      },
    ],
  },
  {
    slug: 'saf',
    name: 'SAF',
    fullName: 'Selective Absorption Fusion',
    family: 'Powder-bed fusion',
    fusionMechanism:
      'Printheads jet a single infrared-absorbing fluid (HAF) onto nylon powder wherever the part should form, and an infrared lamp fuses the whole layer at once.',
    quickAnswer:
      'SAF is Stratasys’s powder-bed fusion process, used in the H350 printer. Industrial piezoelectric printheads jet a single infrared-absorbing fluid (HAF) onto nylon powder wherever the part should form, and an infrared lamp then fuses the whole layer at once. It is a production process — fixed layer times, densely nested builds, PA11 and PA12 powders.',
    supportNeeded: false,
    supportNote:
      'No support structures: like SLS and MJF, the unfused powder supports the parts during the build (SAF process page FAQ).',
    layerThickness: {
      value: 100,
      unit: 'µm',
      note: 'Single layer thickness of the H350, currently the only SAF machine (per its Stratasys spec sheet, as published on this site’s SAF page)',
      sourceLabel: 'Stratasys product page — H350 (SAF)',
      sourceUrl: 'https://www.stratasys.com/en/3d-printers/printer-catalog/saf/h350/',
    },
    isotropyNote:
      'SAF shares the powder-bed workflow of SLS and MJF; Stratasys publishes no direction-split property set for its SAF powders in the documents cited on this site, so no isotropy figure is recorded.',
    sources: [
      {
        label: 'Stratasys product page — H350 (SAF)',
        url: 'https://www.stratasys.com/en/3d-printers/printer-catalog/saf/h350/',
      },
    ],
  },
  {
    slug: 'fdm',
    name: 'FDM',
    fullName: 'Fused Deposition Modeling',
    family: 'Material extrusion',
    fusionMechanism:
      'A heated nozzle extrudes nylon filament layer by layer; each layer bonds to the already-cooled layer beneath it.',
    quickAnswer:
      'FDM (fused deposition modeling) extrudes nylon filament through a heated nozzle to build tough, wear-resistant functional parts on inexpensive machines. It is the most accessible nylon process, but the filament is hygroscopic — it must be dried before and often during printing — and parts are weaker across layers than powder-bed nylon.',
    isotropyNote:
      'Strongly anisotropic: within a layer, good FDM nylon can approach powder-bed strength, but across layers (Z) parts are significantly weaker, and every filament datasheet in this database shows a large XY-versus-Z gap in strength and elongation. Design so main loads run along the layers.',
    sources: [
      {
        label: 'Polymaker TDS — Fiberon PA6-CF20, v1.1 (XY/Z datasheet splits)',
        url: 'https://polymaker.com/wp-content/uploads/TDS_FIBERON-PA6-CF20_V1.1_EN.pdf',
      },
    ],
  },
];

for (const p of PROCESSES) {
  if (!p.sources.length) throw new Error(`Process ${p.slug} has no sources`);
  for (const s of p.sources) {
    if (!/^https:\/\//.test(s.url)) throw new Error(`Process ${p.slug} has a non-HTTPS source: ${s.url}`);
  }
}
