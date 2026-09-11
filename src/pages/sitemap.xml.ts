import type { APIRoute } from 'astro';
import { getAllCourses, getAllProviders } from '../lib/courses';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const urls = [
    '/',
    '/ai-kurser',
    '/emner',
    '/emner/chatgpt',
    '/emner/ledelse',
    '/emner/teams',
    '/emner/gratis',
    '/artikler',
    '/om',
    '/forfattere',
    '/forfattere/jesper-gunris-schneider',
    ...getAllCourses().map((c) => `/ai-kurser/${c.slug}`),
    ...getAllProviders().map((p) => `/udbydere/${p.slug}`),
    ...articles.map((a) => `/artikler/${a.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${absoluteUrl(u)}</loc>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
