import type { APIRoute } from 'astro';
import { MATERIALS } from '../data/materials';
import { MACHINES } from '../data/machines';
import { SITE } from '../site';

// Generated at build time from the same data files as the HTML pages.
export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${SITE.name} — ${SITE.tagline}`,
    '',
    `> ${SITE.description}`,
    '',
    'Every specification on this site is reproduced from a manufacturer datasheet or official specification document, cited on the page itself. Values manufacturers do not publish are omitted, never estimated.',
    '',
    '## Core pages',
    '',
    `- [Home](${SITE.url}/): Overview and entry points`,
    `- [Material database](${SITE.url}/materials/): All nylon grades with datasheet property tables`,
    `- [Machine database](${SITE.url}/machines/): Powder-bed printers with manufacturer specifications`,
    `- [Processes](${SITE.url}/processes/): SLS, MJF, SAF and FDM explained`,
    `- [SLS vs MJF](${SITE.url}/compare/sls-vs-mjf/): The two production powder processes compared on manufacturer data`,
    `- [Glossary](${SITE.url}/glossary/): Definitions of nylon 3D printing terms`,
    `- [Editorial & sourcing policy](${SITE.url}/editorial/): How data is sourced and verified`,
    '',
    '## Materials',
    '',
    ...MATERIALS.map((m) => `- [${m.name}](${SITE.url}/materials/${m.slug}/): ${m.basePolymer} ${m.form.toLowerCase()} by ${m.manufacturer} for ${m.process}. ${m.quickAnswer}`),
    '',
    '## Machines',
    '',
    ...MACHINES.map((m) => `- [${m.name}](${SITE.url}/machines/${m.slug}/): ${m.process} printer by ${m.manufacturer}. ${m.quickAnswer}`),
    '',
    '## Processes',
    '',
    `- [SLS — selective laser sintering](${SITE.url}/processes/sls/)`,
    `- [MJF — Multi Jet Fusion](${SITE.url}/processes/mjf/)`,
    `- [FDM — nylon filament printing](${SITE.url}/processes/fdm/)`,
    '',
    '## Guides',
    '',
    `- [PA11 vs PA12](${SITE.url}/guides/pa11-vs-pa12/)`,
    `- [How to dry nylon filament](${SITE.url}/guides/how-to-dry-nylon-filament/)`,
    `- [Designing parts for SLS & MJF](${SITE.url}/guides/designing-for-sls-mjf/)`,
    '',
    `Contact: ${SITE.email}`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
