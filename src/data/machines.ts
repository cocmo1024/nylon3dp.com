// Machine database. HARD RULE: every spec below was read from the
// manufacturer's own specification page/datasheet listed in `sources`.
// Specs a manufacturer does not state are omitted, never estimated.
//
// Rebuild B0: each entry also carries relations (vendorSlug, processSlug,
// supportedMaterials) and `structuredSpecs` — the machine-readable form of
// the legacy free-text `specs`. CONSERVATION: every structured value is
// parsed verbatim out of the entry's own legacy spec strings;
// scripts/validate-data.mjs proves the subset relation on every verify.

import type { StructuredSpec } from './types';

export interface MachineSpec {
  label: string;
  value: string;
  note?: string;
}

export interface Machine {
  slug: string;
  name: string;
  manufacturer: string;
  /** Vendor entity slug (vendors.ts); must resolve and match `manufacturer`. */
  vendorSlug: string;
  process: string;
  /** Process entity slug (processes.ts), derived from `process`. */
  processSlug: string;
  /** Material slugs (materials.ts) the manufacturer states for this machine; empty where no verified list exists. */
  supportedMaterials: string[];
  quickAnswer: string;
  intro: string[];
  specs: MachineSpec[];
  /** Machine-readable specs parsed verbatim from `specs` (see header). */
  structuredSpecs: StructuredSpec[];
  notes: string[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
}

export const MACHINES: Machine[] = [
  {
    slug: 'hp-jet-fusion-5200',
    name: 'HP Jet Fusion 5200',
    manufacturer: 'HP',
    vendorSlug: 'hp',
    process: 'MJF',
    processSlug: 'mjf',
    supportedMaterials: ['hp-pa-12'],
    quickAnswer:
      'The HP Jet Fusion 5200 is HP\'s production MJF printer: an effective build volume of 380 × 284 × 380 mm and a 0.08 mm layer thickness, printing HP\'s High Reusability nylon powders including PA 12.',
    intro: [
      'The 5200 series is HP\'s industrial Multi Jet Fusion platform, positioned for production volumes rather than prototyping. It uses HP\'s agent-based process — no laser: inkjet-printed fusing and detailing agents plus infrared energy — and pairs with HP processing stations that automate powder handling and part extraction.',
      'For nylon, the relevant materials are the High Reusability PA 12 (see its database page), PA 11 and PA 12 Glass Beads grades.',
    ],
    specs: [
      { label: 'Technology', value: 'HP Multi Jet Fusion' },
      { label: 'Effective build volume', value: '380 × 284 × 380 mm', note: '15 × 11.2 × 15 in, per HP' },
      { label: 'Layer thickness', value: '0.08 mm', note: 'Per HP 5200 series specification' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 380, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 284, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 380, unit: 'mm' },
      { key: 'layerThickness', label: 'Layer thickness', value: 0.08, unit: 'mm', note: 'Per HP 5200 series specification' },
    ],
    notes: [
      'MJF has no laser; layer time is independent of layer content because whole layers are fused in fixed passes.',
      'HP\'s newer 5420W model adds white-part production to the same platform class; specifications for it will be listed separately when added to this database.',
    ],
    faqs: [
      { q: 'What nylon does the Jet Fusion 5200 print?', a: 'HP\'s High Reusability MJF powders: PA 12 as standard, plus PA 11 and PA 12 Glass Beads. PA 12\'s verified datasheet values are in the material database.' },
      { q: 'How big are Jet Fusion 5200 parts?', a: 'Up to the effective build volume of 380 × 284 × 380 mm, though production parts are usually nested — many smaller parts packed through the full build height.' },
    ],
    sources: [
      { label: 'HP 3D printers — official product listing (build volume)', url: 'https://www.hp.com/us-en/printers/3d-printers/products.html' },
      { label: 'HP Jet Fusion 5200/4200 series specification (layer thickness)', url: 'https://h20195.www2.hp.com/v2/getpdf.aspx/4AA6-4892EEAU.pdf' },
    ],
  },
  {
    slug: 'eos-formiga-p-110',
    name: 'EOS Formiga P 110 Velocis',
    manufacturer: 'EOS',
    vendorSlug: 'eos',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: ['eos-pa-2200', 'eos-pa-1101', 'eos-pa-3200-gf'],
    quickAnswer:
      'The EOS Formiga P 110 Velocis is EOS\'s compact SLS printer: a 200 × 250 × 330 mm build volume and a 30 W CO₂ laser, per the current EOS system data sheet — the entry point to the EOS polymer platform that runs PA 2200, PA 1101 and PA 3200 GF.',
    intro: [
      'The Formiga line is EOS\'s compact class: the machines many service bureaus and in-house print rooms run for PA12 and PA11 production. The current Velocis variant is the model EOS lists in its system data sheet (status November 2026).',
      'Its larger sibling, the EOS P 396, scales the same platform to 340 × 340 × 600 mm with a 70 W CO₂ laser (per its EOS system data sheet).',
    ],
    specs: [
      { label: 'Technology', value: 'SLS (polymer powder-bed fusion)' },
      { label: 'Build volume', value: '200 × 250 × 330 mm', note: '7.9 × 9.8 × 13.0 in, per EOS SDS' },
      { label: 'Laser', value: 'CO₂, 1 × 30 W', note: 'Per EOS system data sheet' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 200, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 250, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 330, unit: 'mm' },
      { key: 'laserPower', label: 'Laser power', value: 30, unit: 'W', note: 'CO₂, 1 × laser, per EOS system data sheet' },
    ],
    notes: [
      'EOS does not state a layer-thickness figure in the current P 110 Velocis system data sheet, so none is listed here.',
      'Materials: the EOS polymer powder range, including PA 2200, PA 1101 and PA 3200 GF — all in the material database with datasheet values.',
    ],
    faqs: [
      { q: 'What is the difference between the P 110 and the P 396?', a: 'Scale. Per their EOS data sheets: the P 110 Velocis offers 200 × 250 × 330 mm with a 30 W CO₂ laser; the P 396 offers 340 × 340 × 600 mm with a 70 W CO₂ laser. Both run the EOS polymer powder ecosystem.' },
      { q: 'Which nylons run on the Formiga P 110?', a: 'EOS polymer powders generally; the nylon core set is PA 2200 (PA12), PA 1101 (PA11) and PA 3200 GF (glass-filled PA12), each documented in the material database.' },
    ],
    sources: [
      { label: 'EOS System Data Sheet — Formiga P 110 Velocis (status 10.11.2026)', url: 'https://www.eos.info/polymer-solutions/polymer-printers/data-sheets/sds-formiga-p-110-velocis' },
      { label: 'EOS System Data Sheet — EOS P 396', url: 'https://www.eos.info/polymer-solutions/polymer-printers/data-sheets/sds-eos-p-396' },
    ],
  },
  {
    slug: 'formlabs-fuse-1-plus-30w',
    name: 'Formlabs Fuse 1+ 30W',
    manufacturer: 'Formlabs',
    vendorSlug: 'formlabs',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: ['formlabs-nylon-12-powder', 'formlabs-nylon-11-powder', 'formlabs-nylon-12-gf-powder'],
    quickAnswer:
      'The Formlabs Fuse 1+ 30W is a compact benchtop-class SLS printer: 165 × 165 × 300 mm build volume, 110 µm layer thickness and a 30 W ytterbium fibre laser, per Formlabs — running Nylon 12 and Nylon 11 powders.',
    intro: [
      'The Fuse 1+ 30W brought SLS into offices and workshops that could never host an industrial EOS system: inert-gas-free nylon printing in a compact footprint, with the Fuse Sift handling powder recovery. Its trade-off against industrial machines is build volume and throughput, not process type — it is genuine selective laser sintering.',
      'Its material set is Formlabs\' own: Nylon 12 Powder as the standard and Nylon 11 Powder for ductile parts, both in the material database.',
    ],
    specs: [
      { label: 'Technology', value: 'Selective laser sintering (SLS)' },
      { label: 'Build volume', value: '165 × 165 × 300 mm', note: '6.5 × 6.5 × 11.8 in, per Formlabs' },
      { label: 'Layer thickness', value: '110 µm', note: 'Single specified value, per Formlabs' },
      { label: 'Laser', value: 'Ytterbium fibre, max 30 W, 1065 nm', note: 'Class 1 laser product per EN 60825-1:2014' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 165, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 165, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 300, unit: 'mm' },
      { key: 'layerThickness', label: 'Layer thickness', value: 110, unit: 'µm', note: 'Single specified value, per Formlabs' },
      { key: 'laserPower', label: 'Laser power', value: 30, unit: 'W', note: 'Ytterbium fibre, max' },
      { key: 'laserWavelength', label: 'Laser wavelength', value: 1065, unit: 'nm', note: 'Ytterbium fibre laser' },
    ],
    notes: [
      'Formlabs specifies a single layer thickness (110 µm) rather than a range.',
      'Formlabs\' SLS design guide for the Fuse series is the source of the SLS design minimums in this site\'s design guide.',
    ],
    faqs: [
      { q: 'Is the Fuse 1+ 30W an industrial printer?', a: 'It is a compact SLS system aimed at workshops and in-house teams. The process is the same SLS as industrial machines, but build volume (165 × 165 × 300 mm) and throughput are smaller than EOS-class platforms.' },
      { q: 'Which powders does it print?', a: 'Formlabs Nylon 12 Powder and Nylon 11 Powder (plus Formlabs\' other Fuse materials). Both nylons have datasheet pages in the material database.' },
    ],
    sources: [
      { label: 'Formlabs product page — Fuse 1+ 30W', url: 'https://formlabs.com/products/fuse-1-30w/' },
      { label: 'Formlabs white paper — Fuse series technology and workflow overview', url: 'https://formlabs.com/uk/white-papers/fuse-series-technology-and-workflow-overview/' },
    ],
  },
  {
    slug: 'stratasys-h350',
    name: 'Stratasys H350',
    manufacturer: 'Stratasys',
    vendorSlug: 'stratasys',
    process: 'SAF',
    processSlug: 'saf',
    supportedMaterials: [],
    quickAnswer:
      'The Stratasys H350 is a production powder-bed printer using SAF (Selective Absorption Fusion) technology: an effective build size of 315 × 208 × 293 mm (19.2 L) and 100 µm layers, per Stratasys — aimed at consistent, volume manufacturing of polymer parts.',
    intro: [
      'The H350 is the flagship of Stratasys\'s H Series. SAF differs from both SLS and MJF: a single pass of an infrared-absorbing fluid (HAF) marks the part areas, and a flood infrared exposure fuses them — no scanning laser, no per-voxel agent arrays of the MJF type.',
      'Stratasys positions the platform at production consistency: the same industrial workflow across a fleet of printers, with powder management designed for repeatability at volume.',
    ],
    specs: [
      { label: 'Technology', value: 'SAF (Selective Absorption Fusion) powder-bed fusion' },
      { label: 'Effective build size', value: '315 × 208 × 293 mm', note: '12.40 × 8.18 × 11.53 in, per Stratasys' },
      { label: 'Effective build volume', value: '19.2 L', note: '5.07 gallon, per Stratasys' },
      { label: 'Layer thickness', value: '100 µm', note: '0.004 in, per Stratasys' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build size (X)', value: 315, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build size (Y)', value: 208, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build size (Z)', value: 293, unit: 'mm' },
      { key: 'buildVolumeCapacity', label: 'Effective build volume', value: 19.2, unit: 'L', note: 'Per Stratasys' },
      { key: 'layerThickness', label: 'Layer thickness', value: 100, unit: 'µm', note: 'Per Stratasys' },
    ],
    notes: [
      'SAF uses an infrared-absorbing fluid and flood exposure, so there is no laser specification to list.',
      'Material coverage for the H350 in this database will grow as individual powder datasheets are verified; see the materials index for what is currently published.',
    ],
    faqs: [
      { q: 'How is SAF different from SLS and MJF?', a: 'All three are powder-bed fusion. SLS fuses with a scanning laser, MJF with jetted agents plus infrared, and SAF with a jetted infrared-absorbing fluid plus a flood infrared exposure. The processes overview and the SLS vs MJF comparison explain the practical consequences.' },
      { q: 'Is the H350 a nylon printer?', a: 'It is a polymer production printer whose material portfolio includes nylon-family powders. This database lists individual material datasheets only after manufacturer verification, so check the material index for the current verified set.' },
    ],
    sources: [
      { label: 'Stratasys product page — H350 (SAF)', url: 'https://www.stratasys.com/en/3d-printers/printer-catalog/saf/h350/' },
    ],
  },
  {
    slug: 'eos-p-396',
    name: 'EOS P 396',
    manufacturer: 'EOS',
    vendorSlug: 'eos',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: ['eos-pa-2200', 'eos-pa-1101', 'eos-pa-3200-gf'],
    quickAnswer:
      'The EOS P 396 is EOS\'s medium-format production SLS printer: a 340 × 340 × 600 mm build volume, a 70 W CO₂ laser and five material-dependent layer thicknesses from 0.06 to 0.18 mm, per the EOS system data sheet — the scale-up platform for serial nylon production on PA 2200, PA 1101 and PA 3200 GF.',
    intro: [
      'The P 396 is the mid-size production workhorse of the EOS polymer line — EOS calls it its medium-format bestseller — aimed at serial components, spare parts on demand and functional prototypes. It runs the same EOS powder ecosystem as the compact Formiga P 110 at roughly triple the build height, with EOSCONNECT integration into MES/ERP environments for documented, repeatable production.',
      'For nylon work the relevant materials are the EOS polyamide set: PA 2200 (PA12) as the standard, PA 1101 (PA11) for ductility and PA 3200 GF (glass-filled PA12) for stiffness — all three are in the material database with datasheet values.',
    ],
    specs: [
      { label: 'Technology', value: 'SLS (polymer powder-bed fusion)' },
      { label: 'Build volume', value: '340 × 340 × 600 mm', note: '13.4 × 13.4 × 23.6 in, per EOS SDS' },
      { label: 'Layer thickness', value: '0.06 / 0.10 / 0.12 / 0.15 / 0.18 mm', note: 'Availability depending on material, per EOS SDS' },
      { label: 'Laser', value: 'CO₂, 1 × 70 W', note: 'Per EOS system data sheet' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 340, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 340, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 600, unit: 'mm' },
      { key: 'laserPower', label: 'Laser power', value: 70, unit: 'W', note: 'CO₂, 1 × laser, per EOS system data sheet' },
    ],
    notes: [
      'EOS states 14 materials with 26 parameter sets for the current P 396 configuration; layer thickness is selected per material parameter set, not freely.',
      'The compact sibling in this database, the Formiga P 110 Velocis (200 × 250 × 330 mm, 30 W), shares the same EOS powder ecosystem.',
    ],
    faqs: [
      { q: 'What is the difference between the EOS P 396 and the Formiga P 110?', a: 'Scale and laser power. Per their EOS data sheets: the P 396 offers 340 × 340 × 600 mm with a 70 W CO₂ laser and five layer thicknesses (0.06–0.18 mm); the P 110 Velocis offers 200 × 250 × 330 mm with a 30 W CO₂ laser. Both run the EOS polymer powder range.' },
      { q: 'Which nylons run on the EOS P 396?', a: 'The EOS polyamide portfolio, including PA 2200 (PA12), PA 1101 (PA11) and PA 3200 GF (glass-filled PA12) — each documented with datasheet values in the material database — plus black and flame-retardant PA grades listed by EOS.' },
    ],
    sources: [
      { label: 'EOS System Data Sheet — EOS P 396', url: 'https://www.eos.info/polymer-solutions/polymer-printers/data-sheets/sds-eos-p-396' },
    ],
  },
  {
    slug: 'eos-helior',
    name: 'EOS HELIOR',
    manufacturer: 'EOS',
    vendorSlug: 'eos',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: ['eos-pa-2200'],
    quickAnswer:
      'The EOS HELIOR is EOS\'s large-format production SLS platform, unveiled at Formnext 2026: a 700 × 380 × 580 mm build volume and three 70 W CO₂ lasers with dynamic load balancing, per the EOS system data sheet — the largest build volume in this database, launched with validated parameters for PA 2200.',
    intro: [
      'HELIOR was unveiled on 17 November 2026 at Formnext in Frankfurt (Hall 12.0, D71) and is commercially available from December 2026, per EOS. It succeeds the EOS P 770 class at the top of the EOS polymer range: the same 700 × 380 × 580 mm build envelope, but three lasers instead of two, an adjustable roller recoater, and load balancing that distributes exposure work across the three lasers.',
      'EOS rates the platform at up to 80% more part volume in 24 hours at 10% packing density (154 litres of build volume) — a manufacturer claim tied to that packing density, not an independent measurement. At launch, validated material and process parameters exist for PA 2200 and PA 2220 HighReuse; PA 2200 is in the material database, PA 2220 HighReuse is not yet listed separately.',
    ],
    specs: [
      { label: 'Technology', value: 'SLS (polymer powder-bed fusion)' },
      { label: 'Build volume', value: '700 × 380 × 580 mm', note: '27.6 × 15.0 × 22.8 in, per EOS SDS' },
      { label: 'Laser', value: 'CO₂, 3 × 70 W', note: 'Per EOS system data sheet' },
      { label: 'Scan speed', value: 'up to 12.0 m/s', note: 'Per EOS system data sheet' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 700, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 380, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 580, unit: 'mm' },
      { key: 'laserPower', label: 'Laser power', value: 70, unit: 'W', note: 'CO₂, per laser; 3 lasers, per EOS system data sheet' },
    ],
    notes: [
      'Some launch-week trade coverage reported the lasers as 80 W units; the EOS system data sheet states CO₂, 3 × 70 W, and this database follows the data sheet.',
      'Materialise, which evaluated HELIOR in production before launch, reported 44% higher productivity than the previous machine — a trial result reported by EOS, not a data-sheet value.',
    ],
    faqs: [
      { q: 'What nylon does the EOS HELIOR print?', a: 'At launch, EOS lists validated material and process parameters for PA 2200 and PA 2220 HighReuse, both PA12 grades. PA 2200 is documented in the material database; more materials are to be validated on customer request, per EOS.' },
      { q: 'How does HELIOR differ from the EOS P 396?', a: 'Scale and laser count. Per their EOS data sheets: HELIOR offers 700 × 380 × 580 mm with three 70 W CO₂ lasers; the P 396 offers 340 × 340 × 600 mm with one 70 W CO₂ laser. HELIOR is aimed at 24-hour production cycles and volume manufacturing.' },
    ],
    sources: [
      { label: 'EOS System Data Sheet — EOS HELIOR', url: 'https://www.eos.info/polymer-solutions/polymer-printers/data-sheets/sds-eos-helior' },
      { label: 'EOS — EOS HELIOR product page', url: 'https://www.eos.info/polymer-solutions/polymer-printers/eos-helior' },
    ],
  },
  {
    slug: 'sinterit-lisa-x',
    name: 'Sinterit Lisa X',
    manufacturer: 'Sinterit',
    vendorSlug: 'sinterit',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: ['sinterit-pa12-smooth'],
    quickAnswer:
      'The Sinterit Lisa X is Sinterit\'s compact open-parameter SLS printer: a 130 × 180 × 330 mm build volume for PA and PP powders, a 30 W infrared diode laser and layer heights from 0.075 to 0.175 mm, per Sinterit\'s product specification.',
    intro: [
      'The Lisa X is the top of Sinterit\'s compact Lisa line: the same bench-scale footprint as the smaller Lisas, but a 30 W galvo-scanned infrared laser in place of the 5 W class units, which Sinterit credits for build speeds up to 14 mm/h. It is an open system — Sinterit Studio exposes the printing parameters — and runs Sinterit\'s powder range including PA12 Smooth, which is in the material database.',
      'For flexible materials the stated Z height rises to 340 mm; the PA/PP figure of 330 mm is the one listed in the specification table here, because this database covers nylon work.',
    ],
    specs: [
      { label: 'Technology', value: 'SLS (polymer powder-bed fusion)' },
      { label: 'Build volume', value: '130 × 180 × 330 mm', note: 'PA / PP powders, per Sinterit specification; flexible materials 130 × 180 × 340 mm' },
      { label: 'Layer thickness', value: '0.075–0.175 mm', note: 'Per Sinterit specification' },
      { label: 'Laser', value: 'IR fibre-coupled diode, 30 W', note: '976 ± 3 nm, galvo scanner, per Sinterit specification' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 130, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 180, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 330, unit: 'mm', note: 'PA / PP powders, per Sinterit specification' },
      { key: 'laserPower', label: 'Laser power', value: 30, unit: 'W', note: 'IR fibre-coupled diode, per Sinterit specification' },
    ],
    notes: [
      'Sinterit states a build speed of up to 14 mm/h and a minimum wall thickness from 0.5 mm in the same specification.',
      'The Lisa X has a built-in inert gas (nitrogen) control system, which some Sinterit materials and workflows require.',
    ],
    faqs: [
      { q: 'Which nylons run on the Lisa X?', a: 'Sinterit\'s PA range, including PA12 Smooth (in the material database, with its 22% manufacturer refresh ratio) and PA11 grades. The system is open, so parameters can be adjusted per material in Sinterit Studio.' },
      { q: 'Lisa X or Suzy?', a: 'Per Sinterit\'s own comparison: both offer 130 × 180 × 330 mm for PA/PP and the same 30 W laser. The Lisa X is the open, multi-material system (PA11, PP, flexible and filled grades, nitrogen support); Suzy is the closed, PA12-focused system with preset profiles and a higher build speed.' },
    ],
    sources: [
      { label: 'Sinterit Lisa X — product specification (official PDF)', url: 'https://sinterit.com/wp-content/uploads/2022/02/Sinterit-LISA-X-SPECIFICATION-1.pdf' },
      { label: 'Sinterit — Lisa X vs. SUZY comparison & FAQ', url: 'https://sinterit.com/blog/sls-technology/sinterit-lisa-x-vs-suzy-comparison-faq/' },
    ],
  },
  {
    slug: 'sinterit-suzy',
    name: 'Sinterit Suzy',
    manufacturer: 'Sinterit',
    vendorSlug: 'sinterit',
    process: 'SLS',
    processSlug: 'sls',
    supportedMaterials: [],
    quickAnswer:
      'Sinterit Suzy is Sinterit\'s closed, PA12-dedicated compact SLS printer: a 130 × 180 × 330 mm build volume, a 30 W infrared diode laser, a fixed 0.075 mm layer height and build speeds up to 20 mm/h, per Sinterit\'s product specification.',
    intro: [
      'Suzy is Sinterit\'s fourth-generation compact SLS machine (specification dated March 2025), deliberately narrowed to one job: a closed system dedicated to PA12, with preset profiles in Sinterit Studio instead of the Lisa X\'s open parameters. In exchange for the narrower material scope, Sinterit states build speeds up to 20 mm/h — faster than the Lisa X on the same build envelope and laser.',
      'Because Suzy is dedicated to Sinterit\'s PA12 Industrial powder — a grade this database does not yet list separately from PA12 Smooth — the supported-materials list below is left empty rather than linked to a different grade.',
    ],
    specs: [
      { label: 'Technology', value: 'SLS (polymer powder-bed fusion)' },
      { label: 'Build volume', value: '130 × 180 × 330 mm', note: 'PA powders, per Sinterit specification' },
      { label: 'Layer thickness', value: '0.075 mm', note: 'Per Sinterit specification' },
      { label: 'Laser', value: 'IR fibre-coupled diode, 30 W', note: '976 ± 3 nm, galvo scanner, per Sinterit specification' },
      { label: 'Build speed', value: 'up to 20 mm/h', note: 'Per Sinterit specification' },
    ],
    structuredSpecs: [
      { key: 'buildVolumeX', label: 'Build volume (X)', value: 130, unit: 'mm' },
      { key: 'buildVolumeY', label: 'Build volume (Y)', value: 180, unit: 'mm' },
      { key: 'buildVolumeZ', label: 'Build volume (Z)', value: 330, unit: 'mm', note: 'PA powders, per Sinterit specification' },
      { key: 'layerThickness', label: 'Layer thickness', value: 0.075, unit: 'mm', note: 'Per Sinterit specification' },
      { key: 'laserPower', label: 'Laser power', value: 30, unit: 'W', note: 'IR fibre-coupled diode, per Sinterit specification' },
    ],
    notes: [
      'Suzy is a closed system dedicated to PA12 (Sinterit PA12 Industrial); it does not run the Lisa X\'s wider material set and does not operate with nitrogen, per Sinterit\'s comparison.',
      'Sinterit states a maximum chamber temperature of 210 °C and a minimum wall thickness from 0.5 mm in the same specification.',
    ],
    faqs: [
      { q: 'What nylon does Suzy print?', a: 'PA12 only, by design: Suzy is a closed system dedicated to Sinterit\'s PA12 powder with preset profiles (Sinterit also lists PA11.5 support in its comparison). Users who need PA11, PP or filled grades are directed by Sinterit to the Lisa X.' },
      { q: 'Why is Suzy faster than the Lisa X with the same laser?', a: 'Per Sinterit, the speed comes from the narrowed scope: one material family, preset profiles and optimised scan patterns give up to 20 mm/h against the Lisa X\'s up to 14 mm/h, on the same 130 × 180 × 330 mm envelope and 30 W laser.' },
    ],
    sources: [
      { label: 'Sinterit SUZY — product specification (official PDF, 18.03.2025)', url: 'https://cdn03.plentymarkets.com/ioseuwg7moqp/propertyItems/4497158/Sinterit_SUZY_Specification_A4_032025_EN.pdf' },
      { label: 'Sinterit — Lisa X vs. SUZY comparison & FAQ', url: 'https://sinterit.com/blog/sls-technology/sinterit-lisa-x-vs-suzy-comparison-faq/' },
    ],
  },
];

for (const mc of MACHINES) {
  if (!mc.sources.length) throw new Error(`Machine ${mc.slug} has no sources`);
  if (!mc.specs.length) throw new Error(`Machine ${mc.slug} has no specs`);
  for (const s of mc.sources) {
    if (!/^https:\/\//.test(s.url)) throw new Error(`Machine ${mc.slug} has a non-HTTPS source: ${s.url}`);
  }
}
