import {
  authConfigured,
  clearSessionCookie,
  hasSession,
  sessionCookie,
  validPassword,
  type ServerEnvironment
} from './motto-auth.ts'
import {
  createGitHubNotesRepository,
  type NotesRepository,
  type RepositoryChange
} from './github-notes.ts'
import {
  AdminError,
  editable,
  maxMarkdownBytes,
  parseMarkdown,
  readNotes,
  readTopicSettings,
  writeMarkdown
} from './admin-content.ts'
import {
  noteId,
  notesPrefix,
  overridesPath,
  safeNotePath,
  type NoteOverride
} from '../lib/note-schema.ts'
import { countValues } from '../lib/note-utils.ts'
import { sortTopics, topicSettingsPath } from '../lib/topic-settings.ts'

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'CDN-Cache-Control': 'no-store',
      Vary: 'Cookie',
      'X-Content-Type-Options': 'nosniff',
      ...headers
    }
  })
}
function sameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    throw new AdminError(403, '请从本站后台进行操作。')
}
async function readJson(request: Request, limit = maxMarkdownBytes * 2) {
  if (
    request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json'
  )
    throw new AdminError(415, '请求需要使用 JSON。')
  if (!request.body) throw new AdminError(400, '请求内容不能为空。')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new AdminError(413, '请求内容过长。')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  try {
    const data: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))
    )
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error()
    return data as Record<string, unknown>
  } catch {
    throw new AdminError(400, '请求内容不是有效的 JSON。')
  }
}
async function respond(action: () => Promise<Response>) {
  try {
    return await action()
  } catch (error) {
    return error instanceof AdminError
      ? json({ error: error.message }, error.status)
      : json({ error: '暂时无法处理文章，请检查仓库内容后重试。' }, 503)
  }
}

export function createAdminHandlers({
  repository = createGitHubNotesRepository(),
  environment = () => process.env,
  now = Date.now
}: {
  repository?: NotesRepository
  environment?: () => ServerEnvironment
  now?: () => number
} = {}) {
  function requireConfigured() {
    const env = environment()
    if (!repository.configured || !authConfigured(env))
      throw new AdminError(503, '文章管理尚未配置，请设置服务端 GitHub 连接和作者口令。')
    return env
  }
  function authorize(request: Request) {
    const env = requireConfigured()
    if (!hasSession(request, env, now())) throw new AdminError(401, '请先登录文章管理。')
  }
  return {
    session(request: Request) {
      return respond(async () => {
        if (request.method === 'DELETE') {
          sameOrigin(request)
          return json({ authenticated: false }, 200, {
            'Set-Cookie': clearSessionCookie(request, environment())
          })
        }
        const env = requireConfigured()
        if (request.method === 'GET')
          return json({ authenticated: hasSession(request, env, now()) })
        sameOrigin(request)
        const body = await readJson(request, 4096)
        if (
          typeof body.password !== 'string' ||
          !body.password ||
          body.password.length > 256 ||
          !validPassword(body.password, env)
        )
          throw new AdminError(401, '作者口令不正确。')
        // Reuse the existing author session, without coupling login to the motto Blob store.
        return json({ authenticated: true }, 200, {
          'Set-Cookie': sessionCookie(request, env, now())
        })
      })
    },
    get(request: Request) {
      return respond(async () => {
        authorize(request)
        const snapshot = await repository.snapshot()
        const [{ notes }, settings] = await Promise.all([
          readNotes(snapshot),
          readTopicSettings(snapshot)
        ])
        return json({
          revision: snapshot.revision,
          notes: notes.map(({ source: _source, ...note }) => note),
          topics: sortTopics(countValues(notes, 'topic'), settings.pinned).map(([name, count]) => ({
            name,
            count,
            pinned: settings.pinned.includes(name)
          }))
        })
      })
    },
    pinTopic(request: Request) {
      return respond(async () => {
        sameOrigin(request)
        authorize(request)
        if (request.method !== 'PUT') throw new AdminError(405, '不支持的操作。')
        const body = await readJson(request, 4096)
        if (
          typeof body.revision !== 'string' ||
          !/^[a-f0-9]{40}$/.test(body.revision) ||
          typeof body.topic !== 'string' ||
          !body.topic.trim() ||
          typeof body.pinned !== 'boolean'
        )
          throw new AdminError(400, '缺少有效的专题、置顶状态或仓库版本。')
        const snapshot = await repository.snapshot()
        if (snapshot.revision !== body.revision)
          throw new AdminError(409, '仓库已有新提交。请重新加载列表后再修改专题置顶。')
        const [{ notes }, settings] = await Promise.all([
          readNotes(snapshot),
          readTopicSettings(snapshot)
        ])
        const topic = body.topic
        if (!notes.some((note) => note.data.topic === topic))
          throw new AdminError(404, '专题不存在，请重新加载列表。')
        if (settings.pinned.includes(topic) === body.pinned)
          return json({ revision: snapshot.revision, unchanged: true })
        const remaining = settings.pinned.filter((name) => name !== topic)
        const pinned = body.pinned ? [topic, ...remaining] : remaining
        const result = await repository.commit(
          snapshot,
          {
            path: topicSettingsPath,
            content: `${JSON.stringify({ pinned }, null, 2)}\n`
          },
          `${body.pinned ? 'Pin' : 'Unpin'} note topic: ${topic}`
        )
        return json({ ...result, unchanged: false })
      })
    },
    mutate(request: Request) {
      return respond(async () => {
        sameOrigin(request)
        authorize(request)
        const body = await readJson(request)
        if (
          !safeNotePath(body.path) ||
          typeof body.revision !== 'string' ||
          !/^[a-f0-9]{40}$/.test(body.revision)
        )
          throw new AdminError(400, '缺少有效的文章路径或仓库版本。')
        const path = body.path
        const snapshot = await repository.snapshot()
        if (body.revision !== snapshot.revision)
          throw new AdminError(409, '仓库已有新提交。输入已保留，请重新加载列表后再保存。')
        const { notes, managed, overrides } = await readNotes(snapshot)
        const existing = notes.find((note) => note.path === path)
        const owned = Object.hasOwn(managed, path)
        let change: RepositoryChange
        let action = 'Update'
        if (request.method === 'POST') {
          if (!path.startsWith('web/'))
            throw new AdminError(400, '网页新增文章请保存在 web/ 目录。')
          if (owned || snapshot.files.has(notesPrefix + path))
            throw new AdminError(409, '该文章路径已存在或由 Obsidian 管理。')
          if (typeof body.markdown !== 'string' || !body.markdown.trim())
            throw new AdminError(400, '请上传或粘贴 Markdown 正文。')
          if (Buffer.byteLength(body.markdown) > maxMarkdownBytes)
            throw new AdminError(413, '单篇 Markdown 不能超过 256 KB。')
          const content = writeMarkdown(body.markdown, editable(body.fields), true)
          let id: string
          try {
            id = noteId(path, parseMarkdown(content).data)
          } catch {
            throw new AdminError(400, '文章网址无效或占用了现有栏目，请更换文件名或 slug。')
          }
          if (notes.some((note) => note.id === id))
            throw new AdminError(409, '文章网址与已有文章重复，请换一个文件名。')
          change = { path: notesPrefix + path, content }
          action = 'Create'
        } else {
          if (!existing) throw new AdminError(404, '文章不存在，请重新加载列表。')
          if (request.method === 'DELETE') {
            if (owned) throw new AdminError(400, 'Obsidian 文章请使用下架，原文由 Obsidian 管理。')
            change = { path: notesPrefix + path, content: null }
            action = 'Delete'
          } else if (request.method === 'PUT') {
            if (body.reset !== true) {
              const incoming = editable(body.fields)
              if (
                Object.entries(incoming).every(
                  ([key, value]) =>
                    JSON.stringify(value) ===
                    JSON.stringify(existing.data[key as keyof typeof existing.data])
                )
              )
                return json({ revision: snapshot.revision, unchanged: true })
            }
            if (owned) {
              const next = { ...overrides }
              if (body.reset === true) delete next[path]
              else {
                const fields = editable(body.fields)
                const previous = Object.hasOwn(next, path) ? next[path]! : {}
                const updated: NoteOverride = { ...previous }
                // Only changed fields become overrides; editing tags must not pin the title.
                for (const name of ['title', 'description', 'topic', 'tags', 'publish'] as const) {
                  if (JSON.stringify(fields[name]) !== JSON.stringify(existing.data[name]))
                    Object.assign(updated, { [name]: fields[name] })
                }
                if (Object.keys(updated).length) next[path] = updated
                else delete next[path]
              }
              change = { path: overridesPath, content: `${JSON.stringify(next, null, 2)}\n` }
            } else {
              if (body.reset === true) throw new AdminError(400, '这篇文章没有 Obsidian 设置。')
              change = {
                path: notesPrefix + path,
                content: writeMarkdown(existing.source, editable(body.fields))
              }
            }
          } else throw new AdminError(405, '不支持的操作。')
        }
        if (change.content === (await snapshot.read(change.path)))
          return json({ revision: snapshot.revision, unchanged: true })
        const result = await repository.commit(snapshot, change, `${action} note: ${path}`)
        return json({ ...result, unchanged: false }, request.method === 'POST' ? 201 : 200)
      })
    }
  }
}

export const adminHandlers = createAdminHandlers()
