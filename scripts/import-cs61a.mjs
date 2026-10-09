import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { Document } from 'yaml'
import { syncObsidian } from './obsidian-sync-lib.mjs'

const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const headingText = (node) => node.value ?? (node.children ?? []).map(headingText).join('')
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')

async function existingBytes(path) {
  try {
    return await readFile(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

// Convert in an isolated project so the real Obsidian ownership manifest stays untouched.
export async function importCs61a({ sourcePath, date, projectRoot = projectDirectory }) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  )
    throw new Error('请指定真实的添加日期，例如 2026-10-09。')
  const source = await readFile(sourcePath, 'utf8')
  const sourceRoot = dirname(await realpath(sourcePath))
  const headings = fromMarkdown(source).children.filter(
    (node) =>
      node.type === 'heading' &&
      node.depth === 1 &&
      /^#\s/.test(source.slice(node.position.start.offset))
  )
  const lectures = headings.slice(1).map((heading, index) => {
    const match = headingText(heading).match(
      /^(?:L(?:ecture)?\s*(\d+)|第\s*(\d+)\s*讲)[\s·:：-]+(.+)$/i
    )
    if (!match || Number(match[1] ?? match[2]) !== index + 1)
      throw new Error('CS61A 原稿讲次不连续，请先核对一级目录。')
    return {
      heading,
      title: `Lecture ${String(index + 1).padStart(2, '0')} · ${match[3]}`,
      description: `CS61A 第 ${index + 1} 讲：${match[3]}`,
      filename: `lecture-${String(index + 1).padStart(2, '0')}.md`
    }
  })
  if (!headingText(headings[0] ?? {}).includes('CS61A') || lectures.length !== 37)
    throw new Error('CS61A 原稿应包含书名和完整的 37 讲。')

  let introduction = source.slice(
    headings[0].position.end.offset,
    lectures[0].heading.position.start.offset
  )
  const replacements = []
  function visit(node) {
    if (node.type === 'link') {
      const match = node.url.match(/^BV1sy411z7nA_p(\d+)\/book\.html$/)
      if (match) {
        const lecture = lectures[Number(match[1]) - 1]
        if (!lecture) throw new Error('CS61A 总目录引用了不存在的讲次。')
        replacements.push({
          ...node.position,
          value: `[${lecture.title}](/notes/cs61a/${lecture.filename.slice(0, -3)})`
        })
      } else if (node.url === 'http://localhost:8080/cs61a.html') {
        replacements.push({ ...node.position, value: '[CS61A 专题目录](/notes/topics/CS61A)' })
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(introduction))
  for (const change of replacements.sort((a, b) => b.start.offset - a.start.offset))
    introduction =
      introduction.slice(0, change.start.offset) +
      change.value +
      introduction.slice(change.end.offset)
  const attribution = introduction.split(/^---\s*$/m)[0].trim()

  const temporary = await mkdtemp(join(tmpdir(), 'cs61a-import-'))
  try {
    const vaultPath = join(temporary, 'vault')
    const stagingProject = join(temporary, 'project')
    const stagingNotes = join(vaultPath, 'Blog/CS61A')
    await mkdir(stagingNotes, { recursive: true })
    await mkdir(stagingProject)
    for (const [index, lecture] of lectures.entries()) {
      const document = new Document({
        title: lecture.title,
        description: lecture.description,
        date,
        topic: 'CS61A',
        tags: ['cs61a'],
        status: 'completed',
        publish: true,
        order: index + 1
      })
      const prefix = index === 0 ? introduction : `${attribution}\n\n---\n\n`
      const body =
        prefix +
        source.slice(
          lecture.heading.position.end.offset,
          lectures[index + 1]?.heading.position.start.offset
        )
      await writeFile(
        join(stagingNotes, lecture.filename),
        `---\n${document.toString()}---\n${body}`
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
    const planned = []
    for (const path of Object.keys(manifest.notes)) {
      const markdown = await readFile(join(stagingProject, 'src/content/notes', path), 'utf8')
      planned.push({
        path: join(projectRoot, 'src/content/notes', path),
        bytes: Buffer.from(markdown.replaceAll('/attachments/obsidian-', '/attachments/cs61a-'))
      })
    }
    for (const name of Object.keys(manifest.attachments))
      planned.push({
        path: join(projectRoot, 'public/attachments', name.replace(/^obsidian-/, 'cs61a-')),
        bytes: await readFile(join(stagingProject, 'public/attachments', name))
      })
    // Check every collision before copying any file; repeat imports are harmless.
    for (const file of planned) {
      const previous = await existingBytes(file.path)
      if (previous && digest(previous) !== digest(file.bytes))
        throw new Error(`目标文件已有不同内容，已停止导入：${file.path}`)
      file.exists = previous !== null
    }
    let written = 0
    for (const file of planned) {
      if (file.exists) continue
      await mkdir(dirname(file.path), { recursive: true })
      await writeFile(file.path, file.bytes, { flag: 'wx' })
      written += 1
    }
    return { notes: result.notes, attachments: result.attachments, written }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await importCs61a({ sourcePath: process.argv[2], date: process.argv[3] })
    console.log(
      `已导入 CS61A：${result.notes} 讲、${result.attachments} 张配图（写入 ${result.written} 项）。`
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'CS61A 导入失败。')
    process.exitCode = 1
  }
}
