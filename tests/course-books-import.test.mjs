import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { importCourseBook } from '../scripts/import-course-books.mjs'

test('book import keeps sources intact, resolves PDF page links and is repeatable; conflicts copy nothing', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'course-books-test-'))
  try {
    const sourceDirectory = join(temporary, 'source'),
      projectRoot = join(temporary, 'blog')
    await mkdir(join(sourceDirectory, 'slides'), { recursive: true })
    await mkdir(projectRoot)
    const originals = new Map()
    for (const name of [
      ...Array.from({ length: 18 }, (_, i) => `lec${i + 1}`),
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
    ]) {
      const filename = `CS231n-${name}.md`
      const text = `---\ntitle: ${name}\ndescription: Test chapter\n---\n\n# ${name}\n\n[课件索引](课件索引.md)\n\n[page](slides/lecture_1.pdf#page=7)\n\n\`\`\`python\nprint('hello $$ literal $$')\n\`\`\`\n`
      originals.set(filename, text + '\nTwo formulas: $$x=1$$$$y=2$$ then $z$.\n')
      await writeFile(join(sourceDirectory, filename), originals.get(filename))
    }
    await writeFile(join(sourceDirectory, 'slides/lecture_1.pdf'), '%PDF-1.4\nfixture')
    await writeFile(
      join(sourceDirectory, '课件索引.md'),
      '# 课件\n\n| 讲次 | PDF |\n| --- | --- |\n| 1 | [PDF](slides/lecture_1.pdf) |\n'
    )
    const options = { course: 'cs231n', sourceDirectory, date: '2026-11-14', projectRoot }
    const result = await importCourseBook(options)
    assert.equal(result.notes, 29)
    assert.equal(result.attachments, 1)
    const markdown = await readFile(join(projectRoot, 'src/content/notes/CS231n/lec01.md'), 'utf8')
    assert.match(markdown, /\/notes\/cs231n\/slides/)
    assert.match(markdown, /\/attachments\/cs231n-[a-f0-9]+\.pdf#page=7/)
    assert.ok(markdown.includes("print('hello $$ literal $$')"))
    assert.match(markdown, /\$\$\nx=1\n\$\$\s+\$\$\ny=2\n\$\$/)
    assert.doesNotMatch(markdown, /^# lec1$/m)
    assert.equal((await importCourseBook(options)).written, 0)
    for (const [name, text] of originals)
      assert.equal(await readFile(join(sourceDirectory, name), 'utf8'), text)
    const conflictingRoot = join(temporary, 'conflict')
    await mkdir(join(conflictingRoot, 'src/content/notes/CS231n'), { recursive: true })
    const conflict = join(conflictingRoot, 'src/content/notes/CS231n/embodied.md')
    await writeFile(conflict, 'An existing note must survive.')
    await assert.rejects(
      importCourseBook({ ...options, projectRoot: conflictingRoot }),
      /目标文件已有不同内容/
    )
    assert.equal(await readFile(conflict, 'utf8'), 'An existing note must survive.')
    assert.deepEqual(await readdir(join(conflictingRoot, 'src/content/notes/CS231n')), [
      'embodied.md'
    ])
    await assert.rejects(readdir(join(conflictingRoot, 'public')), { code: 'ENOENT' })

    // Replacing the PDF edition with the illustrated source updates the same
    // article URLs and retires the index that no longer exists in the source.
    await mkdir(join(sourceDirectory, 'images'))
    await writeFile(join(sourceDirectory, 'images/slide.png'), Buffer.from('PNG fixture'))
    for (const [name, original] of originals) {
      await writeFile(
        join(sourceDirectory, name),
        original
          .replace('[课件索引](课件索引.md)\n\n', '')
          .replace('[page](slides/lecture_1.pdf#page=7)', '![课件图](images/slide.png)')
      )
    }
    await rm(join(sourceDirectory, '课件索引.md'))
    await assert.rejects(importCourseBook(options), /目标文件已有不同内容/)
    const illustrated = await importCourseBook({ ...options, replaceExisting: true })
    assert.equal(illustrated.notes, 28)
    assert.equal(illustrated.attachments, 1)
    const refreshed = await readFile(join(projectRoot, 'src/content/notes/CS231n/lec01.md'), 'utf8')
    assert.match(refreshed, /!\[课件图\]\(<\/attachments\/cs231n-[a-f0-9]+\.png>\)/)
    assert.doesNotMatch(refreshed, /\.pdf|cs231n\/slides/)
    await assert.rejects(readFile(join(projectRoot, 'src/content/notes/CS231n/slides.md')), {
      code: 'ENOENT'
    })
    assert.equal((await importCourseBook({ ...options, replaceExisting: true })).written, 0)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test('MIT book imports the review lecture in sequence and resolves chapter, index and image links', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'mit-book-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const sourceDirectory = join(root, 'source')
  const projectRoot = join(root, 'blog')
  await mkdir(join(sourceDirectory, 'images'), { recursive: true })
  await mkdir(projectRoot)
  await writeFile(join(sourceDirectory, 'images', 'board.png'), 'image fixture')
  const names = [...Array.from({ length: 34 }, (_, i) => String(i + 1)), '24b']
  for (const name of names) {
    await writeFile(
      join(sourceDirectory, `MIT18.06-lec${name}.md`),
      `---\ntitle: Lecture ${name}\ndescription: Course notes\n---\n\n# Lecture ${name}\n\n[目录](index.md) [复习](MIT18.06-lec24b.md)\n\n![板书](images/board.png)\n`
    )
  }
  await writeFile(
    join(sourceDirectory, 'index.md'),
    '---\ntitle: Overview\ndescription: Course overview\n---\n\n# Overview\n\n[第一讲](MIT18.06-lec1.md)\n'
  )
  const options = { course: 'mit1806', sourceDirectory, projectRoot, date: '2026-11-14' }
  const result = await importCourseBook(options)
  assert.equal(result.notes, 36)
  assert.equal(result.attachments, 1)
  const notes = join(projectRoot, 'src/content/notes/MIT 18.06')
  const first = await readFile(join(notes, 'lec01.md'), 'utf8')
  const review = await readFile(join(notes, 'lec24b.md'), 'utf8')
  const next = await readFile(join(notes, 'lec25.md'), 'utf8')
  const overview = await readFile(join(notes, 'overview.md'), 'utf8')
  assert.match(first, /\/notes\/mit-1806\/overview/)
  assert.match(first, /\/notes\/mit-1806\/lec24b/)
  assert.match(first, /\/attachments\/mit1806-[a-f0-9]+\.png/)
  assert.match(overview, /\/notes\/mit-1806\/lec01/)
  assert.match(review, /order: 26/)
  assert.match(next, /order: 27/)
  assert.equal((await importCourseBook(options)).written, 0)
})
