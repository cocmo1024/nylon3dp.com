// Submit URLs to IndexNow (Bing, Yandex, etc.) after a deploy.
// Usage: npm run indexnow            → every URL in dist/sitemap-index.xml's child sitemaps
//        npm run indexnow -- /materials/pa-2200/ /tools/   → only these paths
// Run `npm run build` first so dist/ reflects the current site.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'nylon3dp.com';
const KEY = '9dab3462f2c4f7ea5b0c3b4242b1e9cc'; // key file: public/<KEY>.txt

const args = process.argv.slice(2).filter((a) => a.startsWith('/') || a.startsWith('http'));
let urls;
if (args.length) {
  urls = args.map((a) => (a.startsWith('http') ? a : `https://${HOST}${a}`));
} else {
  const indexXml = readFileSync('dist/sitemap-index.xml', 'utf8');
  urls = [];
  for (const m of indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const child = readFileSync(join('dist', new URL(m[1]).pathname), 'utf8');
    for (const u of child.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(u[1]);
  }
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urls.length} URL(s)`);
