import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTheme } from '../src/lib/theme.ts'

test('first visits, legacy system preferences and invalid saved values default to light', () => {
  assert.equal(normalizeTheme(null), 'light')
  assert.equal(normalizeTheme('system'), 'light')
  assert.equal(normalizeTheme('invalid'), 'light')
})
test('explicit light and dark preferences are preserved', () => {
  assert.equal(normalizeTheme('light'), 'light')
  assert.equal(normalizeTheme('dark'), 'dark')
})
