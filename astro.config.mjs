import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { rehypeDanishHeadingIds } from './plugins/rehype-danish-heading-ids.mjs';

export default defineConfig({
  site: 'https://kursusoversigten.dk',
  trailingSlash: 'never',
  output: 'hybrid',
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
