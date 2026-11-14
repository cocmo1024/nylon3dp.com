// Vendor database (rebuild batch B0 — new entity).
// A vendor is the manufacturer behind the materials and machines in this
// database; materials and machines reference it by `vendorSlug`, and the
// reverse lists (a vendor's materials and machines) are derived from those
// references at build time, never hand-written.
// FACT DISCIPLINE: hqCountry and officialSite are public facts; `founded`
// is recorded only where it is part of the elementary public record
// (vendor's own site / encyclopaedia level) and is omitted where the
// entity's founding is ambiguous (e.g. a brand inside an older group).

import type { DataSource } from './types';

export interface Vendor {
  slug: string;
  /** Must match the `manufacturer` string on every material/machine that references this vendor. */
  name: string;
  hqCountry: string;
  /** Founding year; omitted where not unambiguously verifiable (see header). */
  founded?: number;
  type: 'material' | 'machine' | 'both';
  officialSite: string;
  /** One neutral, factual paragraph. No marketing claims. */
  intro: string;
  sources: DataSource[];
  /**
   * Commercial skeleton (B4.5): whether the vendor has claimed its
   * directory listing. Optional; the default for every listing is
   * 'unclaimed'. Recorded only when a claim actually happens — never
   * pre-filled, and it changes nothing the page renders.
   */
  claimStatus?: 'unclaimed' | 'claimed';
  /**
   * Commercial skeleton (B4.5): directory listing tier. Optional; the
   * default for every listing is 'standard'. Any non-standard tier is
   * a commercial decision for the user to rule on first.
   */
  listingTier?: 'standard' | 'enhanced' | 'sponsored';
}

export const VENDORS: Vendor[] = [
  {
    slug: 'eos',
    name: 'EOS',
    hqCountry: 'Germany',
    founded: 1989,
    type: 'both',
    officialSite: 'https://www.eos.info',
    intro:
      'EOS is a German industrial 3D printing company headquartered in Krailling, Bavaria, and one of the originators of laser sintering. Its polymer platform — the Formiga and P-series printers together with the PA 2200, PA 1101 and PA 3200 GF powders listed in this database — is the reference ecosystem for SLS nylon production.',
    sources: [{ label: 'EOS — official site', url: 'https://www.eos.info' }],
  },
  {
    slug: 'hp',
    name: 'HP',
    hqCountry: 'United States',
    founded: 1939,
    type: 'both',
    officialSite: 'https://www.hp.com',
    intro:
      'HP Inc. is the US technology company founded in Palo Alto in 1939. Its Multi Jet Fusion (MJF) platform — the Jet Fusion printers and the High Reusability nylon powders — is one of the main production routes for nylon powder-bed parts, and the only MJF ecosystem.',
    sources: [{ label: 'HP — official site', url: 'https://www.hp.com' }],
  },
  {
    slug: 'formlabs',
    name: 'Formlabs',
    hqCountry: 'United States',
    founded: 2011,
    type: 'both',
    officialSite: 'https://formlabs.com',
    intro:
      'Formlabs is a US 3D printing company founded in 2011 and headquartered in Somerville, Massachusetts. Its Fuse series brought SLS nylon printing into a compact, office-friendly format, running Formlabs’ own Nylon 12, Nylon 11 and glass-filled Nylon 12 powders.',
    sources: [{ label: 'Formlabs — official site', url: 'https://formlabs.com' }],
  },
  {
    slug: 'stratasys',
    name: 'Stratasys',
    hqCountry: 'United States',
    founded: 1989,
    type: 'both',
    officialSite: 'https://www.stratasys.com',
    intro:
      'Stratasys is a US additive manufacturing company founded in 1989 and headquartered in Eden Prairie, Minnesota. Its SAF (Selective Absorption Fusion) platform, shipped in the H350 printer, is a production powder-bed process for nylon-family powders including its SAF PA11 and PA12 grades.',
    sources: [{ label: 'Stratasys — official site', url: 'https://www.stratasys.com' }],
  },
  {
    slug: 'basf-forward-am',
    name: 'BASF Forward AM',
    hqCountry: 'Germany',
    type: 'material',
    officialSite: 'https://www.forward-am.com',
    intro:
      'Forward AM is the additive manufacturing brand of BASF, the German chemical group headquartered in Ludwigshafen. Its Ultrasint powder line for laser sintering includes the unfilled PA6 grade listed in this database, positioned for stiffness and heat resistance.',
    sources: [{ label: 'Forward AM (BASF) — official site', url: 'https://www.forward-am.com' }],
  },
  {
    slug: 'polymaker',
    name: 'Polymaker',
    hqCountry: 'China',
    founded: 2013,
    type: 'material',
    officialSite: 'https://polymaker.com',
    intro:
      'Polymaker is a 3D printing filament manufacturer founded in 2013 and headquartered in Shanghai, China. Its PolyMide and Fiberon nylon filament lines — including the PA6-CF, PA12-CF and CoPA grades in this database — are widely used desktop engineering filaments.',
    sources: [{ label: 'Polymaker — official site', url: 'https://polymaker.com' }],
  },
  {
    slug: 'bambu-lab',
    name: 'Bambu Lab',
    hqCountry: 'China',
    founded: 2020,
    type: 'both',
    officialSite: 'https://bambulab.com',
    intro:
      'Bambu Lab is a consumer 3D printing company founded in 2020 and headquartered in Shenzhen, China. Alongside its printers it sells its own engineering filaments, including the PA6-CF and PAHT-CF carbon-fibre nylon grades listed in this database.',
    sources: [{ label: 'Bambu Lab — official site', url: 'https://bambulab.com' }],
  },
  {
    slug: 'arkema',
    name: 'Arkema',
    hqCountry: 'France',
    founded: 2004,
    type: 'material',
    officialSite: 'https://www.arkema.com',
    intro:
      'Arkema is a French specialty materials company headquartered in Colombes, formed in 2004 as a spin-off of Total’s chemicals division. Its Rilsan polyamide 11 — polymerised from castor oil — is the original PA11 chemistry, and the Rilsan Invent line adapts that chemistry for powder-bed fusion.',
    sources: [{ label: 'Arkema — official site', url: 'https://www.arkema.com' }],
  },
];

for (const v of VENDORS) {
  if (!v.sources.length) throw new Error(`Vendor ${v.slug} has no sources`);
  for (const s of v.sources) {
    if (!/^https:\/\//.test(s.url)) throw new Error(`Vendor ${v.slug} has a non-HTTPS source: ${s.url}`);
  }
}
