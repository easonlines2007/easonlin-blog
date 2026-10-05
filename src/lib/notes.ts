import { getCollection } from 'astro:content'
import { publishedNotes } from './note-utils'
import rawOverrides from '../data/note-overrides.json'
import manifest from '../data/obsidian-sync.json'
import { applyNoteOverride, overridesSchema } from './note-schema'

// Every public surface uses this function, including routes, lists, RSS and search pages.
export async function getNotes() {
  const overrides = overridesSchema.parse(rawOverrides)
  return publishedNotes(
    (await getCollection('notes')).map((note) => applyNoteOverride(note, overrides, manifest.notes))
  )
}
