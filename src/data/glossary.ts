// Glossary terms. Definitions must stay consistent with the rest of the site.
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'pa11',
    term: 'PA11 (polyamide 11)',
    definition:
      'A nylon made from 11-aminoundecanoic acid, which is derived from castor oil, making PA11 a bio-based polyamide. Compared with PA12 it is generally more ductile and impact-resistant, with higher elongation at break, which is why it is preferred for clips, living hinges and parts that must flex or absorb impact. It is used as an SLS and MJF powder and occasionally as a filament.',
  },
  {
    id: 'pa12',
    term: 'PA12 (polyamide 12)',
    definition:
      'The most widely used nylon in 3D printing. PA12 is a petrochemical polyamide with a balanced profile of strength, stiffness and elongation, low moisture uptake for a nylon, and good chemical resistance. It is the standard powder for SLS and MJF and is also extruded into filament. Most "nylon" 3D printing parts discussed without further qualification are PA12.',
  },
  {
    id: 'pa6',
    term: 'PA6 (polyamide 6)',
    definition:
      'A tougher, stronger nylon than PA12 with a higher melting point, but also higher moisture absorption, which makes it more demanding to print and less dimensionally stable in humid environments. In 3D printing PA6 appears mainly as an FDM filament (often carbon-fibre filled) and as an SLS powder from BASF Forward AM (Ultrasint PA6 family).',
  },
  {
    id: 'sls',
    term: 'SLS (selective laser sintering)',
    definition:
      'A powder-bed fusion process in which a laser scans and sinters each cross-section of a part into a bed of polymer powder. Unfused powder supports the part during the build, so no support structures are needed. SLS is the original powder process for nylon and is dominated by PA12 and PA11 powders.',
  },
  {
    id: 'mjf',
    term: 'MJF (Multi Jet Fusion)',
    definition:
      "HP's powder-bed fusion process. Instead of a laser, an inkjet array deposits fusing and detailing agents across the powder bed, and an infrared energy source fuses the printed areas. MJF prints PA12, PA11 and glass-bead-filled PA12, generally with fast build cycles and consistent, near-isotropic properties.",
  },
  {
    id: 'saf',
    term: 'SAF (Selective Absorption Fusion)',
    definition:
      "Stratasys's powder-bed fusion technology, used in the H350 printer. An infrared-absorbing fluid is jetted where parts are to form and the whole layer is exposed to infrared energy; areas with the fluid absorb enough energy to fuse. SAF targets production volumes of polymer parts, including nylon-based powders.",
  },
  {
    id: 'haf',
    term: 'HAF (High Absorption Fluid)',
    definition:
      "Stratasys's infrared-absorbing fluid, the single working fluid of SAF printing. Piezoelectric printheads jet HAF onto the powder layer only where the part cross-section is to form; when an infrared lamp then exposes the whole layer, the HAF-treated powder absorbs enough energy to fuse while untreated powder stays loose. Unlike MJF, which uses separate fusing and detailing agents, SAF works with this one fluid.",
  },
  {
    id: 'big-wave',
    term: 'Big Wave powder management',
    definition:
      "Stratasys's powder distribution and thermal management system in SAF printers such as the H350. It spreads and conditions the powder bed so that layer temperature stays uniform across the whole build area — a prerequisite for the flood infrared exposure in SAF to fuse parts consistently across a full production build.",
  },
  {
    id: 'fdm',
    term: 'FDM / FFF (fused deposition modeling)',
    definition:
      'Extrusion printing: a thermoplastic filament is melted and deposited line by line. Nylon filaments (PA6, PA12, PA blends and carbon-fibre-filled grades) produce tough functional parts, but nylon is hygroscopic and warps more readily than PLA or PETG, so dry filament, an enclosed printer and good bed adhesion matter.',
  },
  {
    id: 'refresh-ratio',
    term: 'Refresh ratio',
    definition:
      'In powder-bed fusion, the proportion of new ("virgin") powder that must be mixed with powder recovered from previous builds to keep part quality consistent. Powder that has been through a build ages thermally, so manufacturers specify a refresh ratio for each material; the rest of the used powder can be reused, which is a major factor in powder process economics.',
  },
  {
    id: 'glass-filled-nylon',
    term: 'Glass-filled nylon',
    definition:
      'Nylon compounded with glass — as short fibres in filaments, or as glass beads in powders such as EOS PA 3200 GF and HP PA 12 Glass Beads. Glass raises stiffness, dimensional stability and heat resistance, at the cost of lower elongation and impact strength, so glass-filled grades suit housings, brackets and tooling rather than flexing parts.',
  },
  {
    id: 'carbon-fibre-nylon',
    term: 'Carbon-fibre nylon (PA-CF)',
    definition:
      'Nylon filament filled with chopped carbon fibre. The fibres stiffen the printed part, reduce warping during printing and improve dimensional stability compared with unfilled PA6 or PA12 filament. PA-CF is a common choice for strong FDM end-use parts such as brackets, gears and drone components; it is abrasive and requires a hardened nozzle.',
  },
  {
    id: 'hygroscopic',
    term: 'Hygroscopic',
    definition:
      'The tendency of a material to absorb moisture from the air. All nylons are hygroscopic. Wet filament pops, strings and produces weak, rough parts during FDM printing, and printed nylon parts slowly absorb moisture in service, which lowers stiffness slightly while increasing toughness and can shift dimensions. Dry storage and pre-print drying are standard practice.',
  },
  {
    id: 'annealing',
    term: 'Annealing',
    definition:
      'Heating a printed part to a controlled temperature below its melting point and cooling it slowly, to increase crystallinity. For nylon parts annealing can raise heat resistance and stiffness, but it also causes shrinkage that must be accounted for in the design, so it is used deliberately rather than by default.',
  },
  {
    id: 'vapor-smoothing',
    term: 'Vapor smoothing',
    definition:
      'Exposing a printed part to a solvent vapour that slightly melts its surface, sealing porosity and producing a smoother, glossier, less moisture-hungry finish. It is well established for some polymers; for nylon powders it is offered as an industrial post-process for SLS/MJF parts where a sealed, injection-moulded-like surface is needed.',
  },
  {
    id: 'living-hinge',
    term: 'Living hinge',
    definition:
      'A thin, flexible web of the same material that connects two rigid sections and bends repeatedly — the classic example is a box lid. Nylon, especially ductile PA11, is one of the few 3D printing materials that can survive repeated living-hinge flexing in powder-bed printing, which is a frequent reason to choose it over more brittle polymers.',
  },
  {
    id: 'powder-bed-fusion',
    term: 'Powder-bed fusion (PBF)',
    definition:
      'The family of processes — SLS, MJF and SAF among them — that build parts inside a bed of fine polymer powder, fusing one thin layer at a time. The surrounding powder supports overhangs, parts can be nested in three dimensions to fill the build volume, and unfused powder is recovered, refreshed and reused.',
  },
  {
    id: 'hdt',
    term: 'Heat deflection temperature (HDT)',
    definition:
      'The temperature at which a test bar deflects under a standard load (commonly 0.45 MPa or 1.8 MPa, per ASTM D648 or ISO 75). HDT is the practical shortcut for "how hot can this part get under load". Datasheets on this site state which load each HDT value was measured at, because the two loads give very different numbers.',
  },
];
