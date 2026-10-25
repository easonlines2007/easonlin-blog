import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { loadObsidianConfig } from '../scripts/obsidian-config.mjs'
import { createSourceSnapshot, watchObsidian } from '../scripts/obsidian-watch.mjs'

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'blog-obsidian-cli-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

test('configured notebook scopes are passed to normal sync and watcher runs', async (t) => {
  const root = await fixture(t)
  await mkdir(join(root, 'src/data'), { recursive: true })
  await writeFile(
    join(root, '.env.local'),
    'OBSIDIAN_VAULT_PATH="/tmp/Vault"\nOBSIDIAN_PUBLISH_ALL=true\n'
  )
  const settings = { sourceFolders: ['CS61A - Lin', 'FC - Lin'], skipEmpty: true }
  await writeFile(join(root, 'src/data/obsidian-sources.json'), JSON.stringify(settings))
  const config = await loadObsidianConfig({ root, environment: {} })
  assert.deepEqual(config.sourceFolders, settings.sourceFolders)
  assert.equal(config.skipEmpty, true)
})

test('Obsidian configuration uses the project file and respects environment overrides', async (t) => {
  const base = await fixture(t)
  const root = join(base, 'project # with spaces')
  await mkdir(root)
  await writeFile(join(root, '.env.local'), 'OBSIDIAN_VAULT_PATH="/tmp/Vault with spaces"\n')
  assert.deepEqual(await loadObsidianConfig({ root, environment: {} }), {
    projectRoot: root,
    vaultPath: '/tmp/Vault with spaces'
  })
  assert.equal(
    (await loadObsidianConfig({ root, environment: { OBSIDIAN_VAULT_PATH: '/tmp/Other Vault' } }))
      .vaultPath,
    '/tmp/Other Vault'
  )
  await assert.rejects(
    loadObsidianConfig({ root, environment: { OBSIDIAN_VAULT_PATH: '~/Vault' } }),
    /绝对路径/
  )
  await assert.rejects(
    loadObsidianConfig({ root, environment: { OBSIDIAN_VAULT_PATH: '' } }),
    /配置 OBSIDIAN_VAULT_PATH/
  )
})

test('whole-Vault config is explicit and its watch sees new notes outside Blog without scanning hidden folders', async (t) => {
  const root = await fixture(t)
  const vaultPath = join(root, 'vault')
  await mkdir(join(vaultPath, 'FC'), { recursive: true })
  await mkdir(join(vaultPath, '.obsidian'))
  await writeFile(
    join(root, '.env.local'),
    `OBSIDIAN_VAULT_PATH="${vaultPath}"\nOBSIDIAN_PUBLISH_ALL=true\n`
  )
  const config = await loadObsidianConfig({ root, environment: {} })
  assert.equal(config.publishAll, true)
  const snapshot = createSourceSnapshot(config.vaultPath, config)
  const initial = await snapshot()
  await writeFile(join(vaultPath, '.obsidian', 'private.md'), 'excluded')
  assert.equal(await snapshot(), initial)
  await writeFile(join(vaultPath, 'FC', 'new.md'), 'new note')
  assert.notEqual(await snapshot(), initial)
  assert.ok((await snapshot()).includes('FC/new.md'))
  assert.equal(
    (await loadObsidianConfig({ root, environment: { OBSIDIAN_PUBLISH_ALL: 'false' } })).publishAll,
    undefined
  )
  await assert.rejects(
    loadObsidianConfig({ root, environment: { OBSIDIAN_PUBLISH_ALL: 'yes' } }),
    /true 或 false/
  )
})

test('configuration loads course rules and the watcher includes only referenced external attachments', async (t) => {
  const root = await fixture(t)
  const vaultPath = join(root, 'vault')
  const attachmentRoot = join(root, 'videobook')
  await mkdir(join(vaultPath, 'Blog'), { recursive: true })
  await mkdir(attachmentRoot)
  await mkdir(join(root, 'src/data'), { recursive: true })
  await writeFile(
    join(root, '.env.local'),
    `OBSIDIAN_VAULT_PATH="${vaultPath}"\nOBSIDIAN_ATTACHMENT_PATH="${attachmentRoot}"\n`
  )
  const noteImports = { 'course.md': { topic: 'MIT 18.06', tags: ['lineal algebra'], modules: [] } }
  await writeFile(join(root, 'src/data/obsidian-imports.json'), JSON.stringify(noteImports))
  const config = await loadObsidianConfig({ root, environment: {} })
  assert.equal(config.attachmentRoot, attachmentRoot)
  assert.equal(
    (await loadObsidianConfig({ root, environment: { OBSIDIAN_ATTACHMENT_PATH: '' } }))
      .attachmentRoot,
    undefined
  )
  assert.deepEqual(config.noteImports, noteImports)
  const image = join(attachmentRoot, 'image.png')
  await writeFile(image, 'first image')
  const snapshot = createSourceSnapshot(vaultPath, config)
  const first = await snapshot([image])
  assert.ok(first.includes('image.png'))
  assert.ok(!first.includes('UNSAFE_PATH'))
  await writeFile(join(attachmentRoot, 'unreferenced.png'), 'not imported')
  assert.equal(await snapshot([image]), first)
  await writeFile(image, 'second image')
  assert.notEqual(await snapshot([image]), first)
  await assert.rejects(
    loadObsidianConfig({ root, environment: { OBSIDIAN_ATTACHMENT_PATH: '../outside' } }),
    /绝对路径/
  )
})

test('watch fingerprints nested Markdown and referenced assets while excluding .obsidian', async (t) => {
  const vaultPath = await fixture(t)
  const note = join(vaultPath, 'Blog', 'nested', 'note.md')
  const secret = join(vaultPath, 'Blog', '.obsidian', 'private.md')
  const asset = join(vaultPath, 'Attachments', 'image.png')
  await mkdir(join(vaultPath, 'Blog', 'nested'), { recursive: true })
  await mkdir(join(vaultPath, 'Blog', '.obsidian'))
  await mkdir(join(vaultPath, 'Attachments'))
  await writeFile(note, 'First note')
  await writeFile(secret, 'Never inspect this')
  await writeFile(asset, 'image-one')
  const snapshot = createSourceSnapshot(vaultPath)
  const first = await snapshot([asset, secret])
  assert.ok(first.includes('Blog/nested/note.md'))
  assert.ok(first.includes('Attachments/image.png'))
  assert.ok(!first.includes('.obsidian'))
  await writeFile(secret, 'Different hidden content')
  assert.equal(await snapshot([asset, secret]), first)
  await writeFile(asset, 'image-two')
  const second = await snapshot([asset, secret])
  assert.notEqual(second, first)
  await writeFile(note, 'Second note')
  assert.notEqual(await snapshot([asset, secret]), second)
})

test('watch performs initial sync, coalesces changes, and stops without overlapping syncs', async () => {
  let fingerprint = 'initial'
  let active = 0
  let calls = 0
  let greatestActive = 0
  let finishSecond
  const secondSync = new Promise((resolve) => {
    finishSecond = resolve
  })
  const watcher = await watchObsidian(
    { vaultPath: '/unused', projectRoot: '/unused' },
    {
      snapshot: async () => fingerprint,
      sync: async () => {
        calls += 1
        active += 1
        greatestActive = Math.max(active, greatestActive)
        await new Promise((resolve) => setTimeout(resolve, 20))
        active -= 1
        if (calls === 2) finishSecond()
        return { notes: 1, attachments: 0, written: 0, removed: 0, sourcePaths: [] }
      },
      log: { log() {}, error() {} },
      pollInterval: 5,
      debounceInterval: 15
    }
  )
  try {
    assert.equal(calls, 1)
    fingerprint = 'edit-1'
    await new Promise((resolve) => setTimeout(resolve, 7))
    fingerprint = 'edit-2'
    let timeout
    try {
      await Promise.race([
        secondSync,
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Watcher did not sync')), 1_000)
        })
      ])
    } finally {
      clearTimeout(timeout)
    }
    assert.equal(calls, 2)
    assert.equal(greatestActive, 1)
  } finally {
    watcher.stop()
    await watcher.done
  }
  fingerprint = 'after-stop'
  await new Promise((resolve) => setTimeout(resolve, 25))
  assert.equal(calls, 2)
})

test('watch refuses symlinked Blog roots and replaced attachment parents', async (t) => {
  const base = await fixture(t)
  const vaultPath = join(base, 'Vault')
  const outside = join(base, 'outside')
  await mkdir(vaultPath)
  await mkdir(outside)
  await writeFile(join(outside, 'note.md'), 'Outside Vault')
  await symlink(outside, join(vaultPath, 'Blog'), 'dir')
  const snapshot = createSourceSnapshot(vaultPath)
  const unsafeBlog = await snapshot()
  assert.ok(unsafeBlog.includes('UNSAFE_PATH'))
  assert.ok(!unsafeBlog.includes('note.md'))
  await writeFile(join(outside, 'note.md'), 'Changed outside Vault')
  assert.equal(await snapshot(), unsafeBlog)

  await rm(join(vaultPath, 'Blog'))
  await mkdir(join(vaultPath, 'Blog'))
  const attachments = join(vaultPath, 'Attachments')
  const asset = join(attachments, 'image.png')
  await mkdir(attachments)
  await writeFile(asset, 'Safe file')
  assert.ok(!(await snapshot([asset])).includes('UNSAFE_PATH'))
  await rename(attachments, join(vaultPath, 'Attachments-original'))
  await writeFile(join(outside, 'image.png'), 'Outside image')
  await symlink(outside, attachments, 'dir')
  const unsafeAttachment = await snapshot([asset])
  assert.ok(unsafeAttachment.includes('UNSAFE_PATH'))
  await writeFile(join(outside, 'image.png'), 'Changed outside image')
  assert.equal(await snapshot([asset]), unsafeAttachment)
})
