import { createHash } from 'node:crypto'
import { Document, isMap, parseDocument } from 'yaml'
import { z } from 'astro/zod'
import {
  editableSchema,
  manifestPath,
  noteId,
  noteSchema,
  notesPrefix,
  overridesPath,
  overridesSchema,
  safeNotePath,
  type EditableNote
} from '../lib/note-schema.ts'
import type { RepositorySnapshot } from './github-notes.ts'
import { topicSettingsPath, topicSettingsSchema } from '../lib/topic-settings.ts'

export class AdminError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const maxMarkdownBytes = 256 * 1024

export function parseMarkdown(source: string) {
  const match = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m.exec(source)
  if (!match || match.index !== 0) {
    if (/^\uFEFF?---/.test(source)) throw new AdminError(400, 'Markdown 的 frontmatter 未结束。')
    return { document: new Document(), data: {} as Record<string, unknown>, body: source }
  }
  const document = parseDocument(match[1], { uniqueKeys: true })
  if (document.errors.length || !isMap(document.contents))
    throw new AdminError(400, 'frontmatter 必须是有效的 YAML 对象，且不能有重复字段。')
  let data: Record<string, unknown>
  try {
    data = document.toJS({ maxAliasCount: 50 })
  } catch {
    throw new AdminError(400, 'frontmatter 的 YAML 引用过多。')
  }
  return { document, data, body: source.slice(match[0].length) }
}

export function editable(value: unknown): EditableNote {
  const parsed = editableSchema.safeParse(value)
  if (!parsed.success)
    throw new AdminError(
      400,
      '请检查标题（1–100 字符）、简介（最多 200 字符）、分类、标签和发布状态。'
    )
  const data = parsed.data
  if (!data.title.trim() || !data.topic.trim() || data.tags.some((tag) => !tag.trim()))
    throw new AdminError(400, '标题、分类和标签不能只有空格。')
  return {
    ...data,
    title: data.title.trim(),
    topic: data.topic.trim(),
    tags: [...new Set(data.tags.map((tag) => tag.trim()))]
  }
}

export function validateMetadata(data: unknown) {
  const result = noteSchema.safeParse(data)
  if (!result.success) throw new AdminError(400, '文章属性不符合现有 frontmatter 规则。')
  for (const key of ['date', 'updated'] as const) {
    const value = (data as Record<string, unknown>)[key]
    if (key === 'updated' && value === undefined) continue
    const day =
      typeof value === 'string' ? value.match(/^(\d{4}-\d{2}-\d{2})(?:$|[T ])/u)?.[1] : undefined
    if (
      !(value instanceof Date) &&
      (!day || new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) !== day)
    )
      throw new AdminError(400, '日期必须是真实日期，如 2026-10-05。')
  }
  return result.data
}

export function writeMarkdown(source: string, fields: EditableNote, creating = false) {
  const parsed = parseMarkdown(source)
  for (const [name, value] of Object.entries(fields)) parsed.document.set(name, value)
  if (creating && !parsed.document.has('date'))
    parsed.document.set('date', new Date().toISOString().slice(0, 10))
  // Retain all unedited properties and the exact body, including Obsidian/Markdown syntax.
  validateMetadata(parsed.document.toJS({ maxAliasCount: 50 }))
  const markdown = `---\n${parsed.document.toString()}---\n${parsed.body}`
  if (Buffer.byteLength(markdown) > maxMarkdownBytes)
    throw new AdminError(413, '单篇 Markdown 不能超过 256 KB。')
  return markdown
}

const manifestSchema = z.object({
  version: z.literal(1),
  notes: z.record(z.string().refine(safeNotePath), z.string().regex(/^[a-f0-9]{64}$/)),
  attachments: z.record(z.string(), z.string().regex(/^[a-f0-9]{64}$/))
})

export async function readSettings(snapshot: RepositorySnapshot) {
  const [manifest, overrides] = await Promise.all([
    snapshot.read(manifestPath),
    snapshot.read(overridesPath)
  ])
  try {
    if (manifest === null) throw new Error('Missing ownership manifest')
    return {
      managed: manifestSchema.parse(JSON.parse(manifest)).notes,
      overrides: overridesSchema.parse(JSON.parse(overrides ?? '{}'))
    }
  } catch {
    throw new AdminError(503, '文章同步清单或网站设置无效，已停止写入。')
  }
}

export async function readTopicSettings(snapshot: RepositorySnapshot) {
  const source = await snapshot.read(topicSettingsPath)
  try {
    return topicSettingsSchema.parse(JSON.parse(source ?? '{"pinned":[]}'))
  } catch {
    throw new AdminError(503, '专题置顶设置无效，请先检查仓库中的设置。')
  }
}

export async function readNotes(snapshot: RepositorySnapshot) {
  const settings = await readSettings(snapshot)
  const paths = [...snapshot.files.keys()].filter(
    (path) => path.startsWith(notesPrefix) && path.endsWith('.md')
  )
  const notes = []
  // Keep GitHub reads bounded; a personal blog does not need a database or persistent cache.
  for (let offset = 0; offset < paths.length; offset += 4) {
    notes.push(
      ...(await Promise.all(
        paths.slice(offset, offset + 4).map(async (fullPath) => {
          const path = fullPath.slice(notesPrefix.length)
          if (!safeNotePath(path)) throw new AdminError(503, '仓库中有不支持的文章路径。')
          const source = await snapshot.read(fullPath)
          if (source === null) throw new AdminError(409, '文章已发生变化，请重新加载。')
          const { data } = parseMarkdown(source)
          const managed = Object.hasOwn(settings.managed, path)
          if (
            managed &&
            createHash('sha256').update(source).digest('hex') !== settings.managed[path]
          )
            throw new AdminError(409, 'Obsidian 同步副本与清单不一致，请先处理同步冲突。')
          const override =
            managed && Object.hasOwn(settings.overrides, path)
              ? settings.overrides[path]
              : undefined
          return {
            path,
            id: noteId(path, data),
            managed,
            overridden: Object.keys(override ?? {}),
            data: validateMetadata({ ...data, ...override }),
            source
          }
        })
      ))
    )
  }
  const routes = new Set<string>()
  for (const note of notes) {
    if (routes.has(note.id)) throw new AdminError(503, '仓库中的文章网址重复，请先修复冲突。')
    routes.add(note.id)
  }
  return { ...settings, notes }
}
