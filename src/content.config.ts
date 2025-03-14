import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
  }),
});

export const collections = { posts };
