// i18n foundation + homepage copy table.
//
// English is the source language and lives at the root (unprefixed).
// Pilot locales are prefixed: /de/, /es/, /pt/, /ja/, /zh/.
// Spec rule (GOAL.md «多语言»): translations share the English data layer —
// brand/grade names, process acronyms (SLS/MJF/SAF/FDM), material codes
// (PA11, PA12, PA6-CF) and every number stay byte-identical to English.
//
// Since rebuild batch B5 the homepage is ONE portal anatomy (masthead,
// lead story, news & briefing, ecosystem, depth, applications landscape,
// data & tools, sign-off) rendered by components/PortalHome.astro from
// the per-language copy below. English copy lives here too (single
// source); the lead story's headline/dek and the news items are read
// from data/news.ts for English and from the translated strings here
// for the other locales — the Formnext feature itself is English-only,
// and the localized homes say so (englishNote / newsLangNote).

export const LOCALE_CODES = ['de', 'es', 'pt', 'ja', 'zh'] as const;
export type LocaleCode = (typeof LOCALE_CODES)[number];
export type AnyLocale = 'en' | LocaleCode;

export interface LocaleMeta {
  code: AnyLocale;
  /** value for <html lang="..."> */
  htmlLang: string;
  /** value for og:locale */
  ogLocale: string;
  /** URL prefix of the locale homepage ('' for English root) */
  prefix: string;
  /** native name shown in the language switcher */
  label: string;
}

export const LOCALE_META: Record<AnyLocale, LocaleMeta> = {
  en: { code: 'en', htmlLang: 'en', ogLocale: 'en_US', prefix: '', label: 'English' },
  de: { code: 'de', htmlLang: 'de', ogLocale: 'de_DE', prefix: '/de', label: 'Deutsch' },
  es: { code: 'es', htmlLang: 'es', ogLocale: 'es_ES', prefix: '/es', label: 'Español' },
  pt: { code: 'pt', htmlLang: 'pt', ogLocale: 'pt_BR', prefix: '/pt', label: 'Português' },
  ja: { code: 'ja', htmlLang: 'ja', ogLocale: 'ja_JP', prefix: '/ja', label: '日本語' },
  zh: { code: 'zh', htmlLang: 'zh-CN', ogLocale: 'zh_CN', prefix: '/zh', label: '简体中文' },
};

export const ALL_LOCALES: AnyLocale[] = ['en', ...LOCALE_CODES];

/** Path of a locale's homepage ('/' for English). */
export const homePath = (code: AnyLocale) => `${LOCALE_META[code].prefix}/`;

/** Absolute URL of a locale's homepage. */
export const homeUrl = (code: AnyLocale) => `https://nylon3dp.com${homePath(code)}`;

/**
 * Full hreflang cluster for the homepage, emitted on all six homepages.
 * x-default points at the English homepage. Only locales that actually
 * exist may ever be listed here.
 */
export const HOME_ALTERNATES: { hreflang: string; href: string }[] = [
  ...ALL_LOCALES.map((code) => ({ hreflang: code as string, href: homeUrl(code) })),
  { hreflang: 'x-default', href: homeUrl('en') },
];

// --- portal date formatting -------------------------------------------------
const MONTHS_I18N: Record<AnyLocale, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  ja: [],
  zh: [],
};

/** '2026-11-14' → the locale's long date form (no Date/timezone involvement). */
export const formatPortalDate = (iso: string, locale: AnyLocale): string => {
  const [y, m, d] = iso.split('-').map(Number);
  switch (locale) {
    case 'de':
      return `${d}. ${MONTHS_I18N.de[m - 1]} ${y}`;
    case 'es':
      return `${d} de ${MONTHS_I18N.es[m - 1]} de ${y}`;
    case 'pt':
      return `${d} de ${MONTHS_I18N.pt[m - 1]} de ${y}`;
    case 'ja':
    case 'zh':
      return `${y}年${m}月${d}日`;
    default:
      return `${d} ${MONTHS_I18N.en[m - 1]} ${y}`;
  }
};

// --- portal homepage copy ----------------------------------------------------

export interface PortalNewsText {
  title: string;
  /** full translated dek (lead-story reuse / reference) */
  dek: string;
  /** one-sentence standfirst for the homepage news rail, used verbatim */
  rail: string;
}

export interface PortalDepthItem {
  href: string;
  /** when set and body is omitted, the body is the process quickAnswer's first sentence (English data layer) */
  processSlug?: string;
  title: string;
  body?: string;
}

export interface PortalCopy {
  title: string;
  description: string;
  langNavLabel: string;
  mastheadKicker: string;
  mastheadTitle: string;
  mastheadLede: string;
  leadKicker: string;
  /** desk tag of the lead item, translated ('Shows' …) */
  leadTag: string;
  /** translated lead headline/dek — used for non-English locales only (English reads data/news.ts) */
  leadTitle: string;
  leadDek: string;
  leadPlace: string;
  leadKind: string;
  leadRead: string;
  leadAll: string;
  /** honesty marker next to the lead links, e.g. '(in English)'; '' for English */
  englishNote: string;
  newsKicker: string;
  /** translated news items by href — used for non-English locales only */
  newsItems: Record<string, PortalNewsText>;
  newsPageLink: string;
  /** honesty line under the news rail, e.g. 'All coverage is published in English.'; '' for English */
  newsLangNote: string;
  briefingKicker: string;
  briefingTitle: string;
  briefingBody: string;
  briefingButton: string;
  /** email subject line for the mailto signup (the copy quotes "Subscribe" in every locale) */
  briefingSubject: string;
  ecoKicker: string;
  ecoIntro: string;
  vendorTypes: { material: string; machine: string; both: string };
  gradeNoun: [string, string];
  machineNoun: [string, string];
  /** HTML with a {machines} count token; carries the /vendors/ and /machines/ links */
  ecoFooterHtml: string;
  depthKicker: string;
  depthItems: PortalDepthItem[];
  /** HTML link line under the depth list */
  depthFooterHtml: string;
  appKicker: string;
  /** HTML with {industries}/{families}/{guides}/{planned} count tokens */
  appBodyHtml: string;
  toolsKicker: string;
  toolsCounts: { grades: [string, string]; machines: [string, string]; vendors: [string, string] };
  toolsBody: string;
  toolsLinks: { href: string; label: string }[];
  /** HTML with a {updated} token */
  signoffHtml: string;
  updated: string;
}

const en: PortalCopy = {
  title: 'The Nylon 3D Printing Industry Hub | Nylon3DP',
  description:
    "Nylon 3D printing's industry hub: news and show coverage, the vendor ecosystem, datasheet-sourced material and machine databases, and powder-economics tools.",
  langNavLabel: 'Language',
  mastheadKicker: 'Nylon3DP · Industry hub',
  mastheadTitle: 'The nylon 3D printing industry hub',
  mastheadLede:
    'News and show coverage, the vendor and equipment ecosystem, materials and process depth — backed by datasheet-sourced databases and powder-economics tools. If it matters to nylon 3D printing, it is covered here, with the sources attached.',
  leadKicker: 'Lead story',
  leadTag: 'Shows',
  leadTitle: 'Formnext 2026: the nylon watchlist',
  leadDek:
    'Formnext opens in Frankfurt on Tuesday 17 November, and the nylon side of the hall is unusually dense: EOS unveils a new large-frame polymer SLS platform, Arkema shows next-generation Orgasol PA12 powders, Stratasys unveils a manufacturing-scale system and TPM3D gives its compact CF250 its international debut. The desk’s preview, with vendor claims labelled as claims.',
  leadPlace: 'Frankfurt',
  leadKind: 'Preview',
  leadRead: 'Read the watchlist',
  leadAll: 'All coverage',
  englishNote: '',
  newsKicker: 'News & briefing',
  newsItems: {},
  newsPageLink: 'The news page — how the desk works and every item so far',
  newsLangNote: '',
  briefingKicker: 'The briefing',
  briefingTitle: 'Get the nylon briefing by email',
  briefingBody:
    'Show reports, vendor moves and new database entries, collected into one occasional email. No daily noise, no third-party list. Signup is by email for now: send a note with “Subscribe” in the subject line.',
  briefingButton: 'Subscribe by email',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: 'Ecosystem — vendors & equipment',
  ecoIntro:
    'The directory tracks the companies behind nylon printing — who makes the powders, who makes the machines, and what of theirs is specified in our databases. Every count below is the live state of the database, not a marketing number.',
  vendorTypes: { material: 'Materials', machine: 'Machines', both: 'Materials & machines' },
  gradeNoun: ['grade', 'grades'],
  machineNoun: ['machine', 'machines'],
  ecoFooterHtml:
    '<a href="/vendors/">Vendor directory</a> · <a href="/machines/">Machine database</a> — {machines} production machines fully specified, from the EOS P 396 to the Formlabs Fuse 1+ 30W, with two more platforms being unveiled at Formnext this week.',
  depthKicker: 'Depth — materials & processes',
  depthItems: [
    { href: '/processes/sls/', processSlug: 'sls', title: 'SLS — selective laser sintering' },
    { href: '/processes/mjf/', processSlug: 'mjf', title: 'MJF — Multi Jet Fusion' },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11 vs PA12: which nylon powder?',
      body: 'The ductility-versus-balance decision at the heart of powder-bed nylon, settled with EOS, Formlabs and HP datasheet numbers.',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: 'Designing parts for SLS & MJF',
      body: 'Wall thickness, hole sizes and powder escape holes from the official Formlabs SLS design guide, plus the design rules both powder processes share.',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">All processes</a> · <a href="/guides/">All guides</a> · <a href="/glossary/">Glossary</a>',
  appKicker: 'Applications landscape',
  appBodyHtml:
    'Nylon’s application map, organised as an industry landscape rather than a parts catalogue: the <a href="/applications/">coverage map</a> spans {industries} industries × {families} part families. {guides} guides are published — the <a href="/applications/drones/">drones &amp; UAV hub</a>, with <a href="/applications/drones/motor-mounts/">motor mounts</a> and <a href="/applications/drones/propeller-guards/">propeller guards</a> worked end to end — and {planned} further cells are planned, each gated on real demand and a complete engineering kernel before it is written.',
  toolsKicker: 'Data & tools — the service desk',
  toolsCounts: {
    grades: ['material grade', 'material grades'],
    machines: ['machine', 'machines'],
    vendors: ['vendor', 'vendors'],
  },
  toolsBody:
    'Every value from a manufacturer datasheet or official specification, cited on the page; values manufacturers do not publish are omitted, never estimated.',
  toolsLinks: [
    { href: '/materials/', label: 'Material database' },
    { href: '/machines/', label: 'Machine database' },
    { href: '/compare/materials/', label: 'Compare materials' },
    { href: '/compare/machines/', label: 'Compare machines' },
    { href: '/calculators/powder-refresh-ratio/', label: 'Refresh ratio calculator' },
    { href: '/calculators/part-cost/', label: 'Part cost estimator' },
    { href: '/calculators/', label: 'All calculators' },
  ],
  signoffHtml:
    'Nylon3DP is an independent industry publication and reference, not affiliated with any manufacturer — see the <a href="/editorial/">sourcing policy</a>. Last updated: {updated}',
  updated: 'November 2026',
};

const de: PortalCopy = {
  title: 'Der Branchen-Hub für Nylon-3D-Druck | Nylon3DP',
  description:
    'News, Messen und das Hersteller-Ökosystem des Nylon-3D-Drucks — plus Material- und Maschinendatenbanken aus Datenblättern und Werkzeuge zur Pulverökonomie.',
  langNavLabel: 'Sprache',
  mastheadKicker: 'Nylon3DP · Branchen-Hub',
  mastheadTitle: 'Der Branchen-Hub für Nylon-3D-Druck',
  mastheadLede:
    'News und Messeberichte, das Ökosystem der Hersteller und Anlagen, Tiefe bei Materialien und Verfahren — gestützt auf Datenbanken aus Herstellerdatenblättern und Werkzeuge zur Pulverökonomie. Was für den Nylon-3D-Druck zählt, wird hier behandelt — mit den Quellen dazu.',
  leadKicker: 'Top-Thema',
  leadTag: 'Messen',
  leadTitle: 'Formnext 2026: die Nylon-Beobachtungsliste',
  leadDek:
    'Die Formnext öffnet am Dienstag, 17. November, in Frankfurt ihre Tore, und die Nylon-Seite der Halle ist ungewöhnlich dicht besetzt: EOS enthüllt eine neue großformatige Polymer-SLS-Plattform, Arkema zeigt Orgasol-PA12-Pulver der nächsten Generation, Stratasys enthüllt ein System im Produktionsmaßstab, und TPM3D gibt seiner kompakten CF250 ihr internationales Debüt. Die Vorschau der Redaktion — mit Herstellerangaben, die als Angaben gekennzeichnet sind.',
  leadPlace: 'Frankfurt',
  leadKind: 'Vorschau',
  leadRead: 'Zur Beobachtungsliste',
  leadAll: 'Alle Berichte',
  englishNote: '(auf Englisch)',
  newsKicker: 'News & Briefing',
  newsItems: {
    '/guides/formnext-2026/': {
      title: 'Formnext 2026: die Nylon-Beobachtungsliste',
      dek: 'Die Formnext öffnet am Dienstag, 17. November, in Frankfurt ihre Tore, und die Nylon-Seite der Halle ist ungewöhnlich dicht besetzt: EOS enthüllt eine neue großformatige Polymer-SLS-Plattform, Arkema zeigt Orgasol-PA12-Pulver der nächsten Generation, Stratasys enthüllt ein System im Produktionsmaßstab, und TPM3D gibt seiner kompakten CF250 ihr internationales Debüt. Die Vorschau der Redaktion — mit Herstellerangaben, die als Angaben gekennzeichnet sind.',
      rail: 'Die Formnext öffnet am Dienstag, 17. November, in Frankfurt ihre Tore — mit einer ungewöhnlich dichten Nylon-Besetzung: EOS enthüllt eine neue großformatige Polymer-SLS-Plattform, Arkema zeigt Orgasol PA12 der nächsten Generation, Stratasys ein System im Produktionsmaßstab und TPM3D gibt der kompakten CF250 ihr internationales Debüt.',
    },
  },
  newsPageLink: 'Die News-Seite — wie die Redaktion arbeitet und alle bisherigen Beiträge',
  newsLangNote: 'Alle Beiträge erscheinen auf Englisch.',
  briefingKicker: 'Das Briefing',
  briefingTitle: 'Das Nylon-Briefing per E-Mail erhalten',
  briefingBody:
    'Messeberichte, Herstellerbewegungen und neue Datenbankeinträge — gesammelt in einer gelegentlichen E-Mail. Kein täglicher Lärm, keine Weitergabe an Dritte. Die Anmeldung läuft vorerst per E-Mail: Senden Sie eine Nachricht mit „Subscribe“ in der Betreffzeile.',
  briefingButton: 'Per E-Mail abonnieren',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: 'Ökosystem — Hersteller & Anlagen',
  ecoIntro:
    'Das Verzeichnis erfasst die Unternehmen hinter dem Nylon-Druck — wer die Pulver herstellt, wer die Maschinen baut und was davon in unseren Datenbanken spezifiziert ist. Jede Zahl unten ist der aktuelle Stand der Datenbank, keine Marketingzahl.',
  vendorTypes: { material: 'Materialien', machine: 'Maschinen', both: 'Materialien & Maschinen' },
  gradeNoun: ['Materialtyp', 'Materialtypen'],
  machineNoun: ['Maschine', 'Maschinen'],
  ecoFooterHtml:
    '<a href="/vendors/">Herstellerverzeichnis</a> · <a href="/machines/">Maschinendatenbank</a> — {machines} Produktionsmaschinen vollständig spezifiziert, von der EOS P 396 bis zur Formlabs Fuse 1+ 30W, dazu zwei weitere Plattformen, die diese Woche auf der Formnext enthüllt werden.',
  depthKicker: 'Tiefe — Materialien & Verfahren',
  depthItems: [
    {
      href: '/processes/sls/',
      processSlug: 'sls',
      title: 'SLS — Selektives Lasersintern',
      body: 'SLS baut Bauteile, indem ein Laser über ein beheiztes Bett aus Nylonpulver scannt und Querschnitt für Querschnitt sintert.',
    },
    {
      href: '/processes/mjf/',
      processSlug: 'mjf',
      title: 'MJF — Multi Jet Fusion',
      body: 'MJF ist das Pulverbettverfahren von HP: Inkjet-Arrays drucken Fusing- und Detailing-Agentien auf Nylonpulver, und eine Infrarotlampe verschmilzt die bedruckten Bereiche.',
    },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11 vs. PA12: Welches Nylonpulver?',
      body: 'Die Entscheidung zwischen Duktilität und Ausgewogenheit im Zentrum des Pulverbett-Nylons — entschieden mit Datenblatt-Werten von EOS, Formlabs und HP.',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: 'Bauteile für SLS & MJF konstruieren',
      body: 'Wandstärken, Bohrungsgrößen und Pulver-Entweichungslöcher aus dem offiziellen Formlabs SLS Design Guide, plus die Konstruktionsregeln, die beide Pulververfahren teilen.',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">Alle Verfahren</a> · <a href="/guides/">Alle Leitfäden</a> · <a href="/glossary/">Glossar</a>',
  appKicker: 'Anwendungslandschaft',
  appBodyHtml:
    'Die Anwendungskarte des Nylons, organisiert als Branchenlandschaft statt als Teilekatalog: Die <a href="/applications/">Abdeckungskarte</a> spannt {industries} Branchen × {families} Teilefamilien auf. {guides} Leitfäden sind veröffentlicht — der <a href="/applications/drones/">Hub für Drohnen &amp; UAV</a> mit <a href="/applications/drones/motor-mounts/">Motorhalterungen</a> und <a href="/applications/drones/propeller-guards/">Propellerschutzkäfigen</a>, durchgehend ausgearbeitet — und {planned} weitere Zellen sind geplant, jede erst nach echter Nachfrage und mit vollständigem Engineering-Kern, bevor sie geschrieben wird.',
  toolsKicker: 'Daten & Werkzeuge — die Servicetheke',
  toolsCounts: {
    grades: ['Materialtyp', 'Materialtypen'],
    machines: ['Maschine', 'Maschinen'],
    vendors: ['Hersteller', 'Hersteller'],
  },
  toolsBody:
    'Jeder Wert stammt aus einem Herstellerdatenblatt oder einer offiziellen Spezifikation und ist auf der Seite zitiert; Werte, die Hersteller nicht veröffentlichen, werden weggelassen, niemals geschätzt.',
  toolsLinks: [
    { href: '/materials/', label: 'Materialdatenbank' },
    { href: '/machines/', label: 'Maschinendatenbank' },
    { href: '/compare/materials/', label: 'Materialien vergleichen' },
    { href: '/compare/machines/', label: 'Maschinen vergleichen' },
    { href: '/calculators/powder-refresh-ratio/', label: 'Rechner für die Auffrischrate' },
    { href: '/calculators/part-cost/', label: 'Kostenrechner pro Bauteil' },
    { href: '/calculators/', label: 'Alle Rechner' },
  ],
  signoffHtml:
    'Nylon3DP ist eine unabhängige Branchenpublikation und Referenz, mit keinem Hersteller verbunden — siehe die <a href="/editorial/">Quellenrichtlinie</a>. Zuletzt aktualisiert: {updated}',
  updated: 'November 2026',
};

const es: PortalCopy = {
  title: 'El centro del sector de la impresión 3D de nailon | Nylon3DP',
  description:
    'Noticias y ferias, el ecosistema de fabricantes y bases de datos de materiales y máquinas basadas en fichas técnicas para la impresión 3D de nailon.',
  langNavLabel: 'Idioma',
  mastheadKicker: 'Nylon3DP · Centro del sector',
  mastheadTitle: 'El centro del sector de la impresión 3D de nailon',
  mastheadLede:
    'Noticias y cobertura de ferias, el ecosistema de fabricantes y equipos, y profundidad en materiales y procesos — con el respaldo de bases de datos basadas en fichas técnicas y herramientas de economía del polvo. Si es importante para la impresión 3D de nailon, está aquí, con las fuentes adjuntas.',
  leadKicker: 'Tema principal',
  leadTag: 'Ferias',
  leadTitle: 'Formnext 2026: la lista de seguimiento del nailon',
  leadDek:
    'Formnext abre en Fráncfort el martes 17 de noviembre, y el lado del nailon del pabellón está inusualmente denso: EOS presenta una nueva plataforma SLS de polímero de gran formato, Arkema muestra polvos Orgasol PA12 de próxima generación, Stratasys presenta un sistema a escala de fabricación y TPM3D da a su compacta CF250 su debut internacional. El avance de la redacción, con las afirmaciones de los fabricantes etiquetadas como afirmaciones.',
  leadPlace: 'Fráncfort',
  leadKind: 'Avance',
  leadRead: 'Leer la lista de seguimiento',
  leadAll: 'Toda la cobertura',
  englishNote: '(en inglés)',
  newsKicker: 'Noticias y briefing',
  newsItems: {
    '/guides/formnext-2026/': {
      title: 'Formnext 2026: la lista de seguimiento del nailon',
      dek: 'Formnext abre en Fráncfort el martes 17 de noviembre, y el lado del nailon del pabellón está inusualmente denso: EOS presenta una nueva plataforma SLS de polímero de gran formato, Arkema muestra polvos Orgasol PA12 de próxima generación, Stratasys presenta un sistema a escala de fabricación y TPM3D da a su compacta CF250 su debut internacional. El avance de la redacción, con las afirmaciones de los fabricantes etiquetadas como afirmaciones.',
      rail: 'Formnext abre en Fráncfort el martes 17 de noviembre, y el lado del nailon del pabellón está inusualmente denso: EOS presenta una nueva plataforma SLS de gran formato, Arkema muestra polvos Orgasol PA12 de próxima generación, Stratasys presenta un sistema a escala de fabricación y TPM3D da a su compacta CF250 su debut internacional.',
    },
  },
  newsPageLink: 'La página de noticias: cómo trabaja la redacción y todos los artículos hasta ahora',
  newsLangNote: 'Todos los artículos se publican en inglés.',
  briefingKicker: 'El briefing',
  briefingTitle: 'Recibe el briefing de nailon por correo',
  briefingBody:
    'Informes de ferias, movimientos de fabricantes y nuevas entradas en las bases de datos, reunidos en un correo ocasional. Sin ruido diario, sin listas de terceros. El registro es por correo por ahora: envía un mensaje con «Subscribe» en el asunto.',
  briefingButton: 'Suscribirse por correo',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: 'Ecosistema — fabricantes y equipos',
  ecoIntro:
    'El directorio sigue a las empresas detrás de la impresión de nailon: quién fabrica los polvos, quién fabrica las máquinas y qué productos suyos están especificados en nuestras bases de datos. Cada cifra siguiente es el estado actual de la base de datos, no un número de marketing.',
  vendorTypes: { material: 'Materiales', machine: 'Máquinas', both: 'Materiales y máquinas' },
  gradeNoun: ['grado', 'grados'],
  machineNoun: ['máquina', 'máquinas'],
  ecoFooterHtml:
    '<a href="/vendors/">Directorio de fabricantes</a> · <a href="/machines/">Base de datos de máquinas</a> — {machines} máquinas de producción totalmente especificadas, desde la EOS P 396 hasta la Formlabs Fuse 1+ 30W, con dos plataformas más que se presentan esta semana en Formnext.',
  depthKicker: 'Profundidad — materiales y procesos',
  depthItems: [
    {
      href: '/processes/sls/',
      processSlug: 'sls',
      title: 'SLS — sinterización selectiva por láser',
      body: 'El SLS construye piezas escaneando un láser sobre un lecho caliente de polvo de nailon, sinterizando una sección tras otra.',
    },
    {
      href: '/processes/mjf/',
      processSlug: 'mjf',
      title: 'MJF — Multi Jet Fusion',
      body: 'MJF es el proceso de fusión en lecho de polvo de HP: los cabezales inkjet imprimen agentes de fusión y de detalle sobre el polvo de nailon, y una lámpara infrarroja fusiona las zonas impresas.',
    },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11 frente a PA12: ¿qué polvo de nailon?',
      body: 'La decisión entre ductilidad y equilibrio en el corazón del nailon de lecho de polvo, resuelta con las cifras de las fichas técnicas de EOS, Formlabs y HP.',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: 'Diseño de piezas para SLS y MJF',
      body: 'Espesores de pared, tamaños de agujeros y agujeros de escape de polvo de la guía oficial de diseño SLS de Formlabs, además de las reglas de diseño que comparten ambos procesos de polvo.',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">Todos los procesos</a> · <a href="/guides/">Todas las guías</a> · <a href="/glossary/">Glosario</a>',
  appKicker: 'Panorama de aplicaciones',
  appBodyHtml:
    'El mapa de aplicaciones del nailon, organizado como un panorama del sector y no como un catálogo de piezas: el <a href="/applications/">mapa de cobertura</a> abarca {industries} sectores × {families} familias de piezas. Hay {guides} guías publicadas — el <a href="/applications/drones/">centro de drones y UAV</a>, con <a href="/applications/drones/motor-mounts/">soportes de motor</a> y <a href="/applications/drones/propeller-guards/">protectores de hélice</a> trabajados de principio a fin — y {planned} celdas más están planificadas, cada una condicionada a una demanda real y a un núcleo de ingeniería completo antes de escribirse.',
  toolsKicker: 'Datos y herramientas — el mostrador de servicio',
  toolsCounts: {
    grades: ['grado de material', 'grados de material'],
    machines: ['máquina', 'máquinas'],
    vendors: ['fabricante', 'fabricantes'],
  },
  toolsBody:
    'Cada valor procede de una ficha técnica del fabricante o de una especificación oficial, citada en la página; los valores que los fabricantes no publican se omiten, nunca se estiman.',
  toolsLinks: [
    { href: '/materials/', label: 'Base de datos de materiales' },
    { href: '/machines/', label: 'Base de datos de máquinas' },
    { href: '/compare/materials/', label: 'Comparar materiales' },
    { href: '/compare/machines/', label: 'Comparar máquinas' },
    { href: '/calculators/powder-refresh-ratio/', label: 'Calculadora de tasa de renovación' },
    { href: '/calculators/part-cost/', label: 'Estimador de coste por pieza' },
    { href: '/calculators/', label: 'Todas las calculadoras' },
  ],
  signoffHtml:
    'Nylon3DP es una publicación y referencia independiente del sector, sin afiliación con ningún fabricante — consulta la <a href="/editorial/">política de fuentes</a>. Última actualización: {updated}',
  updated: 'noviembre de 2026',
};

const pt: PortalCopy = {
  title: 'O centro do setor de impressão 3D de nylon | Nylon3DP',
  description:
    'Notícias e feiras, o ecossistema de fabricantes e bancos de dados de materiais e máquinas baseados em fichas técnicas — o centro da impressão 3D de nylon.',
  langNavLabel: 'Idioma',
  mastheadKicker: 'Nylon3DP · Centro do setor',
  mastheadTitle: 'O centro do setor de impressão 3D de nylon',
  mastheadLede:
    'Notícias e cobertura de feiras, o ecossistema de fabricantes e equipamentos e profundidade em materiais e processos — com o respaldo de bancos de dados baseados em fichas técnicas e ferramentas de economia do pó. Se é importante para a impressão 3D de nylon, está coberto aqui, com as fontes anexadas.',
  leadKicker: 'Destaque',
  leadTag: 'Feiras',
  leadTitle: 'Formnext 2026: a lista de observação do nylon',
  leadDek:
    'A Formnext abre em Frankfurt na terça-feira, 17 de novembro, e o lado do nylon do pavilhão está excepcionalmente denso: a EOS apresenta uma nova plataforma SLS de polímero de grande formato, a Arkema mostra pós Orgasol PA12 de próxima geração, a Stratasys apresenta um sistema em escala de manufatura e a TPM3D dá à sua compacta CF250 a estreia internacional. A prévia da redação, com as alegações dos fabricantes rotuladas como alegações.',
  leadPlace: 'Frankfurt',
  leadKind: 'Prévia',
  leadRead: 'Ler a lista de observação',
  leadAll: 'Toda a cobertura',
  englishNote: '(em inglês)',
  newsKicker: 'Notícias e briefing',
  newsItems: {
    '/guides/formnext-2026/': {
      title: 'Formnext 2026: a lista de observação do nylon',
      dek: 'A Formnext abre em Frankfurt na terça-feira, 17 de novembro, e o lado do nylon do pavilhão está excepcionalmente denso: a EOS apresenta uma nova plataforma SLS de polímero de grande formato, a Arkema mostra pós Orgasol PA12 de próxima geração, a Stratasys apresenta um sistema em escala de manufatura e a TPM3D dá à sua compacta CF250 a estreia internacional. A prévia da redação, com as alegações dos fabricantes rotuladas como alegações.',
      rail: 'A Formnext abre em Frankfurt na terça-feira, 17 de novembro, e o lado do nylon do pavilhão está excepcionalmente denso: a EOS apresenta uma nova plataforma SLS de grande formato, a Arkema mostra pós Orgasol PA12 de próxima geração, a Stratasys apresenta um sistema em escala de manufatura e a TPM3D dá à sua compacta CF250 a estreia internacional.',
    },
  },
  newsPageLink: 'A página de notícias — como a redação trabalha e todos os itens até agora',
  newsLangNote: 'Todos os itens são publicados em inglês.',
  briefingKicker: 'O briefing',
  briefingTitle: 'Receba o briefing de nylon por e-mail',
  briefingBody:
    'Relatórios de feiras, movimentos de fabricantes e novas entradas nos bancos de dados, reunidos em um e-mail ocasional. Sem ruído diário, sem lista de terceiros. A inscrição é por e-mail por enquanto: envie uma mensagem com “Subscribe” no assunto.',
  briefingButton: 'Assinar por e-mail',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: 'Ecossistema — fabricantes e equipamentos',
  ecoIntro:
    'O diretório acompanha as empresas por trás da impressão em nylon — quem fabrica os pós, quem fabrica as máquinas e o que delas está especificado nos nossos bancos de dados. Cada número abaixo é o estado atual do banco de dados, não um número de marketing.',
  vendorTypes: { material: 'Materiais', machine: 'Máquinas', both: 'Materiais e máquinas' },
  gradeNoun: ['grau', 'graus'],
  machineNoun: ['máquina', 'máquinas'],
  ecoFooterHtml:
    '<a href="/vendors/">Diretório de fabricantes</a> · <a href="/machines/">Banco de dados de máquinas</a> — {machines} máquinas de produção totalmente especificadas, da EOS P 396 à Formlabs Fuse 1+ 30W, com mais duas plataformas sendo apresentadas esta semana na Formnext.',
  depthKicker: 'Profundidade — materiais e processos',
  depthItems: [
    {
      href: '/processes/sls/',
      processSlug: 'sls',
      title: 'SLS — sinterização seletiva a laser',
      body: 'O SLS constrói peças escaneando um laser sobre um leito aquecido de pó de nylon, sinterizando uma seção de cada vez.',
    },
    {
      href: '/processes/mjf/',
      processSlug: 'mjf',
      title: 'MJF — Multi Jet Fusion',
      body: 'O MJF é o processo de fusão em leito de pó da HP: matrizes inkjet imprimem agentes de fusão e de detalhamento sobre o pó de nylon, e uma lâmpada infravermelha funde as áreas impressas.',
    },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11 vs. PA12: qual pó de nylon?',
      body: 'A decisão entre ductilidade e equilíbrio no coração do nylon em leito de pó, resolvida com os números das fichas técnicas da EOS, da Formlabs e da HP.',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: 'Projeto de peças para SLS e MJF',
      body: 'Espessuras de parede, tamanhos de furos e furos de escape de pó do guia oficial de design SLS da Formlabs, além das regras de design que os dois processos de pó compartilham.',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">Todos os processos</a> · <a href="/guides/">Todos os guias</a> · <a href="/glossary/">Glossário</a>',
  appKicker: 'Panorama de aplicações',
  appBodyHtml:
    'O mapa de aplicações do nylon, organizado como um panorama do setor e não como um catálogo de peças: o <a href="/applications/">mapa de cobertura</a> abrange {industries} setores × {families} famílias de peças. Há {guides} guias publicados — o <a href="/applications/drones/">hub de drones e UAV</a>, com <a href="/applications/drones/motor-mounts/">suportes de motor</a> e <a href="/applications/drones/propeller-guards/">protetores de hélice</a> trabalhados de ponta a ponta — e mais {planned} células estão planejadas, cada uma condicionada a uma demanda real e a um núcleo de engenharia completo antes de ser escrita.',
  toolsKicker: 'Dados e ferramentas — o balcão de serviços',
  toolsCounts: {
    grades: ['grau de material', 'graus de material'],
    machines: ['máquina', 'máquinas'],
    vendors: ['fabricante', 'fabricantes'],
  },
  toolsBody:
    'Cada valor vem de uma ficha técnica do fabricante ou de uma especificação oficial, citada na página; valores que os fabricantes não publicam são omitidos, nunca estimados.',
  toolsLinks: [
    { href: '/materials/', label: 'Banco de dados de materiais' },
    { href: '/machines/', label: 'Banco de dados de máquinas' },
    { href: '/compare/materials/', label: 'Comparar materiais' },
    { href: '/compare/machines/', label: 'Comparar máquinas' },
    { href: '/calculators/powder-refresh-ratio/', label: 'Calculadora de taxa de renovação' },
    { href: '/calculators/part-cost/', label: 'Estimador de custo por peça' },
    { href: '/calculators/', label: 'Todas as calculadoras' },
  ],
  signoffHtml:
    'O Nylon3DP é uma publicação e referência independente do setor, sem afiliação com nenhum fabricante — veja a <a href="/editorial/">política de fontes</a>. Última atualização: {updated}',
  updated: 'novembro de 2026',
};

const ja: PortalCopy = {
  title: 'ナイロン3Dプリント業界ハブ | Nylon3DP',
  description:
    'ナイロン3Dプリントの業界ハブ。ニュースと展示会レポート、メーカーのエコシステム、データシートに基づく材料・装置データベースと粉末経済ツールを収録。',
  langNavLabel: '言語',
  mastheadKicker: 'Nylon3DP · 業界ハブ',
  mastheadTitle: 'ナイロン3Dプリント業界ハブ',
  mastheadLede:
    'ニュースと展示会レポート、メーカーと装置のエコシステム、材料とプロセスの深掘り——データシートに基づくデータベースと粉末経済ツールに裏打ちされています。ナイロン3Dプリントにとって重要なことは、出典付きでここに収録します。',
  leadKicker: 'トップストーリー',
  leadTag: '展示会',
  leadTitle: 'Formnext 2026：ナイロンの注目リスト',
  leadDek:
    'Formnextは11月17日（火）にフランクフルトで開幕します。ホールのナイロン側は例年になく密度の高い顔ぶれです。EOSは大型ポリマーSLSプラットフォームを発表し、Arkemaは次世代Orgasol PA12粉末を展示、Stratasysは製造スケールのシステムを発表し、TPM3Dは小型機CF250の国際デビューを果たします。メーカーの主張には主張である旨を明記した、編集部のプレビューです。',
  leadPlace: 'フランクフルト',
  leadKind: 'プレビュー',
  leadRead: '注目リストを読む',
  leadAll: 'すべての記事',
  englishNote: '（英語）',
  newsKicker: 'ニュースとブリーフィング',
  newsItems: {
    '/guides/formnext-2026/': {
      title: 'Formnext 2026：ナイロンの注目リスト',
      dek: 'Formnextは11月17日（火）にフランクフルトで開幕します。ホールのナイロン側は例年になく密度の高い顔ぶれです。EOSは大型ポリマーSLSプラットフォームを発表し、Arkemaは次世代Orgasol PA12粉末を展示、Stratasysは製造スケールのシステムを発表し、TPM3Dは小型機CF250の国際デビューを果たします。メーカーの主張には主張である旨を明記した、編集部のプレビューです。',
      rail: 'Formnextは11月17日（火）にフランクフルトで開幕し、EOSの大型SLSプラットフォーム、Arkemaの次世代Orgasol PA12、Stratasysの製造スケールシステム、TPM3D CF250の国際デビューと、ナイロン勢が例年になく充実しています。',
    },
  },
  newsPageLink: 'ニュースページ ― 編集部の進め方とこれまでの全記事',
  newsLangNote: '記事はすべて英語で公開されています。',
  briefingKicker: 'ブリーフィング',
  briefingTitle: 'ナイロン・ブリーフィングをメールで受け取る',
  briefingBody:
    '展示会レポート、メーカーの動向、新しいデータベース登録を、時折届く1通のメールにまとめます。毎日のノイズも、第三者のリストもありません。登録は当面メールで受け付けています。件名に「Subscribe」と書いてお送りください。',
  briefingButton: 'メールで登録する',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: 'エコシステム ― メーカーと装置',
  ecoIntro:
    'このディレクトリは、ナイロン印刷の背後にいる企業を追います。誰が粉末を作り、誰が装置を作り、そのうち何が当サイトのデータベースに仕様として収録されているか。下記の数字はすべてデータベースの現在の状態であり、マーケティング上の数字ではありません。',
  vendorTypes: { material: '材料', machine: '装置', both: '材料と装置' },
  gradeNoun: ['グレード', 'グレード'],
  machineNoun: ['機種', '機種'],
  ecoFooterHtml:
    '<a href="/vendors/">メーカーディレクトリ</a> · <a href="/machines/">装置データベース</a> — EOS P 396からFormlabs Fuse 1+ 30Wまで、量産装置{machines}機種を完全に仕様収録。さらに今週のFormnextで2つのプラットフォームが発表されます。',
  depthKicker: '深掘り ― 材料とプロセス',
  depthItems: [
    {
      href: '/processes/sls/',
      processSlug: 'sls',
      title: 'SLS ― 選択的レーザー焼結',
      body: 'SLSは、加熱したナイロン粉末のベッド上をレーザーで走査し、断面を1層ずつ焼結して部品を造形します。',
    },
    {
      href: '/processes/mjf/',
      processSlug: 'mjf',
      title: 'MJF ― Multi Jet Fusion',
      body: 'MJFはHPの粉末床溶融結合プロセスです。インクジェットアレイがナイロン粉末上に溶融剤とディテール剤を印刷し、赤外線ランプが印刷部分を溶融します。',
    },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11とPA12：どちらのナイロン粉末か',
      body: '粉末床ナイロンの核心にある、延性とバランスの判断。EOS、Formlabs、HPのデータシートの数値で決着をつけます。',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: 'SLS・MJF向け部品設計',
      body: 'Formlabs公式SLS設計ガイドに基づく壁厚、穴径、粉末逃がし穴に、両粉末プロセスに共通する設計ルールを加えました。',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">すべてのプロセス</a> · <a href="/guides/">すべてのガイド</a> · <a href="/glossary/">用語集</a>',
  appKicker: 'アプリケーション全景',
  appBodyHtml:
    'ナイロンのアプリケーションマップを、部品カタログではなく業界の全景として整理しました。<a href="/applications/">カバレッジマップ</a>は{industries}業界 × {families}部品ファミリーにわたります。公開済みのガイドは{guides}本——<a href="/applications/drones/">ドローン・UAVハブ</a>で、<a href="/applications/drones/motor-mounts/">モーターマウント</a>と<a href="/applications/drones/propeller-guards/">プロペラガード</a>を端から端まで検証しました——さらに{planned}セルが計画中で、各セルは実需と完全なエンジニアリングカーネルを執筆の条件としています。',
  toolsKicker: 'データとツール ― サービスデスク',
  toolsCounts: {
    grades: ['グレード', 'グレード'],
    machines: ['機種', '機種'],
    vendors: ['社', '社'],
  },
  toolsBody:
    'すべての値はメーカーのデータシートまたは公式仕様から取り、ページに出典を明記しています。メーカーが公表していない値は、推定で埋めずに省略します。',
  toolsLinks: [
    { href: '/materials/', label: '材料データベース' },
    { href: '/machines/', label: '装置データベース' },
    { href: '/compare/materials/', label: '材料を比較する' },
    { href: '/compare/machines/', label: '装置を比較する' },
    { href: '/calculators/powder-refresh-ratio/', label: 'リフレッシュ比率カリキュレーター' },
    { href: '/calculators/part-cost/', label: '部品コスト見積もり' },
    { href: '/calculators/', label: 'すべてのカリキュレーター' },
  ],
  signoffHtml:
    'Nylon3DPは独立した業界出版物・リファレンスであり、いずれのメーカーとも提携していません。詳しくは<a href="/editorial/">出典ポリシー</a>をご覧ください。最終更新：{updated}',
  updated: '2026年11月',
};

const zh: PortalCopy = {
  title: '尼龙3D打印行业中枢 | Nylon3DP',
  description: '尼龙3D打印行业中枢：新闻与展会报道、厂家生态系统、基于数据手册的材料与设备数据库，以及粉末经济性工具。',
  langNavLabel: '语言',
  mastheadKicker: 'Nylon3DP · 行业中枢',
  mastheadTitle: '尼龙3D打印行业中枢',
  mastheadLede:
    '新闻与展会报道、厂家与设备生态系统、材料与工艺深度解析——背后是基于数据手册的数据库与粉末经济性工具。凡是对尼龙3D打印重要的事，这里都有报道，并附上来源。',
  leadKicker: '头条',
  leadTag: '展会',
  leadTitle: 'Formnext 2026：尼龙观察名单',
  leadDek:
    'Formnext将于11月17日（周二）在法兰克福开幕，展馆里尼龙这一侧异常密集：EOS将发布一台大型聚合物SLS平台，Arkema将展示新一代Orgasol PA12粉末，Stratasys将发布一台生产级系统，TPM3D紧凑型CF250将迎来国际首秀。这是编辑部的展前预览，厂家的说法均已标注为厂家说法。',
  leadPlace: '法兰克福',
  leadKind: '预览',
  leadRead: '查看观察名单',
  leadAll: '全部报道',
  englishNote: '（英文）',
  newsKicker: '新闻与简报',
  newsItems: {
    '/guides/formnext-2026/': {
      title: 'Formnext 2026：尼龙观察名单',
      dek: 'Formnext将于11月17日（周二）在法兰克福开幕，展馆里尼龙这一侧异常密集：EOS将发布一台大型聚合物SLS平台，Arkema将展示新一代Orgasol PA12粉末，Stratasys将发布一台生产级系统，TPM3D紧凑型CF250将迎来国际首秀。这是编辑部的展前预览，厂家的说法均已标注为厂家说法。',
      rail: 'Formnext将于11月17日（周二）在法兰克福开幕，尼龙阵容异常密集：EOS将发布大型聚合物SLS平台，Arkema将展示新一代Orgasol PA12粉末，Stratasys将发布生产级系统，TPM3D紧凑型CF250将迎来国际首秀。',
    },
  },
  newsPageLink: '新闻页——编辑部如何运作，以及迄今的全部条目',
  newsLangNote: '全部报道以英文发布。',
  briefingKicker: '简报',
  briefingTitle: '通过邮件获取尼龙简报',
  briefingBody:
    '展会报告、厂家动态与数据库新条目，汇总成一封不定期邮件。没有每日噪声，不使用第三方名单。目前通过邮件订阅：在主题行写上“Subscribe”，发送一封邮件即可。',
  briefingButton: '通过邮件订阅',
  briefingSubject: 'Subscribe — Nylon3DP briefing',
  ecoKicker: '生态系统——厂家与设备',
  ecoIntro:
    '本目录跟踪尼龙打印背后的公司——谁生产粉末，谁制造设备，以及他们的哪些产品已收录进我们的数据库。下面的每个数字都是数据库的实时状态，不是营销数字。',
  vendorTypes: { material: '材料', machine: '设备', both: '材料与设备' },
  gradeNoun: ['个牌号', '个牌号'],
  machineNoun: ['台设备', '台设备'],
  ecoFooterHtml:
    '<a href="/vendors/">厂家目录</a> · <a href="/machines/">设备数据库</a>——{machines}台生产设备已完整收录规格，从EOS P 396到Formlabs Fuse 1+ 30W，另有两台平台将于本周在Formnext上发布。',
  depthKicker: '深度——材料与工艺',
  depthItems: [
    {
      href: '/processes/sls/',
      processSlug: 'sls',
      title: 'SLS——选择性激光烧结',
      body: 'SLS通过激光在加热的尼龙粉末床上扫描，逐层烧结截面来构建零件。',
    },
    {
      href: '/processes/mjf/',
      processSlug: 'mjf',
      title: 'MJF——Multi Jet Fusion',
      body: 'MJF是HP的粉末床熔融工艺：喷墨阵列将熔合剂与精细剂打印到尼龙粉末上，红外灯将打印区域熔合。',
    },
    {
      href: '/guides/pa11-vs-pa12/',
      title: 'PA11 与 PA12：选哪种尼龙粉末？',
      body: '粉末床尼龙核心的韧性与均衡之争，用EOS、Formlabs和HP数据手册的数字来判定。',
    },
    {
      href: '/guides/designing-for-sls-mjf/',
      title: '为SLS与MJF设计零件',
      body: '壁厚、孔径与粉末排出孔取自Formlabs官方SLS设计指南，另加两种粉末工艺共有的设计规则。',
    },
  ],
  depthFooterHtml:
    '<a href="/processes/">全部工艺</a> · <a href="/guides/">全部指南</a> · <a href="/glossary/">术语表</a>',
  appKicker: '应用版图',
  appBodyHtml:
    '尼龙的应用地图，按行业版图而非零件目录来组织：<a href="/applications/">覆盖地图</a>横跨{industries}个行业 × {families}个零件族。已发布{guides}篇指南——<a href="/applications/drones/">无人机与UAV中心</a>，其中<a href="/applications/drones/motor-mounts/">电机座</a>与<a href="/applications/drones/propeller-guards/">桨叶保护罩</a>已完整做通——另有{planned}个单元格在规划中，每个都必须先有真实需求和完整的工程内核才动笔。',
  toolsKicker: '数据与工具——服务台',
  toolsCounts: {
    grades: ['个材料牌号', '个材料牌号'],
    machines: ['台设备', '台设备'],
    vendors: ['家厂家', '家厂家'],
  },
  toolsBody: '每个数值都来自厂家数据手册或官方规格，并在页面上注明来源；厂家未公布的数值一律省略，绝不估算。',
  toolsLinks: [
    { href: '/materials/', label: '材料数据库' },
    { href: '/machines/', label: '设备数据库' },
    { href: '/compare/materials/', label: '对比材料' },
    { href: '/compare/machines/', label: '对比设备' },
    { href: '/calculators/powder-refresh-ratio/', label: '刷新比计算器' },
    { href: '/calculators/part-cost/', label: '零件成本估算' },
    { href: '/calculators/', label: '全部计算器' },
  ],
  signoffHtml:
    'Nylon3DP是一家独立的行业出版物与参考站，与任何厂家均无隶属关系——见<a href="/editorial/">来源政策</a>。最后更新：{updated}',
  updated: '2026年11月',
};

export const PORTAL_COPY: Record<AnyLocale, PortalCopy> = { en, de, es, pt, ja, zh };
