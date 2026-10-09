import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { parse } from 'yaml'
import { importCs61a } from '../scripts/import-cs61a.mjs'
import { syncObsidian } from '../scripts/obsidian-sync-lib.mjs'

const date = '2026-10-09'
const image = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0x0a, 0x0d, 0x80])
const formula = '$$\nA\n=\nB\n$$'
const filename = (number) => `lecture-${String(number).padStart(2, '0')}.md`
const metadata = (source) => parse(source.match(/^---\n([\s\S]*?)\n---/)[1])

function book({ missingImage = false, count = 37 } = {}) {
  const introduction =
    '# CS61A: 计算机程序的结构与解释\n\n> 主讲：John DeNero\n\n' +
    '[在线目录](http://localhost:8080/cs61a.html)\n\n---\n\n## 总目录\n\n' +
    Array.from(
      { length: count },
      (_, index) => `[第 ${index + 1} 讲](BV1sy411z7nA_p${index + 1}/book.html)`
    ).join('\n\n') +
    '\n\n'
  return (
    introduction +
    Array.from({ length: count }, (_, index) => {
      const number = index + 1
      const heading =
        number <= 8
          ? `L${number} · Topic ${number}`
          : number <= 28
            ? `Lecture ${number}: Topic ${number}`
            : `第 ${number} 讲：Topic ${number}`
      let body = `# ${heading}\n\n正文标记 ${number}。\n\n${formula}\n\n`
      if (number === 1)
        body +=
          '```python\n# Lecture 99: 代码注释不应拆分\nprint("hello")\n```\n\n' +
          '![板书](BV1sy411z7nA_p1/images/shot.png)\n\n'
      if (number === count)
        body += `![末讲板书](BV1sy411z7nA_p1/images/${missingImage ? 'missing' : 'shot'}.png)\n\n`
      return body
    }).join('')
  )
}

async function snapshot(root) {
  const files = {}
  async function visit(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`
      const path = join(directory, entry.name)
      if (entry.isDirectory()) await visit(path, `${relative}/`)
      else if (entry.isFile())
        files[relative] = {
          digest: createHash('sha256')
            .update(await readFile(path))
            .digest('hex'),
          modified: (await stat(path)).mtimeMs
        }
    }
  }
  await visit(root)
  return files
}

async function fixture(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'eason-cs61a-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const projectRoot = join(root, 'project')
  const sourceRoot = join(root, 'source')
  const vaultPath = join(root, 'existing-vault')
  const sourcePath = join(sourceRoot, 'CS61A.md')
  await mkdir(projectRoot)
  await mkdir(join(vaultPath, 'Blog'), { recursive: true })
  await mkdir(join(sourceRoot, 'BV1sy411z7nA_p1/images'), { recursive: true })
  await writeFile(
    join(vaultPath, 'Blog/existing.md'),
    '---\ntitle: 已有笔记\ndate: 2026-01-01\npublish: true\n---\n\n保留已有笔记。\n'
  )
  // Start with a genuine export and its ownership manifest, rather than a dummy file.
  await syncObsidian({ vaultPath, projectRoot })
  await writeFile(sourcePath, book(options))
  await writeFile(join(sourceRoot, 'BV1sy411z7nA_p1/images/shot.png'), image)
  return {
    root,
    projectRoot,
    sourceRoot,
    sourcePath,
    vaultPath,
    run: () => importCs61a({ sourcePath, date, projectRoot }),
    output: (number) =>
      readFile(join(projectRoot, 'src/content/notes/CS61A', filename(number)), 'utf8')
  }
}

test('imports all 37 lectures with completed metadata, intact content and bytes, without touching existing ownership', async (t) => {
  const f = await fixture(t)
  const sourceBefore = await snapshot(f.sourceRoot)
  const vaultBefore = await snapshot(f.vaultPath)
  const projectBefore = await snapshot(f.projectRoot)
  assert.deepEqual(await f.run(), { notes: 37, attachments: 1, written: 38 })
  const notes = await readdir(join(f.projectRoot, 'src/content/notes/CS61A'))
  assert.deepEqual(
    notes.sort(),
    Array.from({ length: 37 }, (_, index) => filename(index + 1))
  )

  for (let number = 1; number <= 37; number += 1) {
    const output = await f.output(number)
    const data = metadata(output)
    assert.equal(data.title, `Lecture ${String(number).padStart(2, '0')} · Topic ${number}`)
    assert.equal(data.description, `CS61A 第 ${number} 讲：Topic ${number}`)
    assert.equal(data.topic, 'CS61A')
    assert.deepEqual(data.tags, ['cs61a'])
    assert.equal(data.status, 'completed')
    assert.equal(data.order, number)
    assert.equal(data.date, date)
    assert.match(output, new RegExp(`正文标记 ${number}。`))
    assert.ok(output.includes(formula))
    assert.match(output, /主讲：John DeNero/)
    if (number < 37) assert.ok(!output.includes(`正文标记 ${number + 1}。`))
  }

  const first = await f.output(1)
  assert.match(first, /```python\n# Lecture 99: 代码注释不应拆分\nprint\("hello"\)\n```/)
  assert.match(first, /\[CS61A 专题目录\]\(\/notes\/topics\/CS61A\)/)
  for (let number = 1; number <= 37; number += 1)
    assert.ok(first.includes(`/notes/cs61a/${filename(number).slice(0, -3)}`))
  assert.ok(!first.includes('book.html'))
  assert.ok(!first.includes('localhost:8080'))
  assert.ok(!(await f.output(2)).includes('## 总目录'))

  const attachment = first.match(/!\[板书\]\(<(\/attachments\/cs61a-[a-f0-9]+\.png)>\)/)?.[1]
  assert.ok(attachment, 'images should use public course attachment URLs')
  assert.ok((await f.output(37)).includes(attachment))
  assert.deepEqual(await readFile(join(f.projectRoot, 'public', attachment)), image)
  assert.deepEqual(await snapshot(f.sourceRoot), sourceBefore)
  assert.deepEqual(await snapshot(f.vaultPath), vaultBefore)
  const afterImport = await snapshot(f.projectRoot)
  for (const [path, value] of Object.entries(projectBefore))
    assert.deepEqual(afterImport[path], value)

  assert.deepEqual(await f.run(), { notes: 37, attachments: 1, written: 0 })
  assert.deepEqual(await snapshot(f.projectRoot), afterImport)
})

test('a missing late image fails before any destination files are written', async (t) => {
  const f = await fixture(t, { missingImage: true })
  const before = await snapshot(f.root)
  await assert.rejects(f.run(), /不存在/)
  assert.deepEqual(await snapshot(f.root), before)
})

test('a conflicting late lecture fails before earlier notes or attachments are copied', async (t) => {
  const f = await fixture(t)
  const directory = join(f.projectRoot, 'src/content/notes/CS61A')
  await mkdir(directory)
  await writeFile(join(directory, filename(37)), '已存在且不能覆盖的末讲。')
  const before = await snapshot(f.root)
  await assert.rejects(f.run(), /目标文件已有不同内容/)
  assert.deepEqual(await snapshot(f.root), before)
})

test('incomplete or misnumbered lecture outlines cannot create a partial course', async (t) => {
  const f = await fixture(t, { count: 36 })
  const projectBefore = await snapshot(f.projectRoot)
  await assert.rejects(f.run(), /完整的 37 讲/)
  assert.deepEqual(await snapshot(f.projectRoot), projectBefore)
  await writeFile(f.sourcePath, book().replace('# Lecture 9:', '# Lecture 10:'))
  await assert.rejects(f.run(), /讲次不连续/)
  assert.deepEqual(await snapshot(f.projectRoot), projectBefore)
})
