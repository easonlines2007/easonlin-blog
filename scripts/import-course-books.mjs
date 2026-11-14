import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { Document, parseDocument } from 'yaml'
import { syncObsidian } from './obsidian-sync-lib.mjs'

const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const courses = {
  cs61a: {
    topic: 'CS61A',
    lectures: 40,
    modules: [
      'functions',
      'recursion',
      'data',
      'objects',
      'design',
      'interpreters',
      'sql',
      'review'
    ]
  },
  cs231n: {
    topic: 'CS231n',
    lectures: 18,
    modules: [
      'classification',
      'optimization',
      'cnn',
      'sequence',
      'detection',
      'video',
      'scaling',
      'generative',
      '3d-vision',
      'embodied'
    ]
  }
}
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')

// MathJax exports allow adjacent inline display formulas; remark-math needs
// separate display blocks. Protect code, including literal dollar delimiters.
function normalizeDisplayMath(body) {
  const protectedRanges = []
  function visit(node) {
    if (['code', 'inlineCode'].includes(node.type))
      protectedRanges.push([node.position.start.offset, node.position.end.offset])
    else for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(body))
  const normalize = (text) =>
    text.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`)
  let cursor = 0,
    result = ''
  for (const [start, end] of protectedRanges.sort((a, b) => a[0] - b[0])) {
    result += normalize(body.slice(cursor, start)) + body.slice(start, end)
    cursor = end
  }
  return result + normalize(body.slice(cursor))
}
async function existing(path) {
  try {
    return await readFile(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

// Import only finished Markdown chapters and the assets they actually reference.
// All rewriting happens in a temporary Vault; the supplied source stays read-only.
export async function importCourseBook({
  course,
  sourceDirectory,
  date,
  replaceExisting = false,
  projectRoot = projectDirectory
}) {
  const config = courses[course]
  if (!config) throw new Error('课程应为 cs61a 或 cs231n。')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  )
    throw new Error('请指定真实的添加日期。')
  const sourceRoot = await realpath(sourceDirectory)
  const sourceNames = await readdir(sourceRoot)
  const { topic, lectures, modules } = config
  const chapters = Array.from({ length: lectures }, (_, index) => ({
    name: `${topic}-lec${course === 'cs61a' ? String(index + 1).padStart(2, '0') : index + 1}.md`,
    filename: `lec${String(index + 1).padStart(2, '0')}.md`,
    order: index + 1
  }))
  modules.forEach((name, index) =>
    chapters.push({
      name: `${topic}-${name}.md`,
      filename: `${name}.md`,
      order: lectures + index + 1
    })
  )
  const hasSlidesIndex = course === 'cs231n' && sourceNames.includes('课件索引.md')
  if (hasSlidesIndex)
    chapters.push({
      name: '课件索引.md',
      filename: 'slides.md',
      order: lectures + modules.length + 1
    })
  const actual = sourceNames.filter((name) => name.startsWith(`${topic}-`) && name.endsWith('.md'))
  if (
    actual.length !== lectures + modules.length ||
    actual.some((name) => !chapters.some((chapter) => chapter.name === name))
  )
    throw new Error(`${topic} 的单讲与模块清单不完整。`)
  const destinations = new Map([
    ['index.html', `/notes/topics/${encodeURIComponent(topic)}`],
    ['README.md', `/notes/topics/${encodeURIComponent(topic)}`]
  ])
  for (const chapter of chapters) {
    const url = `/notes/${course}/${chapter.filename.slice(0, -3)}`
    destinations.set(chapter.name, url)
    destinations.set(chapter.name.replace(/\.md$/, '.html'), url)
  }
  const temporary = await mkdtemp(join(tmpdir(), `${course}-book-`))
  try {
    const vaultPath = join(temporary, 'vault')
    const stagingProject = join(temporary, 'project')
    const stagingNotes = join(vaultPath, 'Blog', topic)
    await mkdir(stagingNotes, { recursive: true })
    await mkdir(stagingProject)
    for (const chapter of chapters) {
      const source = (await readFile(join(sourceRoot, chapter.name), 'utf8')).replace(/\r\n/g, '\n')
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
      let metadata, body
      if (frontmatter) {
        const document = parseDocument(frontmatter[1])
        if (document.errors.length) throw new Error(`${chapter.name} 的 YAML 无效。`)
        metadata = document.toJS()
        body = source.slice(frontmatter[0].length).trimStart()
        const heading = fromMarkdown(body).children[0]
        if (heading?.type === 'heading' && heading.depth === 1)
          body = body.slice(heading.position.end.offset).trimStart()
      } else if (chapter.name === '课件索引.md') {
        metadata = {
          title: 'CS231n · 官方课件索引',
          description: 'CS231n Spring 2025 官方 PDF 课件：18 份、2110 页，支持按页码跳转。'
        }
        const table = source.indexOf('| 讲次 |')
        if (table < 0) throw new Error('课件索引缺少课件表。')
        body =
          'CS231n Spring 2025 官方 PDF 课件，共 **18 份、2110 页**，对应 Lecture 1–17。Lecture 1 分为两份；Lecture 18 未提供官方课件。正文中的课件链接可直接定位 PDF 页码。\n\n' +
          source.slice(table)
      } else throw new Error(`${chapter.name} 缺少 frontmatter。`)
      if (!metadata.title || typeof metadata.description !== 'string')
        throw new Error(`${chapter.name} 缺少标题或简介。`)
      body = normalizeDisplayMath(body)
      const changes = []
      function visit(node) {
        if (node.type === 'code' && node.lang === 'mermaid') {
          const value = node.value
            .replace(/((?:-->|---|==>|===|-\.->)\|)([^|\n]+)\|/g, (line, prefix, label) =>
              !label.startsWith('"') && /[\[\]():]/.test(label) ? `${prefix}"${label}"|` : line
            )
            .replace(
              '      显存 O(N^2) 与 FlashAttention',
              '      memory["显存 O(N^2) 与 FlashAttention"]'
            )
          if (value !== node.value)
            changes.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              value: body
                .slice(node.position.start.offset, node.position.end.offset)
                .replace(node.value, () => value)
            })
        }
        if (['link', 'image', 'definition'].includes(node.type)) {
          const [target, suffix = ''] = node.url.split(/(?=[#?])/s, 2)
          const next = destinations.get(decodeURIComponent(target.replace(/^\.\//, '')))
          if (next) {
            const start = node.position.start.offset,
              end = node.position.end.offset
            const original = body.slice(start, end)
            const value = original.replace(node.url, `${next}${suffix}`)
            if (value === original) throw new Error(`无法转换链接：${node.url}`)
            changes.push({ start, end, value })
          }
        }
        for (const child of node.children ?? []) visit(child)
      }
      visit(fromMarkdown(body))
      for (const change of changes.sort((a, b) => b.start - a.start))
        body = body.slice(0, change.start) + change.value + body.slice(change.end)
      const outputMetadata = new Document({
        title: metadata.title,
        description: metadata.description,
        date,
        topic,
        category: 'ai',
        order: chapter.order,
        tags: [course],
        status: 'completed',
        publish: true
      })
      await writeFile(
        join(stagingNotes, chapter.filename),
        `---\n${outputMetadata.toString()}---\n\n${body.trimEnd()}\n`
      )
    }
    const result = await syncObsidian({
      vaultPath,
      projectRoot: stagingProject,
      attachmentRoot: sourceRoot
    })
    const manifest = JSON.parse(
      await readFile(join(stagingProject, 'src/data/obsidian-sync.json'), 'utf8')
    )
    const planned = [],
      assetNames = new Map(),
      plannedAssets = new Set()
    for (const name of Object.keys(manifest.attachments)) {
      const bytes = await readFile(join(stagingProject, 'public/attachments', name))
      const destination = `${course}-${digest(bytes).slice(0, 24)}${name.slice(name.lastIndexOf('.'))}`
      assetNames.set(name, destination)
      if (plannedAssets.has(destination)) continue
      plannedAssets.add(destination)
      planned.push({ path: join(projectRoot, 'public/attachments', destination), bytes })
    }
    for (const path of Object.keys(manifest.notes)) {
      let markdown = await readFile(join(stagingProject, 'src/content/notes', path), 'utf8')
      for (const [original, destination] of assetNames)
        markdown = markdown.replaceAll(`/attachments/${original}`, `/attachments/${destination}`)
      planned.push({
        path: join(projectRoot, 'src/content/notes', path),
        bytes: Buffer.from(markdown),
        replace: replaceExisting
      })
    }
    if (course === 'cs231n' && !hasSlidesIndex && replaceExisting)
      planned.push({
        path: join(projectRoot, 'src/content/notes/CS231n/slides.md'),
        bytes: null,
        replace: true
      })
    // Validate the entire import before copying anything into the blog.
    for (const file of planned) {
      const bytes = await existing(file.path)
      file.unchanged = file.bytes === null ? bytes === null : (bytes?.equals(file.bytes) ?? false)
      if (bytes && !file.unchanged && !file.replace)
        throw new Error(`目标文件已有不同内容：${file.path}`)
      file.previousBytes = bytes
    }
    for (const file of planned) {
      const bytes = await existing(file.path)
      if (!(bytes === null && file.previousBytes === null) && !bytes?.equals(file.previousBytes))
        throw new Error(`导入期间目标文件发生变化：${file.path}`)
    }
    let written = 0
    for (const file of planned) {
      if (file.unchanged) continue
      if (file.bytes === null) {
        await rm(file.path)
        written++
        continue
      }
      await mkdir(dirname(file.path), { recursive: true })
      await writeFile(file.path, file.bytes, {
        flag: file.replace && file.previousBytes ? 'w' : 'wx'
      })
      written++
    }
    return { notes: result.notes, attachments: new Set(assetNames.values()).size, written }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(
      await importCourseBook({
        course: process.argv[2],
        sourceDirectory: process.argv[3],
        date: process.argv[4],
        replaceExisting: process.argv[5] === '--replace'
      })
    )
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
