import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  utimes,
  writeFile
} from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { test } from 'node:test'
import { parse } from 'yaml'
import { obsidianNoteId, syncObsidian } from '../scripts/obsidian-sync-lib.mjs'

const digest = (value) => createHash('sha256').update(value).digest('hex')
const note = (body = '正文', fields = '') =>
  `---\ntitle: 一篇笔记\ndescription: 用于同步测试\ndate: 2026-10-05\ntopic: 学习\ntags: [Obsidian, PDF]\nstatus: ready\npublish: true\n${fields}---\n\n${body}\n`
const minimalNote = (fields = '', body = '正文') => `---\npublish: true\n${fields}---\n\n${body}\n`
const exportedMetadata = (source) => parse(source.match(/^---\n([\s\S]*?)\n---/)[1])

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'eason-obsidian-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  let vaultPath = join(directory, 'vault')
  let projectRoot = join(directory, 'project')
  await mkdir(join(vaultPath, 'Blog'), { recursive: true })
  await mkdir(join(projectRoot, 'src/content/notes'), { recursive: true })
  await mkdir(join(projectRoot, 'src/data'), { recursive: true })
  await mkdir(join(projectRoot, 'public/attachments'), { recursive: true })
  vaultPath = await realpath(vaultPath)
  projectRoot = await realpath(projectRoot)
  const put = async (path, contents) => {
    await mkdir(join(path, '..'), { recursive: true })
    await writeFile(path, contents)
  }
  return {
    vaultPath,
    projectRoot,
    source: (path, contents) => put(join(vaultPath, path), contents),
    destination: (path, contents) => put(join(projectRoot, path), contents),
    output: (path) => readFile(join(projectRoot, path), 'utf8'),
    run: (options = {}) => syncObsidian({ vaultPath, projectRoot, ...options })
  }
}

test('scoped Lin sync preserves other managed courses and assets, skips empty drafts, and cleans only its scope', async (t) => {
  const f = await fixture(t)
  await f.source('MIT/course.md', note('![board](../board.png)'))
  await f.source('FC/old.md', note('old FC'))
  await f.source('board.png', 'original board')
  await f.run({ publishAll: true })
  const course = await f.output('src/content/notes/MIT/course.md')
  const oldFC = await f.output('src/content/notes/FC/old.md')
  const oldManifest = JSON.parse(await f.output('src/data/obsidian-sync.json'))
  await rm(join(f.vaultPath, 'MIT'), { recursive: true })
  await rm(join(f.vaultPath, 'FC'), { recursive: true })
  await f.source('CS61A - Lin/Lec 2 - Functions.md', 'personal CS61A notes')
  await f.source('CS61A - Lin/empty.md', '')
  await f.source('FC - Lin/lab.md', 'personal FC notes')
  const options = { publishAll: true, sourceFolders: ['CS61A - Lin', 'FC - Lin'], skipEmpty: true }
  const vaultBefore = await snapshot(f.vaultPath)
  const result = await f.run(options)
  assert.equal(result.notes, 2)
  assert.equal(await f.output('src/content/notes/MIT/course.md'), course)
  assert.equal(await f.output('src/content/notes/FC/old.md'), oldFC)
  await assert.rejects(f.output('src/content/notes/CS61A - Lin/empty.md'), { code: 'ENOENT' })
  const personal = exportedMetadata(
    await f.output('src/content/notes/CS61A - Lin/Lec 2 - Functions.md')
  )
  assert.equal(personal.category, 'lin')
  assert.equal(personal.order, 2)
  let manifest = JSON.parse(await f.output('src/data/obsidian-sync.json'))
  assert.equal(Object.keys(manifest.notes).length, 4)
  assert.deepEqual(manifest.attachments, oldManifest.attachments)
  assert.deepEqual(await snapshot(f.vaultPath), vaultBefore)
  assert.equal((await f.run(options)).written, 0)
  await rm(join(f.vaultPath, 'FC - Lin/lab.md'))
  await f.run(options)
  manifest = JSON.parse(await f.output('src/data/obsidian-sync.json'))
  assert.equal(Object.keys(manifest.notes).length, 3)
  assert.equal(await f.output('src/content/notes/MIT/course.md'), course)
  assert.deepEqual(manifest.attachments, oldManifest.attachments)
  const beforeFailure = await snapshot(f.projectRoot)
  await assert.rejects(f.run({ ...options, sourceFolders: ['missing-folder'] }), /文件不存在/)
  await assert.rejects(f.run({ ...options, sourceFolders: ['../outside'] }), /安全相对目录/)
  assert.deepEqual(await snapshot(f.projectRoot), beforeFailure)
})

test('category routes are reserved and scoped sync refreshes reused attachments', async (t) => {
  const f = await fixture(t)
  assert.throws(() => obsidianNoteId('categories/lin.md'), /占用了现有栏目/)
  await f.source('FC - Lin/lab.md', '![diagram](../diagram.png)')
  await f.source('diagram.png', 'first diagram')
  const options = { publishAll: true, sourceFolders: ['FC - Lin'] }
  await f.run(options)
  const manifest = JSON.parse(await f.output('src/data/obsidian-sync.json'))
  const name = Object.keys(manifest.attachments)[0]
  await f.source('diagram.png', 'updated diagram')
  await f.run(options)
  assert.equal(await f.output(`public/attachments/${name}`), 'updated diagram')
})

test('completed and ready notes keep distinct statuses and invalid status changes preserve the last export', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/ready.md', note())
  await f.source('Blog/completed.md', note().replace('status: ready', 'status: completed'))
  assert.equal((await f.run()).notes, 2)
  assert.equal(exportedMetadata(await f.output('src/content/notes/ready.md')).status, 'ready')
  assert.equal(
    exportedMetadata(await f.output('src/content/notes/completed.md')).status,
    'completed'
  )
  const before = await snapshot(f.projectRoot)
  await f.source('Blog/completed.md', note().replace('status: ready', 'status: complete'))
  await assert.rejects(f.run(), /status 必须是/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('course imports split five modules, preserve formula bytes and external images, and remain repeatable', async (t) => {
  const f = await fixture(t)
  const sourcePath = 'MIT 18.06/course.md'
  const attachmentRoot = join(f.projectRoot, 'external-assets')
  await mkdir(join(attachmentRoot, 'p1'), { recursive: true })
  await writeFile(join(attachmentRoot, 'p1/image.png'), 'original image bytes')
  const modules = Array.from({ length: 5 }, (_, index) => ({
    heading: `Lecture ${index + 1}`,
    output: `MIT 18.06/module-${index + 1}.md`,
    description: `第 ${index + 1} 份笔记`
  }))
  const formula = '$$\nA\n=\nB\n$$'
  const content =
    '> 作者与许可\n\n---\n\n## 导读\n保留导读。\n\n' +
    modules
      .map(
        (module, index) =>
          `# ${module.heading}\n\n## 第 ${index + 1} 讲\n正文 ${index + 1}\n\n${formula}\n\n![板书](p1/image.png)\n\n[原视频](https://www.bilibili.com/video/example/?p=${index + 1})\n\n` +
          (index === 0 ? '```markdown\n# 不是模块\n```\n\n' : '')
      )
      .join('')
  await f.source(sourcePath, content)
  const options = {
    publishAll: true,
    attachmentRoot,
    noteImports: {
      [sourcePath]: { topic: 'MIT 18.06', tags: ['lineal algebra'], status: 'ready', modules }
    }
  }
  const vaultBefore = await snapshot(f.vaultPath)
  const assetBefore = await snapshot(attachmentRoot)
  const result = await f.run(options)
  assert.equal(result.notes, 5)
  assert.equal(result.attachments, 1)
  for (const [index, module] of modules.entries()) {
    const output = await f.output(`src/content/notes/${module.output}`)
    const metadata = exportedMetadata(output)
    assert.equal(metadata.order, index + 1)
    assert.equal(metadata.topic, 'MIT 18.06')
    assert.deepEqual(metadata.tags, ['lineal algebra'])
    assert.equal(metadata.status, 'ready')
    assert.match(output, new RegExp(`正文 ${index + 1}`))
    assert.ok(output.includes(formula))
    assert.match(output, /作者与许可/)
    assert.match(output, /!\[板书\]\(<\/attachments\/obsidian-[a-f0-9]+\.png>\)/)
    assert.equal(output.includes('保留导读'), index === 0)
  }
  assert.deepEqual(await snapshot(f.vaultPath), vaultBefore)
  assert.deepEqual(await snapshot(attachmentRoot), assetBefore)
  const beforeRepeat = await snapshot(f.projectRoot)
  assert.equal((await f.run(options)).written, 0)
  assert.deepEqual(await snapshot(f.projectRoot), beforeRepeat)
  // A changed source outline must not silently truncate modules or clean up the last good export.
  await f.source(sourcePath, content.replace('# Lecture 5', '# Unexpected module'))
  await assert.rejects(f.run(options), /一级目录已变化/)
  assert.deepEqual(await snapshot(f.projectRoot), beforeRepeat)
})

test('external attachment lookup rejects traversal and symlinked files without changing the project', async (t) => {
  const f = await fixture(t)
  const attachmentRoot = join(f.projectRoot, 'external-assets')
  await mkdir(attachmentRoot)
  await f.destination('secret.png', 'not a public image')
  await f.source('Blog/note.md', note('![图](../secret.png)'))
  let before = await snapshot(f.projectRoot)
  await assert.rejects(f.run({ attachmentRoot }), /不存在/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
  await symlink(join(f.projectRoot, 'secret.png'), join(attachmentRoot, 'image.png'))
  await f.source('Blog/note.md', note('![图](image.png)'))
  before = await snapshot(f.projectRoot)
  await assert.rejects(f.run({ attachmentRoot }), /符号链接/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('note routes reserve all navigation entry points', () => {
  for (const route of ['all', 'status', 'topics', 'tags', 'pdf', 'index']) {
    assert.throws(() => obsidianNoteId(`${route}.md`), /占用/)
  }
})

async function snapshot(root) {
  const result = {}
  async function visit(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = `${prefix}${entry.name}`
      if (entry.isDirectory()) await visit(join(directory, entry.name), `${name}/`)
      else if (entry.isFile()) result[name] = digest(await readFile(join(directory, entry.name)))
    }
  }
  await visit(root)
  return result
}

test('only literal published Blog Markdown syncs with nested directories; all Vault bytes stay unchanged', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/课程/Linear Algebra.md', note('内容'))
  await f.source('Blog/draft.md', note('私密', 'publish: false\n').replace('publish: true\n', ''))
  await f.source('Blog/missing-publish.md', note('私密').replace('publish: true\n', ''))
  await f.source('Outside.md', note('不属于 Blog'))
  await f.source('.obsidian/private.md', note('不读取此目录'))
  await f.destination('src/content/notes/manual.md', note('已有内容'))
  const before = await snapshot(f.vaultPath)
  const result = await f.run()
  assert.equal(result.notes, 1)
  assert.equal(result.written, 1)
  assert.match(await f.output('src/content/notes/课程/Linear Algebra.md'), /内容/)
  assert.match(await f.output('src/content/notes/manual.md'), /已有内容/)
  assert.deepEqual(await snapshot(f.vaultPath), before)
  assert.deepEqual(Object.keys(JSON.parse(await f.output('src/data/obsidian-sync.json')).notes), [
    '课程/Linear Algebra.md'
  ])
})

test('publish true alone exports filename metadata and the source modification UTC date without editing the Vault', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/First Note.md', minimalNote())
  const modified = new Date('2024-03-07T23:45:00.000Z')
  await utimes(join(f.vaultPath, 'Blog/First Note.md'), modified, modified)
  const before = await snapshot(f.vaultPath)
  const result = await f.run()
  assert.equal(result.notes, 1)
  const data = exportedMetadata(await f.output('src/content/notes/First Note.md'))
  assert.equal(data.title, 'First Note')
  assert.equal(data.description, '')
  assert.equal(data.topic, '随笔')
  assert.equal(data.date, '2024-03-07')
  assert.equal(data.publish, true)
  assert.deepEqual(await snapshot(f.vaultPath), before)
})

test('empty Obsidian properties get safe defaults and nested notes use the first directory as topic', async (t) => {
  const f = await fixture(t)
  await f.source(
    'Blog/课程/子模块/空字段.md',
    minimalNote(
      'title: "  "\ndescription: null\ntopic: "  "\ndate: null\ntags:\nstatus: ""\nupdated: "  "\npdf: null\nsample: ""\n'
    )
  )
  const modified = new Date('2024-02-29T10:30:00.000Z')
  await utimes(join(f.vaultPath, 'Blog/课程/子模块/空字段.md'), modified, modified)
  const before = await snapshot(f.vaultPath)
  await f.run()
  const data = exportedMetadata(await f.output('src/content/notes/课程/子模块/空字段.md'))
  assert.equal(data.title, '空字段')
  assert.equal(data.description, '')
  assert.equal(data.topic, '课程')
  assert.equal(data.date, '2024-02-29')
  assert.deepEqual(data.tags, [])
  assert.ok(data.status === undefined || data.status === 'growing')
  for (const field of ['updated', 'pdf', 'sample']) assert.ok(!Object.hasOwn(data, field))
  assert.deepEqual(await snapshot(f.vaultPath), before)
})

test('a missing date retains the verified owned publication date after source edits and later syncs are no-ops', async (t) => {
  const f = await fixture(t)
  const path = join(f.vaultPath, 'Blog/entry.md')
  await f.source('Blog/entry.md', minimalNote('', '初版'))
  const firstDate = new Date('2024-01-03T16:00:00.000Z')
  await utimes(path, firstDate, firstDate)
  await f.run()
  assert.equal(exportedMetadata(await f.output('src/content/notes/entry.md')).date, '2024-01-03')
  await f.source('Blog/entry.md', minimalNote('date: "  "\n', '修改正文'))
  const modified = new Date('2026-10-05T09:00:00.000Z')
  await utimes(path, modified, modified)
  const result = await f.run()
  assert.equal(result.written, 1)
  const output = await f.output('src/content/notes/entry.md')
  assert.equal(exportedMetadata(output).date, '2024-01-03')
  assert.match(output, /修改正文/)
  const before = await snapshot(f.projectRoot)
  const repeated = await f.run()
  assert.equal(repeated.written, 0)
  assert.equal(repeated.removed, 0)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('explicit invalid, numeric and boolean dates fail clearly rather than silently falling back or becoming 1970', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', minimalNote('date: 2026-10-05\n'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  for (const value of [
    'nope',
    20261005,
    0,
    true,
    false,
    [2026, 10, 5],
    { year: 2026 },
    '2026-02-30',
    '2026-2-30',
    '2026/02/30',
    '2026-02-29',
    '2026-13-01',
    '2026-10-05T99:00:00Z'
  ]) {
    await f.source('Blog/entry.md', minimalNote(`date: ${JSON.stringify(value)}\n`))
    await assert.rejects(f.run, /date/)
    assert.deepEqual(await snapshot(f.projectRoot), before)
  }
})

test('valid ISO timestamps retain their time and explicit metadata types still require valid values', async (t) => {
  const f = await fixture(t)
  const timestamp = '2026-10-05T01:23:45+02:00'
  await f.source(
    'Blog/entry.md',
    minimalNote(`date: "${timestamp}"\nupdated: "2026-10-05T18:00:00Z"\n`)
  )
  await f.run()
  const data = exportedMetadata(await f.output('src/content/notes/entry.md'))
  assert.equal(typeof data.date, 'string')
  assert.equal(new Date(data.date).getTime(), new Date(timestamp).getTime())
  assert.match(data.date, /T/)
  assert.equal(new Date(data.updated).getTime(), new Date('2026-10-05T18:00:00Z').getTime())
  const before = await snapshot(f.projectRoot)
  for (const [field, value] of [
    ['title', 42],
    ['description', {}],
    ['topic', []]
  ]) {
    await f.source('Blog/entry.md', minimalNote(`${field}: ${JSON.stringify(value)}\n`))
    await assert.rejects(f.run, new RegExp(field))
    assert.deepEqual(await snapshot(f.projectRoot), before)
  }
})

test('whole-Vault publishing is explicit, includes drafts, preserves Blog routes and never changes source bytes', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note('原网址'))
  await f.run()
  await f.source('FC/Laboratory/Lab.md', '# 实验\n\n[[entry|测试笔记]]\n\n![[image.png]]')
  await f.source('FC/Teoria/draft.md', '---\npublish: false\n---\n\n草稿')
  await f.source('Assets/image.png', 'image')
  await f.source('.obsidian/secret.md', '不能导入')
  await f.source('.hidden/private.md', '不能导入')
  const before = await snapshot(f.vaultPath)
  const result = await syncObsidian({ ...f, publishAll: true })
  assert.equal(result.notes, 3)
  assert.equal(result.attachments, 1)
  const lab = await f.output('src/content/notes/FC/Laboratory/Lab.md')
  assert.match(lab, /publish: true/)
  assert.match(lab, /\/notes\/entry/)
  assert.match(lab, /\/attachments\/obsidian-[a-f\d]{24}\.png/)
  assert.match(await f.output('src/content/notes/FC/Teoria/draft.md'), /publish: true/)
  assert.match(await f.output('src/content/notes/entry.md'), /原网址/)
  assert.deepEqual(await snapshot(f.vaultPath), before)
  assert.equal((await syncObsidian({ ...f, publishAll: true })).written, 0)
  await assert.rejects(() => syncObsidian({ ...f, publishAll: 'true' }), /布尔值/)
  const restored = await f.run()
  assert.equal(restored.notes, 1)
  assert.equal(restored.removed, 3)
})

test('whole-Vault mode also works without a Blog folder', async (t) => {
  const f = await fixture(t)
  await rm(join(f.vaultPath, 'Blog'), { recursive: true })
  await f.source('FC/lesson.md', '课程正文')
  assert.equal((await syncObsidian({ ...f, publishAll: true })).notes, 1)
  assert.match(await f.output('src/content/notes/FC/lesson.md'), /publish: true/)
})

test('relative images, PDFs, reference definitions and Obsidian embeds resolve to stable public assets', async (t) => {
  const f = await fixture(t)
  const image = Buffer.from('image contents')
  const pdf = Buffer.from('%PDF-1.7 fixture')
  await f.source('Assets/画 图 #1.png', image)
  await f.source('Assets/lecture notes.pdf', pdf)
  await f.source(
    'Blog/nested/entry.md',
    note(
      '![原图](<../../Assets/画 图 %231.png> "说明")\n\n[讲义](../../Assets/lecture%20notes.pdf#page=2)\n\n![参考][picture]\n\n[picture]: <../../Assets/画 图 %231.png> "标题"\n\n![[Assets/画 图 #1.png|240]]\n\n![[Assets/lecture notes.pdf]]',
      'pdf: Assets/lecture notes.pdf\n'
    ).replace('画 图 #1.png|240', '画 图 %231.png|240')
  )
  const before = await snapshot(f.vaultPath)
  const result = await f.run()
  assert.equal(result.attachments, 2)
  assert.equal(result.written, 3)
  const output = await f.output('src/content/notes/nested/entry.md')
  const files = await readdir(join(f.projectRoot, 'public/attachments'))
  const imageName = files.find((name) => name.endsWith('.png'))
  const pdfName = files.find((name) => name.endsWith('.pdf'))
  assert.match(imageName, /^obsidian-[a-f\d]{24}\.png$/)
  assert.match(output, new RegExp(`/attachments/${imageName}`, 'g'))
  assert.match(output, new RegExp(`/attachments/${pdfName}#page=2`))
  assert.match(output, new RegExp(`pdf: /attachments/${pdfName}`))
  assert.match(output, /\[picture\]: </)
  assert.deepEqual(await readFile(join(f.projectRoot, 'public/attachments', imageName)), image)
  assert.deepEqual(await readFile(join(f.projectRoot, 'public/attachments', pdfName)), pdf)
  assert.deepEqual(await snapshot(f.vaultPath), before)
})

test('fenced code, inline code and escaped wikilinks remain literal and never request attachments', async (t) => {
  const f = await fixture(t)
  const body =
    '```md\n![[private.png]]\n![x](missing.png)\n```\n\n`![[inline.pdf]]`\n\n\\![[escaped.png]]\n\n\\[[escaped-note]]'
  await f.source('Blog/code.md', note(body))
  const result = await f.run()
  assert.equal(result.attachments, 0)
  assert.ok((await f.output('src/content/notes/code.md')).includes(body))
})

test('standard and wiki links use the exact Astro nested route IDs and heading slugs', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/课程/Linear Algebra.md', note('# A Heading'))
  await f.source(
    'Blog/start.md',
    note(
      '[标准](课程/Linear%20Algebra.md#A%20Heading)\n\n[[课程/Linear Algebra#A Heading|跳到标题]]'
    )
  )
  await f.run()
  const output = await f.output('src/content/notes/start.md')
  assert.equal(obsidianNoteId('课程/Linear Algebra.md'), '课程/linear-algebra')
  assert.equal(obsidianNoteId('Folder/index.md'), 'folder')
  assert.match(output, /\/notes\/%E8%AF%BE%E7%A8%8B\/linear-algebra#a-heading/)
  assert.match(output, /\[跳到标题\]/)
})

test('uppercase Markdown extensions and same-page wiki headings keep working with Astro IDs', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/Lecture.MD', note('# A Heading\n\n[[#A Heading|当前标题]]'))
  await f.source('Blog/start.md', note('[[Lecture|课程]]\n\n[主页](/)\n\n[关于](/about)'))
  await f.run()
  assert.match(await f.output('src/content/notes/Lecture.md'), /\[当前标题\]\(<#a-heading>\)/)
  assert.match(await f.output('src/content/notes/start.md'), /\/notes\/lecture/)
})

test('unique bare attachment filenames resolve without reading notes outside Blog', async (t) => {
  const f = await fixture(t)
  await f.source('Elsewhere/image.png', 'image')
  await f.source('Elsewhere/unrelated.md', '---\ninvalid: [')
  await f.source('Blog/entry.md', note('![[image.png]]'))
  const result = await f.run()
  assert.equal(result.attachments, 1)
  assert.ok(result.sourcePaths.includes(join(f.vaultPath, 'Elsewhere/image.png')))
  assert.ok(!result.sourcePaths.includes(join(f.vaultPath, 'Elsewhere/unrelated.md')))
})

test('ambiguous attachment names fail without changing previous outputs or manifest', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note('初版'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  await f.source('A/image.png', 'one')
  await f.source('B/image.png', 'two')
  await f.source('Blog/entry.md', note('![[image.png]]'))
  await assert.rejects(f.run, /附件文件名不唯一/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('missing attachments, schema errors and malformed YAML preserve the previous snapshot', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note('初版'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  for (const source of [
    note('![x](missing.png)'),
    note('失败').replace('date: 2026-10-05', 'date: nope'),
    '---\npublish: true\ntags: [\n---\n正文'
  ]) {
    await f.source('Blog/entry.md', source)
    await assert.rejects(f.run)
    assert.deepEqual(await snapshot(f.projectRoot), before)
  }
})

test('empty attachment placeholders cannot replace a complete published snapshot', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note('旧版'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  await f.source('Assets/pending.pdf', Buffer.alloc(0))
  await f.source('Blog/entry.md', note('新版', 'pdf: Assets/pending.pdf\n'))
  await assert.rejects(f.run, /附件为空|尚未下载完成/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('only owned copies are removed when source goes draft or is deleted, keeping shared and manual assets', async (t) => {
  const f = await fixture(t)
  await f.destination('src/content/notes/manual.md', note('手写副本'))
  await f.destination('public/attachments/sample-notes.pdf', '%PDF sample')
  await f.source('Assets/shared.png', 'shared')
  await f.source('Blog/one.md', note('![[Assets/shared.png]]'))
  await f.source('Blog/two.md', note('![[Assets/shared.png]]'))
  await f.run()
  await f.source('Blog/one.md', note('草稿').replace('publish: true', 'publish: false'))
  const first = await f.run()
  assert.equal(first.notes, 1)
  assert.equal(first.attachments, 1)
  assert.equal(first.removed, 1)
  await rm(join(f.vaultPath, 'Blog/two.md'))
  const second = await f.run()
  assert.equal(second.removed, 2)
  assert.equal(await f.output('public/attachments/sample-notes.pdf'), '%PDF sample')
  assert.match(await f.output('src/content/notes/manual.md'), /手写副本/)
})

test('existing manual destination and route collisions are rejected untouched', async (t) => {
  const f = await fixture(t)
  await f.destination('src/content/notes/entry.md', note('手工文件'))
  await f.source('Blog/entry.md', note('Vault 文件'))
  const before = await snapshot(f.projectRoot)
  await assert.rejects(f.run, /冲突|不能覆盖/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
  await rm(join(f.vaultPath, 'Blog/entry.md'))
  await f.source('Blog/ENTRY.md', note('同网址不同文件'))
  await assert.rejects(f.run, /网址冲突/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('edited generated copies cannot be overwritten or removed', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note())
  await f.run()
  await f.destination('src/content/notes/entry.md', '手动修改')
  await f.source('Blog/entry.md', note('新内容'))
  await assert.rejects(f.run, /生成副本已被手工修改/)
  await rm(join(f.vaultPath, 'Blog/entry.md'))
  await assert.rejects(f.run, /生成副本已被手工修改/)
  assert.equal(await f.output('src/content/notes/entry.md'), '手动修改')
})

test('.obsidian and external symlink sources are never read or copied', async (t) => {
  const f = await fixture(t)
  await f.source('.obsidian/private.png', 'private')
  await f.source('.OBSIDIAN/upper.png', 'upper private')
  await f.source('Outside/private.png', 'outside')
  await symlink(join(f.vaultPath, 'Outside/private.png'), join(f.vaultPath, 'Blog/linked.png'))
  await f.source('Blog/entry.md', note('![[.obsidian/private.png]]'))
  await assert.rejects(f.run, /不读取 .obsidian/)
  await f.source('Blog/entry.md', note('![[.OBSIDIAN/upper.png]]'))
  await assert.rejects(f.run, /不读取 .obsidian/)
  await f.source('Blog/entry.md', note('![x](linked.png)'))
  await assert.rejects(f.run, /符号链接/)
  const outside = join(f.vaultPath, '..', 'external.png')
  await writeFile(outside, 'not in Vault')
  await rm(join(f.vaultPath, 'Blog/linked.png'))
  await symlink(outside, join(f.vaultPath, 'Blog/linked.png'))
  await assert.rejects(f.run, /符号链接/)
  assert.deepEqual(await readdir(join(f.projectRoot, 'public/attachments')), [])
})

test('destination ancestor symlinks and malicious manifest paths fail without overwrites', async (t) => {
  const f = await fixture(t)
  const outside = join(f.vaultPath, '..', 'outside')
  await mkdir(outside)
  await symlink(outside, join(f.projectRoot, 'src/content/notes/linked'))
  await f.source('Blog/linked/entry.md', note())
  await assert.rejects(f.run, /符号链接/)
  assert.deepEqual(await readdir(outside), [])
  await rm(join(f.vaultPath, 'Blog/linked'), { recursive: true })
  await f.destination(
    'src/data/obsidian-sync.json',
    JSON.stringify({ version: 1, notes: { '../escape.md': 'a'.repeat(64) }, attachments: {} })
  )
  await assert.rejects(f.run, /不安全路径/)
})

test('missing Blog never cleans up an existing export and does not create source folders', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note())
  await f.run()
  const before = await snapshot(f.projectRoot)
  await rm(join(f.vaultPath, 'Blog'), { recursive: true })
  await assert.rejects(f.run, /文件不存在/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
  assert.ok(!(await readdir(f.vaultPath)).includes('Blog'))
})

test('public site PDF paths stay compatible; relative PDF frontmatter is rewritten for the existing viewer', async (t) => {
  const f = await fixture(t)
  await f.destination('public/attachments/sample-notes.pdf', '%PDF sample')
  await f.source(
    'Blog/manual-pdf.md',
    note('[打开](/attachments/sample-notes.pdf)', 'pdf: /attachments/sample-notes.pdf\n')
  )
  await f.source('Assets/中文 讲义.PDF', '%PDF source')
  await f.source('Blog/vault-pdf.md', note('正文', 'pdf: "![[Assets/中文 讲义.PDF]]"\n'))
  await f.run()
  const manual = await f.output('src/content/notes/manual-pdf.md')
  assert.match(manual, /pdf: \/attachments\/sample-notes.pdf/)
  const exported = await f.output('src/content/notes/vault-pdf.md')
  const data = parse(exported.match(/^---\n([\s\S]*?)\n---/)[1])
  assert.match(data.pdf, /^\/attachments\/[a-zA-Z0-9_-]+\.pdf$/)
})

test('local HTML attachment attributes convert, while unsupported local srcset fails safely', async (t) => {
  const f = await fixture(t)
  await f.source('Assets/image.png', 'image')
  await f.source(
    'Blog/html.md',
    note(
      '<img src="../Assets/image.png" alt="图片">\n\n<img src="https://example.com/image.png?x=1&amp;y=2">'
    )
  )
  await f.run()
  assert.match(
    await f.output('src/content/notes/html.md'),
    /<img src="\/attachments\/obsidian-[a-f\d]{24}\.png"/
  )
  assert.match(
    await f.output('src/content/notes/html.md'),
    /https:\/\/example.com\/image.png\?x=1&amp;y=2/
  )
  const before = await snapshot(f.projectRoot)
  await f.source(
    'Blog/html.md',
    note('<img srcset="../Assets/image.png 1x, ../Assets/image.png 2x">')
  )
  await assert.rejects(f.run, /srcset/)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('private or out-of-Blog note links are rejected without importing their text', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/draft.md', note('secret').replace('publish: true', 'publish: false'))
  await f.source('Outside.md', note('outside secret'))
  await f.source('Blog/public.md', note('[[draft]]'))
  await assert.rejects(f.run, /未发布笔记/)
  await f.source('Blog/public.md', note('[私密](../Outside.md)'))
  await assert.rejects(f.run, /必须位于 Blog/)
  assert.deepEqual(await readdir(join(f.projectRoot, 'src/content/notes')), [])
})

test('reserved routes, generated-route collisions, invalid publish values and duplicate YAML fail before writing', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/pdf.md', note())
  await assert.rejects(f.run, /占用了现有栏目/)
  await rm(join(f.vaultPath, 'Blog/pdf.md'))
  await f.source('Blog/My Note.md', note())
  await f.source('Blog/my-note.md', note())
  await assert.rejects(f.run, /网址冲突/)
  await rm(join(f.vaultPath, 'Blog/My Note.md'))
  await f.source('Blog/my-note.md', note().replace('publish: true', 'publish: "true"'))
  await assert.rejects(f.run, /publish 必须是布尔值/)
  await f.source('Blog/my-note.md', note('', 'title: 重复\n'))
  await assert.rejects(f.run, /YAML 无效/)
  assert.deepEqual(await readdir(join(f.projectRoot, 'src/content/notes')), [])
})

test('an unchanged second sync writes nothing and retains exact manifest and output bytes', async (t) => {
  const f = await fixture(t)
  await f.source('Assets/image.png', 'image')
  await f.source('Blog/entry.md', note('![[Assets/image.png]]'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  const result = await f.run()
  assert.equal(result.written, 0)
  assert.equal(result.removed, 0)
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('a destination write failure rolls back changed copies and leaves the prior manifest intact', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note('旧版'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  await f.source('Blog/entry.md', note('新版\n\n![[Assets/image.png]]'))
  await f.source('Assets/image.png', 'image')
  const assets = join(f.projectRoot, 'public/attachments')
  await chmod(assets, 0o500)
  try {
    await assert.rejects(f.run, /EACCES|EPERM/)
  } finally {
    await chmod(assets, 0o700)
  }
  assert.deepEqual(await snapshot(f.projectRoot), before)
  assert.deepEqual(
    (await readdir(join(f.projectRoot, 'src/content/notes'))).filter((name) =>
      name.endsWith('.tmp')
    ),
    []
  )
})

test('a failed final manifest write rolls back new outputs and restores removed owned files', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/old.md', note('旧版'))
  await f.run()
  const before = await snapshot(f.projectRoot)
  await rm(join(f.vaultPath, 'Blog/old.md'))
  await f.source('Blog/new.md', note('新版\n\n![[Assets/image.png]]'))
  await f.source('Assets/image.png', 'image')
  const data = join(f.projectRoot, 'src/data')
  await chmod(data, 0o500)
  try {
    await assert.rejects(f.run, /EACCES|EPERM/)
  } finally {
    await chmod(data, 0o700)
  }
  assert.deepEqual(await snapshot(f.projectRoot), before)
})

test('overlapping or aliased Vault/project roots cannot modify source contents', async (t) => {
  const f = await fixture(t)
  await f.source('Blog/entry.md', note())
  const nestedProject = join(f.vaultPath, 'project')
  await mkdir(nestedProject)
  const before = await snapshot(f.vaultPath)
  await assert.rejects(
    () => syncObsidian({ vaultPath: f.vaultPath, projectRoot: nestedProject }),
    /不能互相包含/
  )
  await assert.rejects(
    () => syncObsidian({ vaultPath: join(f.vaultPath, 'Blog'), projectRoot: f.vaultPath }),
    /不能互相包含/
  )
  const alias = join(f.vaultPath, '..', 'alias')
  await symlink(f.vaultPath, alias)
  await assert.rejects(
    () => syncObsidian({ vaultPath: alias, projectRoot: f.projectRoot }),
    /符号链接/
  )
  assert.deepEqual(await snapshot(f.vaultPath), before)
})
