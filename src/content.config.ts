import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per page. The filename must match a key in site.config.json "pages".
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().max(60, 'Title must be under 60 characters'),
    description: z.string().max(160),
    h1: z.string(),
    eyebrow: z.string().optional(),
    subhead: z.string().optional(),
    promise: z.string().optional(),
    related: z.array(z.string()).length(2),
    commercial: z
      .object({
        heading: z.string(),
        intro: z.string(),
        points: z.array(z.string()),
      })
      .optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(5).max(8),
  }),
});

export const collections = { pages };
