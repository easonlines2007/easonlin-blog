import { describeSyncError, loadObsidianConfig, syncSummary } from './obsidian-config.mjs'
import { syncObsidian } from './obsidian-sync-lib.mjs'

try {
  const result = await syncObsidian(await loadObsidianConfig())
  console.log(syncSummary(result))
} catch (error) {
  console.error(`Obsidian 同步失败：${describeSyncError(error)}`)
  process.exitCode = 1
}
