import { AdminError, maxMarkdownBytes } from './admin-content.ts'
import { manifestPath, notesPrefix, overridesPath, safeNotePath } from '../lib/note-schema.ts'
import type { ServerEnvironment } from './motto-auth.ts'
import { topicSettingsPath } from '../lib/topic-settings.ts'

export interface RepositoryFile {
  sha: string
  mode: string
  type: string
  size?: number
}
export interface RepositorySnapshot {
  revision: string
  tree: string
  files: Map<string, RepositoryFile>
  read(path: string): Promise<string | null>
}
export interface RepositoryChange {
  path: string
  content: string | null
}
export interface NotesRepository {
  readonly configured: boolean
  snapshot(): Promise<RepositorySnapshot>
  commit(
    snapshot: RepositorySnapshot,
    change: RepositoryChange,
    message: string
  ): Promise<{ revision: string; url: string }>
}

const oid = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)
// Explicitly set both identities so GitHub never falls back to the account's private email.
const commitIdentity = {
  name: 'Eason Lin',
  email: '278925066+easonlines2007@users.noreply.github.com'
}
const readable = (path: string) =>
  path === manifestPath ||
  path === overridesPath ||
  path === topicSettingsPath ||
  (path.startsWith(notesPrefix) && safeNotePath(path.slice(notesPrefix.length)))

export function createGitHubNotesRepository({
  environment = () => process.env,
  fetcher = fetch
}: { environment?: () => ServerEnvironment; fetcher?: typeof fetch } = {}): NotesRepository {
  function config() {
    const env = environment()
    const owner = env.BLOG_GITHUB_OWNER ?? ''
    const repo = env.BLOG_GITHUB_REPO ?? ''
    const branch = env.BLOG_GITHUB_BRANCH || 'main'
    const token = env.BLOG_GITHUB_TOKEN
    if (
      !token ||
      !/^[\w-]+$/.test(owner) ||
      !/^[\w.-]+$/.test(repo) ||
      repo === '.' ||
      repo === '..' ||
      !/^[\w./-]+$/.test(branch) ||
      branch.includes('..') ||
      branch.includes('//') ||
      branch.startsWith('/') ||
      branch.endsWith('/') ||
      env.VERCEL_ENV === 'preview'
    )
      return null
    return { owner, repo, branch, token }
  }
  function configured() {
    const value = config()
    if (!value) throw new AdminError(503, '文章管理尚未配置，请设置服务端 GitHub 连接。')
    return value
  }
  function client() {
    const { owner, repo, branch, token } = configured()
    const base = `https://api.github.com/repos/${owner}/${repo}`
    const ref = branch.split('/').map(encodeURIComponent).join('/')
    return {
      owner,
      repo,
      ref,
      async request(path: string, method = 'GET', body?: unknown) {
        let response: Response
        try {
          response = await fetcher(`${base}${path}`, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
              'Content-Type': 'application/json'
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            cache: 'no-store',
            redirect: 'error',
            signal: AbortSignal.timeout(15_000)
          })
        } catch {
          throw new AdminError(503, '暂时无法确认 GitHub 操作结果，请重新加载后检查再试。')
        }
        if (!response.ok) {
          if (response.status === 409 || (method === 'PATCH' && response.status === 422))
            throw new AdminError(409, '仓库已更新或分支拒绝提交，请重新加载后再试。')
          if (response.status === 403 || response.status === 429)
            throw new AdminError(503, 'GitHub 暂时拒绝访问，请检查令牌权限、分支规则或稍后重试。')
          throw new AdminError(503, 'GitHub 读取或提交失败，请检查服务端仓库配置。')
        }
        return response.json()
      }
    }
  }
  return {
    get configured() {
      return config() !== null
    },
    async snapshot() {
      const api = client()
      const head = await api.request(`/git/ref/heads/${api.ref}`)
      if (!oid(head.object?.sha) || head.object.type !== 'commit')
        throw new Error('Invalid Git head')
      const revision = head.object.sha as string
      const commit = await api.request(`/git/commits/${revision}`)
      if (!oid(commit.tree?.sha)) throw new Error('Invalid Git tree')
      const tree = commit.tree.sha as string
      const result = await api.request(`/git/trees/${tree}?recursive=1`)
      if (result.truncated || !Array.isArray(result.tree))
        throw new AdminError(503, '仓库目录未完整读取，已停止操作。')
      const files = new Map<string, RepositoryFile>()
      for (const entry of result.tree) {
        if (typeof entry.path !== 'string' || !oid(entry.sha)) throw new Error('Invalid Git entry')
        files.set(entry.path, entry)
      }
      const cache = new Map<string, Promise<string>>()
      return {
        revision,
        tree,
        files,
        async read(path: string) {
          if (!readable(path)) throw new AdminError(400, '不允许读取这个路径。')
          const file = files.get(path)
          if (!file) return null
          if (file.type !== 'blob' || !['100644', '100755'].includes(file.mode))
            throw new AdminError(400, '文章和设置必须是普通文件。')
          if ((file.size ?? 0) > maxMarkdownBytes)
            throw new AdminError(413, '文件超过 256 KB，暂不支持网页管理。')
          if (!cache.has(path))
            cache.set(
              path,
              (async () => {
                const blob = await api.request(`/git/blobs/${file.sha}`)
                if (blob.encoding !== 'base64' || typeof blob.content !== 'string')
                  throw new Error('Invalid Git blob')
                const bytes = Buffer.from(blob.content, 'base64')
                if (bytes.length > maxMarkdownBytes) throw new AdminError(413, '文件超过 256 KB。')
                return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
              })()
            )
          return cache.get(path)!
        }
      }
    },
    async commit(snapshot, change, message) {
      if (
        !readable(change.path) ||
        change.path === manifestPath ||
        !oid(snapshot.revision) ||
        !oid(snapshot.tree)
      )
        throw new AdminError(400, '不允许修改这个路径。')
      if (change.content !== null && Buffer.byteLength(change.content) > maxMarkdownBytes)
        throw new AdminError(413, '文件超过 256 KB。')
      const api = client()
      const nextTree = await api.request('/git/trees', 'POST', {
        base_tree: snapshot.tree,
        tree: [
          {
            path: change.path,
            mode: '100644',
            type: 'blob',
            ...(change.content === null ? { sha: null } : { content: change.content })
          }
        ]
      })
      if (!oid(nextTree.sha)) throw new Error('Invalid new tree')
      const nextCommit = await api.request('/git/commits', 'POST', {
        message,
        tree: nextTree.sha,
        parents: [snapshot.revision],
        author: commitIdentity,
        committer: commitIdentity
      })
      if (!oid(nextCommit.sha)) throw new Error('Invalid new commit')
      // A concurrent commit makes this non-fast-forward. Never force or retry with a new parent.
      await api.request(`/git/refs/heads/${api.ref}`, 'PATCH', {
        sha: nextCommit.sha,
        force: false
      })
      return {
        revision: nextCommit.sha,
        url: `https://github.com/${api.owner}/${api.repo}/commit/${nextCommit.sha}`
      }
    }
  }
}
