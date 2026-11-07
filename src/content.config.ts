import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    gallery: z
      .array(
        z.object({
          type: z.enum(['image', 'video']),
          src: z.string(),
          caption: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { blog };
