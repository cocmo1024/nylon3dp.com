// Client island for the comparison tool (rebuild batch B2):
// /compare/materials/ and /compare/machines/.
//
// Selection lives in the URL query string (?sel=slug,slug,…) so every
// comparison is linkable. The picker is a plain GET form — without JS it
// still submits and lands on the same URL with the selection in the
// query string; with JS the table renders live from the JSON payload
// serialised at build time from `structuredSpecs` (lib/payload.ts).
// Structured values only: ranges and text-only datasheet values stay on
// the entity pages (see the B2 incidentals decision in lib/specs.ts).

interface CompareSpec {
  key: string;
  label: string;
  value: number;
  unit: string;
  standard?: string;
  orientation?: string;
  note?: string;
}

interface CompareEntry {
  slug: string;
  name: string;
  manufacturer: string;
  quickAnswer: string;
  identity: { label: string; value: string }[];
  specs: CompareSpec[];
  buildVolume: string | null;
}

interface ComparePayload {
  kind: 'materials' | 'machines';
  base: string;
  entries: CompareEntry[];
}

const MAX = 4;
const AXIS_KEYS = new Set(['buildVolumeX', 'buildVolumeY', 'buildVolumeZ']);

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function excerpt(text: string, limit = 240): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > 80) return cut.slice(0, sentence + 1);
  const word = cut.lastIndexOf(' ');
  return `${cut.slice(0, word > 0 ? word : limit)}…`;
}

function initCompare(root: HTMLElement): void {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-compare-data]');
  if (!dataEl?.textContent) return;
  const payload = JSON.parse(dataEl.textContent) as ComparePayload;
  const bySlug = new Map(payload.entries.map((e) => [e.slug, e]));
  const form = root.querySelector<HTMLFormElement>('[data-picker]');
  const checks = [...root.querySelectorAll<HTMLInputElement>('input[name="sel"]')];
  const status = root.querySelector<HTMLElement>('[data-status]');
  const result = root.querySelector<HTMLElement>('[data-result]');
  if (!result || !status) return;

  const readSelection = (): { sel: string[]; notes: string[] } => {
    const notes: string[] = [];
    const raw = new URLSearchParams(window.location.search).get('sel') ?? '';
    const seen = new Set<string>();
    const sel: string[] = [];
    for (const slug of raw.split(',').map((s) => s.trim()).filter(Boolean)) {
      if (!bySlug.has(slug)) {
        notes.push(`"${slug}" is not in the database and was ignored`);
        continue;
      }
      if (seen.has(slug)) continue;
      seen.add(slug);
      sel.push(slug);
    }
    if (sel.length > MAX) {
      notes.push(`only the first ${MAX} are compared — the tool compares at most ${MAX} at a time`);
      sel.length = MAX;
    }
    return { sel, notes };
  };

  const missingCell = (): HTMLTableCellElement => {
    const td = el('td', 'cmp-missing');
    td.title = 'The manufacturer does not publish this value';
    td.textContent = '—';
    return td;
  };

  const render = (): void => {
    const { sel, notes } = readSelection();
    const noun = payload.kind === 'materials' ? 'materials' : 'machines';
    checks.forEach((c) => {
      c.checked = sel.includes(c.value);
      c.disabled = !c.checked && sel.length >= MAX;
    });
    result.replaceChildren();
    if (sel.length < 2) {
      status.textContent =
        sel.length === 0
          ? `Select 2–${MAX} ${noun} above to build a side-by-side comparison.${notes.length ? ` (${notes.join('; ')})` : ''}`
          : `One selected — pick at least one more to compare.${notes.length ? ` (${notes.join('; ')})` : ''}`;
      return;
    }
    status.textContent = `Comparing ${sel.length} ${noun}.${notes.length ? ` Note: ${notes.join('; ')}.` : ''}`;
    const entries = sel.map((s) => bySlug.get(s)!);

    const table = el('table', 'data-table compare-table');
    const thead = el('thead');
    const headRow = el('tr');
    headRow.appendChild(el('th', undefined, ''));
    for (const e of entries) {
      const th = el('th');
      th.scope = 'col';
      const a = el('a', undefined, e.name);
      a.href = `${payload.base}${e.slug}/`;
      th.appendChild(a);
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    const addRow = (label: string, fill: (td: HTMLTableCellElement, e: CompareEntry) => void): void => {
      const tr = el('tr');
      const th = el('th', undefined, label);
      th.scope = 'row';
      tr.appendChild(th);
      for (const e of entries) {
        const td = el('td');
        fill(td, e);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    };

    // Identity rows (union of labels, in first-appearance order).
    const identityLabels: string[] = [];
    for (const e of entries) {
      for (const i of e.identity) if (!identityLabels.includes(i.label)) identityLabels.push(i.label);
    }
    for (const label of identityLabels) {
      addRow(label, (td, e) => {
        const hit = e.identity.find((i) => i.label === label);
        if (hit) td.textContent = hit.value;
        else td.replaceWith(missingCell());
      });
    }

    // Machines: the three axis specs render as one build-volume row.
    if (payload.kind === 'machines') {
      addRow('Build volume X × Y × Z (mm)', (td, e) => {
        if (e.buildVolume) td.appendChild(el('span', 'num', e.buildVolume));
        else td.replaceWith(missingCell());
      });
    }

    // Spec union across the selected entries.
    const keyOrder: string[] = [];
    const keyLabel = new Map<string, string>();
    for (const e of entries) {
      for (const s of e.specs) {
        if (payload.kind === 'machines' && AXIS_KEYS.has(s.key)) continue;
        if (!keyOrder.includes(s.key)) {
          keyOrder.push(s.key);
          keyLabel.set(s.key, s.label);
        }
      }
    }
    for (const key of keyOrder) {
      addRow(keyLabel.get(key)!, (td, e) => {
        const specs = e.specs.filter((s) => s.key === key);
        if (!specs.length) {
          td.replaceWith(missingCell());
          return;
        }
        for (const s of specs) {
          const line = el('div', 'cmp-spec');
          line.appendChild(el('span', 'num', `${s.value} ${s.unit}`));
          const sub = [s.orientation, s.standard, s.note].filter(Boolean).join(' · ');
          if (sub) line.appendChild(el('span', 'cmp-sub', sub));
          td.appendChild(line);
        }
      });
    }

    addRow('Quick answer (excerpt)', (td, e) => {
      td.textContent = excerpt(e.quickAnswer);
    });
    addRow('Full datasheet page', (td, e) => {
      const a = el('a', undefined, `${e.name} — full data & sources`);
      a.href = `${payload.base}${e.slug}/`;
      td.appendChild(a);
    });

    table.appendChild(tbody);
    const scroll = el('div', 'table-scroll');
    scroll.appendChild(table);
    result.appendChild(scroll);
  };

  const syncFromChecks = (): void => {
    const sel = checks.filter((c) => c.checked).map((c) => c.value).slice(0, MAX);
    const url = new URL(window.location.href);
    if (sel.length) url.searchParams.set('sel', sel.join(','));
    else url.searchParams.delete('sel');
    window.history.replaceState(null, '', url);
    render();
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    syncFromChecks();
  });
  checks.forEach((c) => c.addEventListener('change', syncFromChecks));
  window.addEventListener('popstate', render);
  render();
}

document.querySelectorAll<HTMLElement>('[data-compare]').forEach(initCompare);
