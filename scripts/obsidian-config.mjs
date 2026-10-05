import { readFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

export const projectRoot = fileURLToPath(new URL('../', import.meta.url))

export async function loadObsidianConfig({ root = projectRoot, environment = process.env } = {}) {
  let localEnvironment = {}
  try {
    localEnvironment = parseEnv(await readFile(join(root, '.env.local'), 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw new Error('无法读取 .env.local 配置。', { cause: error })
  }

  // A command-line environment setting takes precedence over the local file.
  const vaultPath = environment.OBSIDIAN_VAULT_PATH ?? localEnvironment.OBSIDIAN_VAULT_PATH
  if (typeof vaultPath !== 'string' || !vaultPath.trim()) {
    throw new Error('请在 .env.local 中配置 OBSIDIAN_VAULT_PATH，指向现有 Vault 的绝对路径。')
  }
  if (!isAbsolute(vaultPath) || vaultPath.includes('\0')) {
    throw new Error('OBSIDIAN_VAULT_PATH 必须是绝对路径，不能使用相对路径或 ~。')
  }
  const publishMode =
    environment.OBSIDIAN_PUBLISH_ALL ?? localEnvironment.OBSIDIAN_PUBLISH_ALL ?? 'false'
  if (!['true', 'false'].includes(publishMode)) {
    throw new Error('OBSIDIAN_PUBLISH_ALL 只能设置为 true 或 false。')
  }
  return { projectRoot: root, vaultPath, ...(publishMode === 'true' ? { publishAll: true } : {}) }
}

export function syncSummary({ notes, attachments, written, removed }) {
  return `已同步 ${notes} 篇笔记、${attachments} 个附件（写入 ${written} 项，移除 ${removed} 项）。`
}

export function describeSyncError(error) {
  return error instanceof Error ? error.message : '同步失败，请检查 Vault 配置。'
}
