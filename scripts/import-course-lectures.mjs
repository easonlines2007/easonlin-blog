import { mkdtemp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { Document } from 'yaml'
import { syncObsidian } from './obsidian-sync-lib.mjs'

const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const courses = { csapp: { topic: 'CSAPP', count: 26 }, cs61b: { topic: 'CS61B', count: 40 } }
// Lecture 3 refers to nonexistent slide numbers. Match the section topics to the
// supplied 02–03 Bits/Integers deck: Casting Surprises, Sign Extension, TAdd
// Overflow, and Compiled Multiplication Code. Source files stay untouched.
const csappImageFixes = new Map([
  ['./images/p03/slide_45.png', './images/p02/slide_28.png'],
  ['./images/p03/slide_56.png', './images/p02/slide_31.png'],
  ['./images/p03/slide_65.png', './images/p02/slide_39.png'],
  ['./images/p03/slide_78.png', './images/p03/slide_35.png']
])
const text = (node) => node.value ?? (node.children ?? []).map(text).join('')

function repairCs61bBody(body) {
  // The CS61B export contains Python string escapes in TeX commands. Restore
  // their literal backslashes so KaTeX receives frac/alpha/approx/to/etc.
  body = body.replace(
    /\u000crac|\u0007(?:lpha|pprox)|\t(?:o\b|imes\b|ext\b)|\r(?:floor\b|ight\b)/g,
    (value) => {
      const prefix = { '\f': 'f', '\u0007': 'a', '\t': 't', '\r': 'r' }[value[0]]
      return `\\${prefix}${value.slice(1)}`
    }
  )
  // Mermaid requires quoted titles when a subgraph label contains brackets or
  // parentheses. Give those five source labels explicit IDs and keep the text.
  const subgraphs = new Map([
    ['含有元素 [5, 10] 的链表', 'listWithElements'],
    ['路径压缩后 (单次 find 瞬间压平)', 'compressedTree'],
    ['分裂后 (中间 B 升入父节点)', 'splitNode'],
    ['集合 S (被点亮的已连通城镇)', 'connected'],
    ['集合 V - S (未被点亮的其余城镇)', 'unconnected']
  ])
  for (const [label, id] of subgraphs)
    body = body.replaceAll(`subgraph ${label}`, `subgraph ${id}["${label}"]`)
  return body
}

async function existingBytes(path) {
  try {
    return await readFile(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

// Use an isolated Vault and ownership manifest; never write to the source or real Vault.
export async function importCourseLectures({
  course,
  sourceDirectory,
  date,
  projectRoot = projectDirectory
}) {
  if (!Object.hasOwn(courses, course)) throw new Error('课程应为 csapp 或 cs61b。')
  const { topic, count } = courses[course]
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  )
    throw new Error('请指定真实的添加日期，例如 2026-10-21。')
  const sourceRoot = await realpath(sourceDirectory)
  const files = (await readdir(sourceRoot))
    .filter((name) => /^Lecture_\d+_.+\.md$/.test(name))
    .sort()
  if (files.length !== count) throw new Error(`${topic} 应包含完整的 ${count} 讲。`)
  const lectures = []
  for (const [index, name] of files.entries()) {
    const source = await readFile(join(sourceRoot, name), 'utf8')
    const heading = fromMarkdown(source).children[0]
    const match =
      heading?.type === 'heading' && heading.depth === 1
        ? text(heading).match(/^L(\d+)\s*·\s*(.+)$/)
        : null
    if (
      !match ||
      Number(match[1]) !== index + 1 ||
      Number(name.match(/^Lecture_(\d+)/)[1]) !== index + 1
    )
      throw new Error(`${topic} 讲次不连续或标题与文件名不符：${name}`)
    lectures.push({
      name,
      filename: `lecture-${String(index + 1).padStart(2, '0')}.md`,
      title: `Lecture ${String(index + 1).padStart(2, '0')} · ${match[2]}`,
      description: `${topic} 第 ${index + 1} 讲：${match[2]}`,
      body:
        course === 'cs61b'
          ? repairCs61bBody(source.slice(heading.position.end.offset).trimStart())
          : source.slice(heading.position.end.offset).trimStart()
    })
  }
  const destinations = new Map(
    lectures.map(({ name, filename }) => [name, `/notes/${course}/${filename.slice(0, -3)}`])
  )
  destinations.set('README.md', `/notes/topics/${topic}`)
  const temporary = await mkdtemp(join(tmpdir(), `${course}-import-`))
  try {
    const vaultPath = join(temporary, 'vault')
    const stagingProject = join(temporary, 'project')
    const stagingNotes = join(vaultPath, 'Blog', topic)
    await mkdir(stagingNotes, { recursive: true })
    await mkdir(stagingProject)
    for (const [index, lecture] of lectures.entries()) {
      const replacements = []
      function visit(node) {
        if (node.type === 'link' || node.type === 'image') {
          const target =
            node.type === 'image'
              ? course === 'csapp' && index === 2 && csappImageFixes.get(node.url)
              : destinations.get(node.url.replace(/^\.\//, ''))
          if (target) {
            const { start, end } = node.position
            const original = lecture.body.slice(start.offset, end.offset)
            const rewritten = original.replace(`](${node.url})`, `](${target})`)
            if (rewritten === original) throw new Error(`无法转换课程链接：${node.url}`)
            replacements.push({ start: start.offset, end: end.offset, value: rewritten })
          }
        }
        for (const child of node.children ?? []) visit(child)
      }
      visit(fromMarkdown(lecture.body))
      let body = lecture.body
      for (const change of replacements.sort((a, b) => b.start - a.start))
        body = body.slice(0, change.start) + change.value + body.slice(change.end)
      const metadata = new Document({
        title: lecture.title,
        description: lecture.description,
        date,
        topic,
        tags: [course],
        status: 'completed',
        publish: true,
        order: index + 1
      })
      await writeFile(
        join(stagingNotes, lecture.filename),
        `---\n${metadata.toString()}---\n\n${body}`
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
        bytes: Buffer.from(markdown.replaceAll('/attachments/obsidian-', `/attachments/${course}-`))
      })
    }
    for (const name of Object.keys(manifest.attachments))
      planned.push({
        path: join(projectRoot, 'public/attachments', name.replace(/^obsidian-/, `${course}-`)),
        bytes: await readFile(join(stagingProject, 'public/attachments', name))
      })
    // Validate every destination before writing, including a conflict in the last lecture.
    for (const file of planned) {
      const previous = await existingBytes(file.path)
      if (previous && !previous.equals(file.bytes))
        throw new Error(`目标文件已有不同内容：${file.path}`)
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
    const result = await importCourseLectures({
      course: process.argv[2],
      sourceDirectory: process.argv[3],
      date: process.argv[4]
    })
    console.log(
      `已导入 ${process.argv[2].toUpperCase()}：${result.notes} 讲、${result.attachments} 张配图（写入 ${result.written} 项）。`
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : '课程导入失败。')
    process.exitCode = 1
  }
}
