# nylon3dp.com — The Nylon 3D Printing Reference

Independent reference site for nylon (polyamide) 3D printing: a datasheet-verified
material database (PA11, PA12, PA6, filled grades), a machine database (SLS, MJF,
SAF), process explainers, design guides and a glossary. English only.

## Hard rules

- **No source, no number.** Every material/machine specification comes from the
  manufacturer's own datasheet or specification page, cited in the data file and
  on the page. Values a manufacturer does not publish are omitted, never estimated.
- This is a reference publication, not a business or print-service site: no
  services are offered and nothing is sold. The only contact is the editorial
  email in `src/site.ts`.
- No superlative marketing claims ("#1", "best in the world"). Hub positioning
  ("The Nylon 3D Printing Reference") is the site identity, earned by coverage.
- Pages are data-driven: materials live in `src/data/materials.ts`, machines in
  `src/data/machines.ts`, glossary terms in `src/data/glossary.ts`. Both data
  modules validate at build time (an entry without sources fails the build).
  `llms.txt` / `llms-full.txt` are generated from the same data at build time —
  never hand-edit them.

## Develop & verify

```bash
npm install
npm run dev        # local dev server
npm run verify     # production build + scripts/check-site.mjs (must pass)
```

`check-site.mjs` enforces: one `<h1>` per page, title ≤ 70 chars, meta
description 50–160 chars, canonical = own URL, no broken internal links, every
indexable page present in the sitemap, and `llms.txt` / `llms-full.txt` /
`robots.txt` present in `dist/`.

## Deploy (Cloudflare Workers — project "nylon3dp-com")

- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: `npx wrangler deploy` (config: `wrangler.jsonc`)
- Production branch: `main` of the project repository
- `worker.js` serves the static build and carries the legacy
  `/Terms/` → `/terms/` 301 plus the custom 404 (`public/_redirects`
  remains in the repo for reference; Workers does not process it).
- After a deploy, submit the sitemap URLs to IndexNow:
  `npm run indexnow` (key file: `public/9dab3462f2c4f7ea5b0c3b4242b1e9cc.txt`).

## Layout

- `src/pages/` — routes (materials/machines are generated from data via
  `[slug].astro` templates)
- `src/layouts/Base.astro` — shared shell: meta, canonical, OG, JSON-LD
  (Organization + WebSite on every page; FAQPage/TechArticle where applicable)
- `src/styles/global.css` — single stylesheet, no framework, no trackers
- `public/robots.txt` — allows all crawlers, explicitly including AI crawlers
  (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
