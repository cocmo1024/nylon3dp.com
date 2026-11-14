// Client island for the database hub pages (rebuild batch B2): filtering,
// sorting and comparison selection on top of the server-rendered tables.
//
// Progressive enhancement contract: the static table is complete and
// readable with JS disabled; nothing is hidden in the shipped HTML. This
// script only ADDS behaviour after load — rows are hidden exclusively by
// toggling the `is-hidden` class from here, sort order is applied by
// re-appending existing rows, and the comparison bar starts `hidden` in
// markup and is revealed only when a selection exists.
//
// All values come from the JSON payload serialised at build time from
// `structuredSpecs` (see lib/payload.ts) — display strings are never
// parsed back into numbers.

interface HubRowPayload {
  f: Record<string, string>;
  s: Record<string, number | string | null>;
  [extra: string]: unknown;
}

interface HubPayload {
  kind: 'materials' | 'machines';
  noun: string;
  compareBase: string;
  /** Localised rendered strings (B5); templates carry {…} tokens. */
  ui?: { countFiltered?: string; selected?: string; selectedMore?: string };
  rows: Record<string, HubRowPayload>;
}

const fillTokens = (tpl: string, vals: Record<string, number | string>): string =>
  Object.entries(vals).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), tpl);

const MAX_COMPARE = 4;

function initHub(root: HTMLElement): void {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-hub-data]');
  if (!dataEl?.textContent) return;
  const payload = JSON.parse(dataEl.textContent) as HubPayload;
  const tbody = root.querySelector<HTMLTableSectionElement>('tbody');
  if (!tbody) return;
  const rows = [...tbody.querySelectorAll<HTMLTableRowElement>('tr[data-slug]')];
  const noMatches = tbody.querySelector<HTMLTableRowElement>('[data-no-matches]');
  const countEl = root.querySelector<HTMLElement>('[data-count]');
  const selects = [...root.querySelectorAll<HTMLSelectElement>('[data-filter]')];
  const numInputs = [...root.querySelectorAll<HTMLInputElement>('[data-filter-num]')];
  const form = root.querySelector<HTMLFormElement>('[data-filter-form]');
  form?.addEventListener('submit', (e) => e.preventDefault());

  const restripe = (visible: HTMLTableRowElement[]): void => {
    visible.forEach((r, i) => r.classList.toggle('alt', i % 2 === 1));
  };

  const applyFilters = (): void => {
    const activeSelects = selects
      .map((sel) => ({ key: sel.dataset.filter!, value: sel.value }))
      .filter((x) => x.value !== '');
    const activeNums = numInputs
      .map((inp) => ({ field: inp.dataset.filterNum!, min: Number.parseFloat(inp.value) }))
      .filter((x) => Number.isFinite(x.min));
    const visible: HTMLTableRowElement[] = [];
    for (const row of rows) {
      const p = payload.rows[row.dataset.slug!];
      if (!p) continue;
      let show = activeSelects.every(({ key, value }) => p.f[key] === value);
      if (show) {
        show = activeNums.every(({ field, min }) => {
          const v = p[field];
          return typeof v === 'number' && v >= min;
        });
      }
      row.classList.toggle('is-hidden', !show);
      if (show) visible.push(row);
    }
    if (noMatches) noMatches.hidden = visible.length !== 0;
    if (countEl) {
      countEl.textContent =
        visible.length === rows.length
          ? `${rows.length} ${payload.noun}`
          : fillTokens(payload.ui?.countFiltered ?? 'Showing {visible} of {total} {noun} — filters active', {
              visible: visible.length,
              total: rows.length,
              noun: payload.noun,
            });
    }
    restripe(visible);
  };

  selects.forEach((sel) => sel.addEventListener('change', applyFilters));
  numInputs.forEach((inp) => inp.addEventListener('input', applyFilters));
  root.querySelectorAll<HTMLButtonElement>('[data-reset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      selects.forEach((s) => (s.value = ''));
      numInputs.forEach((i) => (i.value = ''));
      applyFilters();
    }),
  );

  // --- sorting -------------------------------------------------------------
  let sortKey: string | null = null;
  let sortDir = 1;
  const compareVals = (a: number | string | null, b: number | string | null, dir: number): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1; // unpublished values always sort last
    if (b === null) return -1;
    if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir;
    return String(a).localeCompare(String(b)) * dir;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort!;
      sortDir = sortKey === key ? -sortDir : 1;
      sortKey = key;
      const sorted = [...rows].sort((ra, rb) => {
        const pa = payload.rows[ra.dataset.slug!];
        const pb = payload.rows[rb.dataset.slug!];
        return compareVals(pa?.s[key] ?? null, pb?.s[key] ?? null, sortDir);
      });
      for (const r of sorted) tbody.appendChild(r);
      if (noMatches) tbody.appendChild(noMatches);
      root.querySelectorAll('th[aria-sort]').forEach((th) => th.removeAttribute('aria-sort'));
      btn.closest('th')?.setAttribute('aria-sort', sortDir === 1 ? 'ascending' : 'descending');
      root.querySelectorAll('[data-sort]').forEach((b) => b.classList.toggle('sorted', b === btn));
      btn.dataset.dir = sortDir === 1 ? 'asc' : 'desc';
      applyFilters();
    });
  });

  // --- comparison selection --------------------------------------------------
  const selected = new Set<string>();
  const checks = [...root.querySelectorAll<HTMLInputElement>('.cmp-check')];
  const bar = root.querySelector<HTMLElement>('[data-compare-bar]');
  const barCount = root.querySelector<HTMLElement>('[data-compare-count]');
  const barLink = root.querySelector<HTMLAnchorElement>('[data-compare-link]');
  const syncCompare = (): void => {
    checks.forEach((c) => {
      c.disabled = !c.checked && selected.size >= MAX_COMPARE;
    });
    if (bar) bar.hidden = selected.size === 0;
    if (barCount) {
      barCount.textContent =
        selected.size < 2
          ? fillTokens(payload.ui?.selectedMore ?? '{n} selected — pick {m} more to compare', {
              n: selected.size,
              m: 2 - selected.size,
            })
          : fillTokens(payload.ui?.selected ?? '{n} selected', { n: selected.size });
    }
    if (barLink) {
      barLink.href = `${payload.compareBase}?sel=${[...selected].join(',')}`;
      barLink.classList.toggle('disabled', selected.size < 2);
      if (selected.size < 2) barLink.setAttribute('aria-disabled', 'true');
      else barLink.removeAttribute('aria-disabled');
    }
  };
  checks.forEach((c) =>
    c.addEventListener('change', () => {
      if (c.checked) selected.add(c.value);
      else selected.delete(c.value);
      syncCompare();
    }),
  );
  root.querySelector<HTMLButtonElement>('[data-compare-clear]')?.addEventListener('click', () => {
    selected.clear();
    checks.forEach((c) => (c.checked = false));
    syncCompare();
  });

  applyFilters();
  syncCompare();
}

document.querySelectorAll<HTMLElement>('[data-hub]').forEach(initHub);
