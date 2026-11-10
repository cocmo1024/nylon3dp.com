// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nylon3dp.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // English is the default locale and stays unprefixed at the root;
  // pilot translations live under /de/, /es/, /pt/, /ja/, /zh/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'pt', 'ja', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', de: 'de', es: 'es', pt: 'pt', ja: 'ja', zh: 'zh' },
      },
      // @astrojs/sitemap emits locale alternates but no x-default; add it for
      // every URL that has alternates (currently only the homepage cluster),
      // pointing at the English version.
      serialize(item) {
        if (item.links?.length && !item.links.some((l) => l.lang === 'x-default')) {
          const en = item.links.find((l) => l.lang === 'en');
          if (en) item.links = [...item.links, { url: en.url, lang: 'x-default' }];
        }
        return item;
      },
    }),
  ],
});
