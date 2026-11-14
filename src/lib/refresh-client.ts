// Client island for the powder refresh-ratio calculator (rebuild B4):
// /calculators/powder-refresh-ratio/.
//
// Implements exactly the definitions published on this site (glossary,
// "Refresh ratio"): the refresh ratio R is the proportion of virgin
// powder in the powder charged to a build —
//   R = V / T,  T = U + V
//   target mode:  V = U × R / (100 − R)   (R in %)
//   actual mode:  R = V / (U + V) × 100
// The downstream block assumes the next build is identical to this one
// (same charge, same fused part mass); the page states that assumption
// next to the form, and the surplus line is the steady-state discard.
//
// Everything runs client-side; nothing is stored or sent. Inputs are
// mirrored into the URL query string so a calculation is linkable.
// Without JavaScript the formula section and the worked example below
// the form remain the complete, readable answer.

interface Fields {
  mode: 'target' | 'actual';
  stock: 'cake' | 'direct';
  cake: number | null;
  parts: number | null;
  used: number | null;
  ratio: number | null;
  virgin: number | null;
}

const fmtKg = (v: number): string => {
  const r = Math.round(v * 100) / 100;
  return `${r.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`;
};
const fmtPct = (v: number): string => `${(Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;

function initRefresh(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-calc-form]');
  const errorsBox = root.querySelector<HTMLElement>('[data-errors]');
  const results = root.querySelector<HTMLElement>('[data-results]');
  if (!form || !errorsBox || !results) return;

  const input = (name: string): HTMLInputElement | null =>
    form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  const num = (name: string): number | null => {
    const el = input(name);
    if (!el || el.value.trim() === '') return null;
    const v = Number(el.value);
    return Number.isFinite(v) ? v : null;
  };
  const radio = (name: string): string =>
    form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? '';

  const groups = {
    stockCake: root.querySelector<HTMLElement>('[data-group-stock-cake]'),
    stockDirect: root.querySelector<HTMLElement>('[data-group-stock-direct]'),
    modeTarget: root.querySelector<HTMLElement>('[data-group-mode-target]'),
    modeActual: root.querySelector<HTMLElement>('[data-group-mode-actual]'),
  };

  const read = (): Fields => ({
    mode: radio('mode') === 'actual' ? 'actual' : 'target',
    stock: radio('stock') === 'direct' ? 'direct' : 'cake',
    cake: num('cake'),
    parts: num('parts'),
    used: num('used'),
    ratio: num('ratio'),
    virgin: num('virgin'),
  });

  const validate = (f: Fields): Map<string, string> => {
    const errs = new Map<string, string>();
    let usedAvail: number | null = null;
    if (f.stock === 'cake') {
      if (f.cake === null) errs.set('cake', 'Enter the cake mass — the total powder taken out of the machine after the last build.');
      else if (f.cake <= 0) errs.set('cake', 'Cake mass must be above 0 kg.');
      if (f.parts === null) errs.set('parts', 'Enter the fused part mass — weigh the finished parts from the last build.');
      else if (f.parts < 0) errs.set('parts', 'Fused part mass cannot be negative.');
      else if (f.cake !== null && f.parts >= f.cake) errs.set('parts', 'Fused part mass must be less than the cake mass — the cake is parts plus unfused powder.');
      if (!errs.has('cake') && !errs.has('parts')) usedAvail = (f.cake ?? 0) - (f.parts ?? 0);
    } else {
      if (f.used === null) errs.set('used', 'Enter the recovered used powder you have available.');
      else if (f.used <= 0) errs.set('used', 'Recovered used powder must be above 0 kg — with no used powder there is nothing to refresh.');
      usedAvail = f.used;
    }
    if (f.mode === 'target') {
      if (f.ratio === null) errs.set('ratio', 'Enter the target refresh ratio — the figure your material manufacturer specifies.');
      else if (f.ratio <= 0) errs.set('ratio', 'A 0% target means no virgin powder at all — that is not a refresh. Enter a ratio above 0%.');
      else if (f.ratio >= 100) errs.set('ratio', '100% virgin leaves no room for the recovered powder this calculation starts from. Enter a ratio below 100%.');
    } else {
      if (f.virgin === null) errs.set('virgin', 'Enter the virgin powder you added (0 is allowed and means a 0% refresh).');
      else if (f.virgin < 0) errs.set('virgin', 'Virgin powder added cannot be negative.');
    }
    if (usedAvail !== null && usedAvail <= 0) errs.set('parts', 'That leaves no recovered powder — the parts cannot account for the whole cake.');
    return errs;
  };

  const row = (tbody: HTMLElement, label: string, value: string, note?: string): void => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = label;
    const td = document.createElement('td');
    const val = document.createElement('span');
    val.className = 'num spec-val';
    val.textContent = value;
    td.appendChild(val);
    if (note) {
      const sub = document.createElement('span');
      sub.className = 'cmp-sub';
      sub.textContent = note;
      td.appendChild(sub);
    }
    tr.append(th, td);
    tbody.appendChild(tr);
  };

  const render = (): void => {
    const f = read();
    // Mode visibility (JS only — without JS every group stays visible
    // and labelled, next to the printed formula and worked example).
    if (groups.stockCake) groups.stockCake.hidden = f.stock !== 'cake';
    if (groups.stockDirect) groups.stockDirect.hidden = f.stock !== 'direct';
    if (groups.modeTarget) groups.modeTarget.hidden = f.mode !== 'target';
    if (groups.modeActual) groups.modeActual.hidden = f.mode !== 'actual';

    const errs = validate(f);
    form.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach((el) => {
      const bad = errs.has(el.name);
      el.toggleAttribute('aria-invalid', bad);
      el.classList.toggle('field-invalid', bad);
    });
    errorsBox.replaceChildren();
    results.replaceChildren();
    if (errs.size) {
      const p = document.createElement('p');
      p.className = 'calc-error';
      p.textContent = 'No result yet — fix the following:';
      const ul = document.createElement('ul');
      for (const msg of errs.values()) {
        const li = document.createElement('li');
        li.textContent = msg;
        ul.appendChild(li);
      }
      errorsBox.append(p, ul);
      const note = document.createElement('p');
      note.className = 'compare-status';
      note.textContent = 'Results appear here once every input above is valid. The worked example below the form shows a complete, hand-checked run.';
      results.appendChild(note);
      return;
    }

    const usedAvail = f.stock === 'cake' ? (f.cake ?? 0) - (f.parts ?? 0) : (f.used ?? 0);
    const partMass = f.stock === 'cake' ? (f.parts ?? 0) : null;

    let virgin: number;
    let ratio: number;
    let total: number;
    if (f.mode === 'target') {
      ratio = f.ratio ?? 0;
      virgin = (usedAvail * ratio) / (100 - ratio);
      total = usedAvail + virgin;
    } else {
      virgin = f.virgin ?? 0;
      total = usedAvail + virgin;
      ratio = (virgin / total) * 100;
    }

    const table = document.createElement('table');
    table.className = 'spec-table';
    const tbody = document.createElement('tbody');
    row(tbody, 'Recovered used powder available (U)', fmtKg(usedAvail),
      f.stock === 'cake' ? 'Cake mass minus fused part mass' : 'As entered');
    row(tbody, 'Virgin powder in the charge (V)', fmtKg(virgin),
      f.mode === 'target' ? 'Computed from the target ratio' : 'As entered');
    row(tbody, 'Total powder charge (T = U + V)', fmtKg(total));
    row(tbody, 'Effective refresh ratio (R = V ÷ T)', fmtPct(ratio),
      f.mode === 'target' ? 'Your target, confirmed' : 'The ratio this mix actually runs at');
    row(tbody, 'Charge split', `${fmtPct(ratio)} virgin / ${fmtPct(100 - ratio)} used`);

    if (partMass !== null) {
      const recovered = total - partMass;
      const drawNext = (total * (100 - ratio)) / 100;
      const surplus = recovered - drawNext;
      row(tbody, 'Unfused powder recovered after this build', fmtKg(recovered),
        'Charge minus fused parts — assumes this build fuses the same part mass as the last');
      row(tbody, 'Used powder the next identical build draws', fmtKg(drawNext));
      if (surplus >= 0) {
        row(tbody, 'Surplus aged powder per build (discard)', fmtKg(surplus),
          'Recovered powder beyond what the next build can take at this ratio — the discard stream');
        row(tbody, 'Virgin powder bought per build, steady state', fmtKg(partMass + surplus),
          'Fused parts plus discard. Cross-check: this equals the virgin powder in the charge above.');
      } else {
        row(tbody, 'Used-powder shortfall for the next build', fmtKg(-surplus),
          'This build returns less used powder than the next identical build draws — normal while a powder stock is being built up, or when builds are growing. The gap is covered with virgin powder, which lowers the effective ratio.');
      }
    } else {
      const note = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 2;
      td.textContent = 'Leftover and surplus figures need the fused part mass — switch the stock input above to “From cake and parts” to see them.';
      note.appendChild(td);
      tbody.appendChild(note);
    }
    table.appendChild(tbody);
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.appendChild(table);
    results.appendChild(scroll);
  };

  const syncUrl = (): void => {
    const f = read();
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null): void => {
      if (v === null || v === '') url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    };
    set('mode', f.mode);
    set('stock', f.stock);
    set('cake', input('cake')?.value ?? null);
    set('parts', input('parts')?.value ?? null);
    set('used', input('used')?.value ?? null);
    set('ratio', input('ratio')?.value ?? null);
    set('virgin', input('virgin')?.value ?? null);
    window.history.replaceState(null, '', url);
  };

  const applyUrl = (): void => {
    const params = new URLSearchParams(window.location.search);
    for (const name of ['cake', 'parts', 'used', 'ratio', 'virgin']) {
      const v = params.get(name);
      const el = input(name);
      if (v !== null && el) el.value = v;
    }
    for (const name of ['mode', 'stock']) {
      const v = params.get(name);
      if (v) {
        const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${v}"]`);
        if (el) el.checked = true;
      }
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    syncUrl();
    render();
  });
  form.addEventListener('input', () => {
    syncUrl();
    render();
  });
  form.addEventListener('change', () => {
    syncUrl();
    render();
  });
  window.addEventListener('popstate', () => {
    applyUrl();
    render();
  });

  applyUrl();
  render();
}

document.querySelectorAll<HTMLElement>('[data-calc-refresh]').forEach(initRefresh);
