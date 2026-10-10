import { getCollection, type CollectionEntry } from 'astro:content'
import { publishedNotes } from './note-utils'
import rawOverrides from '../data/note-overrides.json'
import manifest from '../data/obsidian-sync.json'
import { applyNoteOverride, overridesSchema } from './note-schema'
import type { Locale } from './i18n'
import { translatedEntries } from './translation-utils'

// Every public surface uses this function, including routes, lists, RSS and search pages.
export async function getNotes(locale: Locale = 'zh') {
  const overrides = overridesSchema.parse(rawOverrides)
  const notes = publishedNotes(
    (await getCollection('notes')).map((note) => applyNoteOverride(note, overrides, manifest.notes))
  )
  return locale === 'en'
    ? translatedEntries(notes, await getCollection('translations'), 'notes')
    : notes.map((entry) => ({
        ...entry,
        translation: undefined as CollectionEntry<'translations'> | undefined
      }))
}
