import type { NoteMeta } from './note-utils'

export const noteCategories = [
  { id: 'ai', title: 'AI', description: { zh: 'ai电子书', en: 'AI ebooks' } },
  { id: 'lin', title: 'Lin', description: { zh: '古法笔记', en: 'Old-school notes' } }
] as const

export type NoteCategory = (typeof noteCategories)[number]['id']
export const categoryUrl = (category: NoteCategory) => `/notes/categories/${category}`
export const noteCategory = (note: NoteMeta): NoteCategory => note.data.category ?? 'ai'
export const categoryNotes = <T extends NoteMeta>(notes: T[], category: NoteCategory): T[] =>
  notes.filter((note) => noteCategory(note) === category)
