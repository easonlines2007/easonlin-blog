import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  publishedNotes,
  countValues,
  noteUrl,
  tagUrl,
  statusUrl,
  sortTopicNotes,
  type NoteMeta
} from '../src/lib/note-utils.ts'

function note(id: string, publish: boolean, date: string, updated?: string): NoteMeta {
  return {
    id,
    data: {
      publish,
      date: new Date(date),
      updated: updated ? new Date(updated) : undefined,
      topic: '笔记方法',
      tags: ['PDF'],
      status: 'ready'
    }
  }
}
test('unpublished notes never enter public collections', () => {
  const input = [note('private', false, '2026-10-03'), note('public', true, '2026-10-01')]
  assert.deepEqual(
    publishedNotes(input).map((item) => item.id),
    ['public']
  )
  assert.equal(input.length, 2)
})
test('updated notes sort first, without mutating source order', () => {
  const input = [note('new', true, '2026-10-02'), note('revised', true, '2026-10-01', '2026-10-03')]
  assert.deepEqual(
    publishedNotes(input).map((item) => item.id),
    ['revised', 'new']
  )
  assert.equal(input[0].id, 'new')
})
test('nested note paths and Unicode tags produce safe URLs', () => {
  assert.equal(
    noteUrl('数学/线性 代数'),
    '/notes/%E6%95%B0%E5%AD%A6/%E7%BA%BF%E6%80%A7%20%E4%BB%A3%E6%95%B0'
  )
  assert.equal(tagUrl('C++'), '/notes/tags/C%2B%2B')
})
test('topic and tag counts reflect the actual collection', () => {
  const input = [note('a', true, '2026-10-01'), note('b', true, '2026-10-02')]
  assert.deepEqual(countValues(input, 'tags'), [['PDF', 2]])
  assert.deepEqual(countValues(input, 'topic'), [['笔记方法', 2]])
})

test('topic reading order takes precedence over update dates and leaves the recent list unchanged', () => {
  const first = note('lecture-01-05', true, '2026-10-01')
  const second = note('lecture-06-13', true, '2026-10-02', '2026-10-05')
  first.data.order = 1
  second.data.order = 2
  const recent = publishedNotes([first, second, note('extra', true, '2026-10-03')])
  assert.deepEqual(
    sortTopicNotes(recent).map((item) => item.id),
    ['lecture-01-05', 'lecture-06-13', 'extra']
  )
  assert.deepEqual(
    recent.map((item) => item.id),
    ['lecture-06-13', 'extra', 'lecture-01-05']
  )
  assert.equal(statusUrl('growing'), '/notes/status/growing')
  assert.equal(statusUrl('ready'), '/notes/status/ready')
})
