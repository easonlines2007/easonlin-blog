import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sortListItems, type SortableListItem } from '../src/lib/list-sort.ts'

const titles = (items: SortableListItem[]) => items.map((item) => item.title)

test('date sorting supports oldest and newest first using the adding date', () => {
  const items = [
    { title: 'Middle', date: Date.parse('2026-10-02'), index: 0 },
    { title: 'Newest', date: Date.parse('2026-10-03'), index: 1 },
    { title: 'Oldest', date: Date.parse('2026-10-01'), index: 2 }
  ]
  assert.deepEqual(titles(sortListItems(items, 'date-asc')), ['Oldest', 'Middle', 'Newest'])
  assert.deepEqual(titles(sortListItems(items, 'date-desc')), ['Newest', 'Middle', 'Oldest'])
})

test('title sorting handles Chinese, English and lecture numbers in both directions', () => {
  const items = ['Lecture 10', '中间', 'Beta', 'Lecture 2', '阿尔法'].map((title, index) => ({
    title,
    date: 0,
    index
  }))
  const ascending = ['阿尔法', '中间', 'Beta', 'Lecture 2', 'Lecture 10']
  assert.deepEqual(titles(sortListItems(items, 'title-asc')), ascending)
  assert.deepEqual(titles(sortListItems(items, 'title-desc')), [...ascending].reverse())
})

test('default restores the original reading order after another sort', () => {
  const items = [
    { title: 'Lecture 3', date: 3, index: 0 },
    { title: 'Lecture 1', date: 1, index: 1 },
    { title: 'Lecture 2', date: 2, index: 2 }
  ]
  const titleSorted = sortListItems(items, 'title-asc')
  assert.deepEqual(titles(sortListItems(titleSorted, 'default')), titles(items))
})

test('equal dates retain the original order in either date direction', () => {
  const items = [
    { title: 'Third', date: 100, index: 2 },
    { title: 'First', date: 100, index: 0 },
    { title: 'Second', date: 100, index: 1 }
  ]
  for (const order of ['date-asc', 'date-desc'] as const) {
    assert.deepEqual(titles(sortListItems(items, order)), ['First', 'Second', 'Third'])
  }
})

test('case-insensitive equal titles retain the original order in either title direction', () => {
  const items = [
    { title: 'LECTURE 2', date: 1, index: 2 },
    { title: 'Lecture 2', date: 3, index: 0 },
    { title: 'lecture 2', date: 2, index: 1 }
  ]
  for (const order of ['title-asc', 'title-desc'] as const) {
    assert.deepEqual(titles(sortListItems(items, order)), ['Lecture 2', 'lecture 2', 'LECTURE 2'])
  }
})

test('invalid dates always sort last without disrupting valid dates or invalid item order', () => {
  const items = [
    { title: 'Invalid third', date: Infinity, index: 4 },
    { title: 'Oldest', date: 1, index: 0 },
    { title: 'Invalid first', date: NaN, index: 2 },
    { title: 'Newest', date: 2, index: 1 },
    { title: 'Invalid second', date: -Infinity, index: 3 }
  ]
  const invalidTitles = ['Invalid first', 'Invalid second', 'Invalid third']
  assert.deepEqual(titles(sortListItems(items, 'date-asc')), ['Oldest', 'Newest', ...invalidTitles])
  assert.deepEqual(titles(sortListItems(items, 'date-desc')), [
    'Newest',
    'Oldest',
    ...invalidTitles
  ])
})

test('sorting returns a new array without mutating source items or losing extra data', () => {
  const first = Object.freeze({ title: 'B', date: 2, index: 0, href: '/notes/b' })
  const second = Object.freeze({ title: 'A', date: 1, index: 1, href: '/notes/a' })
  const items = [first, second]
  const result = sortListItems(items, 'title-asc')
  assert.notStrictEqual(result, items)
  assert.deepEqual(items, [first, second])
  assert.strictEqual(result[0], second)
  assert.equal(result[0].href, '/notes/a')
  assert.deepEqual(sortListItems([], 'date-desc'), [])
})
