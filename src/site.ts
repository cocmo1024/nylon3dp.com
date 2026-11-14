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
  themeColor: '#121a2c',
  lastUpdated: 'November 2026',
} as const;

/**
 * Commercial skeleton (B4.5): sponsorship/advertising slots exist in the
 * layout (see components/AdSlot.astro) but render nothing while this is
 * false. Advertising stays off until the user rules on timing and form.
 */
export const SPONSOR_SLOTS_ENABLED = false;

// Portal navigation (B4.5): the industry sections lead — news, the
// vendor/equipment ecosystem, applications — with data & tools as a
// service entry. Guides, processes and the glossary live in the footer
// and in the homepage depth section; their URLs are unchanged.
export const NAV = [
  { href: '/news/', label: 'News' },
  { href: '/vendors/', label: 'Vendors' },
  { href: '/materials/', label: 'Materials' },
  { href: '/machines/', label: 'Machines' },
  { href: '/applications/', label: 'Applications' },
  { href: '/guides/formnext-2026/', label: 'Formnext 2026' },
  { href: '/calculators/', label: 'Calculators' },
] as const;

export const FOOTER_NAV = [
  {
    title: 'Reference',
    links: [
      { href: '/news/', label: 'Industry news' },
      { href: '/materials/', label: 'Material database' },
      { href: '/machines/', label: 'Machine database' },
      { href: '/vendors/', label: 'Vendor directory' },
      { href: '/applications/', label: 'Applications' },
      { href: '/processes/', label: 'Processes' },
      { href: '/compare/sls-vs-mjf/', label: 'SLS vs MJF' },
      { href: '/compare/materials/', label: 'Compare materials' },
      { href: '/compare/machines/', label: 'Compare machines' },
      { href: '/calculators/', label: 'Calculators' },
      { href: '/calculators/powder-refresh-ratio/', label: 'Refresh ratio calculator' },
      { href: '/calculators/part-cost/', label: 'Part cost estimator' },
      { href: '/glossary/', label: 'Glossary' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/guides/formnext-2026/', label: 'Formnext 2026: the nylon watchlist' },
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
