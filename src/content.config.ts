import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  // Astro 5 Content Layer: ids are the file names (kebab-case), matching the old `slug`.
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Jesper Gunris Schneider'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
  }),
});

export const collections = { articles };
