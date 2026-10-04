import { getCollection } from 'astro:content'
import { publishedNotes } from './note-utils'

// Every public surface uses this function, including routes, lists, RSS and search pages.
export async function getNotes() {
  return publishedNotes(await getCollection('notes'))
}
