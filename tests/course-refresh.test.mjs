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

test('CCCS restores episode images and refuses a mismatched directory edition', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'cccs-import-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const sourceDirectory = join(root, 'collection')
  const projectRoot = join(root, 'project')
  await mkdir(sourceDirectory)
  for (let index = 1; index <= 40; index++) {
    const episode = join(root, `BV1EW411u7th_p${index}`)
    await mkdir(episode)
    const heading = `# Lecture ${String(index).padStart(2, '0')} ${index}. 主题 ${index}\n\n`
    const navigation = index === 1 ? '[下一讲](Lecture_02_Topic.md)\n\n' : ''
    const image = index === 1 ? '![图](images/shot.png)\n' : ''
    const corruptImage =
      index === 1
        ? '[![图](images/p01/\u0001)](https://www.bilibili.com/video/BV1EW411u7th/?p=1&t=1)\n'
        : ''
    await writeFile(join(episode, 'book.md'), heading + navigation + image)
    await writeFile(
      join(sourceDirectory, `Lecture_${String(index).padStart(2, '0')}_Topic.md`),
      heading + navigation + corruptImage
    )
  }
  const images = join(root, 'BV1EW411u7th_p1/images')
  await mkdir(images)
  await writeFile(join(images, 'shot.png'), Buffer.from('screenshot fixture'))
  const run = () =>
    importCourseLectures({ course: 'cccs', sourceDirectory, projectRoot, date: '2026-10-24' })
  assert.deepEqual(await run(), { notes: 40, attachments: 1, written: 41 })
  const path = join(projectRoot, 'src/content/notes/CCCS/lecture-01.md')
  const note = await readFile(path, 'utf8')
  assert.match(note, /title: Lecture 01 · 主题 1\n/)
  assert.match(note, /topic: CCCS\n/)
  assert.match(note, /\/notes\/cccs\/lecture-02/)
  assert.match(note, /\/attachments\/cccs-[a-f0-9]+\.png/)
  assert.ok(!note.includes('\u0001'))
  assert.equal((await run()).written, 0)
  await writeFile(
    join(sourceDirectory, 'Lecture_01_Topic.md'),
    '# Lecture 01 1. 新版本\n\n已扩充。\n'
  )
  await assert.rejects(run(), /正文不一致/)
  assert.equal(await readFile(path, 'utf8'), note)
})
