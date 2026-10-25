import { test } from 'node:test'
import assert from 'node:assert/strict'
import { categoryNotes, categoryUrl, noteCategories } from '../src/lib/note-categories.ts'
import { publishedNotes } from '../src/lib/note-utils.ts'
import { translatedEntries } from '../src/lib/translation-utils.ts'
import { noteId, noteSchema } from '../src/lib/note-schema.ts'

test('categories partition visible notes and stay attached to their English translations', () => {
  const make = (id: string, category?: 'ai' | 'lin', publish = true) => ({
    id,
    data: {
      title: id,
      category,
      publish,
      date: new Date('2026-10-25'),
      topic: 'CS61A',
      tags: [],
      status: 'ready' as const
    }
  })
  const notes = publishedNotes([
    make('ebook'),
    make('personal', 'lin'),
    make('draft', 'lin', false)
  ])
  assert.deepEqual(
    categoryNotes(notes, 'ai').map((note) => note.id),
    ['ebook']
  )
  assert.deepEqual(
    categoryNotes(notes, 'lin').map((note) => note.id),
    ['personal']
  )
  const english = translatedEntries(
    notes,
    [
      {
        data: {
          kind: 'notes' as const,
          source: 'personal',
          publish: true,
          sourceHash: 'hash',
          title: 'Personal notes'
        }
      }
    ],
    'notes'
  )
  assert.deepEqual(
    categoryNotes(english, 'lin').map((note) => note.id),
    ['personal']
  )
  assert.equal(categoryNotes(english, 'ai').length, 0)
  assert.equal(categoryUrl('lin'), '/notes/categories/lin')
  assert.deepEqual(
    noteCategories.map((category) => category.description.zh),
    ['ai电子书', '古法笔记']
  )
  assert.throws(() => noteId('categories/lin.md'), /占用了现有栏目/)
  const data = make('ebook').data
  assert.equal(noteSchema.parse({ ...data, description: '' }).category, 'ai')
  assert.equal(
    noteSchema.safeParse({ ...data, description: '', category: 'unknown' }).success,
    false
  )
})
