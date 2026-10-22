import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { parse, stringify } from 'yaml'
import { importCourseLectures } from '../scripts/import-course-lectures.mjs'

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'course-refresh-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const sourceDirectory = join(root, 'source')
  const projectRoot = join(root, 'project')
  await mkdir(sourceDirectory)
  for (let index = 1; index <= 26; index++)
    await writeFile(
      join(sourceDirectory, `Lecture_${String(index).padStart(2, '0')}_Topic.md`),
      `# L${index} · 主题 ${index}\n\n原始内容。\n`
    )
  const run = (updated) =>
    importCourseLectures({
      course: 'csapp',
      sourceDirectory,
      projectRoot,
      date: '2026-10-21',
      updated
    })
  const note = (index) =>
    join(projectRoot, 'src/content/notes/CSAPP', `lecture-${String(index).padStart(2, '0')}.md`)
  return { sourceDirectory, projectRoot, run, note }
}

test('explicit refresh preserves original dates and custom settings and is repeatable', async (t) => {
  const f = await fixture(t)
  await f.run()
  const original = await readFile(f.note(1), 'utf8')
  const [, header, body] = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const data = { ...parse(header), date: '2026-10-09', tags: ['custom-tag'], status: 'ready' }
  await writeFile(f.note(1), `---\n${stringify(data)}---\n${body}`)
  await writeFile(
    join(f.sourceDirectory, 'Lecture_01_Topic.md'),
    '# L1 · 扩充后的主题\n\n新增讲解。\n'
  )
  await assert.rejects(f.run(), /目标文件已有不同内容/)
  await f.run('2026-10-22')
  const result = await readFile(f.note(1), 'utf8')
  const metadata = parse(result.match(/^---\n([\s\S]*?)\n---/)[1])
  assert.equal(metadata.date, '2026-10-09')
  assert.equal(metadata.updated, '2026-10-22')
  assert.equal(metadata.status, 'ready')
  assert.deepEqual(metadata.tags, ['custom-tag'])
  assert.match(result, /新增讲解/)
  assert.equal((await f.run('2026-10-22')).written, 0)
})

test('a missing image in the last lecture leaves every existing article unchanged', async (t) => {
  const f = await fixture(t)
  await f.run()
  const before = await Promise.all(Array.from({ length: 26 }, (_, i) => readFile(f.note(i + 1))))
  await writeFile(join(f.sourceDirectory, 'Lecture_01_Topic.md'), '# L1 · 主题 1\n\n更新内容。\n')
  await writeFile(
    join(f.sourceDirectory, 'Lecture_26_Topic.md'),
    '# L26 · 主题 26\n\n![缺图](missing.png)\n'
  )
  await assert.rejects(f.run('2026-10-22'), /附件不存在/)
  const after = await Promise.all(Array.from({ length: 26 }, (_, i) => readFile(f.note(i + 1))))
  assert.deepEqual(after, before)
})

test('renaming a referenced image reuses its existing public asset', async (t) => {
  const f = await fixture(t)
  const bytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aR30AAAAASUVORK5CYII=',
    'base64'
  )
  await writeFile(join(f.sourceDirectory, 'old.png'), bytes)
  await writeFile(
    join(f.sourceDirectory, 'Lecture_01_Topic.md'),
    '# L1 · 主题 1\n\n![图](old.png)\n'
  )
  await f.run()
  const directory = join(f.projectRoot, 'public/attachments')
  const files = await readdir(directory)
  await writeFile(join(f.sourceDirectory, 'new.png'), bytes)
  await writeFile(
    join(f.sourceDirectory, 'Lecture_01_Topic.md'),
    '# L1 · 主题 1\n\n![图](new.png)\n'
  )
  await f.run('2026-10-22')
  assert.deepEqual(await readdir(directory), files)
  assert.ok((await readFile(f.note(1), 'utf8')).includes(`/attachments/${files[0]}`))
})
