import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.string().min(1),
    tags: z
      .array(z.string().min(1))
      .default([])
      .transform((tags) => [...new Set(tags)]),
    status: z.enum(['growing', 'ready']).default('growing'),
    publish: z.boolean().default(false),
    sample: z.boolean().default(false),
    pdf: z
      .string()
      .regex(/^\/attachments\/[a-zA-Z0-9_-]+\.pdf$/)
      .optional()
  })
})

export const collections = { notes }
