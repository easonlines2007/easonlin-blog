import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createAdminHandlers } from '../src/server/admin-api.ts'
import { AdminError, parseMarkdown, writeMarkdown } from '../src/server/admin-content.ts'
import {
  createGitHubNotesRepository,
  type NotesRepository,
  type RepositoryChange,
  type RepositoryFile
} from '../src/server/github-notes.ts'
import { sessionCookie } from '../src/server/motto-auth.ts'
import {
  applyNoteOverride,
  editableSchema,
  manifestPath,
  noteId,
  notesPrefix,
  overridesPath,
  overridesSchema,
  type EditableNote
} from '../src/lib/note-schema.ts'
import { publishedNotes } from '../src/lib/note-utils.ts'
import { topicSettingsPath } from '../src/lib/topic-settings.ts'
import { syncObsidian, obsidianNoteId } from '../scripts/obsidian-sync-lib.mjs'

const origin = 'https://blog.example'
const password = 'test-only-high-entropy-author-password'
const environment = {
  MOTTO_ADMIN_PASSWORD_HASH: createHash('sha256').update(password).digest('hex'),
  MOTTO_SESSION_SECRET: 'test-only-independent-signing-key-for-admin',
  BLOG_GITHUB_TOKEN: 'server-only-test-token',
  BLOG_GITHUB_OWNER: 'owner',
  BLOG_GITHUB_REPO: 'blog'
}
const fields: EditableNote = {
  title: '实验笔记',
  description: '',
  topic: 'FC',
  tags: ['原始'],
  publish: true
}
const source =
  '---\ntitle: 实验笔记\ndescription: ""\ntopic: FC\ntags: [原始]\npublish: true\ndate: 2026-10-05\nstatus: ready\npdf: /attachments/sample.pdf\ncustom: 保留\n---\n\n原始正文\n'
const digest = (text: string) => createHash('sha256').update(text).digest('hex')
function req(
  method = 'GET',
  body?: unknown,
  authenticated = true,
  extra: Record<string, string> = {}
) {
  return new Request(`${origin}/api/admin-notes`, {
    method,
    headers: {
      ...(method === 'GET' ? {} : { origin, 'content-type': 'application/json' }),
      ...(authenticated
        ? { cookie: sessionCookie(new Request(origin), environment).split(';')[0]! }
        : {}),
      ...extra
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  })
}
function memory(initial: Record<string, string> = {}) {
  const content = new Map(
    Object.entries({
      [manifestPath]: JSON.stringify({
        version: 1,
        notes: { 'FC/Lab.md': digest(source) },
        attachments: {}
      }),
      [overridesPath]: '{}\n',
      [notesPrefix + 'FC/Lab.md']: source,
      [notesPrefix + 'manual.md']: source.replace('实验笔记', '手写笔记'),
      ...initial
    })
  )
  let revision = '1'.repeat(40)
  const changes: RepositoryChange[] = []
  const repository: NotesRepository = {
    configured: true,
    async snapshot() {
      const copy = new Map(content)
      const files = new Map<string, RepositoryFile>(
        [...copy].map(([path]) => [path, { sha: 'a'.repeat(40), mode: '100644', type: 'blob' }])
      )
      return { revision, tree: '2'.repeat(40), files, read: async (path) => copy.get(path) ?? null }
    },
    async commit(snapshot, change) {
      if (snapshot.revision !== revision) throw new AdminError(409, 'Conflict')
      changes.push(change)
      if (change.content === null) content.delete(change.path)
      else content.set(change.path, change.content)
      revision = String(changes.length + 1).padStart(40, '0')
      return { revision, url: `https://github.com/owner/blog/commit/${revision}` }
    }
  }
  return {
    content,
    changes,
    repository,
    api: createAdminHandlers({ repository, environment: () => environment }),
    revision: () => revision
  }
}

test('all admin reads and writes require authentication; login does not require Blob', async () => {
  const f = memory()
  assert.equal((await f.api.get(req('GET', undefined, false))).status, 401)
  assert.equal((await f.api.pinTopic(req('PUT', {}, false))).status, 401)
  for (const method of ['POST', 'PUT', 'DELETE'])
    assert.equal((await f.api.mutate(req(method, {}, false))).status, 401)
  assert.equal((await f.api.session(req('POST', { password: 'wrong' }, false))).status, 401)
  const login = await f.api.session(req('POST', { password }, false))
  assert.equal(login.status, 200)
  assert.match(login.headers.get('set-cookie')!, /HttpOnly; SameSite=Strict/)
  assert.match(login.headers.get('set-cookie')!, /Secure/)
  const list = await f.api.get(req())
  assert.equal(list.status, 200)
  assert.match(list.headers.get('cache-control')!, /no-store/)
  const text = await list.text()
  assert.ok(!text.includes(environment.BLOG_GITHUB_TOKEN))
  assert.ok(!text.includes('原始正文'))
  const logout = await f.api.session(req('DELETE'))
  assert.match(logout.headers.get('set-cookie')!, /Max-Age=0/)
})

test('cross-origin, malformed JSON, path traversal and stale revisions cannot write', async () => {
  const f = memory()
  const body = { path: 'manual.md', revision: f.revision(), fields }
  assert.equal(
    (await f.api.mutate(req('PUT', body, true, { origin: 'https://elsewhere.example' }))).status,
    403
  )
  assert.equal(
    (await f.api.mutate(req('PUT', body, true, { 'content-type': 'text/plain' }))).status,
    415
  )
  for (const path of [
    '../README.md',
    '%2e%2e/secret.md',
    '/secret.md',
    'x\\secret.md',
    'x\nfile.md'
  ])
    assert.equal((await f.api.mutate(req('PUT', { ...body, path }))).status, 400)
  assert.equal((await f.api.mutate(req('PUT', { ...body, revision: 'a'.repeat(40) }))).status, 409)
  assert.equal(f.changes.length, 0)
})

test('tags-only overrides do not default publish or pin other metadata; reset restores inheritance', async () => {
  assert.deepEqual(overridesSchema.parse({ 'FC/Lab.md': { tags: [] } }), {
    'FC/Lab.md': { tags: [] }
  })
  assert.equal(editableSchema.safeParse({ ...fields, publish: undefined }).success, false)
  const f = memory()
  const result = await f.api.mutate(
    req('PUT', { path: 'FC/Lab.md', revision: f.revision(), fields: { ...fields, tags: [] } })
  )
  assert.equal(result.status, 200)
  assert.equal(f.changes[0]!.path, overridesPath)
  assert.deepEqual(JSON.parse(f.content.get(overridesPath)!), { 'FC/Lab.md': { tags: [] } })
  assert.equal(f.content.get(notesPrefix + 'FC/Lab.md'), source)
  const list = await (await f.api.get(req())).json()
  const note = list.notes.find((entry: { managed: boolean }) => entry.managed)
  assert.equal(note.data.publish, true)
  assert.deepEqual(note.data.tags, [])
  assert.equal(
    (await f.api.mutate(req('PUT', { path: 'FC/Lab.md', revision: f.revision(), reset: true })))
      .status,
    200
  )
  assert.deepEqual(JSON.parse(f.content.get(overridesPath)!), {})
})

test('Obsidian removal is unpublishing; physical deletion and missing manifests fail closed', async () => {
  const f = memory()
  assert.equal(
    (await f.api.mutate(req('DELETE', { path: 'FC/Lab.md', revision: f.revision() }))).status,
    400
  )
  assert.equal(
    (
      await f.api.mutate(
        req('PUT', {
          path: 'FC/Lab.md',
          revision: f.revision(),
          fields: { ...fields, publish: false }
        })
      )
    ).status,
    200
  )
  assert.deepEqual(JSON.parse(f.content.get(overridesPath)!), { 'FC/Lab.md': { publish: false } })
  assert.equal(f.content.get(notesPrefix + 'FC/Lab.md'), source)
  f.content.delete(manifestPath)
  assert.equal(
    (await f.api.mutate(req('DELETE', { path: 'FC/Lab.md', revision: f.revision() }))).status,
    503
  )
  assert.equal(f.changes.length, 1)
})

test('unchanged saves create no deployment; invalid overrides and edited sync copies stop writes', async () => {
  const f = memory()
  const response = await f.api.mutate(
    req('PUT', { path: 'FC/Lab.md', revision: f.revision(), fields })
  )
  assert.equal((await response.json()).unchanged, true)
  assert.equal(f.changes.length, 0)
  f.content.set(overridesPath, '{"FC/Lab.md":{"publish":"false"}}')
  assert.equal((await f.api.get(req())).status, 503)
  f.content.set(overridesPath, '{}')
  f.content.set(notesPrefix + 'FC/Lab.md', source + '手工改动')
  assert.equal(
    (
      await f.api.mutate(
        req('PUT', { path: 'FC/Lab.md', revision: f.revision(), fields: { ...fields, tags: [] } })
      )
    ).status,
    409
  )
  assert.equal(f.changes.length, 0)
})

test('web articles create, preserve body and unknown properties on edit, and delete', async () => {
  const f = memory()
  const path = 'web/一篇新文章.md'
  assert.equal(
    (
      await f.api.mutate(
        req('POST', {
          path,
          revision: f.revision(),
          fields: { ...fields, publish: false },
          markdown: source
        })
      )
    ).status,
    201
  )
  assert.ok(f.content.has(notesPrefix + path))
  assert.equal(
    (
      await f.api.mutate(
        req('PUT', {
          path,
          revision: f.revision(),
          fields: { ...fields, tags: ['新标签', '新标签'] }
        })
      )
    ).status,
    200
  )
  const edited = parseMarkdown(f.content.get(notesPrefix + path)!)
  assert.equal(edited.body, parseMarkdown(source).body)
  assert.equal(edited.data.custom, '保留')
  assert.equal(edited.data.pdf, '/attachments/sample.pdf')
  assert.equal(edited.data.date, '2026-10-05')
  assert.deepEqual(edited.data.tags, ['新标签'])
  assert.equal((await f.api.mutate(req('DELETE', { path, revision: f.revision() }))).status, 200)
  assert.ok(!f.content.has(notesPrefix + path))
})

test('create rejects duplicate URLs, invalid YAML, dates and oversized Markdown', async () => {
  const f = memory()
  const body = { path: 'web/new.md', revision: f.revision(), fields, markdown: source }
  assert.equal(
    (
      await f.api.mutate(
        req('POST', { ...body, markdown: source.replace('date:', 'slug: manual\ndate:') })
      )
    ).status,
    409
  )
  for (const markdown of [
    source.replace('date: 2026-10-05', 'date: 2026-02-31'),
    source.replace('date: 2026-10-05', 'date: 20261005'),
    source.replace('date:', 'title: 重复\ndate:'),
    '---\ntitle: 未结束'
  ])
    assert.equal((await f.api.mutate(req('POST', { ...body, markdown }))).status, 400)
  assert.equal(
    (await f.api.mutate(req('POST', { ...body, markdown: 'a'.repeat(256 * 1024 + 1) }))).status,
    413
  )
  assert.equal(f.changes.length, 0)
  assert.equal(noteId('FC/Laboratory/Lab 03.md'), obsidianNoteId('FC/Laboratory/Lab 03.md'))
  assert.equal(noteId('Folder/index.md'), obsidianNoteId('Folder/index.md'))
})

test('a real Obsidian sync preserves overrides, ownership hashes and Vault bytes', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'blog-admin-sync-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const vaultPath = join(root, 'vault')
  const projectRoot = join(root, 'project')
  await mkdir(join(vaultPath, 'Blog'), { recursive: true })
  await mkdir(projectRoot)
  const original = source.replace('pdf: /attachments/sample.pdf\n', '')
  await writeFile(join(vaultPath, 'Blog/Lab.md'), original)
  await syncObsidian({ vaultPath, projectRoot })
  const firstCopy = await readFile(join(projectRoot, notesPrefix, 'Lab.md'), 'utf8')
  const overrides = { 'Lab.md': { tags: ['网站标签'], publish: false } }
  await writeFile(join(projectRoot, overridesPath), JSON.stringify(overrides))
  const topicSettings = { pinned: ['FC'] }
  await writeFile(join(projectRoot, topicSettingsPath), JSON.stringify(topicSettings))
  await syncObsidian({ vaultPath, projectRoot })
  assert.equal(await readFile(join(projectRoot, notesPrefix, 'Lab.md'), 'utf8'), firstCopy)
  assert.equal(await readFile(join(vaultPath, 'Blog/Lab.md'), 'utf8'), original)
  assert.deepEqual(JSON.parse(await readFile(join(projectRoot, overridesPath), 'utf8')), overrides)
  assert.deepEqual(
    JSON.parse(await readFile(join(projectRoot, topicSettingsPath), 'utf8')),
    topicSettings
  )
  const manifest = JSON.parse(await readFile(join(projectRoot, manifestPath), 'utf8'))
  assert.equal(manifest.notes['Lab.md'], digest(firstCopy))
  const note = {
    id: 'lab',
    filePath: notesPrefix + 'Lab.md',
    data: { ...fields, date: new Date(), status: 'ready' as const }
  }
  const effective = applyNoteOverride(note, overrides, manifest.notes)
  assert.deepEqual(effective.data.tags, ['网站标签'])
  assert.deepEqual(publishedNotes([effective]), [])
  assert.equal(note.data.publish, true)
  assert.equal(applyNoteOverride(note, overrides, {}).data.publish, true)
})

test('GitHub commits retain the original tree and parent, reject concurrent updates without force', async () => {
  const calls: Array<{ path: string; method?: string; body?: any }> = []
  const sha = (n: string) => n.repeat(40)
  const repository = createGitHubNotesRepository({
    environment: () => environment,
    fetcher: async (input, init) => {
      const path = String(input).replace('https://api.github.com/repos/owner/blog', '')
      calls.push({
        path,
        method: init?.method,
        body: init?.body ? JSON.parse(String(init.body)) : undefined
      })
      assert.equal(
        (init!.headers as Record<string, string>).Authorization,
        `Bearer ${environment.BLOG_GITHUB_TOKEN}`
      )
      if (path === '/git/ref/heads/main')
        return Response.json({ object: { sha: sha('1'), type: 'commit' } })
      if (path === `/git/commits/${sha('1')}`) return Response.json({ tree: { sha: sha('2') } })
      if (path.startsWith(`/git/trees/${sha('2')}`))
        return Response.json({ truncated: false, tree: [] })
      if (path === '/git/trees') return Response.json({ sha: sha('3') })
      if (path === '/git/commits') return Response.json({ sha: sha('4') })
      if (path === '/git/refs/heads/main')
        return Response.json({ message: 'Update is not a fast forward' }, { status: 422 })
      throw new Error(`Unexpected ${path}`)
    }
  })
  const snapshot = await repository.snapshot()
  await assert.rejects(
    () => repository.commit(snapshot, { path: overridesPath, content: '{}' }, 'Update tags'),
    (error: unknown) => error instanceof AdminError && error.status === 409
  )
  assert.deepEqual(calls.at(-1)!.body, { sha: sha('4'), force: false })
  assert.deepEqual(calls.find((call) => call.path === '/git/commits')!.body.parents, [sha('1')])
  const commit = calls.find((call) => call.path === '/git/commits')!.body
  const noreplyIdentity = {
    name: 'Eason Lin',
    email: '278925066+easonlines2007@users.noreply.github.com'
  }
  assert.deepEqual(commit.author, noreplyIdentity)
  assert.deepEqual(commit.committer, noreplyIdentity)
  assert.equal(calls.find((call) => call.path === '/git/trees')!.body.base_tree, sha('2'))
  const count = calls.length
  await assert.rejects(() =>
    repository.commit(snapshot, { path: '.github/workflows/foo.yml', content: '' }, 'Bad')
  )
  await assert.rejects(() =>
    repository.commit(snapshot, { path: manifestPath, content: '{}' }, 'Bad')
  )
  assert.equal(calls.length, count)
  assert.equal(
    createGitHubNotesRepository({ environment: () => ({ ...environment, VERCEL_ENV: 'preview' }) })
      .configured,
    false
  )
})

test('GitHub tree truncation and symbolic links stop the read instead of bypassing ownership checks', async () => {
  for (const truncated of [true, false]) {
    const repository = createGitHubNotesRepository({
      environment: () => environment,
      fetcher: async (input) => {
        const url = String(input)
        if (url.includes('/git/ref/'))
          return Response.json({ object: { sha: '1'.repeat(40), type: 'commit' } })
        if (url.includes('/git/commits/')) return Response.json({ tree: { sha: '2'.repeat(40) } })
        return Response.json({
          truncated,
          tree: [
            { path: notesPrefix + 'link.md', sha: '3'.repeat(40), type: 'blob', mode: '120000' }
          ]
        })
      }
    })
    if (truncated) await assert.rejects(() => repository.snapshot())
    else
      await assert.rejects(() =>
        repository.snapshot().then((snapshot) => snapshot.read(notesPrefix + 'link.md'))
      )
  }
})

test('topic pinning persists globally without editing notes; unpin restores default order', async () => {
  const f = memory({ [notesPrefix + 'manual.md']: source.replace('topic: FC', 'topic: MIT 18.06') })
  const originals = new Map(f.content)
  const listing = await (await f.api.get(req())).json()
  assert.equal(listing.topics.length, 2)
  assert.ok(listing.topics.every((topic: { pinned: boolean }) => !topic.pinned))
  const pin = async (topic: string, pinned: boolean) =>
    f.api.pinTopic(req('PUT', { topic, pinned, revision: f.revision() }))
  assert.equal((await pin('MIT 18.06', true)).status, 200)
  assert.deepEqual(JSON.parse(f.content.get(topicSettingsPath)!), { pinned: ['MIT 18.06'] })
  assert.equal((await pin('FC', true)).status, 200)
  let topics = (await (await f.api.get(req())).json()).topics
  assert.deepEqual(
    topics.map((topic: { name: string }) => topic.name),
    ['FC', 'MIT 18.06']
  )
  assert.ok(topics.every((topic: { pinned: boolean }) => topic.pinned))
  const changes = f.changes.length
  assert.equal((await (await pin('FC', true)).json()).unchanged, true)
  assert.equal(f.changes.length, changes)
  assert.equal((await pin('FC', false)).status, 200)
  topics = (await (await f.api.get(req())).json()).topics
  assert.deepEqual(
    topics.map((topic: { name: string; pinned: boolean }) => [topic.name, topic.pinned]),
    [
      ['MIT 18.06', true],
      ['FC', false]
    ]
  )
  assert.equal((await pin('MIT 18.06', false)).status, 200)
  assert.deepEqual((await (await f.api.get(req())).json()).topics, listing.topics)
  assert.ok(f.changes.every((change) => change.path === topicSettingsPath))
  for (const [path, source] of originals) assert.equal(f.content.get(path), source)
})

test('topic pin writes reject cross-origin calls, stale revisions, invalid status and unknown topics', async () => {
  const f = memory()
  const body = { topic: 'FC', pinned: true, revision: f.revision() }
  assert.equal(
    (await f.api.pinTopic(req('PUT', body, true, { origin: 'https://elsewhere.example' }))).status,
    403
  )
  assert.equal(
    (await f.api.pinTopic(req('PUT', { ...body, revision: 'a'.repeat(40) }))).status,
    409
  )
  assert.equal((await f.api.pinTopic(req('PUT', { ...body, pinned: 'true' }))).status, 400)
  assert.equal((await f.api.pinTopic(req('PUT', { ...body, topic: 'unknown' }))).status, 404)
  assert.equal((await f.api.pinTopic(req('PUT', { ...body, topic: '../../secret' }))).status, 404)
  assert.equal(
    (await f.api.pinTopic(req('PUT', body, true, { 'content-type': 'text/plain' }))).status,
    415
  )
  assert.equal((await f.api.pinTopic(req('PUT', { ...body, topic: 'a'.repeat(5000) }))).status, 413)
  assert.equal(f.changes.length, 0)
})

test('malformed topic settings and concurrent Git writes cannot erase existing preferences', async () => {
  for (const source of ['invalid', '{"pinned":["FC","FC"]}', '{"pinned":true}']) {
    const f = memory({ [topicSettingsPath]: source })
    assert.equal((await f.api.get(req())).status, 503)
    assert.equal(
      (await f.api.pinTopic(req('PUT', { topic: 'FC', pinned: true, revision: f.revision() })))
        .status,
      503
    )
    assert.equal(f.changes.length, 0)
    assert.equal(f.content.get(topicSettingsPath), source)
  }
  const f = memory()
  f.repository.commit = async () => {
    throw new AdminError(409, 'Concurrent commit')
  }
  assert.equal(
    (await f.api.pinTopic(req('PUT', { topic: 'FC', pinned: true, revision: f.revision() })))
      .status,
    409
  )
  assert.equal(f.changes.length, 0)
})
