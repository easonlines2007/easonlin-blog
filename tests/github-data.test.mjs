import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeRepositories,
  parseContributions,
  sameGitHubData
} from '../scripts/github-data.mjs'

const username = 'easonlines2007'
const repository = (name, extra = {}) => ({
  name,
  private: false,
  archived: false,
  description: 'Description from GitHub',
  html_url: `https://github.com/${username}/${name}`,
  fork: false,
  language: null,
  stargazers_count: 0,
  ...extra
})
const calendar = (count = 365) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2025, 9, 5) + index * 86400000).toISOString().slice(0, 10)
    return `<td data-level="${index === 1 ? 2 : 0}" id="day-${index}" data-date="${date}"></td><tool-tip for="day-${index}">${index === 1 ? '2 contributions' : 'No contributions'} on a date.</tool-tip>`
  }).join('')

test('only active public repositories enter the website, in a stable order', () => {
  const repos = normalizeRepositories(
    [
      repository('z'),
      repository('private', { private: true }),
      repository('archive', { archived: true }),
      repository('a', { fork: true })
    ],
    username
  )
  assert.deepEqual(
    repos.map((repo) => repo.name),
    ['a', 'z']
  )
  assert.equal(repos[0].fork, true)
  assert.equal(repos[0].description, 'Description from GitHub')
  assert.throws(() =>
    normalizeRepositories([repository('bad', { html_url: 'https://example.com' })], username)
  )
  assert.throws(() =>
    normalizeRepositories([repository('missing', { private: undefined })], username)
  )
})

test('contributions are parsed by attributes regardless of their source order', () => {
  const days = parseContributions(calendar())
  assert.equal(days.length, 365)
  assert.deepEqual(days[1], { date: '2025-10-06', level: 2, count: 2 })
  assert.equal(
    days.reduce((sum, day) => sum + day.count, 0),
    2
  )
})

test('partial, duplicate or unreadable calendars cannot replace a valid snapshot', () => {
  assert.throws(() => parseContributions(calendar(100)))
  assert.throws(() => parseContributions(calendar().replace('2025-10-06', '2025-10-05')))
  assert.throws(() => parseContributions(calendar().replace('2 contributions', 'Unknown activity')))
})

test('unchanged data skips timestamp-only commits, while metadata and contributions sync', () => {
  const before = {
    username,
    updatedAt: 'old',
    total: 2,
    days: [{ date: '2026-10-04', level: 1, count: 2 }],
    repositories: [{ name: 'a', description: 'old' }]
  }
  assert.equal(sameGitHubData(before, { ...before, updatedAt: 'new' }), true)
  assert.equal(
    sameGitHubData(before, { ...before, repositories: [{ name: 'a', description: 'new' }] }),
    false
  )
  assert.equal(sameGitHubData(before, { ...before, total: 3 }), false)
})
