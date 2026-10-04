import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTheme, resolveTheme } from '../src/lib/theme.ts'

test('first visit and invalid saved values use the device setting', () => {
  assert.equal(normalizeTheme(null), 'system')
  assert.equal(normalizeTheme('invalid'), 'system')
  assert.equal(resolveTheme('system', true), 'dark')
  assert.equal(resolveTheme('system', false), 'light')
})
test('an explicit preference overrides device changes', () => {
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
})
