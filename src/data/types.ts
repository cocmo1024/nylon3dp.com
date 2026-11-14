// Shared data-layer types (rebuild batch B0).
// StructuredSpec is the machine-readable form of a legacy free-text
// property/spec string: the numeric value, its unit and — where the
// manufacturer states them — the test standard and specimen orientation.
// CONSERVATION RULE: a StructuredSpec may only be parsed out of numbers
// that already appear verbatim in the entity's legacy property/spec
// strings (label, value or note). scripts/validate-data.mjs proves this
// for every material and machine on every `npm run verify`.

export interface StructuredSpec {
  /** Canonical spec key, e.g. 'tensileStrength', 'hdt', 'buildVolumeX'. */
  key: string;
  /** Display label, e.g. 'Tensile strength'. */
  label: string;
  /** Numeric value, copied verbatim from the legacy string (never rounded or converted). */
  value: number;
  /** Unit as printed by the manufacturer, e.g. 'MPa', '%', 'g/cm³', '°C', 'µm', 'mm'. */
  unit: string;
  /** Test standard where the legacy string states one, e.g. 'ISO 527-1/-2'. */
  standard?: string;
  /** Specimen orientation where direction-dependent, e.g. 'XY', 'Z', 'X-Y'. */
  orientation?: string;
  /** Qualifiers carried over from the legacy note, e.g. '@ 1.8 MPa', 'Dry'. */
  note?: string;
}

export interface DataSource {
  label: string;
  url: string;
}
