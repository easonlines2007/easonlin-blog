import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sortTopics, topicSettingsSchema } from '../src/lib/topic-settings.ts'

const topics: [string, number][] = [
  ['FC', 20],
  ['CS61A', 10],
  ['MIT 18.06', 5]
]

test('pins precede note counts in explicit order; all other topics retain their original order', () => {
  assert.deepEqual(sortTopics(topics, ['MIT 18.06', 'FC']), [topics[2], topics[0], topics[1]])
  assert.deepEqual(sortTopics(topics, []), topics)
  assert.deepEqual(sortTopics(topics, ['no published notes', 'CS61A']), [
    topics[1],
    topics[0],
    topics[2]
  ])
  assert.deepEqual(topics, [
    ['FC', 20],
    ['CS61A', 10],
    ['MIT 18.06', 5]
  ])
  assert.notStrictEqual(sortTopics(topics, []), topics)
})

test('settings reject duplicate or invalid pins instead of dropping existing preferences', () => {
  assert.deepEqual(topicSettingsSchema.parse({ pinned: ['FC'] }), { pinned: ['FC'] })
  for (const value of [
    {},
    { pinned: true },
    { pinned: ['FC', 'FC'] },
    { pinned: [''] },
    { pinned: [], hidden: true }
  ]) {
    assert.equal(topicSettingsSchema.safeParse(value).success, false)
  }
})
