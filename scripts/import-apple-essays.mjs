import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { fromMarkdown } from 'mdast-util-from-markdown'
import sharp from 'sharp'
import { parse as parseYaml } from 'yaml'

const runFile = promisify(execFile)
const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const sources = [
  ['ability-and-desire', 'ability-and-desire'],
  ['unfinished', 'unfinished'],
  ['time-to-leave', 'time-to-leave'],
  ['no-regrets', 'no-regrets'],
  ['night', 'night'],
  ['fantasy', 'fantasy'],
  ['nineteen', 'nineteen'],
  ['information-overload', 'information-overload'],
  ['ordinary-person.md', 'ordinary-person'],
  ['future-loss', 'future-loss']
]
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')

async function existingBytes(path) {
  try {
    return await readFile(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

function parseExport(source, slug) {
  const lines = source
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
  const dateText = lines
    .shift()
    .trim()
    .replace(/^\*\*(.+)\*\*$/, '$1')
  const dateMatch = dateText.match(/^(\d{4})\.(\d{1,2})(?:\.(\d{1,2}))?$/)
  if (!dateMatch) throw new Error(`${slug}：首行应为明确的写作日期。`)
  const [, year, month, day] = dateMatch
  const written = `${year}-${month.padStart(2, '0')}${day ? `-${day.padStart(2, '0')}` : ''}`
  const fullDate = `${written}${day ? '' : '-01'}`
  if (
    Number(month) < 1 ||
    Number(month) > 12 ||
    new Date(`${fullDate}T00:00:00Z`).toISOString().slice(0, 10) !== fullDate
  )
    throw new Error(`${slug}：写作日期无效。`)
  while (lines.length && !lines[0].trim()) lines.shift()
  const titleMatch = lines.shift()?.match(/^#\s+(.+?)\s*$/)
  if (!titleMatch) throw new Error(`${slug}：日期后应为文章标题。`)
  let title = titleMatch[1].trim()
  // The September note repeats its writing date in the exported heading.
  const duplicateDate = title.match(/^(\d{4})\.(\d{1,2})(?:\.(\d{1,2}))?\s+(.+)$/)
  if (
    duplicateDate &&
    duplicateDate[1] === year &&
    Number(duplicateDate[2]) === Number(month) &&
    Number(duplicateDate[3] ?? 0) === Number(day ?? 0)
  )
    title = duplicateDate[4].trim()
  return { title, written, body: lines.join('\n') }
}

function cleanBody(body) {
  // Notes sometimes exports detected text as links that only work inside Apple apps.
  const autoLinks = []
  const visit = (node) => {
    if (node.type === 'link' && node.url.startsWith('x-apple-data-detectors:'))
      autoLinks.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        label: node.children
          .map((child) => body.slice(child.position.start.offset, child.position.end.offset))
          .join('')
      })
    for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(body))
  for (const link of autoLinks.reverse())
    body = body.slice(0, link.start) + link.label + body.slice(link.end)
  const lines = body.replace(/[\u00A0\u2007\u202F]/g, ' ').split('\n')
  const result = []
  for (const line of lines) {
    const trimmed = line.trimEnd()
    if (!trimmed) {
      if (result.length && result.at(-1) !== '') result.push('')
      continue
    }
    // Standalone photographs get their own paragraph, including after a poem.
    if (/^!\[.*\]\(.+\)$/.test(trimmed)) {
      if (result.length && result.at(-1) !== '') result.push('')
      result.push(trimmed, '')
    } else {
      // Apple Notes exports authored line breaks as two trailing spaces.
      result.push(trimmed + (/ {2,}$/.test(line) ? '  ' : ''))
    }
  }
  while (result.at(-1) === '') result.pop()
  return result
    .map((line, index) => (result[index + 1] ? line : line.trimEnd()))
    .join('\n')
    .trim()
}

function imagesIn(body) {
  const images = []
  const visit = (node) => {
    if (node.type === 'image') images.push(node)
    for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(body))
  return images
}

async function makeWebp(sourcePath, cacheRoot) {
  let input = sourcePath
  if (/\.hei[cf]$/i.test(sourcePath)) {
    const hash = digest(await readFile(sourcePath))
    input = join(cacheRoot, `${hash}.png`)
    if (!(await existingBytes(input))) {
      await mkdir(cacheRoot, { recursive: true })
      await runFile('/usr/bin/sips', ['-s', 'format', 'png', sourcePath, '--out', input])
    }
  }
  const bytes = await sharp(input)
    .rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toBuffer()
  const { width, height } = await sharp(bytes).metadata()
  return { bytes, width, height }
}

// This importer consumes user-exported files only. It never opens Notes or the Vault.
export async function importAppleEssays({
  sourceRoot,
  projectRoot = projectDirectory,
  update = false
}) {
  if (!sourceRoot) throw new Error('请指定已导出的 Apple Notes 目录。')
  const exportRoot = await realpath(sourceRoot)
  const cacheRoot = join(projectRoot, 'artifacts/apple-essay-image-cache')
  const planned = []
  const essays = []
  for (const [directory, slug] of sources) {
    const noteRoot = await realpath(join(exportRoot, directory))
    const markdownFiles = (await readdir(noteRoot, { withFileTypes: true })).filter(
      (entry) => entry.isFile() && extname(entry.name).toLowerCase() === '.md'
    )
    if (markdownFiles.length !== 1) throw new Error(`${directory} 应恰好包含一份 Markdown 导出。`)
    const parsed = parseExport(await readFile(join(noteRoot, markdownFiles[0].name), 'utf8'), slug)
    const imageNodes = imagesIn(parsed.body)
    const replacements = []
    const usedSources = new Set()
    const imageReport = []
    for (const [index, node] of imageNodes.entries()) {
      if (!node.url.startsWith('Attachments/'))
        throw new Error(`${slug}：图片引用必须来自本篇 Attachments 目录。`)
      const sourcePath = await realpath(join(noteRoot, decodeURIComponent(node.url)))
      const sourceRelative = relative(join(noteRoot, 'Attachments'), sourcePath)
      if (sourceRelative.startsWith('..') || isAbsolute(sourceRelative))
        throw new Error(`${slug}：图片超出了已导出的附件目录。`)
      usedSources.add(sourceRelative)
      const imageName = `image-${String(index + 1).padStart(2, '0')}.webp`
      const converted = await makeWebp(sourcePath, cacheRoot)
      planned.push({
        path: join(projectRoot, 'public/essays', slug, imageName),
        bytes: converted.bytes
      })
      imageReport.push({ name: imageName, width: converted.width, height: converted.height })
      const original = parsed.body.slice(node.position.start.offset, node.position.end.offset)
      replacements.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        value: original.replace(node.url, `/essays/${slug}/${imageName}`)
      })
    }
    const exportedAttachments = (
      await readdir(join(noteRoot, 'Attachments'), { withFileTypes: true })
    )
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
    if (exportedAttachments.some((name) => !usedSources.has(name)))
      throw new Error(`${slug}：存在正文未引用的附件，请先核对导出。`)
    let body = parsed.body
    for (const change of replacements.reverse())
      body = body.slice(0, change.start) + change.value + body.slice(change.end)
    body = cleanBody(body)
    if (!body) throw new Error(`${slug}：正文为空。`)
    const articlePath = join(projectRoot, 'src/content/essays', `${slug}.md`)
    const existingArticle = await existingBytes(articlePath)
    let title = parsed.title
    let header = `---\ntitle: ${JSON.stringify(title)}\nwritten: '${parsed.written}'\n---\n`
    if (update && existingArticle) {
      const previousHeader = existingArticle.toString('utf8').match(/^---\n([\s\S]*?)\n---\n/)
      if (!previousHeader) throw new Error(`${slug}：现有文章缺少 frontmatter。`)
      const previousData = parseYaml(previousHeader[1])
      // Author-approved website titles and other metadata survive source resyncs.
      title = previousData.title
      header = previousHeader[0]
      if (previousData.written !== parsed.written)
        header = header.replace(/^written:.*$/m, `written: '${parsed.written}'`)
    }
    const markdown = `${header}\n${body}\n`
    planned.push({
      path: articlePath,
      bytes: Buffer.from(markdown)
    })
    essays.push({ slug, title, written: parsed.written, images: imageReport })
  }
  // Complete conversion and collision checks before touching published content.
  for (const file of planned) {
    const existing = await existingBytes(file.path)
    const identical = existing && digest(existing) === digest(file.bytes)
    if (existing && !identical && !update)
      throw new Error(`目标已有不同内容，已停止导入：${file.path}`)
    file.identical = Boolean(identical)
    file.exists = existing !== null
  }
  let written = 0
  for (const file of planned) {
    if (file.identical) continue
    await mkdir(dirname(file.path), { recursive: true })
    await writeFile(file.path, file.bytes, { flag: file.exists ? 'w' : 'wx' })
    written += 1
  }
  return {
    essays,
    attachments: essays.reduce((total, essay) => total + essay.images.length, 0),
    written,
    changed: planned
      .filter((file) => !file.identical)
      .map((file) => relative(projectRoot, file.path)),
    unchanged: planned.filter((file) => file.identical).length
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await importAppleEssays({
      sourceRoot: process.argv[2],
      update: process.argv.includes('--update')
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Apple Notes 随笔导入失败。')
    process.exitCode = 1
  }
}
