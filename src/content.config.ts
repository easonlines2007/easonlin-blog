import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { noteSchema } from './lib/note-schema'
import { essaySchema } from './lib/essay-schema'

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: noteSchema
})

const essays = defineCollection({
  loader: glob({ base: './src/content/essays', pattern: '**/*.md' }),
  schema: essaySchema
})

const translations = defineCollection({
  loader: glob({ base: './src/content/translations/en', pattern: '**/*.md' }),
  schema: z.object({
    kind: z.enum(['notes', 'essays']),
    source: z.string().min(1),
    title: z.string().min(1).max(300),
    description: z.string().max(600).optional(),
    sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
    publish: z.boolean().default(false),
    translationMethod: z.enum(['ai-assisted', 'machine-assisted', 'human']).optional()
  })
})

export const collections = { notes, essays, translations }
