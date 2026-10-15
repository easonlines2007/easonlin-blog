import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse, stringify } from 'yaml'
import { slug } from 'github-slugger'
import { sourceHash } from '../src/lib/translation-utils.ts'
import {
  translationSegments,
  applyTextTranslations,
  headingIds,
  localizeMarkdownLinks
} from './translation-markdown.mjs'

export function readMarkdown(file) {
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) throw new Error(`Missing frontmatter: ${file}`)
  return { raw, data: parse(match[1]), body: raw.slice(match[0].length) }
}

export function publicSources() {
  const overrides = JSON.parse(readFileSync('src/data/note-overrides.json', 'utf8'))
  const managed = JSON.parse(readFileSync('src/data/obsidian-sync.json', 'utf8')).notes
  return ['notes', 'essays'].flatMap((kind) =>
    readdirSync(`src/content/${kind}`, { recursive: true })
      .filter((file) => file.endsWith('.md'))
      .flatMap((relative) => {
        const file = `src/content/${kind}/${relative}`
        const source = readMarkdown(file)
        const data =
          kind === 'notes' && Object.hasOwn(managed, relative)
            ? { ...source.data, ...overrides[relative] }
            : source.data
        if (kind === 'notes' && data.publish !== true) return []
        const id =
          data.slug ??
          relative
            .replace(/\.md$/, '')
            .split('/')
            .map((part) => slug(part))
            .join('/')
            .replace(/\/index$/, '')
        return [
          {
            ...source,
            data,
            kind,
            id,
            file,
            hash: sourceHash(source.raw, { title: data.title, description: data.description }),
            url: `/${kind === 'notes' ? 'notes' : 'blog'}/${id}`
          }
        ]
      })
  )
}

export function auditTranslations(sources = publicSources()) {
  const problems = []
  for (const source of sources) {
    const file = `src/content/translations/en/${source.kind}/${source.id}.md`
    if (!existsSync(file)) {
      problems.push(`Missing: ${source.url}`)
      continue
    }
    const translation = readMarkdown(file)
    if (translation.data.source !== source.id || translation.data.kind !== source.kind)
      problems.push(`Wrong source: ${file}`)
    if (!translation.data.publish) problems.push(`Unpublished translation: ${source.url}`)
    if (translation.data.sourceHash !== source.hash)
      problems.push(`Translation needs update: ${source.url}`)
  }
  return problems
}

const [command = 'check', input, ...flags] = process.argv.slice(2)
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)
if (invokedDirectly) {
  const sources = publicSources()
  if (command === 'check') {
    const problems = auditTranslations(sources)
    const current = sources.filter((source) => auditTranslations([source]).length === 0).length
    console.log(`${sources.length} public originals; ${current} current English translations.`)
    for (const problem of problems) console.error(problem)
    if (problems.length) process.exitCode = 1
  } else if (command === 'prepare') {
    if (!input) throw new Error('Usage: pnpm translations:prepare artifacts/translation-draft.json')
    if (existsSync(input))
      throw new Error('The output file already exists. Choose a new draft filename.')
    const segments = [
      ...new Set(
        sources
          .flatMap((s) => [
            s.data.title,
            s.data.description ?? '',
            ...translationSegments(s.body).map((n) => n.text)
          ])
          .filter(Boolean)
      )
    ]
    const payload = {
      glossary: JSON.parse(readFileSync('scripts/translation-glossary.json', 'utf8')),
      sources: Object.fromEntries(sources.map((s) => [s.file, s.hash])),
      dictionary: Object.fromEntries(
        segments.map((s) => [s, /\p{Script=Han}|[àèéíïòóúüç]/u.test(s) ? '' : s])
      )
    }
    mkdirSync(dirname(input), { recursive: true })
    writeFileSync(input, JSON.stringify(payload, null, 2) + '\n')
    console.log(
      `Prepared ${segments.length} segments. Fill in the dictionary, then apply the draft.`
    )
  } else if (command === 'apply') {
    if (!input)
      throw new Error('Usage: pnpm translations:apply artifacts/translation-draft.json [--update]')
    const draft = JSON.parse(readFileSync(input, 'utf8'))
    for (const source of sources)
      if (draft.sources[source.file] !== source.hash)
        throw new Error(`Original changed since draft preparation: ${source.file}`)
    const dictionary = draft.dictionary
    const translated = sources.map((s) => ({
      ...s,
      translatedBody: applyTextTranslations(s.body, dictionary)
    }))
    const headings = new Map(
      translated.map((s) => {
        const originalIds = headingIds(s.body),
          translatedIds = headingIds(s.translatedBody)
        if (originalIds.length !== translatedIds.length)
          throw new Error(`Heading structure changed: ${s.file}`)
        return [s.url, new Map(originalIds.map((id, i) => [id, translatedIds[i]]))]
      })
    )
    const publicPaths = new Set([
      ...sources.map((s) => s.url),
      '/',
      '/about',
      '/links',
      '/projects',
      '/blog',
      '/search',
      '/notes',
      '/notes/all',
      '/notes/pdf',
      '/notes/status',
      '/notes/topics',
      '/notes/tags'
    ])
    for (const source of sources.filter((s) => s.kind === 'notes')) {
      publicPaths.add(`/notes/topics/${source.data.topic}`)
      publicPaths.add(`/notes/status/${source.data.status ?? 'growing'}`)
      for (const tag of source.data.tags ?? []) publicPaths.add(`/notes/tags/${tag}`)
    }
    // Validate the complete batch before changing any files; existing edits require --update.
    const outputs = translated.map((s) => {
      const file = `src/content/translations/en/${s.kind}/${s.id}.md`
      if (existsSync(file) && !flags.includes('--update'))
        throw new Error(
          `Translation already exists: ${file}; use --update after reviewing the draft`
        )
      const title = dictionary[s.data.title]
      const description = s.data.description ? dictionary[s.data.description] : ''
      if (!title?.trim() || (s.data.description && !description?.trim()))
        throw new Error(`Missing translated metadata: ${s.file}`)
      const body = localizeMarkdownLinks(s.translatedBody, s.url, headings, publicPaths)
      return {
        file,
        text: `---\n${stringify({ kind: s.kind, source: s.id, title, ...(description && { description }), sourceHash: s.hash, publish: true, translationMethod: 'machine-assisted' })}---\n${body}`
      }
    })
    for (const { file, text } of outputs) {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, text)
    }
    console.log(
      `Saved ${outputs.length} English Markdown files. Run pnpm translations:check and pnpm verify.`
    )
  } else throw new Error(`Unknown translation command: ${command}`)
}
