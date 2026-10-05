import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export type ServerEnvironment = Record<string, string | undefined>

const cookieName = 'motto-session'
const sessionSeconds = 7 * 24 * 60 * 60

export function authConfigured(env: ServerEnvironment) {
  return (
    /^[a-f0-9]{64}$/i.test(env.MOTTO_ADMIN_PASSWORD_HASH || '') &&
    (env.MOTTO_SESSION_SECRET?.length || 0) >= 32 &&
    env.MOTTO_SESSION_SECRET !== env.MOTTO_ADMIN_PASSWORD_HASH
  )
}

export function validPassword(password: string, env: ServerEnvironment) {
  if (!authConfigured(env)) return false
  const actual = createHash('sha256').update(password, 'utf8').digest()
  const expected = Buffer.from(env.MOTTO_ADMIN_PASSWORD_HASH!, 'hex')
  return timingSafeEqual(actual, expected)
}

function signature(payload: string, env: ServerEnvironment) {
  // Changing either the password or the signing secret also invalidates old sessions.
  return createHmac('sha256', env.MOTTO_SESSION_SECRET!)
    .update(`${payload}:${env.MOTTO_ADMIN_PASSWORD_HASH}`)
    .digest('base64url')
}

function secureCookie(request: Request, env: ServerEnvironment) {
  const url = new URL(request.url)
  const localHttp =
    url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
    env.NODE_ENV !== 'production' &&
    env.VERCEL_ENV !== 'production' &&
    env.VERCEL !== '1'
  return !localHttp
}

function cookie(value: string, maxAge: number, request: Request, env: ServerEnvironment) {
  return `${cookieName}=${value}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${
    secureCookie(request, env) ? '; Secure' : ''
  }`
}

export function sessionCookie(request: Request, env: ServerEnvironment, now = Date.now()) {
  const expires = Math.floor(now / 1000) + sessionSeconds
  const payload = `1.${expires}.${randomBytes(16).toString('hex')}`
  return cookie(`${payload}.${signature(payload, env)}`, sessionSeconds, request, env)
}

export function clearSessionCookie(request: Request, env: ServerEnvironment) {
  return cookie('', 0, request, env)
}

export function hasSession(request: Request, env: ServerEnvironment, now = Date.now()) {
  if (!authConfigured(env)) return false
  const cookies = (request.headers.get('cookie') || '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${cookieName}=`))
  if (cookies.length !== 1) return false
  const token = cookies[0]!.slice(cookieName.length + 1)
  const match = /^1\.(\d{10,11})\.([a-f0-9]{32})\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return false

  const expires = Number(match[1])
  const nowSeconds = Math.floor(now / 1000)
  if (expires <= nowSeconds || expires > nowSeconds + sessionSeconds) return false
  const payload = `1.${match[1]}.${match[2]}`
  // Compare the canonical encoding too; alternate base64 padding bits must not pass.
  const actual = Buffer.from(match[3]!, 'ascii')
  const expected = Buffer.from(signature(payload, env), 'ascii')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
