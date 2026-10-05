import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { lstat, readdir, realpath } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describeSyncError, loadObsidianConfig, syncSummary } from './obsidian-config.mjs'
import { syncObsidian } from './obsidian-sync-lib.mjs'

const POLL_INTERVAL = 750
const DEBOUNCE_INTERVAL = 400
const ATTACHMENT_HASH_INTERVAL = 15_000

const excludesObsidian = (path) =>
  path.split(sep).some((part) => part.toLowerCase() === '.obsidian')
const isWithin = (parent, path) => {
  const local = relative(parent, path)
  return local !== '..' && !local.startsWith(`..${sep}`) && !isAbsolute(local)
}

async function digestFile(path) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

/** Polling works across iCloud file replacements, unlike inode-bound native watchers. */
export function createSourceSnapshot(vaultPath) {
  const blogPath = join(vaultPath, 'Blog')
  const cache = new Map()

  return async function snapshot(sourcePaths = []) {
    const files = new Map()
    const entries = []
    let canonicalVault
    try {
      canonicalVault = await realpath(vaultPath)
      if (excludesObsidian(canonicalVault)) return '[["Blog","error:UNSAFE_PATH"]]'
    } catch (error) {
      return JSON.stringify([['Blog', `error:${error.code ?? 'read'}`]])
    }

    function expectedPath(path) {
      const absolute = resolve(path)
      if (isWithin(resolve(vaultPath), absolute)) {
        return join(canonicalVault, relative(resolve(vaultPath), absolute))
      }
      return isWithin(canonicalVault, absolute) ? absolute : undefined
    }

    async function safePath(path) {
      const expected = expectedPath(path)
      const stat = await lstat(path)
      const canonical = await realpath(path)
      // Validate parents as well as the leaf: a folder can be replaced by a symlink.
      if (
        !expected ||
        stat.isSymbolicLink() ||
        canonical !== expected ||
        excludesObsidian(canonical)
      ) {
        throw Object.assign(new Error('Unsafe source path'), { code: 'UNSAFE_PATH' })
      }
      return { path: canonical, stat }
    }

    async function scan(directory) {
      try {
        const safeDirectory = await safePath(directory)
        if (!safeDirectory.stat.isDirectory()) {
          entries.push([relative(canonicalVault, directory), 'error:NOT_DIRECTORY'])
          return
        }
        for (const entry of await readdir(safeDirectory.path, { withFileTypes: true })) {
          if (entry.name.toLowerCase() === '.obsidian' || entry.isSymbolicLink()) continue
          const path = join(safeDirectory.path, entry.name)
          if (entry.isDirectory()) await scan(path)
          else if (entry.isFile()) files.set(path, /\.md$/i.test(entry.name))
        }
      } catch (error) {
        entries.push([
          relative(canonicalVault, expectedPath(directory) ?? directory),
          `error:${error.code ?? 'read'}`
        ])
      }
    }

    await scan(blogPath)
    for (const path of sourcePaths) {
      if (excludesObsidian(path)) continue
      try {
        const safe = await safePath(path)
        if (safe.stat.isFile()) files.set(safe.path, true)
      } catch (error) {
        entries.push([
          relative(canonicalVault, expectedPath(path) ?? path),
          `error:${error.code ?? 'read'}`
        ])
      }
    }
    for (const [path, contentRequired] of files) {
      try {
        const { stat } = await safePath(path)
        if (!stat.isFile()) continue
        const metadata = `${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.ino}`
        const previous = cache.get(path)
        const alwaysHash = /\.md$/i.test(path)
        let digest = previous?.digest ?? ''
        if (
          contentRequired &&
          (alwaysHash ||
            previous?.metadata !== metadata ||
            Date.now() - previous.hashedAt >= ATTACHMENT_HASH_INTERVAL)
        ) {
          digest = await digestFile(path)
          cache.set(path, { metadata, digest, hashedAt: Date.now() })
        }
        entries.push([relative(canonicalVault, path), `${metadata}:${digest}`])
      } catch (error) {
        entries.push([relative(canonicalVault, path), `error:${error.code ?? 'read'}`])
      }
    }
    for (const path of cache.keys()) if (!files.has(path)) cache.delete(path)
    entries.sort(([left], [right]) => left.localeCompare(right))
    return JSON.stringify(entries)
  }
}

export async function watchObsidian(
  config,
  {
    sync = syncObsidian,
    snapshot = createSourceSnapshot(config.vaultPath),
    log = console,
    pollInterval = POLL_INTERVAL,
    debounceInterval = DEBOUNCE_INTERVAL
  } = {}
) {
  let stopped = false
  let timer
  let wake
  let sourcePaths = []
  let previousError
  let firstSync = true

  const stop = () => {
    stopped = true
    clearTimeout(timer)
    wake?.()
  }
  const pause = () =>
    new Promise((resolve) => {
      wake = resolve
      timer = setTimeout(resolve, pollInterval)
    })

  async function synchronize() {
    try {
      const result = await sync(config)
      sourcePaths = result.sourcePaths ?? []
      if (firstSync || previousError || result.written || result.removed)
        log.log(syncSummary(result))
      previousError = undefined
      firstSync = false
      return true
    } catch (error) {
      const message = describeSyncError(error)
      if (message !== previousError) log.error(`Obsidian 同步失败：${message}`)
      previousError = message
      return false
    }
  }

  // Establish the input snapshot before syncing, so changes during a sync trigger a rerun.
  let observed = await snapshot(sourcePaths)
  await synchronize()
  log.log('正在监控 Blog/ 和已引用附件；按 Ctrl+C 停止。')

  const done = (async () => {
    let pendingSince
    let lastAttempt = Date.now()
    while (!stopped) {
      await pause()
      if (stopped) break
      const current = await snapshot(sourcePaths)
      if (current !== observed) {
        observed = current
        pendingSince = Date.now()
      }
      // Retry transient iCloud read errors without repeating the same error message.
      const retryFailed = previousError && Date.now() - lastAttempt >= 30_000
      if ((pendingSince && Date.now() - pendingSince >= debounceInterval) || retryFailed) {
        pendingSince = undefined
        await synchronize()
        lastAttempt = Date.now()
      }
    }
  })()
  return { stop, done }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const watcher = await watchObsidian(await loadObsidianConfig())
    process.once('SIGINT', watcher.stop)
    process.once('SIGTERM', watcher.stop)
    await watcher.done
  } catch (error) {
    console.error(`Obsidian 监控失败：${describeSyncError(error)}`)
    process.exitCode = 1
  }
}
