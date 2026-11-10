// i18n foundation + homepage copy table.
//
// English is the source language and lives at the root (unprefixed).
// Pilot locales are prefixed: /de/, /es/, /pt/, /ja/, /zh/.
// Spec rule (GOAL.md «多语言»): translations share the English data layer —
// brand/grade names, process acronyms (SLS/MJF/SAF/FDM), material codes
// (PA11, PA12, PA6-CF) and every number stay byte-identical to English.

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

export interface HomeCard {
  title: string;
  body: string;
  meta: string;
}

export interface HomeCopy {
  title: string;
  description: string;
  heroTitle: string;
  heroLede: string;
  qaLabel: string;
  /** HTML — carries the process links; identical targets in every locale */
  qaBody: string;
  startHeading: string;
  cards: {
    materials: HomeCard;
    machines: HomeCard;
    processes: HomeCard;
    guides: HomeCard;
    glossary: HomeCard;
    compare: HomeCard;
  };
  featuredHeading: string;
  /**
   * Translated teaser per material slug for the featured-materials cards.
   * English omits this and renders from the data layer, as before.
   * Numbers must match the English datasheet values exactly.
   */
  featuredTeasers?: Record<string, string>;
  coverageHeading: string;
  /** HTML — carries the /editorial/ link. {materials}/{machines}/{glossary} are counts. */
  coverageBody: string;
  trustHeading: string;
  /** HTML — carries the mailto link */
  trustBody: string;
  updatedLine: string;
}

const en: HomeCopy = {
  title: 'Nylon3DP — The Nylon 3D Printing Reference: PA11, PA12, SLS, MJF',
  description:
    'The nylon 3D printing reference: PA11/PA12 datasheet database, SLS, MJF, SAF and FDM processes, machine specs and guides — every number manufacturer-sourced.',
  heroTitle: 'The Nylon 3D Printing Reference',
  heroLede:
    "Nylon is the engineering polymer that 3D printing actually builds with — and its data is scattered across dozens of manufacturer datasheets. Nylon3DP gathers it in one place: material properties, machine specifications, process explainers and design guides for PA11, PA12, PA6 and filled nylons, with every number traced to the manufacturer's own documentation.",
  qaLabel: 'Quick answer — what is nylon 3D printing?',
  qaBody:
    'Nylon (polyamide) 3D printing means producing parts from PA12, PA11, PA6 or filled nylon grades, mainly by powder-bed fusion — <a href="/processes/sls/">SLS</a> and <a href="/processes/mjf/">MJF</a> — or by extruding nylon filament (<a href="/processes/fdm/">FDM</a>). Printed nylon is tough, wear-resistant and moderately heat-resistant, which makes it the default choice for functional end-use parts: hinges, clips, gears, ducts, brackets, jigs and orthotics. PA12 is the standard grade; PA11 is the ductile, bio-based alternative.',
  startHeading: 'Start with the databases',
  cards: {
    materials: {
      title: 'Material database',
      body: '{materials} nylon grades with full datasheet tables — powders from EOS, Formlabs, HP and BASF, filaments from Polymaker and Bambu Lab.',
      meta: 'PA12 · PA11 · PA6 · glass-filled · PA-CF · CoPA',
    },
    machines: {
      title: 'Machine database',
      body: '{machines} powder-bed systems with manufacturer-verified build volumes and layer specs.',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: 'Processes',
      body: 'How SLS, MJF, SAF and nylon FDM work, which materials each uses, and where each fits — plus the sourced SLS vs MJF comparison.',
      meta: 'SLS · MJF · SAF · FDM',
    },
    guides: {
      title: 'Guides',
      body: 'PA11 vs PA12 decided on datasheet numbers; drying nylon filament at manufacturer settings; designing parts for SLS & MJF from official design guides.',
      meta: '3 guides at launch, growing',
    },
    glossary: {
      title: 'Glossary',
      body: '{glossary} definitions — refresh ratio, glass-filled, hygroscopic, HDT and the rest of the vocabulary the datasheets assume.',
      meta: 'Plain-language, cross-checked against the database',
    },
    compare: {
      title: 'SLS vs MJF',
      body: "The two production powder processes compared on their manufacturers' own PA12 data: strength, isotropy, colour, materials and economics.",
      meta: 'Comparison',
    },
  },
  featuredHeading: 'Featured materials',
  coverageHeading: 'Coverage so far — stated plainly',
  coverageBody:
    'This is v1 of the reference, published November 2026: {materials} materials, {machines} machines, 3 process deep-dives plus a comparison, 3 guides and {glossary} glossary terms. The goal is the complete nylon landscape — every significant powder, filament and machine, every major application area — built in verified stages. What is not yet covered is not guessed at: it is queued. The standard for every page is in the <a href="/editorial/">editorial and sourcing policy</a>.',
  trustHeading: 'Why trust the numbers here?',
  trustBody:
    'Because each one names its source. Property tables reproduce manufacturer datasheets (EOS, Formlabs, HP, BASF, Polymaker, Bambu Lab) with the test method kept next to the value; machine specs come from manufacturers\' specification documents; design minimums come from official design guides. If a manufacturer does not publish a value, the table omits it rather than filling the gap. Corrections are welcome at <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a>.',
  updatedLine: 'Last updated: November 2026',
};

const de: HomeCopy = {
  title: 'Nylon3DP — Die Referenz für Nylon-3D-Druck: PA11, PA12, SLS, MJF',
  description:
    'Die Referenz für Nylon-3D-Druck: PA11/PA12-Datenbank mit Herstellerangaben, SLS-, MJF-, SAF- und FDM-Verfahren, Maschinendaten und Konstruktionsleitfäden.',
  heroTitle: 'Die Referenz für Nylon-3D-Druck',
  heroLede:
    'Nylon ist der technische Kunststoff, mit dem im 3D-Druck tatsächlich gebaut wird — doch seine Daten sind über Dutzende von Herstellerdatenblättern verstreut. Nylon3DP führt sie an einem Ort zusammen: Materialeigenschaften, Maschinenspezifikationen, Verfahrenserklärungen und Konstruktionsleitfäden für PA11, PA12, PA6 und gefüllte Nylons, mit jeder Zahl rückverfolgbar zur eigenen Dokumentation des Herstellers.',
  qaLabel: 'Kurze Antwort — Was ist Nylon-3D-Druck?',
  qaBody:
    'Beim Nylon-3D-Druck (Polyamid) werden Bauteile aus PA12, PA11, PA6 oder gefüllten Nylon-Typen gefertigt, hauptsächlich im Pulverbettverfahren — <a href="/processes/sls/">SLS</a> und <a href="/processes/mjf/">MJF</a> — oder durch Extrusion von Nylon-Filament (<a href="/processes/fdm/">FDM</a>). Gedrucktes Nylon ist zäh, verschleißfest und mäßig hitzebeständig — damit ist es die Standardwahl für funktionale Endbauteile: Scharniere, Clips, Zahnräder, Luftkanäle, Halterungen, Vorrichtungen und Orthesen. PA12 ist der Standardtyp; PA11 ist die duktile, biobasierte Alternative.',
  startHeading: 'Beginnen Sie mit den Datenbanken',
  cards: {
    materials: {
      title: 'Materialdatenbank',
      body: '{materials} Nylon-Typen mit vollständigen Datenblatt-Tabellen — Pulver von EOS, Formlabs, HP und BASF, Filamente von Polymaker und Bambu Lab.',
      meta: 'PA12 · PA11 · PA6 · glasgefüllt · PA-CF · CoPA',
    },
    machines: {
      title: 'Maschinendatenbank',
      body: '{machines} Pulverbett-Anlagen mit vom Hersteller verifizierten Bauräumen und Schichtangaben.',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: 'Verfahren',
      body: 'Wie SLS, MJF, SAF und Nylon-FDM funktionieren, welche Materialien sie jeweils nutzen und wo sie jeweils passen — plus der quellenbasierte Vergleich SLS vs. MJF.',
      meta: 'SLS · MJF · SAF · FDM',
    },
    guides: {
      title: 'Leitfäden',
      body: 'PA11 vs. PA12, entschieden anhand von Datenblatt-Werten; Nylon-Filament mit den Einstellungen des Herstellers trocknen; Bauteile für SLS & MJF nach offiziellen Konstruktionsleitfäden auslegen.',
      meta: '3 Leitfäden zum Start, wachsend',
    },
    glossary: {
      title: 'Glossar',
      body: '{glossary} Definitionen — Auffrischrate (Refresh Ratio), glasgefüllt, hygroskopisch, HDT und der übrige Wortschatz, den die Datenblätter voraussetzen.',
      meta: 'Verständlich erklärt, gegen die Datenbank abgeglichen',
    },
    compare: {
      title: 'SLS vs. MJF',
      body: 'Die beiden Produktions-Pulververfahren im Vergleich anhand der PA12-Daten ihrer eigenen Hersteller: Festigkeit, Isotropie, Farbe, Materialien und Wirtschaftlichkeit.',
      meta: 'Vergleich',
    },
  },
  featuredHeading: 'Ausgewählte Materialien',
  featuredTeasers: {
    'eos-pa-2200':
      'EOS PA 2200 ist das Referenz-PA12-Pulver für das selektive Lasersintern: ein ausgewogenes, ungefülltes Nylon 12 mit 48 MPa Zugfestigkeit (XY), 1650 MPa Zugmodul und 18% Bruchdehnung in der XY-Ebene, laut aktuellem EOS-Materialdatenblatt.',
    'eos-pa-1101': 'EOS PA 1101 ist ein biobasiertes PA11-SLS-Pulver, das aus Rizinusöl gewonnen wird.',
    'eos-pa-3200-gf':
      'EOS PA 3200 GF ist ein mit Glaskugeln gefülltes PA12-SLS-Pulver (40 wt% Glaskugeln laut EOS).',
    'formlabs-nylon-12-powder':
      'Formlabs Nylon 12 Powder ist das Standard-PA12 für die Fuse-SLS-Serie: 50 MPa Zugfestigkeit, 1850 MPa Zugmodul und 11% Bruchdehnung (X/Y) laut technischem Datenblatt von Formlabs, mit einer Wärmeformbeständigkeit (HDT) von 171 °C bei 0.45 MPa.',
    'formlabs-nylon-11-powder':
      'Formlabs Nylon 11 Powder ist ein biobasiertes PA11 für die Fuse-Serie, ausgelegt für Bauteile, die sich biegen oder Stöße aufnehmen: 49 MPa Zugfestigkeit, 1600 MPa Modul und 40% Bruchdehnung (X/Y) laut technischem Datenblatt von Formlabs — das duktilste Pulver im Formlabs-Sortiment.',
    'hp-pa-12':
      'HP 3D High Reusability PA 12 ist das Standard-Nylon für Multi Jet Fusion: 54 MPa Zugfestigkeit, 2150 MPa Zugmodul und 18% Bruchdehnung in XY (10% in Z), mit einer Dichte von 1.02 g/cm³, laut technischem Datenblatt von HP.',
  },
  coverageHeading: 'Aktueller Stand — offen gesagt',
  coverageBody:
    'Dies ist Version 1 der Referenz, veröffentlicht im November 2026: {materials} Materialien, {machines} Maschinen, 3 Verfahren im Detail plus ein Vergleich, 3 Leitfäden und {glossary} Glossarbegriffe. Das Ziel ist die vollständige Nylon-Landschaft — jedes wichtige Pulver, Filament und jede Maschine, jeder große Anwendungsbereich — aufgebaut in verifizierten Schritten. Was noch nicht abgedeckt ist, wird nicht erraten: Es steht in der Warteschlange. Der Maßstab für jede Seite steht in der <a href="/editorial/">Redaktions- und Quellenrichtlinie</a>.',
  trustHeading: 'Warum diesen Zahlen vertrauen?',
  trustBody:
    'Weil jede einzelne ihre Quelle nennt. Die Eigenschaftstabellen geben die Datenblätter der Hersteller wieder (EOS, Formlabs, HP, BASF, Polymaker, Bambu Lab) — mit der Prüfmethode direkt neben dem Wert; die Maschinendaten stammen aus den Spezifikationsdokumenten der Hersteller; die Konstruktionsminima aus offiziellen Konstruktionsleitfäden. Veröffentlicht ein Hersteller einen Wert nicht, lässt die Tabelle ihn aus, statt die Lücke zu füllen. Korrekturen sind willkommen unter <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a>.',
  updatedLine: 'Zuletzt aktualisiert: November 2026',
};

const es: HomeCopy = {
  title: 'Nylon3DP — La referencia del nailon en 3D: PA11, PA12, SLS, MJF',
  description:
    'La referencia en impresión 3D de nailon: base de datos de PA11/PA12 con fichas de fabricantes, procesos SLS, MJF, SAF y FDM, máquinas y guías de diseño.',
  heroTitle: 'La referencia en impresión 3D de nailon',
  heroLede:
    'El nailon es el polímero de ingeniería con el que realmente se construye en impresión 3D, pero sus datos están dispersos en decenas de fichas técnicas de fabricantes. Nylon3DP los reúne en un solo lugar: propiedades de materiales, especificaciones de máquinas, explicaciones de procesos y guías de diseño para PA11, PA12, PA6 y nailones con carga, con cada cifra rastreable hasta la documentación del propio fabricante.',
  qaLabel: 'Respuesta rápida — ¿qué es la impresión 3D de nailon?',
  qaBody:
    'La impresión 3D de nailon (poliamida) consiste en producir piezas de PA12, PA11, PA6 o grados de nailon con carga, principalmente por fusión en lecho de polvo — <a href="/processes/sls/">SLS</a> y <a href="/processes/mjf/">MJF</a> — o extruyendo filamento de nailon (<a href="/processes/fdm/">FDM</a>). El nailon impreso es tenaz, resistente al desgaste y moderadamente resistente al calor, lo que lo convierte en la opción habitual para piezas funcionales de uso final: bisagras, clips, engranajes, conductos, soportes, utillajes y órtesis. PA12 es el grado estándar; PA11 es la alternativa dúctil y de origen biológico.',
  startHeading: 'Empieza por las bases de datos',
  cards: {
    materials: {
      title: 'Base de datos de materiales',
      body: '{materials} grados de nailon con tablas completas de ficha técnica: polvos de EOS, Formlabs, HP y BASF, filamentos de Polymaker y Bambu Lab.',
      meta: 'PA12 · PA11 · PA6 · con carga de vidrio · PA-CF · CoPA',
    },
    machines: {
      title: 'Base de datos de máquinas',
      body: '{machines} sistemas de lecho de polvo con volúmenes de construcción y datos de capa verificados por el fabricante.',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: 'Procesos',
      body: 'Cómo funcionan SLS, MJF, SAF y el FDM con nailon, qué materiales usa cada uno y dónde encaja cada cual — además de la comparativa SLS vs. MJF con fuentes.',
      meta: 'SLS · MJF · SAF · FDM',
    },
    guides: {
      title: 'Guías',
      body: 'PA11 frente a PA12, decidido con las cifras de las fichas técnicas; secado del filamento de nailon con los ajustes del fabricante; diseño de piezas para SLS y MJF desde las guías oficiales de diseño.',
      meta: '3 guías en el lanzamiento, en aumento',
    },
    glossary: {
      title: 'Glosario',
      body: '{glossary} definiciones: tasa de renovación del polvo, carga de vidrio, higroscópico, HDT y el resto del vocabulario que las fichas técnicas dan por sentado.',
      meta: 'En lenguaje claro, contrastado con la base de datos',
    },
    compare: {
      title: 'SLS vs. MJF',
      body: 'Los dos procesos de polvo de producción, comparados con los datos de PA12 de sus propios fabricantes: resistencia, isotropía, color, materiales y economía.',
      meta: 'Comparativa',
    },
  },
  featuredHeading: 'Materiales destacados',
  featuredTeasers: {
    'eos-pa-2200':
      'EOS PA 2200 es el polvo de PA12 de referencia para la sinterización selectiva por láser: un nailon 12 equilibrado y sin carga, con 48 MPa de resistencia a la tracción (XY), 1650 MPa de módulo de tracción y 18% de alargamiento a la rotura en el plano XY, según la ficha técnica actual de EOS.',
    'eos-pa-1101': 'EOS PA 1101 es un polvo de PA11 de origen biológico para SLS, derivado del aceite de ricino.',
    'eos-pa-3200-gf':
      'EOS PA 3200 GF es un polvo de PA12 para SLS con carga de microesferas de vidrio (40 wt% de microesferas, según EOS).',
    'formlabs-nylon-12-powder':
      'Formlabs Nylon 12 Powder es el PA12 estándar de la serie Fuse de SLS: 50 MPa de resistencia máxima a la tracción, 1850 MPa de módulo de tracción y 11% de alargamiento a la rotura (X/Y) según la ficha técnica de Formlabs, con una HDT de 171 °C a 0.45 MPa.',
    'formlabs-nylon-11-powder':
      'Formlabs Nylon 11 Powder es un PA11 de origen biológico para la serie Fuse, pensado para piezas que se flexionan o reciben impactos: 49 MPa de resistencia a la tracción, 1600 MPa de módulo y 40% de alargamiento a la rotura (X/Y) según la ficha técnica de Formlabs — el polvo más dúctil de la gama Formlabs.',
    'hp-pa-12':
      'HP 3D High Reusability PA 12 es el nailon estándar para Multi Jet Fusion: 54 MPa de resistencia a la tracción, 2150 MPa de módulo de tracción y 18% de alargamiento a la rotura en XY (10% en Z), con una densidad de 1.02 g/cm³, según la ficha técnica de HP.',
  },
  coverageHeading: 'Cobertura hasta ahora, sin rodeos',
  coverageBody:
    'Esta es la v1 de la referencia, publicada en noviembre de 2026: {materials} materiales, {machines} máquinas, 3 procesos en profundidad más una comparativa, 3 guías y {glossary} términos de glosario. El objetivo es el panorama completo del nailon —cada polvo, filamento y máquina relevantes, cada gran área de aplicación— construido en etapas verificadas. Lo que aún no está cubierto no se adivina: está en cola. El criterio aplicado a cada página está en la <a href="/editorial/">política editorial y de fuentes</a>.',
  trustHeading: '¿Por qué confiar en estas cifras?',
  trustBody:
    'Porque cada una nombra su fuente. Las tablas de propiedades reproducen las fichas técnicas de los fabricantes (EOS, Formlabs, HP, BASF, Polymaker, Bambu Lab) con el método de ensayo junto al valor; las especificaciones de las máquinas proceden de los documentos de especificaciones de los fabricantes; los mínimos de diseño, de las guías oficiales de diseño. Si un fabricante no publica un valor, la tabla lo omite en lugar de rellenar el hueco. Las correcciones son bienvenidas en <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a>.',
  updatedLine: 'Última actualización: noviembre de 2026',
};

const pt: HomeCopy = {
  title: 'Nylon3DP — Referência em impressão 3D de nylon: PA11, PA12, SLS, MJF',
  description:
    'A referência em impressão 3D de nylon: banco de dados de PA11/PA12 com dados dos fabricantes, processos SLS, MJF, SAF e FDM, máquinas e guias.',
  heroTitle: 'A referência em impressão 3D de nylon',
  heroLede:
    'O nylon é o polímero de engenharia com o qual a impressão 3D realmente constrói — mas os seus dados estão espalhados por dezenas de fichas técnicas de fabricantes. O Nylon3DP os reúne em um só lugar: propriedades de materiais, especificações de máquinas, explicações de processos e guias de design para PA11, PA12, PA6 e nylons com carga, com cada número rastreável até a documentação do próprio fabricante.',
  qaLabel: 'Resposta rápida — o que é a impressão 3D de nylon?',
  qaBody:
    'Impressão 3D de nylon (poliamida) significa produzir peças em PA12, PA11, PA6 ou graus de nylon com carga, principalmente por fusão em leito de pó — <a href="/processes/sls/">SLS</a> e <a href="/processes/mjf/">MJF</a> — ou pela extrusão de filamento de nylon (<a href="/processes/fdm/">FDM</a>). O nylon impresso é tenaz, resistente ao desgaste e moderadamente resistente ao calor, o que o torna a escolha padrão para peças funcionais de uso final: dobradiças, clipes, engrenagens, dutos, suportes, gabaritos e órteses. O PA12 é o grau padrão; o PA11 é a alternativa dúctil e de base biológica.',
  startHeading: 'Comece pelos bancos de dados',
  cards: {
    materials: {
      title: 'Banco de dados de materiais',
      body: '{materials} graus de nylon com tabelas completas de ficha técnica — pós da EOS, Formlabs, HP e BASF, filamentos da Polymaker e da Bambu Lab.',
      meta: 'PA12 · PA11 · PA6 · com carga de vidro · PA-CF · CoPA',
    },
    machines: {
      title: 'Banco de dados de máquinas',
      body: '{machines} sistemas de leito de pó com volumes de construção e especificações de camada verificados pelo fabricante.',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: 'Processos',
      body: 'Como funcionam o SLS, o MJF, o SAF e o FDM com nylon, quais materiais cada um usa e onde cada um se encaixa — além da comparação SLS vs. MJF com fontes.',
      meta: 'SLS · MJF · SAF · FDM',
    },
    guides: {
      title: 'Guias',
      body: 'PA11 vs. PA12 decidido pelos números das fichas técnicas; secagem do filamento de nylon nas configurações do fabricante; projeto de peças para SLS e MJF a partir dos guias oficiais de design.',
      meta: '3 guias no lançamento, em crescimento',
    },
    glossary: {
      title: 'Glossário',
      body: '{glossary} definições — taxa de renovação do pó, carga de vidro, higroscópico, HDT e o restante do vocabulário que as fichas técnicas pressupõem.',
      meta: 'Linguagem simples, conferido com o banco de dados',
    },
    compare: {
      title: 'SLS vs. MJF',
      body: 'Os dois processos de pó de produção comparados com os dados de PA12 dos próprios fabricantes: resistência, isotropia, cor, materiais e economia.',
      meta: 'Comparação',
    },
  },
  featuredHeading: 'Materiais em destaque',
  featuredTeasers: {
    'eos-pa-2200':
      'O EOS PA 2200 é o pó de PA12 de referência para a sinterização seletiva a laser: um nylon 12 equilibrado e sem carga, com 48 MPa de resistência à tração (XY), 1650 MPa de módulo de tração e 18% de alongamento na ruptura no plano XY, conforme a ficha técnica atual da EOS.',
    'eos-pa-1101': 'O EOS PA 1101 é um pó de PA11 de base biológica para SLS, derivado do óleo de mamona.',
    'eos-pa-3200-gf':
      'O EOS PA 3200 GF é um pó de PA12 para SLS com carga de microesferas de vidro (40 wt% de microesferas, segundo a EOS).',
    'formlabs-nylon-12-powder':
      'O Formlabs Nylon 12 Powder é o PA12 padrão da série Fuse de SLS: 50 MPa de resistência máxima à tração, 1850 MPa de módulo de tração e 11% de alongamento na ruptura (X/Y), conforme a ficha técnica da Formlabs, com HDT de 171 °C a 0.45 MPa.',
    'formlabs-nylon-11-powder':
      'O Formlabs Nylon 11 Powder é um PA11 de base biológica para a série Fuse, feito para peças que flexionam ou sofrem impacto: 49 MPa de resistência à tração, 1600 MPa de módulo e 40% de alongamento na ruptura (X/Y), conforme a ficha técnica da Formlabs — o pó mais dúctil da linha Formlabs.',
    'hp-pa-12':
      'O HP 3D High Reusability PA 12 é o nylon padrão para Multi Jet Fusion: 54 MPa de resistência à tração, 2150 MPa de módulo de tração e 18% de alongamento na ruptura em XY (10% em Z), com densidade de 1.02 g/cm³, conforme a ficha técnica da HP.',
  },
  coverageHeading: 'Cobertura até agora — dita com franqueza',
  coverageBody:
    'Esta é a v1 da referência, publicada em novembro de 2026: {materials} materiais, {machines} máquinas, 3 processos em profundidade mais uma comparação, 3 guias e {glossary} termos de glossário. O objetivo é o panorama completo do nylon — cada pó, filamento e máquina relevantes, cada grande área de aplicação — construído em etapas verificadas. O que ainda não está coberto não é chutado: está na fila. O padrão de cada página está na <a href="/editorial/">política editorial e de fontes</a>.',
  trustHeading: 'Por que confiar nos números daqui?',
  trustBody:
    'Porque cada um nomeia a sua fonte. As tabelas de propriedades reproduzem as fichas técnicas dos fabricantes (EOS, Formlabs, HP, BASF, Polymaker, Bambu Lab) com o método de ensaio ao lado do valor; as especificações das máquinas vêm dos documentos de especificação dos fabricantes; os mínimos de design, dos guias oficiais de design. Se um fabricante não publica um valor, a tabela o omite em vez de preencher a lacuna. Correções são bem-vindas em <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a>.',
  updatedLine: 'Última atualização: novembro de 2026',
};

const ja: HomeCopy = {
  title: 'Nylon3DP — ナイロン3Dプリントのリファレンス：PA11・PA12・SLS・MJF',
  description:
    'ナイロン3Dプリントの総合リファレンス。PA11/PA12のメーカー公式データシートに基づく材料データベース、SLS・MJF・SAF・FDMの各プロセス、装置仕様と設計ガイドを収録しています。',
  heroTitle: 'ナイロン3Dプリントのリファレンス',
  heroLede:
    'ナイロンは、3Dプリントが実際にものづくりに使うエンジニアリングポリマーです。しかしそのデータは、メーカー各社のデータシートに散らばっています。Nylon3DPはそれを一か所に集約します。PA11、PA12、PA6、充填ナイロンの材料特性、装置仕様、プロセス解説、設計ガイドを収録し、すべての数値はメーカー自身のドキュメントまでたどることができます。',
  qaLabel: 'クイックアンサー ― ナイロン3Dプリントとは？',
  qaBody:
    'ナイロン（ポリアミド）3Dプリントとは、PA12、PA11、PA6、または充填ナイロングレードから部品を作ることです。主流は粉末床溶融結合（パウダーベッドフュージョン）である<a href="/processes/sls/">SLS</a>と<a href="/processes/mjf/">MJF</a>、あるいはナイロンフィラメントを押し出す<a href="/processes/fdm/">FDM</a>です。造形したナイロンは靭性が高く、耐摩耗性に優れ、適度な耐熱性も備えるため、ヒンジ、クリップ、ギア、ダクト、ブラケット、治具、装具といった機能性最終部品の標準的な選択肢となっています。PA12が標準グレード、PA11は延性に優れたバイオベースの代替グレードです。',
  startHeading: 'データベースから始める',
  cards: {
    materials: {
      title: '材料データベース',
      body: '{materials}種類のナイロングレードを、データシートの全項目付きで収録 — 粉末はEOS、Formlabs、HP、BASF、フィラメントはPolymakerとBambu Lab。',
      meta: 'PA12 ・ PA11 ・ PA6 ・ ガラス充填 ・ PA-CF ・ CoPA',
    },
    machines: {
      title: '装置データベース',
      body: 'メーカー確認済みの造形体積と積層仕様を備えた、粉末床方式の装置{machines}機種。',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: 'プロセス',
      body: 'SLS、MJF、SAF、ナイロンFDMの仕組み、各プロセスが使う材料、適した用途を解説。出典を明記したSLSとMJFの比較も収録しています。',
      meta: 'SLS ・ MJF ・ SAF ・ FDM',
    },
    guides: {
      title: 'ガイド',
      body: 'PA11とPA12をデータシートの数値で比較判断すること、ナイロンフィラメントをメーカー設定で乾燥させること、公式設計ガイドに基づくSLS・MJF向け部品設計を扱います。',
      meta: '公開時3本、順次追加',
    },
    glossary: {
      title: '用語集',
      body: 'リフレッシュ比率、ガラス充填、吸湿性、HDTなど、データシートが前提とする用語を{glossary}項目定義しています。',
      meta: '平易な言葉で、データベースと照合済み',
    },
    compare: {
      title: 'SLS vs MJF',
      body: '量産向け粉末プロセスの2方式を、各メーカー自身のPA12データで比較します：強度、等方性、色、材料、経済性。',
      meta: '比較',
    },
  },
  featuredHeading: '注目の材料',
  featuredTeasers: {
    'eos-pa-2200':
      'EOS PA 2200は、選択的レーザー焼結（SLS）の基準となるPA12粉末です。バランスの取れた無充填のナイロン12で、引張強さ48 MPa（XY）、引張弾性率1650 MPa、XY面での破断伸び18%を備えます（現行のEOS材料データシートによる）。',
    'eos-pa-1101': 'EOS PA 1101は、ヒマシ油由来のバイオベースPA11のSLS用粉末です。',
    'eos-pa-3200-gf':
      'EOS PA 3200 GFは、ガラスビーズを充填したPA12のSLS用粉末です（EOSによればガラスビーズ40 wt%）。',
    'formlabs-nylon-12-powder':
      'Formlabs Nylon 12 Powderは、FuseシリーズSLSの標準PA12です。引張強さ50 MPa、引張弾性率1850 MPa、破断伸び11%（X/Y）を備え、HDTは0.45 MPaで171 °Cです（Formlabsの技術データシートによる）。',
    'formlabs-nylon-11-powder':
      'Formlabs Nylon 11 Powderは、Fuseシリーズ向けのバイオベースPA11で、曲げや衝撃を受ける部品のために設計されています。引張強さ49 MPa、弾性率1600 MPa、破断伸び40%（X/Y）を備え、Formlabsの製品群で最も延性の高い粉末です（Formlabsの技術データシートによる）。',
    'hp-pa-12':
      'HP 3D High Reusability PA 12は、Multi Jet Fusionの標準ナイロンです。引張強さ54 MPa、引張弾性率2150 MPa、破断伸びはXYで18%（Zで10%）、密度1.02 g/cm³です（HPの技術データシートによる）。',
  },
  coverageHeading: '現在のカバレッジ ― 率直に',
  coverageBody:
    '本サイトは、2026年11月に公開したリファレンスのv1です。材料{materials}種、装置{machines}機種、プロセス解説3本と比較1本、ガイド3本、用語{glossary}項目を収録しています。目標はナイロンの全体像 — 主要な粉末、フィラメント、装置のすべてと、主要な応用分野のすべて — を、検証済みの段階を積み重ねて構築することです。まだカバーしていないものは推測で埋めず、キューに入れています。各ページの基準は<a href="/editorial/">編集・出典ポリシー</a>に記載しています。',
  trustHeading: 'なぜここの数値を信頼できるのか',
  trustBody:
    'すべての数値に出典があるからです。特性表はメーカーのデータシート（EOS、Formlabs、HP、BASF、Polymaker、Bambu Lab）を再現し、値の横に試験方法を併記しています。装置仕様はメーカーの仕様書、設計最小値は公式設計ガイドが出典です。メーカーが公表していない値は、空白を埋めずに表から省いています。修正のご連絡は <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a> までお寄せください。',
  updatedLine: '最終更新：2026年11月',
};

const zh: HomeCopy = {
  title: 'Nylon3DP — 尼龙3D打印参考：PA11、PA12、SLS、MJF',
  description:
    '尼龙3D打印综合参考：基于厂家数据手册的PA11/PA12材料数据库、SLS、MJF、SAF与FDM工艺、设备规格与设计指南，每个数字均可溯源至厂家文档。',
  heroTitle: '尼龙3D打印参考',
  heroLede:
    '尼龙是3D打印真正用来制造功能零件的工程聚合物，但它的数据散落在几十家厂家的材料数据手册里。Nylon3DP把这些数据汇集到一处：PA11、PA12、PA6与填充尼龙的材料性能、设备规格、工艺讲解与设计指南，每个数字都能溯源到厂家自己的文档。',
  qaLabel: '快速解答——什么是尼龙3D打印？',
  qaBody:
    '尼龙（聚酰胺）3D打印是指用PA12、PA11、PA6或填充尼龙牌号制造零件，主要采用粉末床熔融工艺——<a href="/processes/sls/">SLS</a>和<a href="/processes/mjf/">MJF</a>——或挤出尼龙线材的<a href="/processes/fdm/">FDM</a>。打印出的尼龙韧性好、耐磨、耐热性适中，因此成为功能性最终用途零件的默认选择：铰链、卡扣、齿轮、风管、支架、工装夹具和矫形器。PA12是标准牌号；PA11是韧性更好、生物基的替代牌号。',
  startHeading: '从数据库开始',
  cards: {
    materials: {
      title: '材料数据库',
      body: '{materials}个尼龙牌号，附完整数据手册参数表——粉末来自EOS、Formlabs、HP和BASF，线材来自Polymaker和Bambu Lab。',
      meta: 'PA12 · PA11 · PA6 · 玻纤填充 · PA-CF · CoPA',
    },
    machines: {
      title: '设备数据库',
      body: '{machines}台粉末床设备，成型尺寸与层厚规格均经厂家核实。',
      meta: 'HP Jet Fusion · EOS Formiga · Formlabs Fuse · Stratasys H350',
    },
    processes: {
      title: '工艺',
      body: 'SLS、MJF、SAF与尼龙FDM如何工作、各自使用哪些材料、适合什么场景，另有附来源的SLS与MJF对比。',
      meta: 'SLS · MJF · SAF · FDM',
    },
    guides: {
      title: '指南',
      body: '用数据手册的数字判定PA11与PA12；按厂家参数干燥尼龙线材；依据官方设计指南为SLS与MJF设计零件。',
      meta: '上线时3篇，持续增加',
    },
    glossary: {
      title: '术语表',
      body: '{glossary}条定义——刷新比、玻纤填充、吸湿性、HDT，以及数据手册里默认你已经懂的其余术语。',
      meta: '通俗表述，并与数据库交叉核对',
    },
    compare: {
      title: 'SLS 与 MJF 对比',
      body: '用两大工艺各自厂家的PA12数据，对比两种生产级粉末工艺：强度、各向同性、颜色、材料与经济性。',
      meta: '对比',
    },
  },
  featuredHeading: '精选材料',
  featuredTeasers: {
    'eos-pa-2200':
      'EOS PA 2200是选择性激光烧结的基准PA12粉末：一种性能均衡的无填充尼龙12，拉伸强度48 MPa（XY）、拉伸模量1650 MPa、XY平面断裂伸长率18%，数据来自EOS现行材料数据手册。',
    'eos-pa-1101': 'EOS PA 1101是一种生物基PA11 SLS粉末，源自蓖麻油。',
    'eos-pa-3200-gf': 'EOS PA 3200 GF是一种玻璃微珠填充的PA12 SLS粉末（据EOS数据，玻璃微珠含量为40 wt%）。',
    'formlabs-nylon-12-powder':
      'Formlabs Nylon 12 Powder是Fuse系列SLS的标准PA12：极限拉伸强度50 MPa、拉伸模量1850 MPa、断裂伸长率11%（X/Y），HDT为171 °C（0.45 MPa），数据来自Formlabs技术数据手册。',
    'formlabs-nylon-11-powder':
      'Formlabs Nylon 11 Powder是Fuse系列的生物基PA11，专为需要弯折或承受冲击的零件而设计：拉伸强度49 MPa、模量1600 MPa、断裂伸长率40%（X/Y），是Formlabs产品线中韧性最好的粉末，数据来自Formlabs技术数据手册。',
    'hp-pa-12':
      'HP 3D High Reusability PA 12是Multi Jet Fusion的标准尼龙：拉伸强度54 MPa、拉伸模量2150 MPa、断裂伸长率XY方向18%（Z方向10%），密度1.02 g/cm³，数据来自HP技术数据手册。',
  },
  coverageHeading: '目前的覆盖范围——如实说明',
  coverageBody:
    '这是本参考站的v1，于2026年11月发布：{materials}种材料、{machines}台设备、3篇工艺深度解析加1篇对比、3篇指南、{glossary}条术语。目标是完整的尼龙全景——每种重要的粉末、线材和设备，每个主要应用领域——以经过核实的步骤逐步建成。尚未覆盖的内容不会凭猜测填充，而是排入队列。每一页的标准见<a href="/editorial/">编辑与来源政策</a>。',
  trustHeading: '为什么可以信任这里的数字？',
  trustBody:
    '因为每个数字都注明了来源。性能表复现厂家数据手册（EOS、Formlabs、HP、BASF、Polymaker、Bambu Lab），并在数值旁保留测试方法；设备规格来自厂家的规格文档；设计最小值来自官方设计指南。如果厂家没有公布某个数值，表格会将其省略，而不是填补空白。欢迎通过 <a href="mailto:cqq365@gmail.com">cqq365@gmail.com</a> 提出更正。',
  updatedLine: '最后更新：2026年11月',
};

export const HOME_COPY: Record<AnyLocale, HomeCopy> = { en, de, es, pt, ja, zh };
