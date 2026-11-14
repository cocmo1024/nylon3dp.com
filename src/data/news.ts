// News desk index (rebuild batch B4.5 — portal form).
// One entry per dated editorial item the desk has actually published.
// Entries are added by the weekly batches as real coverage lands —
// vendor announcements, new systems and materials, show reporting —
// each item sourced and dated. Never seed this list with planned or
// unwritten items: if it is listed here, the page exists.

export interface NewsItem {
  /** ISO date the item was published (YYYY-MM-DD). */
  date: string;
  title: string;
  /** Site-internal path of the published item, trailing slash included. */
  href: string;
  /** One- or two-sentence standfirst, as published. */
  dek: string;
  /** Desk tag, e.g. 'Shows', 'Vendors', 'Materials', 'Machines'. */
  tag: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-11-14' → '14 November 2026' (no Date/timezone involvement). */
export const formatNewsDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** Newest first. */
export const NEWS: NewsItem[] = [
  {
    date: '2026-11-14',
    title: 'Formnext 2026: the nylon watchlist',
    href: '/guides/formnext-2026/',
    dek: 'Formnext opens in Frankfurt on Tuesday 17 November, and the nylon side of the hall is unusually dense: EOS unveils a new large-frame polymer SLS platform, Arkema shows next-generation Orgasol PA12 powders, Stratasys unveils a manufacturing-scale system and TPM3D gives its compact CF250 its international debut. The desk\u2019s preview, with vendor claims labelled as claims.',
    tag: 'Shows',
  },
];
