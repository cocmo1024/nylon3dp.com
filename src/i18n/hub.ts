// Database hub chrome copy (rebuild batch B5 — German index pilot).
//
// The material and machine index pages exist in English (root) and
// German (/de/…) — the first database pages to be localized, per the
// GOAL.md sequence (hubs before entity pages). The data layer is shared:
// entity names, data values, filter VALUES and payload values are
// identical in both locales; only the chrome around them (titles,
// intros, table headers, filter labels, methodology notes, the client
// island's strings) is translated here. Entity pages stay English-only
// for now, so the German hubs carry no hreflang to entity pages — the
// hreflang pairs below cover exactly the two index pairs that exist.

import { LOCALE_META, type AnyLocale } from './home';

export type HubLocale = 'en' | 'de';
export const HUB_LOCALES: HubLocale[] = ['en', 'de'];

export const hubUrl = (locale: HubLocale, base: '/materials/' | '/machines/') =>
  `https://nylon3dp.com${LOCALE_META[locale as AnyLocale].prefix}${base}`;

/** hreflang pair for a database index that exists in English and German. */
export const indexAlternates = (base: '/materials/' | '/machines/') => [
  { hreflang: 'en', href: hubUrl('en', base) },
  { hreflang: 'de', href: hubUrl('de', base) },
  { hreflang: 'x-default', href: hubUrl('en', base) },
];

/** Strings the hub client island renders (serialized into the payload). */
export interface HubUiStrings {
  /** '{visible} of {total} {noun} — filters active' pattern */
  countFiltered: string;
  selected: string;
  selectedMore: string;
}

export interface MaterialsHubCopy {
  title: string;
  description: string;
  crumbHome: string;
  crumbHere: string;
  h1: string;
  qaLabel: string;
  qaBody: string;
  /** HTML with {materials} and {makers} tokens */
  coverageHtml: string;
  allHeading: string;
  /** HTML; carries the /compare/materials/ link */
  allIntroHtml: string;
  filters: {
    process: string;
    allProcesses: string;
    polymer: string;
    allPolymers: string;
    form: string;
    allForms: string;
    /** display labels for the data values 'Powder' / 'Filament' */
    formLabels: Record<string, string>;
    vendor: string;
    allVendors: string;
    filler: string;
    allFiller: string;
    fillerLabels: Record<string, string>;
    tsLabel: string;
    hdtLabel: string;
    tsPlaceholder: string;
    hdtPlaceholder: string;
  };
  reset: string;
  /** payload noun + initial result-count noun ('materials' / 'Materialien') */
  noun: string;
  compareSr: string;
  /** aria-label template for a row's compare checkbox, {name} token */
  compareAria: string;
  compareSelected: string;
  clearSelection: string;
  noMatches: string;
  /** column headers in COLUMNS order */
  columns: string[];
  afterNote: string;
  howHeading: string;
  /** HTML */
  howBodyHtml: string;
  updatedLine: string;
  datasetName: string;
  /** with a {materials} token */
  datasetDescription: string;
  ui: HubUiStrings;
}

export interface MachinesHubCopy {
  title: string;
  description: string;
  crumbHome: string;
  crumbHere: string;
  h1: string;
  qaLabel: string;
  qaBody: string;
  /** HTML with a {machines} token */
  coverageHtml: string;
  allHeading: string;
  /** HTML; carries the /compare/machines/ link */
  allIntroHtml: string;
  filters: {
    process: string;
    allProcesses: string;
    vendor: string;
    allVendors: string;
    envelopeLabel: string;
    envelopePlaceholder: string;
  };
  reset: string;
  noun: string;
  compareSr: string;
  compareAria: string;
  compareSelected: string;
  clearSelection: string;
  noMatches: string;
  columns: string[];
  /** fallback cell text when a datasheet lists layer values as text */
  layerFallback: string;
  afterNote: string;
  updatedLine: string;
  datasetName: string;
  /** with a {machines} token */
  datasetDescription: string;
  ui: HubUiStrings;
}

const enMaterials: MaterialsHubCopy = {
  title: 'Nylon 3D Printing Materials Database — PA11, PA12, PA6 | Nylon3DP',
  description:
    'Datasheet-verified nylon materials: PA12, PA11, glass-filled PA12 and PA6 powders plus PA-CF and CoPA filaments from EOS, Formlabs, HP, BASF and more.',
  crumbHome: 'Home',
  crumbHere: 'Materials',
  h1: 'Nylon material database',
  qaLabel: 'Quick answer',
  qaBody:
    "PA12 (polyamide 12) is the most widely used nylon in 3D printing — the standard powder polymer for SLS and MJF, balanced in strength, stiffness and elongation, with low moisture uptake for a nylon; PA11 is its more ductile, bio-based counterpart. Every nylon grade in this database has its own page with a property table taken from the manufacturer's own datasheet — PA12 and PA11 powders for SLS and MJF, glass-filled grades for stiffness, and PA6-CF / CoPA filaments for FDM. No reseller numbers, no estimates: if the manufacturer does not publish a value, the table leaves it out.",
  coverageHtml:
    'Coverage so far: {materials} grades from {makers}. The database is expanding in stages toward the full nylon landscape — powders, filaments and pellets across all major suppliers — and each addition follows the same rule: a manufacturer datasheet, or it does not go in.',
  allHeading: 'All materials',
  allIntroHtml:
    'Filter and sort the database below, or tick up to four grades and open them in the <a href="/compare/materials/">material comparison tool</a> for a full side-by-side datasheet table.',
  filters: {
    process: 'Process',
    allProcesses: 'All processes',
    polymer: 'Polymer',
    allPolymers: 'All polymers',
    form: 'Form',
    allForms: 'All forms',
    formLabels: {},
    vendor: 'Manufacturer',
    allVendors: 'All manufacturers',
    filler: 'Filler',
    allFiller: 'Any filler',
    fillerLabels: {
      Unfilled: 'Unfilled',
      GF: 'Glass-filled (GF)',
      CF: 'Carbon fibre (CF)',
      GB: 'Glass beads (GB)',
    },
    tsLabel: 'Min. tensile strength (MPa)',
    hdtLabel: 'Min. HDT at 1.8 MPa (°C)',
    tsPlaceholder: 'e.g. 50',
    hdtPlaceholder: 'e.g. 100',
  },
  reset: 'Reset filters',
  noun: 'materials',
  compareSr: 'Select to compare',
  compareAria: 'Compare {name}',
  compareSelected: 'Compare selected',
  clearSelection: 'Clear selection',
  noMatches: 'No materials match the current filters.',
  columns: [
    'Material',
    'Manufacturer',
    'Polymer',
    'Form',
    'Process',
    'Tensile strength (MPa)',
    'Tensile modulus (MPa)',
    'Elongation at break (%)',
    'HDT (°C)',
    'Density (g/cm³)',
  ],
  afterNote:
    "Key values are the in-plane (XY / X) variant where a datasheet splits by orientation, and the HDT at 1.8 MPa where two loads are published. Full property sets, all orientations and test methods are on each grade's own page. Grades whose datasheet does not publish a value never pass a minimum-value filter for it.",
  howHeading: 'How to read the tables',
  howBodyHtml:
    'Powder datasheets from EOS use ISO 527 test methods and report "strain at break"; Formlabs and HP typically report ASTM methods. Cross-brand comparisons are therefore indicative rather than laboratory-controlled — each page keeps the manufacturer\'s own test method next to every value so you can judge comparability yourself. New to the grades themselves? Start with <a href="/guides/pa11-vs-pa12/">PA11 vs PA12</a> and the <a href="/glossary/">glossary</a>.',
  updatedLine: 'Last updated: November 2026',
  datasetName: 'Nylon 3D Printing Materials Database',
  datasetDescription:
    "Property data for {materials} nylon 3D printing materials — PA11, PA12, PA6 and carbon-fibre-reinforced grades for SLS, MJF and FDM. Every value is taken from the manufacturer's own technical data sheet, and the source document is cited on each entry page; values a manufacturer does not publish are omitted rather than estimated.",
  ui: {
    countFiltered: 'Showing {visible} of {total} {noun} — filters active',
    selected: '{n} selected',
    selectedMore: '{n} selected — pick {m} more to compare',
  },
};

const deMaterials: MaterialsHubCopy = {
  title: 'Nylon-Materialdatenbank — PA11, PA12, PA6 | Nylon3DP',
  description:
    'Nylon-Materialien mit Datenblatt-Werten: PA12- und PA11-Pulver für SLS und MJF, glasgefüllte Typen, PA6-CF- und CoPA-Filamente von EOS, Formlabs, HP und BASF.',
  crumbHome: 'Startseite',
  crumbHere: 'Materialien',
  h1: 'Nylon-Materialdatenbank',
  qaLabel: 'Kurze Antwort',
  qaBody:
    'PA12 (Polyamid 12) ist das meistverwendete Nylon im 3D-Druck — das Standard-Pulverpolymer für SLS und MJF, ausgewogen in Festigkeit, Steifigkeit und Dehnung, mit für ein Nylon geringer Feuchtigkeitsaufnahme; PA11 ist sein duktileres, biobasiertes Gegenstück. Jeder Nylon-Typ in dieser Datenbank hat eine eigene Seite mit einer Eigenschaftstabelle aus dem Datenblatt des Herstellers — PA12- und PA11-Pulver für SLS und MJF, glasgefüllte Typen für Steifigkeit sowie PA6-CF- und CoPA-Filamente für FDM. Keine Händlerzahlen, keine Schätzungen: Veröffentlicht ein Hersteller einen Wert nicht, lässt die Tabelle ihn aus.',
  coverageHtml:
    'Aktueller Stand: {materials} Typen von {makers}. Die Datenbank wächst in Stufen auf die vollständige Nylon-Landschaft zu — Pulver, Filamente und Pellets aller großen Anbieter — und jede Aufnahme folgt derselben Regel: ein Herstellerdatenblatt, sonst kommt sie nicht hinein.',
  allHeading: 'Alle Materialien',
  allIntroHtml:
    'Filtern und sortieren Sie die Datenbank unten, oder markieren Sie bis zu vier Typen und öffnen Sie sie im <a href="/compare/materials/">Materialvergleich</a> (auf Englisch) für eine vollständige Datenblatt-Tabelle Seite an Seite.',
  filters: {
    process: 'Verfahren',
    allProcesses: 'Alle Verfahren',
    polymer: 'Polymer',
    allPolymers: 'Alle Polymere',
    form: 'Form',
    allForms: 'Alle Formen',
    formLabels: { Powder: 'Pulver', Filament: 'Filament' },
    vendor: 'Hersteller',
    allVendors: 'Alle Hersteller',
    filler: 'Füllstoff',
    allFiller: 'Alle Füllstoffe',
    fillerLabels: {
      Unfilled: 'Ungefüllt',
      GF: 'Glasfaser (GF)',
      CF: 'Carbonfaser (CF)',
      GB: 'Glaskugeln (GB)',
    },
    tsLabel: 'Min. Zugfestigkeit (MPa)',
    hdtLabel: 'Min. HDT bei 1,8 MPa (°C)',
    tsPlaceholder: 'z. B. 50',
    hdtPlaceholder: 'z. B. 100',
  },
  reset: 'Filter zurücksetzen',
  noun: 'Materialien',
  compareSr: 'Zum Vergleich auswählen',
  compareAria: '{name} vergleichen',
  compareSelected: 'Auswahl vergleichen',
  clearSelection: 'Auswahl leeren',
  noMatches: 'Keine Materialien entsprechen den aktuellen Filtern.',
  columns: [
    'Material',
    'Hersteller',
    'Polymer',
    'Form',
    'Verfahren',
    'Zugfestigkeit (MPa)',
    'Zugmodul (MPa)',
    'Bruchdehnung (%)',
    'HDT (°C)',
    'Dichte (g/cm³)',
  ],
  afterNote:
    'Die Kennwerte sind die Variante in der Ebene (XY / X), wenn ein Datenblatt nach Richtung aufteilt, und die HDT bei 1,8 MPa, wenn zwei Lasten veröffentlicht sind. Die vollständigen Eigenschaftssätze mit allen Richtungen und Prüfverfahren stehen auf der Seite jedes Typs (auf Englisch). Typen, deren Datenblatt einen Wert nicht veröffentlicht, bestehen einen Mindestwert-Filter für diesen Wert nie.',
  howHeading: 'So lesen Sie die Tabellen',
  howBodyHtml:
    'Pulver-Datenblätter von EOS nutzen ISO-527-Prüfverfahren und geben die Bruchdehnung an; Formlabs und HP geben typischerweise ASTM-Verfahren an. Vergleiche zwischen Marken sind daher Anhaltswerte und keine Laborvergleiche — jede Seite führt das Prüfverfahren des Herstellers direkt neben jedem Wert, damit Sie die Vergleichbarkeit selbst beurteilen können. Neu bei den Typen selbst? Beginnen Sie mit <a href="/guides/pa11-vs-pa12/">PA11 vs. PA12</a> (auf Englisch) und dem <a href="/glossary/">Glossar</a> (auf Englisch).',
  updatedLine: 'Zuletzt aktualisiert: November 2026',
  datasetName: 'Datenbank für Nylon-3D-Druckmaterialien',
  datasetDescription:
    'Eigenschaftsdaten für {materials} Nylon-3D-Druckmaterialien — PA11, PA12, PA6 und carbonfaserverstärkte Typen für SLS, MJF und FDM. Jeder Wert stammt aus dem technischen Datenblatt des Herstellers, und das Quelldokument ist auf jeder Eintragsseite zitiert; Werte, die ein Hersteller nicht veröffentlicht, werden weggelassen statt geschätzt.',
  ui: {
    countFiltered: '{visible} von {total} {noun} — Filter aktiv',
    selected: '{n} ausgewählt',
    selectedMore: '{n} ausgewählt — noch {m} weitere zum Vergleich wählen',
  },
};

const enMachines: MachinesHubCopy = {
  title: 'Nylon 3D Printer Database — SLS, MJF & SAF Machines | Nylon3DP',
  description:
    'Manufacturer-verified specs for nylon printers: HP Jet Fusion 5200 (MJF), EOS P 396 and Formiga P 110, Formlabs Fuse 1+ 30W (SLS), Stratasys H350 (SAF).',
  crumbHome: 'Home',
  crumbHere: 'Machines',
  h1: 'Nylon 3D printer database',
  qaLabel: 'Quick answer',
  qaBody:
    "Professional nylon printing runs on powder-bed machines: SLS systems from EOS and Formlabs, HP's MJF platform, and Stratasys's SAF production printer. This database lists each machine's build volume, layer thickness and energy source exactly as the manufacturer states them.",
  coverageHtml:
    'Coverage so far: {machines} machines. The database expands toward the full landscape of nylon-capable systems — industrial SLS, MJF and SAF platforms first, then high-temperature FDM machines — and a machine is only listed once its specification sheet has been verified against the manufacturer\'s own documents.',
  allHeading: 'All machines',
  allIntroHtml:
    'Filter and sort the database below, or tick up to four machines and open them in the <a href="/compare/machines/">machine comparison tool</a> for a full side-by-side specification table.',
  filters: {
    process: 'Process',
    allProcesses: 'All processes',
    vendor: 'Manufacturer',
    allVendors: 'All manufacturers',
    envelopeLabel: 'Min. build volume, X × Y × Z (L)',
    envelopePlaceholder: 'e.g. 20',
  },
  reset: 'Reset filters',
  noun: 'machines',
  compareSr: 'Select to compare',
  compareAria: 'Compare {name}',
  compareSelected: 'Compare selected',
  clearSelection: 'Clear selection',
  noMatches: 'No machines match the current filters.',
  columns: [
    'Machine',
    'Manufacturer',
    'Process',
    'Build volume X × Y × Z (mm)',
    'Build capacity',
    'Layer thickness',
    'Laser power',
  ],
  layerFallback: 'Not stated by manufacturer',
  afterNote:
    "Build volume is the manufacturer's effective X × Y × Z figure; the full specification set, including technology and notes, is on each machine's own page. A dash means the manufacturer does not state the value in the documents this database cites. Sorting the build-volume column orders by the X × Y × Z envelope; layer thickness sorts in µm (HP's 0.08 mm counts as 80 µm).",
  updatedLine: 'Last updated: November 2026',
  datasetName: 'Nylon 3D Printing Machines Database',
  datasetDescription:
    "Manufacturer-verified specifications for {machines} nylon-capable 3D printers — SLS, MJF and SAF powder-bed systems. Every specification is taken from the manufacturer's own specification sheet or product documentation, and the source document is cited on each entry page; specifications a manufacturer does not state are omitted rather than estimated.",
  ui: {
    countFiltered: 'Showing {visible} of {total} {noun} — filters active',
    selected: '{n} selected',
    selectedMore: '{n} selected — pick {m} more to compare',
  },
};

const deMachines: MachinesHubCopy = {
  title: 'Datenbank für Nylon-3D-Drucker — SLS, MJF & SAF | Nylon3DP',
  description:
    'Herstellergeprüfte Daten für Nylon-Drucker: HP Jet Fusion 5200 (MJF), EOS P 396 und Formiga P 110, Formlabs Fuse 1+ 30W (SLS), Stratasys H350 (SAF).',
  crumbHome: 'Startseite',
  crumbHere: 'Maschinen',
  h1: 'Datenbank für Nylon-3D-Drucker',
  qaLabel: 'Kurze Antwort',
  qaBody:
    'Professioneller Nylon-Druck läuft auf Pulverbett-Anlagen: SLS-Systeme von EOS und Formlabs, die MJF-Plattform von HP und der SAF-Produktionsdrucker von Stratasys. Diese Datenbank führt Bauvolumen, Schichtdicke und Energiequelle jeder Anlage genau so, wie der Hersteller sie angibt.',
  coverageHtml:
    'Aktueller Stand: {machines} Maschinen. Die Datenbank wächst auf die vollständige Landschaft nylonfähiger Systeme zu — zuerst industrielle SLS-, MJF- und SAF-Plattformen, dann Hochtemperatur-FDM-Maschinen — und eine Anlage wird erst gelistet, wenn ihr Datenblatt anhand der Unterlagen des Herstellers geprüft wurde.',
  allHeading: 'Alle Maschinen',
  allIntroHtml:
    'Filtern und sortieren Sie die Datenbank unten, oder markieren Sie bis zu vier Maschinen und öffnen Sie sie im <a href="/compare/machines/">Maschinenvergleich</a> (auf Englisch) für eine vollständige Gegenüberstellung der Spezifikationen.',
  filters: {
    process: 'Verfahren',
    allProcesses: 'Alle Verfahren',
    vendor: 'Hersteller',
    allVendors: 'Alle Hersteller',
    envelopeLabel: 'Min. Bauvolumen, X × Y × Z (L)',
    envelopePlaceholder: 'z. B. 20',
  },
  reset: 'Filter zurücksetzen',
  noun: 'Maschinen',
  compareSr: 'Zum Vergleich auswählen',
  compareAria: '{name} vergleichen',
  compareSelected: 'Auswahl vergleichen',
  clearSelection: 'Auswahl leeren',
  noMatches: 'Keine Maschinen entsprechen den aktuellen Filtern.',
  columns: [
    'Maschine',
    'Hersteller',
    'Verfahren',
    'Bauvolumen X × Y × Z (mm)',
    'Baukapazität',
    'Schichtdicke',
    'Laserleistung',
  ],
  layerFallback: 'Vom Hersteller nicht angegeben',
  afterNote:
    'Das Bauvolumen ist die wirksame X × Y × Z-Angabe des Herstellers; der vollständige Spezifikationssatz einschließlich Technologie und Anmerkungen steht auf der Seite jeder Anlage (auf Englisch). Ein Strich bedeutet: Der Hersteller gibt den Wert in den hier zitierten Unterlagen nicht an. Die Sortierung der Bauvolumen-Spalte ordnet nach der X × Y × Z-Hülle; die Schichtdicke sortiert in µm (HPs 0,08 mm zählen als 80 µm).',
  updatedLine: 'Zuletzt aktualisiert: November 2026',
  datasetName: 'Datenbank für Nylon-3D-Drucker',
  datasetDescription:
    'Herstellergeprüfte Spezifikationen für {machines} nylonfähige 3D-Drucker — SLS-, MJF- und SAF-Pulverbett-Systeme. Jede Spezifikation stammt aus dem Datenblatt oder der Produktdokumentation des Herstellers, und das Quelldokument ist auf jeder Eintragsseite zitiert; Spezifikationen, die ein Hersteller nicht angibt, werden weggelassen statt geschätzt.',
  ui: {
    countFiltered: '{visible} von {total} {noun} — Filter aktiv',
    selected: '{n} ausgewählt',
    selectedMore: '{n} ausgewählt — noch {m} weitere zum Vergleich wählen',
  },
};

export const MATERIALS_HUB_COPY: Record<HubLocale, MaterialsHubCopy> = { en: enMaterials, de: deMaterials };
export const MACHINES_HUB_COPY: Record<HubLocale, MachinesHubCopy> = { en: enMachines, de: deMachines };
