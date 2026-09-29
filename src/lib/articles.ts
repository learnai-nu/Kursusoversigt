import { getCollection } from 'astro:content';

/**
 * All articles in stable file-name order.
 * Astro 5's content layer does not guarantee `getCollection` order, so sort by id
 * (= file name) to keep the same order as Astro 4 (sitemap, and ties in pubDate sorts).
 */
export async function getArticles() {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
