import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { noteSchema } from './lib/note-schema'

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: noteSchema
})

export const collections = { notes }
