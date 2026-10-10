import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { BlobPreconditionFailedError } from '@vercel/blob'
import { createMottoHandlers } from '../src/server/motto-api.ts'
import {
  authConfigured,
  hasSession,
  sessionCookie,
  type ServerEnvironment
} from '../src/server/motto-auth.ts'
import {
  createBlobMottoStore,
  MottoConflictError,
  type MottoStore,
  type StoredMotto
} from '../src/server/motto-store.ts'

const origin = 'https://easonlin-blog.vercel.app'
const password = 'test-only-random-author-password-938e29d94c65'
const now = Date.parse('2026-10-04T12:00:00.000Z')
const environment: ServerEnvironment = {
  NODE_ENV: 'production',
  MOTTO_ADMIN_PASSWORD_HASH: createHash('sha256').update(password).digest('hex'),
  MOTTO_SESSION_SECRET: 'test-only-independent-session-secret-88426f1a59'
}

function request(
  path: string,
  {
    method = 'GET',
    body,
    headers = {}
  }: {
    method?: string
    body?: unknown
    headers?: Record<string, string>
  } = {}
) {
  return new Request(`${origin}${path}`, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    headers: {
      ...(method === 'GET' ? {} : { Origin: origin, 'Content-Type': 'application/json' }),
      ...headers
    }
  })
}

function memoryStore(): MottoStore {
  let value: StoredMotto | null = null
  let version = 0
  return {
    configured: true,
    async read() {
      return value && { ...value }
    },
    async write(text, revision) {
      if ((value?.revision ?? null) !== revision) throw new MottoConflictError()
      value = { text, updatedAt: new Date(now).toISOString(), revision: `"${++version}"` }
      return { ...value }
    }
  }
}

function handlers(store = memoryStore(), env = environment) {
  return createMottoHandlers({ store, environment: () => env, now: () => now })
}

function authenticatedCookie() {
  return sessionCookie(request('/api/motto-session'), environment, now).split(';')[0]!
}

test('author login gives a private secure session; anonymous visitors only read', async () => {
  const api = handlers()
  const initial = await api.get(request('/api/motto'))
  assert.equal(initial.status, 200)
  assert.match(initial.headers.get('cache-control')!, /no-store/)
  assert.deepEqual(await initial.json(), {
    text: '记录、整理，慢慢理解。',
    updatedAt: null,
    revision: null,
    canEdit: false,
    configured: true
  })
  assert.equal(
    (
      await api.put(
        request('/api/motto', {
          method: 'PUT',
          body: { text: '访客不能写入', revision: null }
        })
      )
    ).status,
    401
  )
  assert.equal(
    (
      await api.login(
        request('/api/motto-session', {
          method: 'POST',
          body: { password: 'incorrect' }
        })
      )
    ).status,
    401
  )

  const login = await api.login(
    request('/api/motto-session', {
      method: 'POST',
      body: { password }
    })
  )
  assert.equal(login.status, 200)
  assert.deepEqual(await login.json(), { canEdit: true })
  const cookie = login.headers.get('set-cookie')!
  assert.match(cookie, /Path=\/api; HttpOnly; SameSite=Strict/)
  assert.match(cookie, /; Secure$/)
  assert.equal(cookie.includes(password), false)
  const response = await api.get(
    request('/api/motto', {
      headers: { Cookie: cookie.split(';')[0]! }
    })
  )
  assert.equal((await response.json()).canEdit, true)
})

test('sessions reject tampering, expiry, duplicate cookies and changed credentials', () => {
  const requestWithSession = request('/api/motto', { headers: { Cookie: authenticatedCookie() } })
  assert.equal(hasSession(requestWithSession, environment, now), true)
  assert.equal(hasSession(requestWithSession, environment, now + 7 * 24 * 60 * 60 * 1000), false)
  assert.equal(
    hasSession(requestWithSession, { ...environment, MOTTO_SESSION_SECRET: 'z'.repeat(40) }, now),
    false
  )
  assert.equal(
    hasSession(
      requestWithSession,
      {
        ...environment,
        MOTTO_ADMIN_PASSWORD_HASH: 'a'.repeat(64)
      },
      now
    ),
    false
  )
  const cookie = authenticatedCookie()
  assert.equal(
    hasSession(
      request('/api/motto', {
        headers: { Cookie: cookie.slice(0, -1) + (cookie.endsWith('a') ? 'b' : 'a') }
      }),
      environment,
      now
    ),
    false
  )
  assert.equal(
    hasSession(
      request('/api/motto', {
        headers: { Cookie: `${cookie}; ${cookie}` }
      }),
      environment,
      now
    ),
    false
  )
  assert.equal(
    hasSession(
      request('/api/motto', {
        headers: { Cookie: `motto-session=${'x'.repeat(2000)}` }
      }),
      environment,
      now
    ),
    false
  )
})

test('missing or malformed configuration never enables author writes', async () => {
  for (const env of [
    {},
    { ...environment, MOTTO_ADMIN_PASSWORD_HASH: 'wrong-format' },
    { ...environment, MOTTO_SESSION_SECRET: 'too-short' },
    { ...environment, MOTTO_SESSION_SECRET: environment.MOTTO_ADMIN_PASSWORD_HASH }
  ]) {
    assert.equal(authConfigured(env), false)
    const api = handlers(memoryStore(), env)
    const state = await (
      await api.get(
        request('/api/motto', {
          headers: { Cookie: authenticatedCookie() }
        })
      )
    ).json()
    assert.equal(state.configured, false)
    assert.equal(state.canEdit, false)
    assert.equal(
      (
        await api.login(
          request('/api/motto-session', {
            method: 'POST',
            body: { password }
          })
        )
      ).status,
      503
    )
  }
  const missingStore = handlers({
    configured: false,
    async read() {
      assert.fail('Unconfigured storage must not be called')
    },
    async write() {
      assert.fail('Unconfigured storage must not be called')
    }
  })
  assert.equal((await missingStore.get(request('/api/motto'))).status, 503)
  assert.equal(
    (
      await missingStore.put(
        request('/api/motto', {
          method: 'PUT',
          body: { text: '不可写', revision: null },
          headers: { Cookie: authenticatedCookie() }
        })
      )
    ).status,
    503
  )
})

test('login, saving and logout require an exact same-origin Origin', async () => {
  const api = handlers({
    configured: true,
    async read() {
      assert.fail('CSRF must be rejected before storage')
    },
    async write() {
      assert.fail('CSRF must be rejected before storage')
    }
  })
  for (const unsafeOrigin of ['', 'null', 'https://other.example', `${origin}.evil.example`]) {
    const headers = { Origin: unsafeOrigin, Cookie: authenticatedCookie() }
    const login = await api.login(
      request('/api/motto-session', {
        method: 'POST',
        body: { password },
        headers
      })
    )
    const save = await api.put(
      request('/api/motto', {
        method: 'PUT',
        body: { text: '不可写', revision: null },
        headers
      })
    )
    const logout = await api.logout(request('/api/motto-session', { method: 'DELETE', headers }))
    assert.equal(login.status, 403)
    assert.equal(save.status, 403)
    assert.equal(logout.status, 403)
  }
  const logout = await api.logout(request('/api/motto-session', { method: 'DELETE' }))
  assert.equal(logout.status, 200)
  assert.match(logout.headers.get('set-cookie')!, /^motto-session=; Path=\/api;/)
  assert.match(logout.headers.get('set-cookie')!, /Max-Age=0; Secure/)
})

test('request limits count actual UTF-8 bytes, validate JSON and limit Unicode code points', async () => {
  const api = handlers()
  const headers = { Cookie: authenticatedCookie() }
  const valid = await api.put(
    request('/api/motto', {
      method: 'PUT',
      body: { text: '🌻'.repeat(120), revision: null },
      headers
    })
  )
  assert.equal(valid.status, 200)
  const revision = (await valid.json()).revision
  for (const text of ['🌻'.repeat(121), '  ', '\u0000bad']) {
    assert.equal(
      (
        await api.put(
          request('/api/motto', {
            method: 'PUT',
            body: { text, revision },
            headers
          })
        )
      ).status,
      400
    )
  }
  assert.equal(
    (
      await api.put(
        request('/api/motto', {
          method: 'PUT',
          body: { text: '没有版本' },
          headers
        })
      )
    ).status,
    400
  )
  assert.equal(
    (
      await api.put(
        request('/api/motto', {
          method: 'PUT',
          body: { text: 'ok', revision },
          headers: { ...headers, 'Content-Type': 'text/plain' }
        })
      )
    ).status,
    415
  )
  const jsonHeaders = { ...headers, Origin: origin, 'Content-Type': 'application/json' }
  const oversized = new Request(`${origin}/api/motto`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ text: '汉'.repeat(1500), revision })
  })
  assert.equal(oversized.headers.has('content-length'), false)
  assert.equal((await api.put(oversized)).status, 413)
  const malformed = new Request(`${origin}/api/motto`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: '{ invalid json'
  })
  assert.equal((await api.put(malformed)).status, 400)
  assert.equal(
    (
      await api.login(
        request('/api/motto-session', {
          method: 'POST',
          body: { password: 'a'.repeat(257) }
        })
      )
    ).status,
    400
  )
})

test('saved plain text is permanent for every new reader; stale clients cannot overwrite', async () => {
  const api = handlers()
  const save = async (text: string, revision: string | null) =>
    api.put(
      request('/api/motto', {
        method: 'PUT',
        body: { text, revision },
        headers: { Cookie: authenticatedCookie() }
      })
    )
  const first = await save('  慢慢\n 理解，认真记录。  ', null)
  assert.equal(first.status, 200)
  const saved = await first.json()
  assert.equal(saved.text, '慢慢 理解，认真记录。')
  const anonymous = await (await api.get(request('/api/motto'))).json()
  assert.equal(anonymous.text, saved.text)
  assert.equal(anonymous.canEdit, false)
  assert.equal((await save('旧首页的首次写入', null)).status, 409)

  const competing = await Promise.all([
    save('<em>仍然只是纯文字</em>', saved.revision),
    save('另一浏览器的改动', saved.revision)
  ])
  assert.deepEqual(competing.map((response) => response.status).sort(), [200, 409])
  const current = await (await api.get(request('/api/motto'))).json()
  assert.notEqual(current.revision, saved.revision)
  assert.equal(current.text, '<em>仍然只是纯文字</em>')
})

test('storage failures preserve fallback reading and never report a successful save', async () => {
  const api = handlers({
    configured: true,
    async read() {
      throw new Error('storage token detail must not reach visitors')
    },
    async write() {
      throw new Error('private backend detail')
    }
  })
  const read = await api.get(request('/api/motto', { headers: { Cookie: authenticatedCookie() } }))
  assert.equal(read.status, 503)
  assert.deepEqual(await read.json(), {
    text: '记录、整理，慢慢理解。',
    updatedAt: null,
    revision: null,
    canEdit: false,
    configured: false,
    error: '暂时无法读取格言。'
  })
  const write = await api.put(
    request('/api/motto', {
      method: 'PUT',
      body: { text: '未保存', revision: null },
      headers: { Cookie: authenticatedCookie() }
    })
  )
  assert.equal(write.status, 503)
  assert.deepEqual(await write.json(), { error: '暂时无法保存，请稍后重试。' })
})

test('Blob store uses uncached reads and atomic create/ETag compare-and-swap', async () => {
  let blob: { text: string; updatedAt: string; etag: string } | null = null
  let version = 0
  const store = createBlobMottoStore({
    environment: () => ({ BLOB_STORE_ID: 'test-store', VERCEL_OIDC_TOKEN: 'test-token' }),
    now: () => new Date(now),
    client: {
      async get(pathname, options) {
        assert.equal(pathname, 'site/motto.json')
        assert.equal(options.access, 'private')
        assert.equal(options.useCache, false)
        if (!blob) return null
        return {
          statusCode: 200,
          stream: new Response(JSON.stringify(blob)).body!,
          blob: { etag: blob.etag }
        }
      },
      async put(pathname, body, options) {
        assert.equal(pathname, 'site/motto.json')
        assert.equal(options.access, 'private')
        assert.equal(options.addRandomSuffix, false)
        if (options.allowOverwrite) {
          assert.equal(typeof options.ifMatch, 'string')
          if (blob?.etag !== options.ifMatch) throw new BlobPreconditionFailedError()
        } else {
          assert.equal(options.ifMatch, undefined)
          if (blob) throw new Error('Blob already exists')
        }
        blob = { ...JSON.parse(body), etag: `"blob-${++version}"` }
        return { etag: blob!.etag }
      }
    }
  })
  assert.equal(store.configured, true)
  assert.equal(await store.read(), null)
  const firstResults = await Promise.allSettled([
    store.write('第一份保存', null),
    store.write('第二份保存', null)
  ])
  assert.equal(firstResults.filter((result) => result.status === 'fulfilled').length, 1)
  const firstConflict = firstResults.find((result) => result.status === 'rejected')!
  assert(firstConflict.status === 'rejected' && firstConflict.reason instanceof MottoConflictError)
  const current = (await store.read())!
  const next = await store.write('更新后的保存', current.revision)
  assert.notEqual(next.revision, current.revision)
  await assert.rejects(store.write('过期浏览器', current.revision), MottoConflictError)
})

test('damaged Blob data is unavailable instead of masquerading as an empty record', async () => {
  const store = createBlobMottoStore({
    client: {
      async get() {
        return { statusCode: 200, stream: new Response('{ damaged').body!, blob: { etag: 'old' } }
      },
      async put() {
        throw new Error('already exists')
      }
    }
  })
  await assert.rejects(store.read())
  await assert.rejects(store.write('不能覆盖坏数据', null), { name: 'SyntaxError' })
})

test('Secure can only be relaxed for local HTTP development', () => {
  const localRequest = new Request('http://127.0.0.1:4321/api/motto-session')
  const localCookie = sessionCookie(localRequest, { ...environment, NODE_ENV: 'development' }, now)
  assert.equal(localCookie.includes('; Secure'), false)
  assert.equal(sessionCookie(localRequest, environment, now).includes('; Secure'), true)
  assert.equal(
    sessionCookie(
      new Request('http://example.com/api/motto-session'),
      {
        ...environment,
        NODE_ENV: 'development'
      },
      now
    ).includes('; Secure'),
    true
  )
})

test('English motto reads and edits share author authentication without changing the Chinese value', async () => {
  let value: StoredMotto = {
    text: '中文格言',
    textEn: 'An English motto',
    revision: '"1"',
    updatedAt: new Date(now).toISOString()
  }
  const store: MottoStore = {
    configured: true,
    async read() {
      return { ...value }
    },
    async write(text, revision, textEn) {
      if (revision !== value.revision) throw new MottoConflictError()
      value = {
        text,
        ...(textEn ? { textEn } : {}),
        revision: '"2"',
        updatedAt: new Date(now).toISOString()
      }
      return { ...value }
    }
  }
  const api = handlers(store)
  assert.equal(
    (await (await api.get(request('/api/motto?lang=en'))).json()).text,
    'An English motto'
  )
  const write = await api.put(
    request('/api/motto?lang=en', {
      method: 'PUT',
      headers: { Cookie: authenticatedCookie() },
      body: { text: 'A revised English motto', revision: '"1"' }
    })
  )
  assert.equal(write.status, 200)
  assert.equal((await write.json()).text, 'A revised English motto')
  assert.equal((await (await api.get(request('/api/motto'))).json()).text, '中文格言')
  const stale = await api.put(
    request('/api/motto?lang=en', {
      method: 'PUT',
      headers: { Cookie: authenticatedCookie() },
      body: { text: 'A stale edit', revision: '"1"' }
    })
  )
  assert.equal(stale.status, 409)
})
