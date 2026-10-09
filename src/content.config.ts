import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
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

export const collections = { notes, essays }
