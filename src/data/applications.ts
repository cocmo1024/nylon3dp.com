// Application database (rebuild batch B0 — schema + planning matrix only).
// NO application pages exist yet: APPLICATIONS ships empty. What ships in
// B0 is the entity schema (the "unique kernel" fields of the application
// engine, formalised) and the industry × part-family matrix as data.
// An application may only be promoted from a matrix cell to an entry when
// it passes the standing double gate — real search demand AND a complete
// unique kernel (selection reasoning chain, part-specific design numbers,
// dominant failure modes, economics versus the conventional process, FAQs
// from real questions) — and every number in it traces to a manufacturer
// source, as everywhere else in this database.

import type { DataSource } from './types';

export interface Application {
  slug: string;
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
 *  not pages: status stays 'candidate' until the double gate is passed. */
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
  { industry: 'drones', partFamily: 'brackets', status: 'candidate' },
  { industry: 'robotics', partFamily: 'gears', status: 'candidate' },
  { industry: 'robotics', partFamily: 'housings-and-enclosures', status: 'candidate' },
  { industry: 'consumer-electronics', partFamily: 'living-hinges', status: 'candidate' },
  { industry: 'sports', partFamily: 'eyewear', status: 'candidate' },
  { industry: 'electrical', partFamily: 'housings-and-enclosures', status: 'candidate' },
];

/** Promoted applications. Empty in B0 — entries are added one at a time,
 *  each through the double gate described in the header. */
export const APPLICATIONS: Application[] = [];
