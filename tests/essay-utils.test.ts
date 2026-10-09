import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  essayUrl,
  formatWritingDate,
  isWritingDate,
  sortEssays,
  writingTimestamp
} from '../src/lib/essay-utils.ts'

test('writing dates preserve month or day precision without a timezone shift', () => {
  assert.equal(formatWritingDate('2024-02'), '2024年2月')
  assert.equal(formatWritingDate('2026-05-04'), '2026年5月4日')
  assert.equal(writingTimestamp('2026-05-04'), Date.UTC(2026, 4, 4))
})

test('writing dates reject calendar rollover and accept leap days', () => {
  for (const value of ['2026-02-29', '2026-04-31', '2026-00', '2026-13', '2026-5', '2026']) {
    assert.equal(isWritingDate(value), false, value)
  }
  assert.equal(isWritingDate('2024-02-29'), true)
  assert.throws(() => formatWritingDate('2026-02-29'))
})

test('essays sort by original writing date with stable ties and preserve source order', () => {
  const input = [
    { id: 'first', data: { written: '2024-02' } },
    { id: 'b', data: { written: '2026-05-04' } },
    { id: 'latest', data: { written: '2026-10' } },
    { id: 'a', data: { written: '2026-05-04' } },
    { id: 'month', data: { written: '2026-05' } }
  ]
  assert.deepEqual(
    sortEssays(input).map((essay) => essay.id),
    ['latest', 'a', 'b', 'month', 'first']
  )
  assert.equal(input[0].id, 'first')
  assert.equal(
    essayUrl('日常/该走了？'),
    '/blog/%E6%97%A5%E5%B8%B8/%E8%AF%A5%E8%B5%B0%E4%BA%86%EF%BC%9F'
  )
})
