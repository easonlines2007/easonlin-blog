import { describeSyncError, loadObsidianConfig, syncSummary } from './obsidian-config.mjs'
import { syncObsidian } from './obsidian-sync-lib.mjs'
import { parseArgs } from 'node:util'

try {
  const { values } = parseArgs({
    options: {
      folder: { type: 'string', multiple: true },
      'skip-empty': { type: 'boolean' }
    }
  })
  const result = await syncObsidian({
    ...(await loadObsidianConfig()),
    ...(values.folder ? { sourceFolders: values.folder } : {}),
    ...(values['skip-empty'] !== undefined ? { skipEmpty: values['skip-empty'] } : {})
  })
  console.log(syncSummary(result))
} catch (error) {
  console.error(`Obsidian 同步失败：${describeSyncError(error)}`)
  process.exitCode = 1
}
