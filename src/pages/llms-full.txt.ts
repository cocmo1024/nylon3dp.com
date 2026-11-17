import type { APIRoute } from 'astro';
import { MATERIALS } from '../data/materials';
import { MACHINES } from '../data/machines';
import { GLOSSARY } from '../data/glossary';
import { VENDORS } from '../data/vendors';
import { APPLICATIONS } from '../data/applications';
import { SITE } from '../site';

// Full-text companion to llms.txt, generated at build time from the same data.
export const GET: APIRoute = () => {
  const out: string[] = [
    `# ${SITE.name} — ${SITE.tagline} (full text)`,
    '',
    SITE.description,
    '',
    `Contact: ${SITE.email}. Sourcing policy: ${SITE.url}/editorial/`,
    '',
    '================================================================',
    'MATERIALS',
    '================================================================',
  ];

  for (const m of MATERIALS) {
    out.push(
      '',
      `## ${m.name} (${m.basePolymer}, ${m.manufacturer})`,
      `URL: ${SITE.url}/materials/${m.slug}/`,
      `Form: ${m.form} · Process: ${m.process}`,
      '',
      `Quick answer: ${m.quickAnswer}`,
      '',
      ...m.intro,
      '',
      'Properties (manufacturer datasheet):',
      ...m.properties.map((p) => `- ${p.label}: ${p.value}${p.note ? ` (${p.note})` : ''}`),
      '',
      'Processing notes:',
      ...m.processing.map((n) => `- ${n}`),
      '',
      'Typical applications:',
      ...m.applications.map((a) => `- ${a}`),
      '',
      'FAQ:',
      ...m.faqs.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`]),
      '',
      'Sources:',
      ...m.sources.map((s) => `- ${s.label}: ${s.url}`),
    );
  }

  out.push('', '================================================================', 'MACHINES', '================================================================');

  for (const m of MACHINES) {
    out.push(
      '',
      `## ${m.name} (${m.manufacturer}, ${m.process})`,
      `URL: ${SITE.url}/machines/${m.slug}/`,
      '',
      `Quick answer: ${m.quickAnswer}`,
      '',
      ...m.intro,
      '',
      'Specifications (manufacturer):',
      ...m.specs.map((s) => `- ${s.label}: ${s.value}${s.note ? ` (${s.note})` : ''}`),
      '',
      'Notes:',
      ...m.notes.map((n) => `- ${n}`),
      '',
      'FAQ:',
      ...m.faqs.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`]),
      '',
      'Sources:',
      ...m.sources.map((s) => `- ${s.label}: ${s.url}`),
    );
  }

  out.push('', '================================================================', 'VENDORS', '================================================================', '');
  for (const v of VENDORS) {
    const mats = MATERIALS.filter((m) => m.vendorSlug === v.slug);
    const machs = MACHINES.filter((m) => m.vendorSlug === v.slug);
    out.push(
      `## ${v.name} (${v.hqCountry}${v.founded ? `, founded ${v.founded}` : ''})`,
      v.intro,
      `Materials in this database: ${mats.length ? mats.map((m) => m.name).join(', ') : 'none yet'}. Machines in this database: ${machs.length ? machs.map((m) => m.name).join(', ') : 'none yet'}.`,
      `Vendor page: ${SITE.url}/vendors/${v.slug}/`,
      '',
    );
  }

  out.push('', '================================================================', 'APPLICATION GUIDES', '================================================================', '');
  for (const a of APPLICATIONS) {
    out.push(
      `## ${a.title} (${SITE.url}/applications/${a.industry}/${a.slug}/)`,
      a.quickAnswer,
      '',
      'Selection reasoning:',
      ...a.selectionReasoning.map((s, i) => `${i + 1}. ${s}`),
      '',
      'Design numbers:',
      ...a.designNumbers.map((d) => `- ${d.label}: ${d.value}${d.note ? ` (${d.note})` : ''}`),
      '',
      'Failure modes:',
      ...a.failureModes.map((f) => `- ${f}`),
      '',
      'Economics vs conventional:',
      ...a.economicsVsConventional,
      '',
      'FAQ:',
      ...a.faqs.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`]),
      '',
      'Sources:',
      ...a.sources.map((s) => `- ${s.label}: ${s.url}`),
      '',
    );
  }

  out.push('', '================================================================', 'CALCULATORS', '================================================================', '');
  out.push(
    `## Powder refresh ratio calculator (${SITE.url}/calculators/powder-refresh-ratio/)`,
    'Definition (this site’s glossary): the refresh ratio R is the proportion of virgin powder in the powder charged to a build. With U = recovered used powder, V = virgin powder and T = U + V: R = V / T. Planning to a target ratio: V = U × R / (100 − R), R in percent. Checking a mix already made: R = V / (U + V) × 100%. Surplus aged powder per build (identical builds, steady state) = (T − fused part mass) − T × (1 − R); virgin powder bought per build in steady state = fused part mass + that surplus.',
    'Manufacturer refresh figures published on this site: Sinterit specifies a material refreshing ratio of 22% for PA12 Smooth; HP specifies a refresh ratio of 30% for stable performance for PA 12 Glass Beads; Formlabs specifies a standard refresh rate of 50% virgin powder for Nylon 12 GF Powder (up to 70% allowed when troubleshooting); Arkema states a refreshing factor of typically 50% for Rilsan Invent PA11. Other grades’ ratios are specified by their manufacturers and are not published in this database. The companion guide is at /guides/powder-refresh-ratio/.',
    '',
    `## Part cost estimator (${SITE.url}/calculators/part-cost/)`,
    'Material cost per powder-bed part: m = V × ρ (fused powder per part; V = solid volume in cm³, ρ = printed-part density in g/cm³ from the manufacturer datasheet); m_virgin = m × (1 + w), where w is the visitor’s refresh & ageing allowance; cost = m_virgin × price per kg / 1000. The steady-state allowance implied by a refresh ratio R at packing fraction p (fused mass / charge mass) is w = R / p − 1. This site publishes no powder prices — the price is always the visitor’s own input. Scope: material cost only, no machine time or labour.',
    '',
  );

  out.push('', '================================================================', 'GLOSSARY', '================================================================', '');
  for (const t of GLOSSARY) {
    out.push(`## ${t.term}`, t.definition, '');
  }

  out.push(
    '================================================================',
    'KEY GUIDE CONCLUSIONS',
    '================================================================',
    '',
    'PA11 vs PA12: PA11 elongation at break is 30% (EOS PA 1101) to 40% (Formlabs Nylon 11) versus 11-18% for PA12 grades; tensile strength is comparable (48-54 MPa across PA12 grades, 49-50 MPa for PA11 grades). Choose PA11 for hinges, clips and impact; PA12 as the balanced default.',
    '',
    'Drying nylon filament: Polymaker PA6-CF (Fiberon PA6-CF20) 100 °C for 10 h; Polymaker PolyMide CoPA 100 °C for 8 h; Bambu Lab PA6-CF and PAHT-CF 80 °C for 8-12 h — all per the manufacturers\' technical data sheets.',
    '',
    'Designing for SLS & MJF: Formlabs SLS design guide minimums — wall thickness 0.6 mm vertical / 0.3 mm horizontal; minimum hole diameter 1.0 mm; escape holes at least 3.5 mm in diameter, at least two per enclosed cavity.',
    '',
    'SLS vs MJF: flagship PA12 datasheets — EOS PA 2200 (SLS) 48 MPa tensile / 1650 MPa modulus / 18% elongation XY, Z elongation 4%; HP HR PA 12 (MJF) 54 MPa / 2150 MPa / 18% XY with equal XY/Z tensile strength per HP. SLS offers the broader material range and white parts; MJF offers fixed layer times and a focused HP material set.',
    '',
  );

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
