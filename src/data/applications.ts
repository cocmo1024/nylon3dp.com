// Application database (rebuild batch B0 — schema + planning matrix;
// B3 — first promoted entries: the Drones & UAV hub).
// An application may only be promoted from a matrix cell to an entry when
// it passes the standing double gate — real search demand AND a complete
// unique kernel (selection reasoning chain, part-specific design numbers,
// dominant failure modes, economics versus the conventional process, FAQs
// from real questions) — and every number in it traces to a manufacturer
// source, as everywhere else in this database. Design numbers that are
// engineering rules of thumb rather than manufacturer-published values
// are labelled as such in their `note`, never passed off as data.

import type { DataSource } from './types';

export interface Application {
  slug: string;
  /** Page title, e.g. 'Drone Motor Mounts'. The page lives at /applications/<industry>/<slug>/. */
  title: string;
  /** One-paragraph direct answer, rendered at the top of the page. */
  quickAnswer: string;
  /** Intro paragraphs: what the part does and why nylon is a candidate at all. */
  intro: string[];
  /** Industry slug, referencing APPLICATION_INDUSTRIES. */
  industry: string;
  /** Part-family slug, referencing APPLICATION_PART_FAMILIES. */
  partFamily: string;
  /** Working conditions → grade + process reasoning chain for this specific part. */
  selectionReasoning: string[];
  /** Part-specific design numbers (wall, tolerance, orientation, inserts, post-processing). */
  designNumbers: { label: string; value: string; note?: string }[];
  /** Dominant failure modes for this part in printed nylon. */
  failureModes: string[];
  /** Economics versus injection moulding / CNC / sheet metal, incl. the sensible batch range. */
  economicsVsConventional: string[];
  /** Material slugs (materials.ts) recommended for this application. */
  recommendedMaterials: string[];
  /** Process slugs (processes.ts) used for this application. */
  processes: string[];
  faqs: { q: string; a: string }[];
  sources: DataSource[];
}

export interface ApplicationTaxon {
  slug: string;
  name: string;
}

export const APPLICATION_INDUSTRIES: ApplicationTaxon[] = [
  { slug: 'aerospace', name: 'Aerospace' },
  { slug: 'automotive', name: 'Automotive' },
  { slug: 'medical', name: 'Medical' },
  { slug: 'consumer-electronics', name: 'Consumer electronics' },
  { slug: 'industrial-equipment', name: 'Industrial equipment' },
  { slug: 'robotics', name: 'Robotics' },
  { slug: 'drones', name: 'Drones & UAV' },
  { slug: 'footwear', name: 'Footwear' },
  { slug: 'electrical', name: 'Electrical' },
  { slug: 'sports', name: 'Sports & consumer goods' },
];

export const APPLICATION_PART_FAMILIES: ApplicationTaxon[] = [
  { slug: 'gears', name: 'Gears & drivetrain parts' },
  { slug: 'living-hinges', name: 'Living hinges, clips & snap-fits' },
  { slug: 'fluid-components', name: 'Fluid components & manifolds' },
  { slug: 'jigs-and-fixtures', name: 'Jigs, fixtures & tooling' },
  { slug: 'housings-and-enclosures', name: 'Housings & enclosures' },
  { slug: 'ducts', name: 'Ducts & air guides' },
  { slug: 'brackets', name: 'Brackets & mounts' },
  { slug: 'prosthetics-and-orthotics', name: 'Prosthetics & orthotics' },
  { slug: 'wear-parts', name: 'Wear parts, guides & bushings' },
  { slug: 'eyewear', name: 'Eyewear frames' },
];

/** A cell of the industry × part-family matrix. Cells are planning data,
 *  not pages: status stays 'candidate' until the double gate is passed,
 *  and 'published' must correspond to exactly one APPLICATIONS entry
 *  (scripts/validate-data.mjs enforces both directions). */
export interface ApplicationMatrixCell {
  industry: string;
  partFamily: string;
  status: 'candidate' | 'in-progress' | 'published';
}

export const APPLICATION_MATRIX: ApplicationMatrixCell[] = [
  { industry: 'industrial-equipment', partFamily: 'jigs-and-fixtures', status: 'candidate' },
  { industry: 'industrial-equipment', partFamily: 'gears', status: 'candidate' },
  { industry: 'industrial-equipment', partFamily: 'fluid-components', status: 'candidate' },
  { industry: 'automotive', partFamily: 'fluid-components', status: 'candidate' },
  { industry: 'automotive', partFamily: 'ducts', status: 'candidate' },
  { industry: 'automotive', partFamily: 'brackets', status: 'candidate' },
  { industry: 'aerospace', partFamily: 'ducts', status: 'candidate' },
  { industry: 'aerospace', partFamily: 'brackets', status: 'candidate' },
  { industry: 'medical', partFamily: 'prosthetics-and-orthotics', status: 'candidate' },
  { industry: 'drones', partFamily: 'gears', status: 'candidate' },
  { industry: 'drones', partFamily: 'brackets', status: 'published' },
  { industry: 'drones', partFamily: 'housings-and-enclosures', status: 'published' },
  { industry: 'robotics', partFamily: 'gears', status: 'candidate' },
  { industry: 'robotics', partFamily: 'housings-and-enclosures', status: 'candidate' },
  { industry: 'consumer-electronics', partFamily: 'living-hinges', status: 'candidate' },
  { industry: 'sports', partFamily: 'eyewear', status: 'candidate' },
  { industry: 'electrical', partFamily: 'housings-and-enclosures', status: 'candidate' },
];

const FORMLABS_SLS_GUIDE: DataSource = {
  label: 'Formlabs — SLS Design Guide, Fuse Series (March 2023)',
  url: 'https://formlabs-media.formlabs.com/rs/060-UIG-504/images/WP-EN-fuse-series-sls-design-guide.pdf',
};

/** Promoted applications. Each entry has passed the double gate in the
 *  file header; entries are added one industry hub at a time. */
export const APPLICATIONS: Application[] = [
  {
    slug: 'motor-mounts',
    title: 'Drone Motor Mounts',
    quickAnswer:
      'A printed nylon motor mount is a stiffness-versus-crash trade. For alignment-critical mounts, glass-filled PA12 powders are the stiff options in this database — EOS PA 3200 GF at 3200 MPa tensile modulus, Formlabs Nylon 12 GF at 2800 MPa — but their elongation at break is only 9% and 4%, so they crack where an unfilled mount bends. For mounts that must survive crashes, PA11 powders (EOS PA 1101: 30% elongation in-plane, 15% in Z; Formlabs Nylon 11: 40% in-plane) are the tougher choice. Print in SLS or MJF, keep the bolt circle loaded in-plane, and spread the clamp load with washers or inserts.',
    intro: [
      'The motor mount is the most structurally honest part on a multirotor: it transfers all of the motor’s thrust and torque reaction into the arm, it is a bolted joint at both ends, and it vibrates for every second of the aircraft’s life. It is also usually the first part to find out about a crash. That combination — steady vibration, bolted clamping, shock — is what makes it a good test of whether printed nylon belongs on an airframe at all.',
      'The incumbent parts are CNC-machined aluminium and carbon-plate mounts. Printed nylon does not beat them on raw stiffness per gram; it wins where the mount stops being a flat plate — integrated arm junctions, tilted or canted motor axes, duct attachments and cable routing in one printed piece, and spares printed on demand after a crash instead of ordered and shipped.',
    ],
    industry: 'drones',
    partFamily: 'brackets',
    selectionReasoning: [
      'Start from the loads. A motor mount sees thrust and torque reaction as steady loads, broadband vibration from the propeller for its whole service life, and crash shocks an order of magnitude larger. It is clamped by bolts at the motor and at the arm, so it is simultaneously a structure and a joint — the reasoning has to satisfy both.',
      'Stiffness is the first filter, because a mount that flexes under thrust tilts the thrust axis and feeds vibration back into the flight controller. On datasheet tensile modulus, the stiffest powder-bed grades in this database are the glass-filled PA12s: EOS PA 3200 GF at 3200 MPa (XY) and Formlabs Nylon 12 GF at 2800 MPa, against 1650 MPa for unfilled EOS PA 2200 and 2150 MPa for HP’s MJF PA 12.',
      'Crash survival is the second filter, and it reverses the ranking. Elongation at break for the filled grades is 9% (PA 3200 GF, XY) and 4% (Nylon 12 GF, XY): they hold alignment beautifully and then snap. The PA11 powders are the ductile end of the database — EOS PA 1101 at 30% in-plane and, critically, 15% in Z; Formlabs Nylon 11 at 40% in-plane; Arkema Rilsan Invent PA11 at 45%. A mount that bends in a crash instead of fracturing often saves the motor and the arm behind it.',
      'Orientation decides how much of that ductility you actually get. EOS PA 2200’s datasheet split — 18% elongation in XY against 4% in Z — is the standard warning: a mount whose bolt circle bends across layers is far weaker than the headline number suggests. PA 1101’s 15% Z value is the best cross-layer ductility among the EOS powders, which is a concrete, datasheet-level reason to prefer it for mounts that cannot be oriented favourably.',
      'Heat is the quiet constraint. The mount sits against a motor that can run hot, often in direct sun. Formlabs lists its Nylon 11’s HDT at just 46 °C under 1.8 MPa load (182 °C at 0.45 MPa) — under light clamping loads that is workable, but it is the thinnest thermal margin in this comparison, and Formlabs Nylon 12 Powder (87 °C at 1.8 MPa) or Nylon 12 GF (113 °C at 1.8 MPa) buys margin back where the motor runs hot.',
      'Verdict: stiffness-critical, alignment-critical mounts on aircraft that are not expected to crash often — glass-filled PA12. Working aircraft, trainers and anything crash-prone — PA11, accepting lower stiffness and recovering it with ribbed geometry. General default — unfilled PA12 (SLS or MJF), where the design, not the filler, does the stiffening.',
    ],
    designNumbers: [
      {
        label: 'Absolute minimum wall (process floor)',
        value: '0.6 mm vertical / 0.3 mm horizontal',
        note: 'Formlabs SLS Design Guide for the Fuse series (Nylon 12 Powder). A printability floor for small features — not a structural target for a mount.',
      },
      {
        label: 'Structural wall around bolt holes',
        value: '2.0–3.0 mm',
        note: 'Engineering rule of thumb for bolted powder-bed nylon brackets: enough material around the hole for the clamp load and the fatigue life, without paying for solid bulk elsewhere.',
      },
      {
        label: 'Bolt-hole edge distance',
        value: '≥ 2× hole diameter (centre to free edge)',
        note: 'Standard mechanical-design rule of thumb for loaded holes in polymers; below this, tear-out at the edge replaces bolt failure as the weak link.',
      },
      {
        label: 'Smallest printable hole',
        value: '1.0 mm diameter',
        note: 'Formlabs SLS Design Guide: holes below 1.0 mm may close off during the build. Functional bolt holes are normally printed with clearance or printed undersize and reamed.',
      },
      {
        label: 'Load direction at the bolt circle',
        value: 'In-plane (XY), never peel across layers',
        note: 'EOS PA 2200 datasheet: elongation at break 18% (XY) vs 4% (Z). Orient the mount so crash bending and clamp loads run along layers, not across them.',
      },
      {
        label: 'Clamp-load spreading',
        value: 'Washers or metal inserts under every bolt head and nut',
        note: 'Engineering practice for bolted nylon: nylon creeps under sustained point clamping, preload decays, and the joint starts to fret. Spreading the load and using an insert or shoulder is the standard countermeasure.',
      },
      {
        label: 'Stiffening strategy',
        value: 'Ribs and section shape before wall thickness',
        note: 'Engineering practice for powder-bed parts: stiffness scales with section geometry, while cost and weight scale with material volume — a ribbed thin mount beats a solid thick one on both.',
      },
    ],
    failureModes: [
      'Fatigue cracking radiating from the bolt holes: the holes are stress concentrators sitting in the highest-vibration location on the aircraft, and cracks start there long before the bulk material is challenged.',
      'Creep relaxation of the clamped joint: sustained bolt preload slowly flows the nylon, preload drops, the motor starts to fret in its seat, and vibration gets worse — the failure presents as “loose screws” but the screws are fine.',
      'Brittle fracture of glass-filled grades in a crash: at 4–9% elongation at break, a filled mount that would have held alignment for years gives up in the first hard impact, often at the bolt circle.',
      'Cross-layer delamination when the mount is oriented so crash bending loads the Z direction — the weakest axis in every powder datasheet on this site (EOS PA 2200: 4% elongation in Z).',
      'Heat softening adjacent to a hot motor on low-HDT grades — Formlabs Nylon 11’s 46 °C HDT at 1.8 MPa leaves little margin on a sun-heated, hard-working aircraft; the mount does not melt, it gradually loses clamp and alignment.',
    ],
    economicsVsConventional: [
      'The incumbents are CNC-machined aluminium or carbon-plate mounts, and injection moulding at OEM scale. The cost structures are fundamentally different: CNC cost scales with machine time per part and punishes complex geometry; moulding cost is dominated by tooling that only amortises over large runs of an unchanged design; powder-bed cost scales mainly with part volume and build packing, and is nearly indifferent to geometry complexity. The full cost-driver comparison between the powder processes is laid out in this site’s SLS vs MJF comparison.',
      'Printed nylon therefore wins where geometry is doing work — a mount integrated with the arm junction, a canted motor axis, a duct or guard attachment, internal cable routing — and where volumes are prototypes through low hundreds of identical parts per design revision, including crash spares printed on demand. It loses to carbon plate on simple flat mounts for large aircraft, and to moulding on stable, high-volume consumer designs.',
      'One operating cost belongs in the comparison honestly: powder that is not fused is not free to reuse indefinitely. Every build blends fresh powder with recycled powder at the manufacturer’s refresh ratio, so the effective powder cost per part is higher than the fused volume alone suggests — that refresh term is part of the per-part maths, not a footnote.',
    ],
    recommendedMaterials: [
      'eos-pa-3200-gf',
      'formlabs-nylon-12-gf-powder',
      'eos-pa-1101',
      'formlabs-nylon-11-powder',
      'hp-pa-12',
      'eos-pa-2200',
    ],
    processes: ['sls', 'mjf'],
    faqs: [
      {
        q: 'Can you 3D print a drone motor mount?',
        a: 'Yes — in powder-bed nylon (SLS or MJF) it is a well-established structural part, not a novelty. The mount has to be designed as a bolted, vibrating joint rather than copied from the aluminium part it replaces: 2–3 mm walls around the bolt holes, edge distance of at least twice the hole diameter, clamp load spread with washers or inserts, and the bolt circle loaded in-plane.',
      },
      {
        q: 'PA11 or PA12 for a drone motor mount?',
        a: 'It depends on which failure you fear. PA12 grades — especially the glass-filled ones — are stiffer (EOS PA 3200 GF: 3200 MPa modulus), so alignment holds better. PA11 grades are far more ductile (EOS PA 1101: 30% elongation in-plane and 15% in Z, against 18% and 4% for EOS PA 2200), so they bend in a crash instead of cracking. Stiffness-critical mounts: filled PA12. Crash-prone aircraft: PA11.',
      },
      {
        q: 'How thick should a 3D printed motor mount be?',
        a: 'Separate the process floor from the structural answer. The floor, per Formlabs’ SLS design guide, is 0.6 mm for vertical walls — that is about printability, not strength. A bolted motor mount wants roughly 2–3 mm of wall around the bolt holes (an engineering rule of thumb), with stiffness coming from ribs and section shape rather than from making the whole part thick.',
      },
      {
        q: 'Why did my printed motor mount crack around the bolt holes?',
        a: 'That is the dominant failure mode of the part, and it is usually one of three causes: fatigue from motor vibration starting at the hole (a stress concentrator), a brittle glass-filled grade meeting a crash load, or the mount printed so the bolt circle bends across layers — the Z direction, where a grade like EOS PA 2200 has only 4% elongation at break against 18% in-plane. More edge distance, a ductile PA11 grade, and in-plane orientation address the three causes respectively.',
      },
      {
        q: 'Is FDM nylon strong enough for motor mounts?',
        a: 'In-plane, the numbers look ample — Polymaker’s PA6-CF filament lists 109.3 MPa tensile strength in X-Y. The problem is the joint: the same datasheet lists 54 MPa in Z, and a bolted, vibrating mount loads exactly that weak direction, with layer lines as built-in crack starters. For small, low-power aircraft with generous sections FDM is workable; for primary motor structure, powder-bed nylon is the defensible default.',
      },
    ],
    sources: [
      {
        label: 'EOS Material Data Sheet — PA 3200 GF (status 10.11.2026)',
        url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-3200-gf',
      },
      {
        label: 'EOS Material Data Sheet — PA 1101 (status 10.11.2026)',
        url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-1101',
      },
      {
        label: 'EOS Material Data Sheet — PA 2200 (status 10.11.2026)',
        url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-2200',
      },
      {
        label: 'Formlabs Technical Data Sheet — Nylon 11 Powder (Rev. 01, 2021)',
        url: 'https://formlabs-media.formlabs.com/datasheets/2101560-TDS-ENUS-0.pdf',
      },
      {
        label: 'Formlabs Technical Data Sheet — Nylon 12 Powder (Rev. 01, 2020)',
        url: 'https://formlabs-media.formlabs.com/datasheets/2201730-TDS-ENUS-0.pdf',
      },
      FORMLABS_SLS_GUIDE,
    ],
  },
  {
    slug: 'propeller-guards',
    title: 'Drone Propeller Guards & Ducts',
    quickAnswer:
      'A propeller guard is a sacrificial impact part, so ductility — not stiffness — picks the material. PA11 powders are the grades that flex and spring back: Formlabs Nylon 11 at 40% elongation at break, Arkema Rilsan Invent PA11 at 45%, EOS PA 1101 at 30% in-plane and 15% in Z. Glass-filled grades (4–9% elongation) and PA12 loaded across layers (EOS PA 2200: 4% in Z) are the brittle choices that crack on the first hard contact. Print the ring flat so impact bending runs in-plane, and hold roughly 1–2% of propeller diameter as tip clearance.',
    intro: [
      'The propeller guard has an unusual job description: it exists to be hit. On cinewhoops and indoor aircraft it is also a duct that shapes the airflow, but structurally it is a bumper — first contact with walls, branches and the ground, at the largest radius on the aircraft, where every gram costs agility. Its design problem is the mirror image of the motor mount’s: survive bending, not resist it.',
      'The incumbent guards are injection-moulded PP or ABS on consumer aircraft and bent carbon or wire at hobby scale — all cheap, all tied to one fixed airframe geometry. Printed nylon enters where the airframe is custom, the guard must integrate with printed mounts and ducts, or replacements are needed faster than shipping allows.',
    ],
    industry: 'drones',
    partFamily: 'housings-and-enclosures',
    selectionReasoning: [
      'Start from the working condition: the guard’s defining load is impact — a bending shock applied at the ring, repeatedly, in any direction the aircraft happens to meet the world. The material property that decides survival is elongation at break, and the datasheet spread in this database is wide: 45% for Arkema Rilsan Invent PA11, 40% for Formlabs Nylon 11 (XY), 30% for EOS PA 1101 (XY).',
      'Orientation halves the choice again. A ring printed flat bends in-plane; stood on edge, the same impact loads the Z direction. EOS PA 2200’s split — 18% elongation in XY, 4% in Z — shows what that costs in PA12; EOS PA 1101 keeps 15% in Z, the strongest cross-layer ductility among the EOS powders, which matters for tall duct rings that cannot be printed perfectly flat.',
      'Stiffness still matters, but it is a geometry problem, not a material problem. The ring must not deflect into the propeller disc under a side load. A closed ring with a taller-than-thick section gets that stiffness from shape; chasing it with glass filler buys modulus (EOS PA 3200 GF: 3200 MPa) at the price of 9% elongation — the wrong trade for a part whose job is to flex.',
      'MJF is the credible alternative process: HP’s PA 12 lists 18% elongation in XY and 10% in Z — a notably smaller orientation penalty than SLS PA12’s 4% Z — so an MJF guard in PA 12 is a reasonable second choice where PA11 is not available. The FDM filaments are not: Polymaker’s CoPA, the most ductile filament in this database in-plane at 12.7%, drops to 1.3% in Z, and a guard is precisely a part that gets loaded across layers.',
      'Verdict: PA11 powder, SLS first choice, ring printed flat; HP PA 12 via MJF as the fallback. Filled grades and FDM are for guards that only need to look the part.',
    ],
    designNumbers: [
      {
        label: 'Propeller tip clearance',
        value: '≈ 1–2% of propeller diameter',
        note: 'Engineering rule of thumb for printed guards and ducts: enough gap that ring deflection and print tolerance never let the tips strike, small enough that the duct effect and protection are not given away. On a 5-inch propeller that is roughly 1.3–2.5 mm.',
      },
      {
        label: 'Absolute minimum wall (process floor)',
        value: '0.6 mm vertical / 0.3 mm horizontal',
        note: 'Formlabs SLS Design Guide for the Fuse series (Nylon 12 Powder) — a printability floor, far below what an impact part needs.',
      },
      {
        label: 'Ring wall (structural)',
        value: '1.5–2.5 mm, with a taller-than-thick section',
        note: 'Engineering rule of thumb: the ring gets its stiffness from section height (radial depth), not from wall thickness, so it can still flex along its length and absorb the hit.',
      },
      {
        label: 'Print orientation',
        value: 'Ring flat, in the XY plane',
        note: 'So impact bending runs along layers. Datasheet basis: elongation at break collapses in Z — 4% vs 18% (EOS PA 2200), 15% vs 30% (EOS PA 1101).',
      },
      {
        label: 'Strut-to-ring junctions',
        value: 'Generous fillets, no sharp internal corners',
        note: 'Engineering practice: the strut roots are the fatigue and fracture site on this part; a sharp corner there concentrates exactly the cyclic bending the guard lives under.',
      },
      {
        label: 'Enclosed sections',
        value: 'Escape holes ≥ 3.5 mm, at least 2 per cavity',
        note: 'Formlabs SLS Design Guide — applies if the guard or duct is designed as a hollow closed section: trapped unfused powder adds weight at the worst possible radius.',
      },
    ],
    failureModes: [
      'Brittle ring fracture on impact — the signature failure of the wrong grade: a glass-filled or cross-layer-loaded PA12 ring cracks through instead of flexing, usually at a strut root.',
      'Ring deflection into the propeller disc under side impact: the guard survives, bends far enough to meet the spinning prop, and destroys both. Clearance and section stiffness, not material strength, prevent it.',
      'Fatigue cracking at the strut-to-ring junctions under continuous propeller vibration — the cyclic-load version of the impact problem, arriving after hours of flight rather than one crash.',
      'Sacrificial abrasion: guards are supposed to wear on contact faces. Thinned sections are a replacement cue, not a defect — the failure is flying a worn guard until the thinned ring becomes the fracture path.',
    ],
    economicsVsConventional: [
      'The incumbent is the injection-moulded guard bundled with a consumer airframe: per-part cost is minimal, but the mould only exists for that one frame, in that one size, and the design is frozen. Bent carbon rod and wire guards cover the hobby end with hand labour per part. Powder-bed printing inverts both: no tooling and no hand-forming, with cost driven by part volume and build packing — and the guard is a large, thin, mostly-air part, which is the shape powder economics handles best when builds are packed well.',
      'Printed nylon wins for custom and low-volume airframes, for guards integrated with printed motor mounts and ducts as a single part, and for operators who treat guards as consumables and print spares on demand. It loses on stable, high-volume consumer designs, where moulding’s tooling has long since amortised — the honest break-even question is always “how many identical guards, of a design that will not change,” and the answer that favours printing is counted in singles to low hundreds per design.',
      'As with every powder-bed part, the effective material cost includes the refresh term: unfused powder is reused blended with fresh powder at the manufacturer’s refresh ratio, so a big thin guard costs more than its fused volume alone. That term belongs in any per-part comparison against a moulded guard.',
    ],
    recommendedMaterials: ['formlabs-nylon-11-powder', 'arkema-rilsan-invent-pa11', 'eos-pa-1101', 'hp-pa-12'],
    processes: ['sls', 'mjf'],
    faqs: [
      {
        q: 'Are 3D printed propeller guards strong enough?',
        a: 'In the right grade, yes — the guard’s job is to flex, and PA11 powders are built for it: 40% elongation at break for Formlabs Nylon 11, 45% for Arkema Rilsan Invent PA11. In the wrong grade — a glass-filled powder at 4–9% elongation, or PA12 loaded across layers — the same shape cracks on first contact. Strength here is a material-and-orientation decision more than a thickness decision.',
      },
      {
        q: 'What is the best material for a 3D printed propeller guard?',
        a: 'A PA11 powder, printed by SLS: Formlabs Nylon 11, EOS PA 1101 or Arkema Rilsan Invent PA11, chosen on elongation at break and on how much of it survives in the Z direction (PA 1101 keeps 15% in Z). HP’s MJF PA 12 (18% XY, 10% Z) is the sensible fallback. Avoid glass-filled grades for this part.',
      },
      {
        q: 'How much clearance should there be between the propeller and the guard?',
        a: 'A working rule of thumb is 1–2% of propeller diameter — roughly 1.3–2.5 mm on a 5-inch propeller. Less, and ring deflection or print tolerance lets the tips strike the guard; much more, and the guard stops guarding (and a duct stops ducting). The clearance has to be checked against the ring’s stiffness: a flexible ring on a crash-prone aircraft belongs at the top of the range.',
      },
      {
        q: 'Do ducted propeller guards increase thrust?',
        a: 'A well-shaped duct can improve static and low-speed efficiency — that is established aerodynamics, and it is why cinewhoops are ducted. On small printed multirotors the gain is easily eaten by the duct’s weight and by as-printed surface finish, so the honest reason to print a duct-guard is protection and integration, with any thrust effect a bonus rather than the design case. This site makes no numerical efficiency claim for printed ducts; no manufacturer publishes one for these grades.',
      },
      {
        q: 'SLS or FDM for a propeller guard?',
        a: 'SLS, and the datasheets show why. A guard is loaded across its layers in exactly the direction where FDM nylon is weakest: Polymaker’s CoPA filament, the most ductile FDM nylon in this database in-plane (12.7% elongation), manages only 1.3% in Z, and the carbon-filled filaments are lower still. Powder-bed PA11 keeps 30–45% in-plane and 15% in Z. FDM guards are acceptable as cosmetic bumpers on micro aircraft; structural guards belong in powder.',
      },
    ],
    sources: [
      {
        label: 'Formlabs Technical Data Sheet — Nylon 11 Powder (Rev. 01, 2021)',
        url: 'https://formlabs-media.formlabs.com/datasheets/2101560-TDS-ENUS-0.pdf',
      },
      {
        label: 'Arkema Technical Data Sheet — Rilsan® PA11 Invent Nat (hpp.arkema.com, retrieved 2026-11-12)',
        url: 'https://hpp.arkema.com/assets/arkema/TDS_RILSAN%C2%AE%20PA11%20INVENT%20NAT_en_WW.pdf',
      },
      {
        label: 'EOS Material Data Sheet — PA 1101 (status 10.11.2026)',
        url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-1101',
      },
      {
        label: 'EOS Material Data Sheet — PA 2200 (status 10.11.2026)',
        url: 'https://www.eos.info/polymer-solutions/polymer-materials/data-sheets/mds-pa-2200',
      },
      {
        label: 'HP Technical Data Sheet — HP 3D High Reusability PA 12 (doc. 4AA8-5029ENW)',
        url: 'https://www8.hp.com/h20195/v2/GetDocument.aspx?docname=4AA8-5029ENW',
      },
      FORMLABS_SLS_GUIDE,
    ],
  },
];

for (const a of APPLICATIONS) {
  if (!a.sources.length) throw new Error(`Application ${a.slug} has no sources`);
  for (const s of a.sources) {
    if (!/^https:\/\//.test(s.url)) throw new Error(`Application ${a.slug} has a non-HTTPS source: ${s.url}`);
  }
}
