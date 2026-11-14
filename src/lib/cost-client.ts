// Client island for the nylon part cost estimator (rebuild B4):
// /calculators/part-cost/.
//
// Model (stated in full on the page, before the tool):
//   m_part   = V × ρ                       (fused powder in one part)
//   m_virgin = m_part × (1 + w)            (w = refresh & ageing
//                                           allowance entered by the
//                                           visitor, as a fraction)
//   cost     = m_virgin × price
// Densities come from the materials data layer (structuredSpecs,
// serialised at build time by the page) — the same values the grade
// pages print. Powder prices are NOT in the database and are never
// defaulted: the visitor types the price they actually pay.
// Everything runs client-side; nothing is stored or sent. Inputs are
// mirrored into the URL query string so a calculation is linkable.

interface CalcGrade {
  slug: string;
  name: string;
  density: { value: number; unit: string; basis: string } | null;
  publishedRefresh: { ratio: number; basis: string } | null;
}

interface CostPayload {
  grades: CalcGrade[];
}

const fmt = (v: number, dp: number): string =>
  v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

function initCost(root: HTMLElement): void {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-calc-data]');
  if (!dataEl?.textContent) return;
  const payload = JSON.parse(dataEl.textContent) as CostPayload;
  const bySlug = new Map(payload.grades.map((g) => [g.slug, g]));

  const form = root.querySelector<HTMLFormElement>('[data-calc-form]');
  const errorsBox = root.querySelector<HTMLElement>('[data-errors]');
  const results = root.querySelector<HTMLElement>('[data-results]');
  const gradeNote = root.querySelector<HTMLElement>('[data-grade-note]');
  const densityNote = root.querySelector<HTMLElement>('[data-density-note]');
  if (!form || !errorsBox || !results) return;

  const select = form.querySelector<HTMLSelectElement>('select[name="grade"]');
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

  let interacted = new URLSearchParams(window.location.search).toString() !== '';

  const groups = {
    volDirect: root.querySelector<HTMLElement>('[data-group-vol-direct]'),
    volDims: root.querySelector<HTMLElement>('[data-group-vol-dims]'),
  };

  const applyGrade = (slug: string, forceDensity: boolean): void => {
    const g = bySlug.get(slug);
    if (!g) return;
    const densEl = input('density');
    if (gradeNote) {
      gradeNote.textContent = g.publishedRefresh
        ? `Published refresh figure for this grade: ${g.publishedRefresh.ratio}% — ${g.publishedRefresh.basis}`
        : 'No refresh ratio is published for this grade in the documents this database cites — the allowance below is yours to set.';
    }
    if (densityNote) {
      densityNote.textContent = g.density
        ? `Density pre-filled from the grade's datasheet value in our database (${g.density.value} ${g.density.unit}${g.density.basis ? `, ${g.density.basis}` : ''}). You can overwrite it.`
        : 'Our database holds no printed-part density for this grade, so the density field is yours to fill from the datasheet. (A bulk or apparent powder density is a different quantity and must not be used here.)';
    }
    if (densEl && (forceDensity || g.density)) {
      densEl.value = g.density ? String(g.density.value) : '';
    }
  };

  const readVolume = (): { vol: number | null; errs: Map<string, string> } => {
    const errs = new Map<string, string>();
    if (radio('vmode') === 'dims') {
      const l = num('dimL');
      const w = num('dimW');
      const h = num('dimH');
      const solid = num('solid');
      for (const [name, v] of [['dimL', l], ['dimW', w], ['dimH', h]] as const) {
        if (v === null) errs.set(name, 'Enter all three bounding-box dimensions.');
        else if (v <= 0) errs.set(name, 'Dimensions must be above 0 mm.');
      }
      if (solid === null) errs.set('solid', 'Enter the solid share of the bounding box (100% for a solid block).');
      else if (solid <= 0 || solid > 100) errs.set('solid', 'Solid share must be between 0 and 100%.');
      if (errs.size) return { vol: null, errs };
      return { vol: ((l ?? 0) * (w ?? 0) * (h ?? 0)) / 1000 * ((solid ?? 100) / 100), errs };
    }
    const v = num('volume');
    if (v === null) errs.set('volume', 'Enter the part’s solid volume — CAD reports it directly.');
    else if (v <= 0) errs.set('volume', 'Part volume must be above 0 cm³.');
    return { vol: v, errs };
  };

  const render = (): void => {
    const vmode = radio('vmode');
    if (groups.volDirect) groups.volDirect.hidden = vmode !== 'direct';
    if (groups.volDims) groups.volDims.hidden = vmode !== 'dims';

    const errs = new Map<string, string>();
    const { vol, errs: volErrs } = readVolume();
    for (const [k, v] of volErrs) errs.set(k, v);

    const density = num('density');
    if (density === null) errs.set('density', 'Enter the printed-part density — pick a grade whose datasheet value we hold, or type the figure from yours.');
    else if (density <= 0) errs.set('density', 'Density must be above 0 g/cm³.');

    const allowance = num('allowance');
    if (allowance === null) errs.set('allowance', 'Enter the refresh & ageing allowance (0% prices only the powder that ends up in the part).');
    else if (allowance < 0) errs.set('allowance', 'The allowance cannot be negative.');
    else if (allowance >= 1000) errs.set('allowance', 'That allowance is implausibly large — check the figure (it is a percentage).');

    const price = num('price');
    if (price === null) errs.set('price', 'Enter the powder price you actually pay, per kilogram — this site does not publish prices, so there is no default.');
    else if (price <= 0) errs.set('price', 'Powder price must be above 0 per kilogram.');

    const count = num('count');
    if (count === null) errs.set('count', 'Enter how many of this part one build produces.');
    else if (!Number.isInteger(count) || count < 1) errs.set('count', 'Parts per build must be a whole number of 1 or more.');

    form.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach((el) => {
      const bad = errs.has(el.name);
      el.toggleAttribute('aria-invalid', bad);
      el.classList.toggle('field-invalid', bad);
    });
    errorsBox.replaceChildren();
    results.replaceChildren();

    // First paint, untouched form: the only missing input is the
    // price (deliberately never defaulted) — prompt neutrally
    // instead of flagging an error the visitor has not made yet.
    const onlyPriceMissing = errs.size === 1 && errs.has('price') && input('price')?.value.trim() === '';
    if (errs.size && !interacted && onlyPriceMissing) {
      const note = document.createElement('p');
      note.className = 'compare-status';
      note.textContent = 'Pre-filled from the database: grade density and the worked example’s volume. Add the powder price you pay and the estimate updates live. The worked example below the form shows a complete run.';
      results.appendChild(note);
      return;
    }
    if (errs.size) {
      const p = document.createElement('p');
      p.className = 'calc-error';
      p.textContent = 'No estimate yet — fix the following:';
      const ul = document.createElement('ul');
      for (const msg of new Set(errs.values())) {
        const li = document.createElement('li');
        li.textContent = msg;
        ul.appendChild(li);
      }
      errorsBox.append(p, ul);
      const note = document.createElement('p');
      note.className = 'compare-status';
      note.textContent = 'The estimate appears here once every input above is valid.';
      results.appendChild(note);
      return;
    }

    const mPartG = (vol ?? 0) * (density ?? 0);
    const mVirginG = mPartG * (1 + (allowance ?? 0) / 100);
    const costPart = (mVirginG / 1000) * (price ?? 0);
    const n = count ?? 1;

    const table = document.createElement('table');
    table.className = 'spec-table';
    const tbody = document.createElement('tbody');
    const row = (label: string, value: string, note?: string): void => {
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
    row('Solid part volume (V)', `${fmt(vol ?? 0, 2)} cm³`,
      radio('vmode') === 'dims' ? 'Bounding box × solid share' : 'As entered');
    row('Fused powder per part (m = V × ρ)', `${fmt(mPartG, 1)} g`);
    row('Virgin powder per part (m × (1 + w))', `${fmt(mVirginG, 1)} g`,
      `Includes the ${fmt(allowance ?? 0, 1)}% refresh & ageing allowance`);
    row('Material cost per part', fmt(costPart, 2), 'In the currency of the price you entered');
    if (n > 1) {
      row(`Virgin powder per build (${n} parts)`, `${fmt((mVirginG * n) / 1000, 3)} kg`);
      row(`Material cost per build (${n} parts)`, fmt(costPart * n, 2), 'In the currency of the price you entered');
    }
    table.appendChild(tbody);
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.appendChild(table);
    results.appendChild(scroll);
    const disc = document.createElement('p');
    disc.className = 'muted';
    disc.textContent = 'Estimate only: material cost from your price and your machine’s powder behaviour — no machine time, labour, post-processing or failures included.';
    results.appendChild(disc);
  };

  const syncUrl = (): void => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null | undefined): void => {
      if (v === null || v === undefined || v === '') url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    };
    set('grade', select?.value);
    set('vmode', radio('vmode'));
    for (const name of ['volume', 'dimL', 'dimW', 'dimH', 'solid', 'density', 'allowance', 'price', 'count']) {
      set(name, input(name)?.value);
    }
    window.history.replaceState(null, '', url);
  };

  const applyUrl = (): void => {
    const params = new URLSearchParams(window.location.search);
    const grade = params.get('grade');
    if (grade && select && bySlug.has(grade)) select.value = grade;
    const vmode = params.get('vmode');
    if (vmode) {
      const el = form.querySelector<HTMLInputElement>(`input[name="vmode"][value="${vmode}"]`);
      if (el) el.checked = true;
    }
    for (const name of ['volume', 'dimL', 'dimW', 'dimH', 'solid', 'density', 'allowance', 'price', 'count']) {
      const v = params.get(name);
      const el = input(name);
      if (v !== null && el) el.value = v;
    }
  };

  select?.addEventListener('change', () => {
    interacted = true;
    applyGrade(select.value, true);
    syncUrl();
    render();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    interacted = true;
    syncUrl();
    render();
  });
  form.addEventListener('input', () => {
    interacted = true;
    syncUrl();
    render();
  });
  form.addEventListener('change', () => {
    syncUrl();
    render();
  });
  window.addEventListener('popstate', () => {
    applyUrl();
    if (select) applyGrade(select.value, false);
    render();
  });

  applyUrl();
  if (select) applyGrade(select.value, !new URLSearchParams(window.location.search).has('density'));
  render();
}

document.querySelectorAll<HTMLElement>('[data-calc-cost]').forEach(initCost);
