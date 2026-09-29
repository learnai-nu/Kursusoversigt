import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { rehypeDanishHeadingIds } from './plugins/rehype-danish-heading-ids.mjs';

export default defineConfig({
  site: 'https://kursusoversigten.dk',
  trailingSlash: 'never',
  // Astro 5: 'static' = prerender by default; routes with `prerender = false` run on the Vercel function.
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false })],
  i18n: {
    defaultLocale: 'da',
    locales: ['da'],
  },
  markdown: {
    // Pre-set Danish-friendly ids; Astro's rehypeHeadingIds keeps them and fills `headings`.
    rehypePlugins: [rehypeDanishHeadingIds],
  },
});
