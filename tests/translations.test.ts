import { test } from 'node:test'
import assert from 'node:assert/strict'
import { localeFromPath, localizePath, formatMessage } from '../src/lib/i18n.ts'
import { sourceHash, translatedEntries } from '../src/lib/translation-utils.ts'
import { formatWritingDate } from '../src/lib/essay-utils.ts'

test('locale routes preserve Unicode, queries, and fragments without prefixing external links', () => {
  assert.equal(localeFromPath('/en/blog/night'), 'en')
  assert.equal(localeFromPath('/english'), 'zh')
  assert.equal(localizePath('/notes/学习?q=a#section', 'en'), '/en/notes/学习?q=a#section')
  assert.equal(localizePath('/en/notes/学习?q=a#section', 'zh'), '/notes/学习?q=a#section')
  assert.equal(localizePath('/en/', 'en'), '/en/')
  assert.equal(localizePath('//example.com/a', 'en'), '//example.com/a')
  assert.equal(localizePath('https://example.com/a', 'en'), 'https://example.com/a')
})

test('only translations of visible originals appear and duplicates fail rather than picking one', () => {
  const originals = [{ id: 'public', data: { title: '原文', written: '2026-10' } }]
  const translation = (source: string, publish = true) => ({
    data: { source, kind: 'essays' as const, publish, title: 'English title', sourceHash: 'hash' }
  })
  const visible = translatedEntries(
    originals,
    [translation('public'), translation('hidden'), translation('draft', false)],
    'essays'
  )
  assert.equal(visible.length, 1)
  assert.equal(visible[0].id, 'public')
  assert.equal(visible[0].data.title, 'English title')
  assert.equal(visible[0].data.written, '2026-10')
  assert.equal(originals[0].data.title, '原文')
  assert.throws(
    () => translatedEntries(originals, [translation('public'), translation('public')], 'essays'),
    /Duplicate/
  )
})

test('source hashes detect edits, normalize line endings, and English dates preserve precision', () => {
  assert.equal(sourceHash('one\r\ntwo'), sourceHash('one\ntwo'))
  assert.notEqual(sourceHash('one'), sourceHash('two'))
  assert.notEqual(
    sourceHash('same body', { title: 'Original' }),
    sourceHash('same body', { title: 'Overridden title' })
  )
  assert.equal(
    sourceHash('same body', { title: 'Original' }),
    sourceHash('same body', { title: 'Original', description: '' })
  )
  assert.equal(formatWritingDate('2024-02', 'en'), 'February 2024')
  assert.equal(formatWritingDate('2026-05-04', 'en'), 'May 4, 2026')
  assert.equal(formatMessage('{0} — page {1} of {2}', ['Notes', 1, 9]), 'Notes — page 1 of 9')
})
