import type { APIRoute } from 'astro';
import { MATERIALS } from '../data/materials';
import { MACHINES } from '../data/machines';
import { GLOSSARY } from '../data/glossary';
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
