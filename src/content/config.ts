import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }),
    tags: z.array(z.string())
  })
});

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/work" }),
  schema: z.object({
    position: z.string(),
    company: z.string(),
    companyUrl: z.string().url(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    order: z.number().optional(),
    expanded: z.boolean().default(false)
  })
});

const education = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/education" }),
  schema: z.object({
    title: z.string(),
    institution: z.string(),
    institutionUrl: z.string().url(),
    endYear: z.number(),
    order: z.number().optional()
  })
});

const profile = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/profile" }),
  schema: z.object({
    title: z.string()
  })
});

export const collections = { blog, work, education, profile };
