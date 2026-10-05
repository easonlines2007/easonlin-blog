import { BlobPreconditionFailedError, get, put } from '@vercel/blob'
import type { ServerEnvironment } from './motto-auth.ts'

export interface StoredMotto {
  text: string
  updatedAt: string
  revision: string
}

export interface MottoStore {
  readonly configured: boolean
  read(): Promise<StoredMotto | null>
  write(text: string, revision: string | null): Promise<StoredMotto>
}

interface BlobClient {
  get(
    pathname: string,
    options: { access: 'private'; useCache: false; abortSignal: AbortSignal }
  ): Promise<{
    statusCode: number
    stream: ReadableStream<Uint8Array> | null
    blob: { etag: string }
  } | null>
  put(
    pathname: string,
    body: string,
    options: {
      access: 'private'
      addRandomSuffix: false
      allowOverwrite: boolean
      contentType: 'application/json'
      ifMatch?: string
      abortSignal: AbortSignal
    }
  ): Promise<{ etag: string }>
}

export class MottoConflictError extends Error {}

export function normalizeMotto(value: unknown) {
  if (typeof value !== 'string' || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(value))
    return null
  const text = value.trim().replace(/\s+/gu, ' ')
  return text && Array.from(text).length <= 120 ? text : null
}

export function createBlobMottoStore({
  client = { get, put },
  environment = () => process.env,
  now = () => new Date()
}: {
  client?: BlobClient
  environment?: () => ServerEnvironment
  now?: () => Date
} = {}): MottoStore {
  const pathname = 'site/motto.json'
  return {
    get configured() {
      const env = environment()
      // In deployed Functions the SDK obtains OIDC from the request context;
      // VERCEL_OIDC_TOKEN is not necessarily an environment variable there.
      return Boolean(env.BLOB_STORE_ID || env.BLOB_READ_WRITE_TOKEN)
    },
    async read() {
      const result = await client.get(pathname, {
        access: 'private',
        useCache: false,
        abortSignal: AbortSignal.timeout(8000)
      })
      if (result === null) return null
      if (result.statusCode !== 200 || !result.stream || !result.blob.etag)
        throw new Error('Unreadable motto record')
      const data: unknown = await new Response(result.stream).json()
      if (!data || typeof data !== 'object') throw new Error('Invalid motto record')
      const record = data as Record<string, unknown>
      const text = normalizeMotto(record.text)
      if (
        !text ||
        typeof record.updatedAt !== 'string' ||
        !Number.isFinite(Date.parse(record.updatedAt))
      )
        throw new Error('Invalid motto record')
      return { text, updatedAt: record.updatedAt, revision: result.blob.etag }
    },
    async write(text, revision) {
      const updatedAt = now().toISOString()
      try {
        const result = await client.put(pathname, JSON.stringify({ text, updatedAt }), {
          access: 'private',
          addRandomSuffix: false,
          // Atomic create for the first value; compare-and-swap for every subsequent save.
          allowOverwrite: revision !== null,
          ...(revision === null ? {} : { ifMatch: revision }),
          contentType: 'application/json',
          abortSignal: AbortSignal.timeout(8000)
        })
        if (!result.etag) throw new Error('Missing motto revision')
        return { text, updatedAt, revision: result.etag }
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) throw new MottoConflictError()
        // The SDK has no dedicated "already exists" error. Confirm the initial-create
        // conflict by reading the fixed path; never retry with overwrite enabled.
        if (revision === null && (await this.read())) throw new MottoConflictError()
        throw error
      }
    }
  }
}
