// Site-wide settings. Change here, not in individual pages.

export const SITE = {
  name: 'Nylon3DP',
  domain: 'nylon3dp.com',
  url: 'https://nylon3dp.com',
  tagline: 'The Nylon 3D Printing Reference',
  description:
    'Nylon3DP is an independent reference for nylon 3D printing: PA11 and PA12 material data from manufacturer datasheets, SLS, MJF and FDM processes, machines, design guides and a glossary.',
  locale: 'en-US',
  email: 'cqq365@gmail.com',
  themeColor: '#10231c',
  lastUpdated: 'November 2026',
} as const;

export const NAV = [
  { href: '/materials/', label: 'Materials' },
  { href: '/machines/', label: 'Machines' },
  { href: '/processes/', label: 'Processes' },
  { href: '/guides/', label: 'Guides' },
  { href: '/glossary/', label: 'Glossary' },
] as const;

export const FOOTER_NAV = [
  {
    title: 'Reference',
    links: [
      { href: '/materials/', label: 'Material database' },
      { href: '/machines/', label: 'Machine database' },
      { href: '/processes/', label: 'Processes' },
      { href: '/compare/sls-vs-mjf/', label: 'SLS vs MJF' },
      { href: '/glossary/', label: 'Glossary' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/guides/pa11-vs-pa12/', label: 'PA11 vs PA12' },
      { href: '/guides/how-to-dry-nylon-filament/', label: 'Drying nylon filament' },
      { href: '/guides/designing-for-sls-mjf/', label: 'Designing for SLS & MJF' },
    ],
  },
  {
    title: 'About this site',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/editorial/', label: 'Editorial & sourcing policy' },
      { href: '/contact/', label: 'Contact' },
      { href: '/privacy/', label: 'Privacy' },
      { href: '/terms/', label: 'Terms' },
    ],
  },
] as const;
