import { z } from 'astro/zod'
import { slug } from 'github-slugger'

export const notesPrefix = 'src/content/notes/'
export const overridesPath = 'src/data/note-overrides.json'
export const manifestPath = 'src/data/obsidian-sync.json'

export const noteSchema = z.object({
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

export const editableSchema = noteSchema
  .pick({
    title: true,
    description: true,
    topic: true,
    tags: true,
    publish: true
  })
  .extend({
    // Overrides must not inherit defaults: changing tags must never implicitly unpublish a note.
    tags: z.array(z.string().min(1)).transform((tags) => [...new Set(tags)]),
    publish: z.boolean()
  })
  .strict()
export type EditableNote = z.output<typeof editableSchema>
export type NoteOverride = Partial<EditableNote>

export function safeNotePath(path: unknown): path is string {
  return (
    typeof path === 'string' &&
    path.length <= 240 &&
    path.endsWith('.md') &&
    !/[\\\u0000-\u001f\u007f%?#:]/u.test(path) &&
    path
      .split('/')
      .every(
        (part) =>
          part && !part.startsWith('.') && !['__proto__', 'constructor', 'prototype'].includes(part)
      )
  )
}

export const overridesSchema = z.record(
  z.string().refine(safeNotePath, '无效的文章路径'),
  editableSchema.partial()
)

// Match the glob loader and the existing Obsidian importer. Paths, not titles, own URLs.
export function noteId(path: string, data: { slug?: unknown } = {}) {
  const id =
    data.slug ??
    path
      .replace(/\.md$/, '')
      .split('/')
      .map((part) => slug(part))
      .join('/')
      .replace(/\/index$/, '')
  if (
    typeof id !== 'string' ||
    !safeNotePath(`${id}.md`) ||
    ['index', 'pdf', 'tags', 'topics'].includes(id.split('/')[0]!)
  ) {
    throw new Error('文章网址无效或占用了现有栏目。')
  }
  return id.normalize('NFC')
}

export function applyNoteOverride<T extends { filePath?: string; data: unknown }>(
  note: T,
  overrides: Record<string, NoteOverride>,
  managed: Record<string, unknown>
): T {
  const path = note.filePath?.replaceAll('\\', '/').replace(/^.*?src\/content\/notes\//, '')
  if (!path || !Object.hasOwn(managed, path) || !Object.hasOwn(overrides, path)) return note
  return { ...note, data: noteSchema.parse({ ...(note.data as object), ...overrides[path] }) }
}
