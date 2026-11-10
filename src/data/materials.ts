// Material database. HARD RULE: every numeric value below was read from the
// manufacturer's own datasheet/product page listed in `sources`.
// Values a manufacturer does not publish are omitted, never estimated.

export interface MaterialProperty {
  label: string;
  value: string;
  note?: string;
}

export interface MaterialSource {
  label: string;
  url: string;
}

export interface Material {
  slug: string;
  name: string;
  manufacturer: string;
  basePolymer: string;
  form: 'Powder' | 'Filament';
  process: string;
  quickAnswer: string;
  intro: string[];
  processing: string[];
  properties: MaterialProperty[];
  applications: string[];
  faqs: { q: string; a: string }[];
  sources: MaterialSource[];
}

export const MATERIALS: Material[] = [
  {
    slug: 'eos-pa-2200',
    name: 'EOS PA 2200',
    manufacturer: 'EOS',
    basePolymer: 'PA12',
    form: 'Powder',
    process: 'SLS',
    quickAnswer:
      'EOS PA 2200 is the reference PA12 powder for selective laser sintering: a balanced, unfilled nylon 12 with 48 MPa tensile strength (XY), 1650 MPa tensile modulus and 18% elongation at break in the XY plane, per the current EOS material data sheet.',
    intro: [
      'PA 2200 is EOS\'s standard polyamide 12 powder and, in EOS\'s own words, has a "very balanced property profile". It is the grade most SLS users start with and the one against which other PA12 powders are compared: stiffness, strength and elongation are evenly matched, and it suits both prototypes and end-use parts.',
      'Orientation matters. EOS publishes direction-dependent values: tensile strength is 48 MPa in X and Y but 42 MPa in Z, and strain at break drops from 18% in-plane to 4% in Z, because layer interfaces are the weak direction. Designers of loaded parts should read the XY figures as best-case and the Z figures as the design limit for cross-layer loads.',
    ],
    processing: [
      'SLS powder, processed on EOS polymer systems with the parameter set referenced in the data sheet (the published values correspond to the Balance parameter set at 120 µm layer thickness).',
      'Parts come out white; the material is widely used with dyeing and other standard SLS post-processing.',
      'EOS lists elongation as "strain at break" (ISO 527-1/-2); the figures in the table use that definition.',
    ],
    properties: [
      { label: 'Tensile strength (X/Y)', value: '48 MPa', note: 'ISO 527-1/-2; Z: 42 MPa' },
      { label: 'Tensile modulus', value: '1650 MPa', note: 'ISO 527-1/-2, all orientations' },
      { label: 'Elongation at break (X/Y)', value: '18%', note: 'EOS "strain at break", ISO 527-1/-2; Z: 4%' },
      { label: 'Density', value: '0.93 g/cm³', note: 'EOS method' },
      { label: 'Melting temperature', value: '176 °C', note: 'ISO 11357-1/-3' },
    ],
    applications: [
      'Production equipment such as grippers, jigs and fixtures',
      'Medical surgery cutting guides and bone models',
      'Eyewear and consumer goods',
      'Automotive spare parts such as brackets and covers',
      'Functional prototypes with hinges or threads',
    ],
    faqs: [
      { q: 'Is EOS PA 2200 the same as PA12?', a: 'PA 2200 is EOS\'s trade name for its unfilled PA12 (polyamide 12) SLS powder. Other manufacturers sell PA12 powders under their own names; properties differ slightly between brands because powder formulation and test setups differ.' },
      { q: 'How strong is PA 2200 in the Z direction?', a: 'EOS lists Z tensile strength at 42 MPa versus 48 MPa in X/Y, and Z strain at break at only 4% versus 18% in-plane. Cross-layer ductility is the main limitation to design around.' },
      { q: 'What is PA 2200 used for?', a: 'EOS lists grippers, jigs and fixtures, medical cutting guides and bone models, eyewear, automotive brackets and covers, and functional prototypes with hinges or threads — a general-purpose profile rather than a specialist one.' },
    ],
    sources: [
      { label: 'EOS Material Data Sheet — PA 2200 (status 10.11.2026)', url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-2200' },
    ],
  },
  {
    slug: 'eos-pa-1101',
    name: 'EOS PA 1101',
    manufacturer: 'EOS',
    basePolymer: 'PA11',
    form: 'Powder',
    process: 'SLS',
    quickAnswer:
      'EOS PA 1101 is a bio-based PA11 SLS powder derived from castor oil. Per the EOS data sheet it offers 50 MPa tensile strength (XY), 1650 MPa modulus and 30% elongation at break — its ductility and impact resistance, not stiffness, are the reason to choose it over PA12.',
    intro: [
      'PA 1101 is EOS\'s polyamide 11 powder. PA11 is produced from castor oil, which makes it a bio-based polymer, and its molecular structure gives it a distinctly tougher character than PA12: EOS positions it for impact-resistant applications that must not splinter under load.',
      'The headline number is elongation: 30% strain at break in X/Y (15% in Z) versus 18% (4% in Z) for PA 2200, at the same 1650 MPa modulus. That combination — PA12-like stiffness with much better ductility — is what clips, buckles and snap-fits need.',
    ],
    processing: [
      'SLS powder for EOS polymer systems; values below are from the current EOS material data sheet.',
      'Melting temperature is 201 °C (ISO 11357-1/-3), noticeably higher than PA 2200\'s 176 °C, which is relevant when a service bureau runs both materials.',
      'Density is 1.03 g/cm³ per ISO 1183-1.',
    ],
    properties: [
      { label: 'Tensile strength (X/Y)', value: '50 MPa', note: 'ISO 527-1/-2; Z: 48 MPa' },
      { label: 'Tensile modulus', value: '1650 MPa', note: 'ISO 527-1/-2, all orientations' },
      { label: 'Elongation at break (X/Y)', value: '30%', note: 'EOS "strain at break", ISO 527-1/-2; Z: 15%' },
      { label: 'Density', value: '1.03 g/cm³', note: 'ISO 1183-1' },
      { label: 'Melting temperature', value: '201 °C', note: 'ISO 11357-1/-3' },
    ],
    applications: [
      'Impact-resistant housings and coverings that must not splinter',
      'Clips, buckles and other parts needing high elongation at break',
      'Eyewear',
      'Functional parts that flex in service',
    ],
    faqs: [
      { q: 'Is PA 1101 bio-based?', a: 'Yes. PA11 is polymerised from a monomer derived from castor oil, and EOS markets PA 1101 on that basis. The polymer itself behaves like a technical nylon; "bio-based" describes the feedstock, not biodegradability.' },
      { q: 'PA 1101 or PA 2200?', a: 'Choose PA 1101 when the part must bend, snap or survive impact: 30% elongation versus 18%, and 15% versus 4% in Z. Choose PA 2200 for general-purpose parts where its balanced profile and lower melting point are convenient. The full comparison is in the PA11 vs PA12 guide.' },
      { q: 'Is PA 1101 stronger than PA 2200?', a: 'In tensile strength, marginally: 50 MPa vs 48 MPa (XY). In stiffness they are equal at 1650 MPa. The meaningful differences are ductility and impact behaviour, where PA11 leads clearly.' },
    ],
    sources: [
      { label: 'EOS Material Data Sheet — PA 1101 (status 10.11.2026)', url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-1101' },
    ],
  },
  {
    slug: 'eos-pa-3200-gf',
    name: 'EOS PA 3200 GF',
    manufacturer: 'EOS',
    basePolymer: 'PA12, glass-filled',
    form: 'Powder',
    process: 'SLS',
    quickAnswer:
      'EOS PA 3200 GF is a glass-bead-filled PA12 SLS powder (40 wt% glass beads per EOS). Filling raises tensile modulus to 3200 MPa — roughly double unfilled PA 2200 — with 51 MPa tensile strength and 9% elongation at break, for stiff housings and wear-resistant machine components.',
    intro: [
      'PA 3200 GF is EOS\'s stiff SLS nylon. The base polymer is PA12, filled with 40 wt% glass beads — beads, not fibres, per the EOS data sheet. Spherical bead filler raises stiffness and dimensional stability in all directions more evenly than fibre filling would.',
      'The trade is ductility: elongation falls to 9% in-plane (5.5% in Z) from PA 2200\'s 18%. This is a material for parts that must not flex — housings under load, fixtures, forming tools — not for clips or hinges.',
    ],
    processing: [
      'SLS powder for EOS polymer systems.',
      'EOS does not publish a melting temperature for this grade (the field is blank in the current data sheet), so none is listed here.',
      'Density is 1.22 g/cm³ (EOS method), reflecting the glass content; parts are noticeably heavier than unfilled PA12.',
    ],
    properties: [
      { label: 'Tensile strength (X/Y)', value: '51 MPa', note: 'ISO 527-1/-2; Z: 47 MPa' },
      { label: 'Tensile modulus (X/Y)', value: '3200 MPa', note: 'ISO 527-1/-2; Z: 2500 MPa' },
      { label: 'Elongation at break (X/Y)', value: '9%', note: 'EOS "strain at break", ISO 527-1/-2; Z: 5.5%' },
      { label: 'Density', value: '1.22 g/cm³', note: 'EOS method' },
      { label: 'Glass content', value: '40 wt% glass beads', note: 'Per EOS data sheet' },
    ],
    applications: [
      'Machine components needing enhanced stiffness under load, e.g. housings',
      'Heavily used parts needing wear and abrasion resistance',
      'Forming tools',
    ],
    faqs: [
      { q: 'Is PA 3200 GF filled with glass fibre or glass beads?', a: 'Glass beads. EOS specifies a white PA12 powder filled with 40 wt% glass beads. Bead filling stiffens more isotropically than short-fibre filling.' },
      { q: 'How much stiffer is PA 3200 GF than PA 2200?', a: 'Tensile modulus is 3200 MPa vs 1650 MPa in the XY plane — close to double. Elongation at break halves in exchange (9% vs 18%).' },
      { q: 'When should I avoid PA 3200 GF?', a: 'For parts that must flex, snap or absorb impact: its 9% elongation and bead-filled structure make it comparatively brittle. Unfilled PA12 or PA11 serve those applications better.' },
    ],
    sources: [
      { label: 'EOS Material Data Sheet — PA 3200 GF (status 10.11.2026)', url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-3200-gf' },
    ],
  },
  {
    slug: 'formlabs-nylon-12-powder',
    name: 'Formlabs Nylon 12 Powder',
    manufacturer: 'Formlabs',
    basePolymer: 'PA12',
    form: 'Powder',
    process: 'SLS (Fuse series)',
    quickAnswer:
      'Formlabs Nylon 12 Powder is the standard PA12 for the Fuse SLS series: 50 MPa ultimate tensile strength, 1850 MPa tensile modulus and 11% elongation at break (X/Y) per the Formlabs technical data sheet, with an HDT of 171 °C at 0.45 MPa.',
    intro: [
      'Nylon 12 Powder is Formlabs\' general-purpose SLS material, positioned for functional prototyping and end-use production of complex assemblies and durable parts with high environmental stability. It is the default choice on Fuse printers the way PA 2200 is on EOS systems.',
      'Formlabs reports properties per ASTM D638 Type 1 specimens. Note the Z-direction penalty in elongation: 6% in Z versus 11% in X/Y — smaller than the drop EOS reports for PA 2200, but the same design lesson applies.',
    ],
    processing: [
      'SLS powder for Formlabs Fuse series printers.',
      'Heat deflection temperature is 87 °C at 1.8 MPa and 171 °C at 0.45 MPa (ASTM D648) — the load matters, so both figures are listed.',
      'Formlabs\' product page also positions the material for thermoforming applications such as clear aligner moulds, and for biocompatible/sterilisable parts including orthotics and prosthetics.',
    ],
    properties: [
      { label: 'Ultimate tensile strength', value: '50 MPa', note: 'ASTM D638 Type 1' },
      { label: 'Tensile modulus', value: '1850 MPa', note: 'ASTM D638 Type 1' },
      { label: 'Elongation at break (X/Y)', value: '11%', note: 'ASTM D638 Type 1; Z: 6%' },
      { label: 'HDT @ 1.8 MPa', value: '87 °C', note: 'ASTM D648' },
      { label: 'HDT @ 0.45 MPa', value: '171 °C', note: 'ASTM D648' },
    ],
    applications: [
      'Functional prototyping and end-use production of complex assemblies',
      'Permanent jigs, fixtures and tooling',
      'Low-volume manufacturing',
      'Orthotics and prosthetics and other sterilisable parts',
      'Thermoforming moulds (e.g. clear aligners)',
    ],
    faqs: [
      { q: 'Which printers use Formlabs Nylon 12 Powder?', a: 'The Formlabs Fuse series of SLS printers (Fuse 1 and Fuse 1+ 30W). It is a closed material system tuned for those machines.' },
      { q: 'How does it compare with EOS PA 2200?', a: 'Both are unfilled PA12 SLS powders with 50 MPa-class tensile strength. Formlabs lists a somewhat higher modulus (1850 vs 1650 MPa) and lower elongation (11% vs 18%), but the numbers come from different test standards (ASTM D638 vs ISO 527), so treat them as indicative, not a controlled head-to-head.' },
      { q: 'What is its heat resistance?', a: 'Formlabs lists HDT of 171 °C at 0.45 MPa load and 87 °C at 1.8 MPa (ASTM D648). For parts under real load at temperature, the 1.8 MPa figure is the conservative design value.' },
    ],
    sources: [
      { label: 'Formlabs Technical Data Sheet — Nylon 12 Powder (Rev. 01, 2020)', url: 'https://formlabs-media.formlabs.com/datasheets/2201730-TDS-ENUS-0.pdf' },
      { label: 'Formlabs product page — Nylon 12 Powder', url: 'https://formlabs.com/products/nylon-12-powder/' },
    ],
  },
  {
    slug: 'formlabs-nylon-11-powder',
    name: 'Formlabs Nylon 11 Powder',
    manufacturer: 'Formlabs',
    basePolymer: 'PA11',
    form: 'Powder',
    process: 'SLS (Fuse series)',
    quickAnswer:
      'Formlabs Nylon 11 Powder is a bio-based PA11 for the Fuse series, built for parts that bend or take impact: 49 MPa tensile strength, 1600 MPa modulus and 40% elongation at break (X/Y) per the Formlabs technical data sheet — the most ductile powder in the Formlabs range.',
    intro: [
      'Nylon 11 Powder is Formlabs\' high-ductility option. Where Nylon 12 Powder is the balanced default, Nylon 11 is specified when parts must flex, snap or survive drops: its 40% elongation at break is in a different class from the 11% of its PA12 sibling.',
      'Formlabs describes it as a high-performance, bio-based nylon for functional prototyping and small-batch production, and lists thin-walled ducts, enclosures, snaps, clips and hinges among its applications — the classic PA11 use profile.',
    ],
    processing: [
      'SLS powder for Formlabs Fuse series printers.',
      'HDT is 46 °C at 1.8 MPa and 182 °C at 0.45 MPa (ASTM D648-16): under significant load its heat resistance is modest, which is the usual PA11 trade-off.',
      'The data sheet gives no Z-direction elongation figure, so only the X/Y value is published here.',
    ],
    properties: [
      { label: 'Ultimate tensile strength', value: '49 MPa', note: 'ASTM D638-14 Type 1' },
      { label: 'Tensile modulus', value: '1600 MPa', note: 'ASTM D638-14 Type 1' },
      { label: 'Elongation at break (X/Y)', value: '40%', note: 'ASTM D638-14 Type 1; Z not published' },
      { label: 'HDT @ 1.8 MPa', value: '46 °C', note: 'ASTM D648-16' },
      { label: 'HDT @ 0.45 MPa', value: '182 °C', note: 'ASTM D648-16' },
    ],
    applications: [
      'Impact-resistant prototypes, jigs and fixtures',
      'Thin-walled ducts and enclosures',
      'Snaps, clips and hinges',
      'Orthotics and prosthetics (e.g. insoles)',
    ],
    faqs: [
      { q: 'Why choose Nylon 11 Powder over Nylon 12 Powder?', a: 'Ductility. At 40% elongation at break versus 11%, PA11 bends and absorbs impact where PA12 cracks. Strength and stiffness are similar, so the choice is about failure mode, not load capacity. See the PA11 vs PA12 guide for the full picture.' },
      { q: 'Is Nylon 11 Powder bio-based?', a: 'Yes — PA11 is derived from castor oil, and Formlabs markets the powder as bio-based. As with all PA11, that describes the feedstock; the printed polymer is a durable engineering nylon, not a biodegradable plastic.' },
      { q: 'What is the catch with PA11?', a: 'Heat under load: HDT at 1.8 MPa is only 46 °C, and the powder typically costs more than PA12. For hot or purely static parts, PA12 is usually the better value.' },
    ],
    sources: [
      { label: 'Formlabs Technical Data Sheet — Nylon 11 Powder (Rev. 01, 2021)', url: 'https://formlabs-media.formlabs.com/datasheets/2101560-TDS-ENUS-0.pdf' },
      { label: 'Formlabs product page — Nylon 11 Powder', url: 'https://formlabs.com/eu/products/nylon-11-powder/' },
    ],
  },

  {
    slug: 'hp-pa-12',
    name: 'HP 3D High Reusability PA 12',
    manufacturer: 'HP',
    basePolymer: 'PA12',
    form: 'Powder',
    process: 'MJF',
    quickAnswer:
      'HP 3D High Reusability PA 12 is the standard nylon for Multi Jet Fusion: 54 MPa tensile strength, 2150 MPa tensile modulus and 18% elongation at break in XY (10% in Z), with a density of 1.02 g/cm³, per HP\'s technical data sheet. "High Reusability" refers to HP\'s powder-refresh economics: surplus powder is recovered and reused at a set refresh ratio.',
    intro: [
      'PA 12 is the default MJF material and the grade most MJF service bureaus run. Compared with SLS PA12 grades, HP publishes unusually uniform figures: tensile strength and modulus are the same in XY and Z in the current data sheet, which reflects MJF\'s near-isotropic positioning.',
      'Elongation still shows the powder-bed pattern — 18% in XY versus 10% in Z — so ductility-critical features should still be oriented with the layer structure in mind, even though the anisotropy is milder than in SLS.',
    ],
    processing: [
      'MJF powder for HP Jet Fusion systems; unfused powder is recovered and refreshed with virgin material at the ratio HP specifies for the system.',
      'HP does not list an HDT value in the current data sheet (document 4AA8-5029ENW), so no heat-deflection figure is published here — see the sourcing policy on omitted values.',
      'Raw MJF parts are grey from the fusing agent and are commonly dyed black.',
    ],
    properties: [
      { label: 'Tensile strength', value: '54 MPa', note: 'Per HP data sheet; same value listed for XY and Z' },
      { label: 'Tensile modulus', value: '2150 MPa', note: 'Per HP data sheet; same value listed for XY and Z' },
      { label: 'Elongation at break (XY)', value: '18%', note: 'Per HP data sheet; Z: 10%' },
      { label: 'Density', value: '1.02 g/cm³', note: 'Per HP data sheet' },
    ],
    applications: [
      'Functional prototypes and end-use production parts',
      'Housings, enclosures and ducting',
      'Jigs, fixtures and assembly aids',
      'Balanced general-purpose MJF work where PA 11 ductility is not required',
    ],
    faqs: [
      { q: 'What does "High Reusability" mean?', a: 'It is HP\'s name for its powder economics: after a build, the unfused PA 12 is recovered and blended with a defined proportion of virgin powder (the refresh ratio) for the next build. This keeps material cost per part lower than processes that discard aged powder.' },
      { q: 'HP PA 12 or HP PA 11?', a: 'PA 12 is the balanced, economical default. PA 11 is the ductility upgrade for clips, hinges and impact-loaded parts — the same choice as in SLS, covered in the PA11 vs PA12 guide. (HP\'s current PA 11 datasheet could not be re-verified at publication time, so this database does not yet list its values.)' },
      { q: 'Is MJF PA 12 stronger than SLS PA12?', a: 'On paper the tensile figures are similar (54 MPa vs 48-50 MPa for EOS/Formlabs grades), and HP lists equal XY and Z strength. Test methods differ between manufacturers, so compare the full table on each material page rather than a single number.' },
    ],
    sources: [
      { label: 'HP Technical Data Sheet — HP 3D High Reusability PA 12 (doc. 4AA8-5029ENW)', url: 'https://www8.hp.com/h20195/v2/GetDocument.aspx?docname=4AA8-5029ENW' },
      { label: 'HP 3D printing — official site', url: 'https://www.hp.com/us-en/printers/3d-printers/products.html' },
    ],
  },
  {
    slug: 'basf-ultrasint-pa6',
    name: 'BASF Forward AM Ultrasint PA6',
    manufacturer: 'BASF Forward AM',
    basePolymer: 'PA6',
    form: 'Powder',
    process: 'SLS',
    quickAnswer:
      'Ultrasint PA6 is BASF Forward AM\'s unfilled PA6 powder for laser sintering — the high-temperature, high-stiffness alternative to PA12 powders. Per BASF\'s TDS (v14.2): 66 MPa tensile strength and 3700 MPa modulus (X, dry), HDT of 103 °C at 1.8 MPa, and a 220 °C melting temperature — but only 2.0% elongation at break when dry.',
    intro: [
      'Where PA12 powders optimise for balance, Ultrasint PA6 optimises for stiffness and heat: its dry tensile modulus of 3700 MPa is more than double EOS PA 2200\'s, and its HDT at 1.8 MPa (103 °C) is in a class PA12 powders do not reach. BASF targets engine-compartment parts, fluid reservoirs and media-flow components.',
      'The PA6 caveats are written into the same datasheet. Dry elongation at break is just 2.0%; conditioned (moisture-equilibrated) specimens reach 16% but tensile strength falls from 66 to 47 MPa and modulus from 3700 to 1700 MPa. PA6 absorbs more moisture than PA12, and its properties move with it — the datasheet\'s dry/conditioned column pairs are the honest picture of the material.',
    ],
    processing: [
      'SLS (laser sintering) powder; printed part density 1.15 g/cm³ (DIN EN ISO 1183-1) per the TDS.',
      'Melting temperature 220 °C (ISO 11357) — a hotter process window than PA12 powders.',
      'Values below are X-direction, dry as printed, unless the note says otherwise; conditioned values are given in the notes because PA6 is unusually moisture-sensitive.',
    ],
    properties: [
      { label: 'Tensile strength (X, dry)', value: '66 MPa', note: 'ISO 527-2 at 23 °C; conditioned: 47 MPa; Z dry: 56 MPa' },
      { label: 'Tensile modulus (X, dry)', value: '3700 MPa', note: 'ISO 527-2 at 23 °C; conditioned: 1700 MPa' },
      { label: 'Elongation at break (X, dry)', value: '2.0%', note: 'ISO 527-2 at 23 °C; conditioned: 16%' },
      { label: 'HDT @ 1.8 MPa', value: '103 °C', note: 'ISO 75-2 (HDT/A)' },
      { label: 'HDT @ 0.45 MPa', value: '192 °C', note: 'ISO 75-2 (HDT/B)' },
      { label: 'Density (printed part)', value: '1.15 g/cm³', note: 'DIN EN ISO 1183-1' },
      { label: 'Melting temperature', value: '220 °C', note: 'ISO 11357' },
    ],
    applications: [
      'Engine compartment parts',
      'Jigs and fixtures',
      'Piping and media flow / storage parts',
      'Fluid reservoirs',
      'Multi-purpose industrial goods',
    ],
    faqs: [
      { q: 'Why does the datasheet give dry and conditioned values?', a: 'PA6 absorbs significant moisture, and moisture plasticises it: conditioned specimens are weaker and less stiff but far more ductile (elongation rises from 2.0% to 16%). Parts in service equilibrate toward the conditioned state, so BASF publishes both.' },
      { q: 'Ultrasint PA6 or a PA12 powder?', a: 'PA6 when stiffness and heat resistance dominate and the environment is controlled; PA12 when balanced properties, ductility and moisture stability matter more. They are not drop-in substitutes — PA6 also runs a hotter process window (220 °C melting temperature).' },
      { q: 'Is Ultrasint PA6 filled?', a: 'No — this is the unfilled grade. BASF also sells Ultrasint PA6 MF, a mineral-filled variant with still higher modulus; it is a different product with its own datasheet and is not covered by the values on this page.' },
    ],
    sources: [
      { label: 'BASF Forward AM Technical Data Sheet — Ultrasint PA6, v14.2 (04/2021)', url: 'https://sls3d.de/wp-content/uploads/BASF_3DPS_TDS_Ultrasint_PA6_V14.2.pdf' },
      { label: 'Forward AM (BASF) — official site', url: 'https://www.forward-am.com' },
    ],
  },
  {
    slug: 'polymaker-polymide-pa6-cf',
    name: 'Polymaker PolyMide PA6-CF',
    manufacturer: 'Polymaker',
    basePolymer: 'PA6, carbon-fibre filled',
    form: 'Filament',
    process: 'FDM',
    quickAnswer:
      'Polymaker\'s carbon-fibre PA6 filament — now sold as Fiberon PA6-CF20, the same formula — is one of the stiffest desktop nylon filaments: 109.3 MPa tensile strength and 8636 MPa Young\'s modulus in XY, HDT of 173 °C at 1.8 MPa, per Polymaker\'s current TDS. The price of that stiffness is 2.1% elongation at break and a mandatory 100 °C / 10 h dry before printing.',
    intro: [
      'PolyMide PA6-CF built its reputation as the benchmark stiff nylon filament, and Polymaker has since moved it into the Fiberon line as PA6-CF20 (20% carbon fibre), stating it is the same proven formula. The current TDS (v1.1) values below are for Fiberon PA6-CF20; note they differ from the older PolyMide TDS revisions still circulating online.',
      'The XY/Z split is the story of all PA-CF filaments in one row: 109.3 MPa strength and 8636 MPa modulus within layers, 54.0 MPa and 3760 MPa across them. Design so loads stay in-plane, and this filament produces genuinely structural desktop parts.',
    ],
    processing: [
      'Nozzle temperature 280–300 °C per the TDS — an all-metal, high-temperature hotend is required, plus a hardened nozzle for the abrasive carbon fibre.',
      'Drying is specified, not optional: 100 °C for 10 h in the TDS printing conditions.',
      'Density 1.17 g/cm³ (ISO 1183). Values are for dry specimens at 23 °C.',
    ],
    properties: [
      { label: 'Tensile strength (X-Y)', value: '109.3 MPa', note: 'ISO 527, ±2.4; Z: 54.0 MPa' },
      { label: 'Young\'s modulus (X-Y)', value: '8636 MPa', note: 'ISO 527, ±211; Z: 3760 MPa' },
      { label: 'Elongation at break (X-Y)', value: '2.1%', note: 'ISO 527; Z: 1.9%' },
      { label: 'HDT @ 1.8 MPa', value: '173 °C', note: 'ISO 75; @ 0.45 MPa: 215 °C' },
      { label: 'Density', value: '1.17 g/cm³', note: 'ISO 1183 at 23 °C' },
      { label: 'Nozzle temperature', value: '280–300 °C', note: 'Manufacturer recommendation' },
      { label: 'Drying', value: '100 °C for 10 h', note: 'TDS recommended printing conditions' },
    ],
    applications: [
      'Structural brackets and machine components',
      'Gears and drivetrain parts',
      'Drone and RC components',
      'High-stiffness jigs and fixtures',
      'Automotive under-bonnet parts within its temperature limits',
    ],
    faqs: [
      { q: 'Is Fiberon PA6-CF20 the same as PolyMide PA6-CF?', a: 'Polymaker states the Fiberon PA6-CF20 is the same proven formula as PolyMide PA6-CF, rebranded into the Fiberon line. The current TDS values differ slightly from older PolyMide TDS revisions, so cite the current document (v1.1).' },
      { q: 'Why is elongation so low for a nylon?', a: 'Carbon fibre stiffens the PA6 matrix and constrains its ability to stretch: 2.1% elongation at break versus double-digit figures for unfilled nylons. It behaves more like a rigid composite than a ductile nylon — strong and stiff, but not a material for snap-fits or hinges.' },
      { q: 'Do I really need to dry it for 10 hours?', a: 'Polymaker specifies 100 °C for 10 h. PA6 is the most moisture-hungry of the common printing nylons; under-dried PA6-CF prints with bubbles, poor layer adhesion and measurably lower strength. See the drying guide.' },
    ],
    sources: [
      { label: 'Polymaker TDS — Fiberon PA6-CF20, v1.1', url: 'https://polymaker.com/wp-content/uploads/TDS_FIBERON-PA6-CF20_V1.1_EN.pdf' },
      { label: 'Polymaker product page — Fiberon PA6-CF20 (formerly PolyMide PA6-CF)', url: 'https://shop.polymaker.com/products/fiberon-pa6-cf20' },
    ],
  },
  {
    slug: 'polymaker-polymide-copa',
    name: 'Polymaker PolyMide CoPA',
    manufacturer: 'Polymaker',
    basePolymer: 'Copolyamide (PA6/66 blend)',
    form: 'Filament',
    process: 'FDM',
    quickAnswer:
      'PolyMide CoPA is Polymaker\'s copolyamide filament, blended for easier printing: 78.0 MPa tensile strength, 2703 MPa modulus and 12.7% elongation at break in XY per its TDS — less stiff than PA6-CF, but far more ductile, less warp-prone, and printable at 250–270 °C.',
    intro: [
      'CoPA is a copolymer of PA6 and PA66 formulated to fix the two complaints about straight nylon filament: warping and brittleness. It gives up the extreme stiffness of carbon-filled PA6 in exchange for 12.7% elongation and a friendlier printing window — the "nylon for people who found PA6-CF too much" option.',
      'Its XY/Z split also teaches the standard FDM lesson in reverse: elongation is 12.7% within layers but only 1.3% across them — interlayer ductility, not strength, is the first thing FDM nylon loses.',
    ],
    processing: [
      'Nozzle temperature 250–270 °C per the TDS (v5.4).',
      'Drying setting in the TDS: 100 °C for 8 h.',
      'Polymaker rates heat resistance up to 180 °C (Vicat), but the load-bearing HDT figures are 111 °C at 0.45 MPa and 70 °C at 1.8 MPa — design to the HDT, not the headline.',
    ],
    properties: [
      { label: 'Tensile strength (X-Y)', value: '78.0 MPa', note: 'ISO 527, ±0.7; Z: 45.8 MPa' },
      { label: 'Young\'s modulus (X-Y)', value: '2703 MPa', note: 'ISO 527, ±259; Z: 2209 MPa' },
      { label: 'Elongation at break (X-Y)', value: '12.7%', note: 'ISO 527, ±2.1; Z: 1.3%' },
      { label: 'HDT @ 1.8 MPa', value: '70 °C', note: 'ISO 75; @ 0.45 MPa: 111 °C' },
      { label: 'Density', value: '1.12 g/cm³', note: 'ISO 1183 at 23 °C' },
      { label: 'Nozzle temperature', value: '250–270 °C', note: 'Manufacturer recommendation' },
      { label: 'Drying', value: '100 °C for 8 h', note: 'TDS drying setting' },
    ],
    applications: [
      'Functional parts needing nylon toughness without composite stiffness',
      'Living hinges and clips in FDM (within interlayer limits)',
      'Wear parts, guides and low-friction components',
      'Prototypes that will later be produced in powder-bed nylon',
    ],
    faqs: [
      { q: 'CoPA or PA6-CF?', a: 'PA6-CF when stiffness and heat resistance are the priority (8636 MPa modulus, 173 °C HDT at 1.8 MPa) and the part does not need to flex. CoPA when the part must bend, snap or survive handling, and for easier printing on less specialised machines.' },
      { q: 'Does CoPA warp less than other nylons?', a: 'That is its design goal: the copolyamide blend has lower crystallisation-driven shrinkage than straight PA6. It still needs an enclosure-friendly setup and dry filament — easier is not the same as effortless.' },
      { q: 'What does CoPA stand for?', a: 'Copolyamide — a polymer combining PA6 and PA66 building blocks in one chain, blending PA6 toughness with PA66 heat behaviour.' },
    ],
    sources: [
      { label: 'Polymaker TDS — PolyMide CoPA, v5.4', url: 'https://cdn.shopify.com/s/files/1/0548/7299/7945/files/PolyMide_CoPA_TDS_V5.4.pdf' },
      { label: 'Polymaker product page — PolyMide CoPA', url: 'https://shop.polymaker.com/products/polymide-copa' },
    ],
  },
  {
    slug: 'bambu-pa6-cf',
    name: 'Bambu Lab PA6-CF',
    manufacturer: 'Bambu Lab',
    basePolymer: 'PA6, carbon-fibre filled',
    form: 'Filament',
    process: 'FDM',
    quickAnswer:
      'Bambu Lab PA6-CF is a carbon-fibre PA6 filament tuned for the Bambu ecosystem: 102 MPa tensile strength and 4430 MPa Young\'s modulus in XY, HDT of 164 °C at 1.8 MPa, per Bambu\'s TDS — with a gentler drying spec than most PA6-CF grades: 80 °C for 8–12 h.',
    intro: [
      'Bambu\'s PA6-CF trades a little of the Polymaker grade\'s extreme stiffness for a broader printing window (260–290 °C) and Bambu\'s usual spool/AMS integration. Its datasheet is unusually complete, publishing XY and Z values with tolerances for every property.',
      'As with all PA-CF filaments, the Z column is the design constraint: 48 MPa strength and 3.7% elongation across layers versus 102 MPa and 5.8% within them.',
    ],
    processing: [
      'Nozzle temperature 260–290 °C per the TDS (v3.0); hardened nozzle required for carbon fibre.',
      'Drying: 80 °C for 8–12 h in a blast drying oven per the TDS (Bambu also lists heatbed drying at 90–100 °C for 12 h on its printers).',
      'Density 1.09 g/cm³ (ISO 1183).',
    ],
    properties: [
      { label: 'Tensile strength (X-Y)', value: '102 MPa', note: '±7; Z: 48 MPa' },
      { label: 'Young\'s modulus (X-Y)', value: '4430 MPa', note: '±310; Z: 2170 MPa' },
      { label: 'Elongation at break (X-Y)', value: '5.8%', note: '±1.6; Z: 3.7%' },
      { label: 'HDT @ 1.8 MPa', value: '164 °C', note: 'ISO 75; @ 0.45 MPa: 186 °C' },
      { label: 'Density', value: '1.09 g/cm³', note: 'ISO 1183' },
      { label: 'Nozzle temperature', value: '260–290 °C', note: 'Manufacturer recommendation' },
      { label: 'Drying', value: '80 °C for 8–12 h', note: 'TDS, blast drying oven' },
    ],
    applications: [
      'Structural desktop-printed components',
      'Brackets, mounts and enclosures needing heat resistance',
      'Functional prototypes in the Bambu Lab ecosystem',
      'End-use parts where PA6-CF properties suffice without powder-bed processing',
    ],
    faqs: [
      { q: 'Bambu PA6-CF or Polymaker PA6-CF?', a: 'On datasheet numbers, Polymaker\'s grade is stiffer (8636 vs 4430 MPa modulus) and stronger in XY (109.3 vs 102 MPa), but demands 280–300 °C and a 100 °C / 10 h dry. Bambu\'s prints cooler and dries gentler (80 °C, 8–12 h). Test methods are both ISO-based, but specimen setups differ — treat the gap as indicative.' },
      { q: 'Can it go in the AMS?', a: 'Carbon-fibre filaments are abrasive and comparatively brittle on the spool path; follow Bambu\'s current guidance for your specific AMS model, and expect to need hardened extruder gears and nozzle.' },
      { q: 'How dry is dry enough?', a: 'Bambu specifies 80 °C for 8–12 h before printing. PA6-CF that has sat out should be re-dried; printing from a dry box preserves the investment.' },
    ],
    sources: [
      { label: 'Bambu Lab TDS — PA6-CF, v3.0', url: 'https://store.bblcdn.com/b2abc59ac250492b979a52f1ce3e61b3.pdf' },
    ],
  },
  {
    slug: 'bambu-paht-cf',
    name: 'Bambu Lab PAHT-CF',
    manufacturer: 'Bambu Lab',
    basePolymer: 'High-temperature PA, carbon-fibre filled',
    form: 'Filament',
    process: 'FDM',
    quickAnswer:
      'Bambu Lab PAHT-CF is a carbon-fibre-filled high-temperature polyamide filament: 92 MPa tensile strength, 3860 MPa modulus and 8.4% elongation at break in XY per Bambu\'s TDS, with the highest HDT of the filaments listed here at 170 °C under 1.8 MPa load — and more ductility than PA6-CF grades.',
    intro: [
      'PAHT-CF is Bambu\'s step up from PA6-CF: a higher-temperature polyamide base (the "HT") with carbon fibre. The datasheet profile is distinctive — slightly lower strength and stiffness than its PA6-CF sibling, but notably higher elongation (8.4% vs 5.8%) and the best load-bearing heat resistance in this filament set.',
      'That combination suits parts that live hot and take knocks: ducts, covers and components near heat sources where PA6-CF\'s brittleness is a liability.',
    ],
    processing: [
      'Nozzle temperature 260–290 °C per the TDS (v3.0); hardened nozzle and extruder components required.',
      'Drying: 80 °C for 8–12 h in a blast drying oven; Bambu\'s store page summarises this as drying at 80 °C for 12 h before printing.',
      'Density 1.06 g/cm³ (ISO 1183) — the lightest filament in this database, reflecting the base polymer.',
    ],
    properties: [
      { label: 'Tensile strength (X-Y)', value: '92 MPa', note: '±7; Z: 47 MPa' },
      { label: 'Young\'s modulus (X-Y)', value: '3860 MPa', note: '±230; Z: 2180 MPa' },
      { label: 'Elongation at break (X-Y)', value: '8.4%', note: '±1.8; Z: 4.1%' },
      { label: 'HDT @ 1.8 MPa', value: '170 °C', note: 'ISO 75; @ 0.45 MPa: 194 °C' },
      { label: 'Density', value: '1.06 g/cm³', note: 'ISO 1183' },
      { label: 'Nozzle temperature', value: '260–290 °C', note: 'Manufacturer recommendation' },
      { label: 'Drying', value: '80 °C for 8–12 h', note: 'TDS, blast drying oven' },
    ],
    applications: [
      'Hot-environment covers, ducts and housings',
      'End-use parts needing heat resistance plus impact tolerance',
      'Automotive and machinery components within temperature limits',
      'Functional parts where PA6-CF is too brittle',
    ],
    faqs: [
      { q: 'PAHT-CF or PA6-CF?', a: 'PA6-CF is stronger and stiffer on paper (102 MPa, 4430 MPa). PAHT-CF wins on elongation (8.4% vs 5.8%) and HDT at 1.8 MPa (170 vs 164 °C). Choose by failure mode: static stiffness → PA6-CF; heat plus knocks → PAHT-CF.' },
      { q: 'What polyamide is PAHT?', a: 'Bambu markets it as a high-temperature polyamide (a PA12-family-based blend in its material documentation) filled with carbon fibre. The verifiable engineering facts are the TDS values above; this page does not speculate beyond them.' },
      { q: 'Does PAHT-CF still need drying?', a: 'Yes — 80 °C for 8–12 h per the TDS. "High-temperature" describes the printed part\'s service behaviour, not moisture immunity; all polyamides are hygroscopic.' },
    ],
    sources: [
      { label: 'Bambu Lab TDS — PAHT-CF, v3.0', url: 'https://store.bblcdn.com/7166b20bc68f4c87b32c972b856eeb4b.pdf' },
      { label: 'Bambu Lab store — PAHT-CF', url: 'https://eu.store.bambulab.com/products/paht-cf' },
    ],
  },
  {
    slug: 'formlabs-nylon-12-gf-powder',
    name: 'Formlabs Nylon 12 GF Powder',
    manufacturer: 'Formlabs',
    basePolymer: 'PA12, glass-filled',
    form: 'Powder',
    process: 'SLS (Fuse series)',
    quickAnswer:
      'Formlabs Nylon 12 GF Powder is the glass-filled PA12 for the Fuse SLS series: glass filler raises tensile modulus to 2800 MPa (from 1850 MPa for unfilled Nylon 12 Powder) and HDT at 1.8 MPa to 113 °C, per Formlabs — at the cost of tensile strength (38 MPa) and elongation at break (4% in X/Y). It is the Fuse material for stiff parts that must hold their shape under sustained load and heat.',
    intro: [
      'Nylon 12 GF is Formlabs\' stiffness option for the Fuse series, positioned for parts where structural rigidity and thermal stability are the key requirements — static jigs and fixtures, and fixtures that sit under sustained loading. Adding glass to the PA12 base lifts the modulus by roughly half over the unfilled powder and pushes the load-bearing heat deflection temperature from 87 °C to 113 °C.',
      'The other side of the trade is written in the same data: ultimate tensile strength falls from 50 MPa to 38 MPa and elongation at break from 11% to 4%. Formlabs itself warns that thin features in Nylon 12 GF are more prone to breaking than in Nylon 12 because of the increased stiffness and brittleness — this is a material for rigid, chunky parts, not for clips, hinges or thin walls.',
    ],
    processing: [
      'SLS powder for Formlabs Fuse series printers, run at a standard refresh rate of 50% (Formlabs allows up to 70% under its guidance for troubleshooting defects).',
      'Formlabs recommends tuning the printer\'s bed temperature before the first build in this material, on aged powder.',
      'Parts carry a stronger Surface Armor shell than Nylon 12 parts and need media blasting to remove it fully.',
    ],
    properties: [
      { label: 'Ultimate tensile strength', value: '38 MPa', note: 'ASTM D638-14 Type 1' },
      { label: 'Tensile modulus', value: '2800 MPa', note: 'ASTM D638-14 Type 1' },
      { label: 'Elongation at break (X/Y)', value: '4%', note: 'ASTM D638-14 Type 1; Z: 3%' },
      { label: 'Flexural modulus', value: '2400 MPa', note: 'ASTM D790-15' },
      { label: 'Notched Izod impact strength', value: '36 J/m', note: 'ASTM D256-10' },
      { label: 'HDT @ 1.8 MPa', value: '113 °C', note: 'ASTM D648-16' },
      { label: 'HDT @ 0.45 MPa', value: '170 °C', note: 'ASTM D648-16' },
    ],
    applications: [
      'Stiff structural components that must not flex',
      'Static jigs and fixtures, including fixtures under long-term sustained loading',
      'Parts needing thermal stability at higher service temperatures',
      'Rigid housings and brackets on Fuse-series production',
    ],
    faqs: [
      { q: 'Nylon 12 GF or plain Nylon 12 Powder?', a: 'GF when the part must stay rigid and hold shape under load and heat: modulus 2800 vs 1850 MPa and HDT at 1.8 MPa of 113 °C vs 87 °C. Plain Nylon 12 when the part needs strength and toughness instead: 50 MPa tensile strength and 11% elongation versus 38 MPa and 4% for the GF grade.' },
      { q: 'What refresh rate does Nylon 12 GF use?', a: 'Formlabs specifies a standard refresh rate of 50% virgin powder, and allows up to 70% under its guidance when troubleshooting part defects. That is a higher virgin-powder share than unfilled Fuse nylons typically run, which is part of this material\'s running cost.' },
      { q: 'Is the filler glass fibre or glass beads?', a: 'Formlabs describes the material as glass-filled PA12 and does not specify the filler form (fibre vs beads) in its published data sheet, so this page does not claim one. EOS, by contrast, explicitly specifies glass beads for PA 3200 GF.' },
      { q: 'When should I avoid Nylon 12 GF?', a: 'For thin features, snap-fits, hinges and anything that must flex or absorb impact. Formlabs notes thin features are more prone to breaking in this material; its 4% elongation at break is the lowest of the Fuse nylon powders listed here.' },
    ],
    sources: [
      { label: 'Formlabs support — Using Nylon 12 GF (values per Formlabs Nylon 12 GF Powder TDS, Rev. 01)', url: 'https://formlabs.com/support/Using-Nylon-12-GF/' },
    ],
  },
  {
    slug: 'polymaker-polymide-pa12-cf',
    name: 'Polymaker PolyMide PA12-CF',
    manufacturer: 'Polymaker',
    basePolymer: 'PA12, carbon-fibre filled',
    form: 'Filament',
    process: 'FDM',
    quickAnswer:
      'Polymaker PolyMide PA12-CF is a carbon-fibre-filled PA12 filament built around moisture stability: 77.4 MPa tensile strength and 3311 MPa Young\'s modulus in XY (dry), an HDT of 105 °C at 1.8 MPa and only ~1.5% equilibrium water absorption, per Polymaker\'s TDS (v5.4). Where PA6-CF grades are stiffer but thirstier, PA12-CF keeps its properties in humid service — note that the datasheet\'s dry figures are measured on annealed specimens.',
    intro: [
      'PA12-CF is Polymaker\'s answer to the PA6 problem: PA6-based carbon-fibre filaments post higher dry stiffness, but PA6 absorbs so much moisture that properties fall away in service. The long-chain PA12 base absorbs far less (Polymaker estimates ~1.5% equilibrium water absorption), and the TDS wet column shows the result — tensile strength only drops from 77.4 MPa dry to 71.7 MPa wet. Polymaker adds its Warp-Free technology, so the filament prints on a cool 25–50 °C bed.',
      'Read the datasheet\'s fine print before using its headline numbers: the dry mechanical values come from specimens annealed at 80 °C for 6 h and dried for 48 h before testing. Polymaker recommends annealing printed parts the same way, so the published figures describe the annealed part, not the as-printed one. Its Z tensile strength of 52.2 MPa is also unusually high for an FDM filament, which matters for parts loaded across layers.',
    ],
    processing: [
      'Contains 10% chopped carbon fibre by weight (per Polymaker\'s SDS) — abrasive; Polymaker states a brass nozzle lasts roughly 9 hours and recommends hardened steel or ruby.',
      'Nozzle temperature 260–300 °C; build plate only 25–50 °C per the TDS (do not exceed 50 °C); an enclosure held at ambient temperature is specified.',
      'Drying setting: 100 °C for 8 h. Annealing setting: 80 °C for 6 h, recommended after printing.',
    ],
    properties: [
      { label: 'Tensile strength (X-Y)', value: '77.4 MPa', note: 'ISO 527, ±1.1, dry; Z: 52.2 MPa; wet: 71.7 MPa' },
      { label: 'Young\'s modulus (X-Y)', value: '3311 MPa', note: 'ISO 527, ±135, dry; Z: 1807 MPa' },
      { label: 'Elongation at break (X-Y)', value: '4.2%', note: 'ISO 527, ±0.4, dry; Z: 5.0%' },
      { label: 'HDT @ 1.8 MPa', value: '105 °C', note: 'ISO 75; @ 0.45 MPa: 131 °C' },
      { label: 'Density', value: '1.06 g/cm³', note: 'ISO 1183 at 23 °C' },
      { label: 'Melting temperature', value: '171 °C', note: 'DSC, 10 °C/min' },
      { label: 'Nozzle temperature', value: '260–300 °C', note: 'Manufacturer recommendation' },
      { label: 'Drying', value: '100 °C for 8 h', note: 'TDS drying setting' },
    ],
    applications: [
      'Manufacturing tools — Polymaker\'s stated design use for this grade',
      'Jigs and fixtures that work in humid environments',
      'End-use parts where PA6-CF\'s moisture-driven property loss is unacceptable',
      'Dimensionally stable functional parts printed on low-temperature beds',
    ],
    faqs: [
      { q: 'PA12-CF or PA6-CF?', a: 'PA6-CF grades are stiffer and stronger when bone dry (Polymaker\'s own PA6-CF: 8636 MPa modulus, 109.3 MPa strength). PA12-CF wins on stability: ~1.5% equilibrium water absorption, and wet tensile strength of 71.7 MPa against 77.4 MPa dry — a small drop where PA6 grades fall much further. Choose by the environment the part will live in, not the dry datasheet alone.' },
      { q: 'Why do the datasheet values say "annealed"?', a: 'Polymaker tested specimens that were annealed at 80 °C for 6 h and dried for 48 h, and it recommends annealing printed parts at 80 °C for 6 h. Annealing raises crystallinity and with it strength and stiffness, so as-printed, unannealed parts will test below the table values.' },
      { q: 'Does PA12-CF need a hot build plate?', a: 'No — the opposite. The TDS specifies a 25–50 °C build plate and warns implicitly through its Warp-Free design: the material is formulated to release from the bed cleanly at low temperatures. It still needs a 260–300 °C all-metal hotend and a hardened nozzle.' },
    ],
    sources: [
      { label: 'Polymaker TDS — PolyMide PA12-CF, v5.4', url: 'https://polymaker-imweb.pages.dev/tds/polymide-pa12-cf.pdf' },
      { label: 'Polymaker SDS — PolyMide PA12-CF (fibre content)', url: 'https://polymaker.com.cn/wp-content/tech-docs/PolyMide_PA12-CF_SDS_AU_EN_V1.pdf' },
    ],
  },
];

// Build-time validation: a material may not ship without sources or properties.
for (const m of MATERIALS) {
  if (!m.sources.length) throw new Error(`Material ${m.slug} has no sources`);
  if (!m.properties.length) throw new Error(`Material ${m.slug} has no properties`);
  for (const s of m.sources) {
    if (!/^https:\/\//.test(s.url)) throw new Error(`Material ${m.slug} has a non-HTTPS source: ${s.url}`);
  }
}
