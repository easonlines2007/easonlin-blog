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
  csapp: { topic: 'CSAPP', count: 26 },
  cs61a: { topic: 'CS61A', count: 37 },
  cs61b: { topic: 'CS61B', count: 40 }
}
// Lecture 3 refers to nonexistent slide numbers. Match the section topics to the
// supplied 02–03 Bits/Integers deck: Casting Surprises, Sign Extension, TAdd
// Overflow, and Compiled Multiplication Code. Source files stay untouched.
const csappImageFixes = new Map([
  ['./images/p03/slide_45.png', './images/p02/slide_28.png'],
  ['./images/p03/slide_48.png', './images/p02/slide_28.png'],
  ['./images/p03/slide_56.png', './images/p02/slide_31.png'],
  ['./images/p03/slide_65.png', './images/p02/slide_39.png'],
  ['./images/p03/slide_78.png', './images/p03/slide_35.png']
])
const text = (node) => node.value ?? (node.children ?? []).map(text).join('')
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')
const missingTextbookImages = new Map([
  [
    'https://joshhug.gitbooks.io/hug61b/content/assets/Screen%20Shot%202019-03-23%20at%208.29.56%20PM.png',
    [
      'Dijkstra 搜索范围与 A* 示意说明',
      'https://cs61b-2.gitbook.io/cs61b-textbook/24.-shortest-paths/24.3-a-algorithm'
    ]
  ],
  [
    'https://joshhug.gitbooks.io/hug61b/content/assets/Screen%20Shot%202019-04-14%20at%208.57.22%20PM.png',
    [
      '最小生成树与割性质说明',
      'https://cs61b-2.gitbook.io/cs61b-textbook/25.-minimum-spanning-trees'
    ]
  ]
])
// Six legacy Google-hosted illustrations in the imported Quicksort section
// returned 404 on 2026-10-22. Keep their captions and link to the chapter.
const missingQuicksortImages = new Set([
  '3f28754c1bd36eeefc6ea5762a30dae21c6eca94157cdd52daf6ace575539050',
  '26974851c500091b81c8f9ecd7cc899e0268e1c762bc36a09db16f532240e053',
  'f0df2b7c6f95bff2f9e963bebd688a80a326d78e570b664b5b5810fda1d5d00b',
  '3fe397e94d59f030e0361946b33d562df3db539ba308f74955cedcaedecfa9ba',
  '5e9d36b559ba3c2eab73d3b6141b9b28f7d3f594b08ca2b6014297a4aa8d99dc',
  '18c53b4128b5b907dae43b16f804f76153f39bff6faf0f5d2d446ff82cc39350'
])

function repairMermaid(source) {
  let group = 0
  return source
    .replace(/^(\s*)subgraph ([^\n]+)$/gm, (line, indent, label) =>
      !label.includes('[') && !label.startsWith('"') && /[():]/.test(label)
        ? `${indent}subgraph importedGroup${group++}["${label}"]`
        : line
    )
    .replace(/((?:-->|---|==>|===|-\.->)\|)([^|\n]+)\|/g, (line, prefix, label) =>
      !label.startsWith('"') && /[():]|->/.test(label) ? `${prefix}"${label}"|` : line
    )
}

function repairMathBlocks(body) {
  const protectedRanges = []
  function visit(node) {
    if (node.type === 'code' || node.type === 'inlineCode')
      protectedRanges.push([node.position.start.offset, node.position.end.offset])
    else for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(body))
  function repair(value) {
    return value.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
      formula = formula.replace(/\\`\\`cat"/g, '\\text{"cat"}').replace(/\\\*/g, '\\cdot ')
      return formula.includes('\n') ? `$$\n${formula.trim()}\n$$` : `$$${formula}$$`
    })
  }
  let result = ''
  let cursor = 0
  for (const [start, end] of protectedRanges.sort((a, b) => a[0] - b[0])) {
    result += repair(body.slice(cursor, start)) + body.slice(start, end)
    cursor = end
  }
  return result + repair(body.slice(cursor))
}

function readMetadata(bytes, path) {
  const match = bytes.toString('utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`目标笔记缺少 frontmatter：${path}`)
  const document = parseDocument(match[1])
  if (document.errors.length) throw new Error(`目标笔记 frontmatter 无效：${path}`)
  return document.toJS()
}

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
  updated,
  projectRoot = projectDirectory
}) {
  if (!Object.hasOwn(courses, course)) throw new Error('课程应为 csapp、cs61a 或 cs61b。')
  const { topic, count } = courses[course]
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  )
    throw new Error('请指定真实的添加日期，例如 2026-10-21。')
  if (
    updated !== undefined &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(updated) ||
      new Date(`${updated}T00:00:00Z`).toISOString().slice(0, 10) !== updated)
  )
    throw new Error('请指定真实的更新日期。')
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
        ? text(heading).match(/^(?:L(?:ecture)?\s*(\d+)|第\s*(\d+)\s*讲)[\s·:：-]+(.+)$/i)
        : null
    if (
      !match ||
      Number(match[1] ?? match[2]) !== index + 1 ||
      Number(name.match(/^Lecture_(\d+)/)[1]) !== index + 1
    )
      throw new Error(`${topic} 讲次不连续或标题与文件名不符：${name}`)
    const filename = `lecture-${String(index + 1).padStart(2, '0')}.md`
    const path = join(projectRoot, 'src/content/notes', topic, filename)
    const previous = await existingBytes(path)
    lectures.push({
      name,
      filename,
      previous,
      metadata: updated && previous ? readMetadata(previous, path) : {},
      title: `Lecture ${String(index + 1).padStart(2, '0')} · ${match[3]}`,
      description: `${topic} 第 ${index + 1} 讲：${match[3]}`,
      body: repairMathBlocks(
        course === 'cs61b'
          ? repairCs61bBody(source.slice(heading.position.end.offset).trimStart())
          : source.slice(heading.position.end.offset).trimStart()
      )
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
        if (course === 'cs61b' && node.type === 'html' && node.value.includes('<img')) {
          const value = node.value.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (tag, url) =>
              missingQuicksortImages.has(digest(url.replaceAll('&amp;', '&')))
                ? '<a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">原教材配图已失效，查看快速排序章节说明。</a>'
              : tag
          )
          if (value !== node.value)
            replacements.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              value
            })
        }
        if (node.type === 'code' && node.lang === 'mermaid') {
          const original = lecture.body.slice(node.position.start.offset, node.position.end.offset)
          const value = original.replace(node.value, repairMermaid(node.value))
          if (value !== original)
            replacements.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              value
            })
        }
        if (course === 'cs61b' && node.type === 'text' && node.value.includes('{%')) {
          const original = lecture.body.slice(node.position.start.offset, node.position.end.offset)
          const value = original
            .replace(/\{%\s*(?:endembed|endhint)\s*%\}/g, '')
            .replace(/\{%\s*hint\s+style="[^"]*"\s*%\}/g, '**补充说明**')
          if (value !== original)
            replacements.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              value
            })
        }
        if (course === 'cs61b' && node.type === 'image' && missingTextbookImages.has(node.url)) {
          const [label, url] = missingTextbookImages.get(node.url)
          replacements.push({
            start: node.position.start.offset,
            end: node.position.end.offset,
            value: `*原教材中的此处配图链接已失效，可参阅[${label}](${url})。*`
          })
          return
        }
        if (node.type === 'link' || node.type === 'image') {
          const target =
            node.type === 'image'
              ? course === 'csapp' &&
                index === 2 &&
                (node.url === './images/p03/slide_45.png' && /位模式|底层机制/.test(node.alt ?? '')
                  ? './images/p02/slide_22.png'
                  : csappImageFixes.get(node.url))
              : (destinations.get(node.url.replace(/^\.\//, '')) ??
                (course === 'cs61b' && node.url.startsWith('/cs61b-textbook/')
                  ? `https://cs61b-2.gitbook.io${node.url.replace(/\.md(?=#|$)/, '')}`
                  : undefined))
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
        date,
        tags: [course],
        status: 'completed',
        publish: true,
        ...lecture.metadata,
        title: lecture.title,
        description: lecture.description,
        topic,
        order: index + 1,
        ...(updated ? { updated } : {})
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
    const assetNames = new Map()
    const attachmentsDirectory = join(projectRoot, 'public/attachments')
    let existingAssets = []
    try {
      existingAssets = (await readdir(attachmentsDirectory))
        .filter((name) => name.startsWith(`${course}-`))
        .sort()
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    const byDigest = new Map()
    for (const name of existingAssets) {
      const bytes = await readFile(join(attachmentsDirectory, name))
      byDigest.set(digest(bytes), name)
    }
    for (const name of Object.keys(manifest.attachments)) {
      const bytes = await readFile(join(stagingProject, 'public/attachments', name))
      const fingerprint = digest(bytes)
      const destination = byDigest.get(fingerprint) ?? name.replace(/^obsidian-/, `${course}-`)
      assetNames.set(name, destination)
      if (byDigest.has(fingerprint)) continue
      byDigest.set(fingerprint, destination)
      planned.push({ path: join(attachmentsDirectory, destination), bytes })
    }
    for (const path of Object.keys(manifest.notes)) {
      let markdown = await readFile(join(stagingProject, 'src/content/notes', path), 'utf8')
      for (const [original, destination] of assetNames)
        markdown = markdown.replaceAll(`/attachments/${original}`, `/attachments/${destination}`)
      planned.push({
        path: join(projectRoot, 'src/content/notes', path),
        bytes: Buffer.from(markdown),
        previous: lectures.find((lecture) => path === `${topic}/${lecture.filename}`)?.previous,
        replace: updated !== undefined
      })
    }
    // Validate every destination before writing, including a conflict in the last lecture.
    for (const file of planned) {
      const previous = await existingBytes(file.path)
      if (
        file.replace &&
        !((previous === null && file.previous === null) || previous?.equals(file.previous))
      )
        throw new Error(`导入期间目标笔记发生变化，已停止：${file.path}`)
      if (previous && !previous.equals(file.bytes) && !file.replace)
        throw new Error(`目标文件已有不同内容：${file.path}`)
      file.exists = previous?.equals(file.bytes) ?? false
    }
    let written = 0
    for (const file of planned) {
      if (file.exists) continue
      await mkdir(dirname(file.path), { recursive: true })
      await writeFile(file.path, file.bytes, { flag: file.replace && file.previous ? 'w' : 'wx' })
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
      date: process.argv[4],
      updated: process.argv[5]
    })
    console.log(
      `已导入 ${process.argv[2].toUpperCase()}：${result.notes} 讲、${result.attachments} 张配图（写入 ${result.written} 项）。`
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : '课程导入失败。')
    process.exitCode = 1
  }
}
