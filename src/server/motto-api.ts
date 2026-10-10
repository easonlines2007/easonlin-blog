import defaultMotto from '../data/motto.json' with { type: 'json' }
import {
  authConfigured,
  clearSessionCookie,
  hasSession,
  sessionCookie,
  validPassword,
  type ServerEnvironment
} from './motto-auth.ts'
import {
  createBlobMottoStore,
  MottoConflictError,
  normalizeMotto,
  type MottoStore
} from './motto-store.ts'

class RequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'CDN-Cache-Control': 'no-store',
      Vary: 'Cookie',
      ...headers
    }
  })
}

function requireSameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    throw new RequestError(403, '请从本站页面进行操作。')
}

async function readJson(request: Request) {
  if (
    request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json'
  )
    throw new RequestError(415, '请求需要使用 JSON。')
  const length = request.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > 4096))
    throw new RequestError(413, '请求内容过长。')
  if (!request.body) throw new RequestError(400, '请求内容不能为空。')

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  try {
    while (true) {
      const result = await reader.read()
      if (result.done) break
      bytes += result.value.byteLength
      if (bytes > 4096) {
        await reader.cancel()
        throw new RequestError(413, '请求内容过长。')
      }
      chunks.push(result.value)
    }
  } finally {
    reader.releaseLock()
  }
  try {
    const body = new Uint8Array(bytes)
    let offset = 0
    for (const chunk of chunks) {
      body.set(chunk, offset)
      offset += chunk.byteLength
    }
    const data: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body))
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error()
    return data as Record<string, unknown>
  } catch {
    throw new RequestError(400, '请求内容不是有效的 JSON。')
  }
}

function requestFailure(error: unknown) {
  return error instanceof RequestError
    ? json({ error: error.message }, error.status)
    : json({ error: '暂时无法保存，请稍后重试。' }, 503)
}

export function createMottoHandlers({
  store = createBlobMottoStore(),
  environment = () => process.env,
  now = Date.now
}: {
  store?: MottoStore
  environment?: () => ServerEnvironment
  now?: () => number
} = {}) {
  function configured(env: ServerEnvironment) {
    return store.configured && authConfigured(env)
  }
  function requireConfigured(env: ServerEnvironment) {
    if (!configured(env)) throw new RequestError(503, '格言编辑暂不可用。')
  }
  return {
    async get(request: Request) {
      const english = new URL(request.url).searchParams.get('lang') === 'en'
      const env = environment()
      const fallback = {
        text: english ? defaultMotto.textEn : defaultMotto.text,
        updatedAt: null,
        revision: null,
        canEdit: false,
        configured: false
      }
      if (!store.configured) return json(fallback, 503)
      try {
        const motto = await store.read()
        const ready = configured(env)
        return json({
          text: english
            ? (motto?.textEn ?? defaultMotto.textEn)
            : (motto?.text ?? defaultMotto.text),
          updatedAt: motto?.updatedAt ?? null,
          revision: motto?.revision ?? null,
          canEdit: ready && hasSession(request, env, now()),
          configured: ready
        })
      } catch {
        return json({ ...fallback, error: '暂时无法读取格言。' }, 503)
      }
    },
    async put(request: Request) {
      try {
        requireSameOrigin(request)
        const env = environment()
        requireConfigured(env)
        if (!hasSession(request, env, now())) throw new RequestError(401, '请先验证作者身份。')
        const body = await readJson(request)
        const text = normalizeMotto(body.text)
        if (!text) throw new RequestError(400, '格言需要为 1–120 个字的纯文字。')
        if (
          body.revision !== null &&
          (typeof body.revision !== 'string' || !/^[\x21-\x7E]{1,256}$/.test(body.revision))
        )
          throw new RequestError(400, '缺少有效的格言版本，请刷新后重试。')
        const english = new URL(request.url).searchParams.get('lang') === 'en'
        const current = english ? await store.read() : null
        const motto = english
          ? await store.write(
              current?.text ?? defaultMotto.text,
              body.revision as string | null,
              text
            )
          : await store.write(text, body.revision as string | null)
        return json({
          ...motto,
          ...(english ? { text: motto.textEn ?? text } : {}),
          canEdit: true,
          configured: true
        })
      } catch (error) {
        return error instanceof MottoConflictError
          ? json({ error: '格言已在另一处更新，请读取最新内容后再保存。' }, 409)
          : requestFailure(error)
      }
    },
    async login(request: Request) {
      try {
        requireSameOrigin(request)
        const env = environment()
        requireConfigured(env)
        const body = await readJson(request)
        if (typeof body.password !== 'string' || !body.password || body.password.length > 256)
          throw new RequestError(400, '请输入有效的作者口令。')
        if (!validPassword(body.password, env)) throw new RequestError(401, '作者口令不正确。')
        return json({ canEdit: true }, 200, {
          'Set-Cookie': sessionCookie(request, env, now())
        })
      } catch (error) {
        return requestFailure(error)
      }
    },
    async logout(request: Request) {
      try {
        requireSameOrigin(request)
        return json({ canEdit: false }, 200, {
          'Set-Cookie': clearSessionCookie(request, environment())
        })
      } catch (error) {
        return requestFailure(error)
      }
    }
  }
}

export const mottoHandlers = createMottoHandlers()
