import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getTocHeadings } from '../src/lib/table-of-contents.ts'

const heading = (depth: number, text: string) => ({ depth, text, slug: text })

test('h1 sections from personal CS61A notes appear in document order with their original anchors', () => {
  const headings = [heading(1, 'enviroment'), heading(1, 'operators'), heading(1, '文档测试')]
  const items = getTocHeadings(headings)
  assert.deepEqual(
    items.map((item) => item.slug),
    ['enviroment', 'operators', '文档测试']
  )
  assert.deepEqual(
    items.map((item) => item.level),
    [0, 0, 0]
  )
  assert.deepEqual(headings, [
    heading(1, 'enviroment'),
    heading(1, 'operators'),
    heading(1, '文档测试')
  ])
})

test('heading indentation follows the document hierarchy while existing h2/h3 contents stay unchanged', () => {
  assert.deepEqual(
    getTocHeadings([heading(2, 'section'), heading(3, 'subsection')]).map((item) => item.level),
    [0, 1]
  )
  assert.deepEqual(
    getTocHeadings([heading(1, 'section'), heading(2, 'subsection'), heading(3, 'detail')]).map(
      (item) => item.level
    ),
    [0, 1, 2]
  )
  assert.equal(getTocHeadings([heading(3, 'standalone')])[0].level, 0)
})

test('documents without contents headings stay empty and detailed h4 sections remain outside the compact contents', () => {
  assert.deepEqual(getTocHeadings([]), [])
  assert.deepEqual(getTocHeadings([heading(2, ''), heading(2, '   ')]), [])
  assert.deepEqual(getTocHeadings([heading(4, 'screenshot'), heading(5, 'detail')]), [])
  assert.deepEqual(
    getTocHeadings([heading(2, 'section'), heading(4, 'screenshot')]).map((item) => item.slug),
    ['section']
  )
})
