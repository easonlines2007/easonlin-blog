import { createHash, randomUUID } from 'node:crypto'
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rename,
  unlink,
  writeFile
} from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { slug as githubSlug } from 'github-slugger'
import { parseDocument } from 'yaml'

const attachmentExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
  '.bmp',
  '.ico',
  '.pdf'
])
const hash = (value) => createHash('sha256').update(value).digest('hex')
const posix = (value) => value.split(sep).join('/')
const key = (value) => value.normalize('NFC')
const noteKey = (value) => key(value).replace(/\.md$/i, '.md')
const external = (value) => /^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(value)
const exists = async (path) => {
  try {
    return await lstat(path)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function fail(message) {
  throw new Error(`Obsidian 同步：${message}`)
}

function within(root, path) {
  const part = relative(root, path)
  return part === '' || (!part.startsWith(`..${sep}`) && part !== '..' && !isAbsolute(part))
}

function safeRelative(path) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    !path.includes('\\') &&
    !path.includes('\0') &&
    !isAbsolute(path) &&
    path.split('/').every((part) => part && part !== '.' && part !== '..' && !part.startsWith('.'))
  )
}

// Check every component, rather than allowing a symlink in an ancestor directory.
async function checkPath(root, path, { missing = false, directory = false } = {}) {
  if (!within(root, path)) fail(`路径超出允许目录：${path}`)
  const parts = relative(root, path).split(sep).filter(Boolean)
  let current = root
  for (let index = 0; index < parts.length; index++) {
    current = join(current, parts[index])
    const stat = await exists(current)
    if (!stat) {
      if (missing) return null
      fail(`文件不存在或 iCloud 尚未下载：${current}`)
    }
    if (stat.isSymbolicLink()) fail(`不读取或覆盖符号链接：${current}`)
    if ((index < parts.length - 1 || directory) && !stat.isDirectory()) fail(`不是目录：${current}`)
    if (index === parts.length - 1 && !directory && !stat.isFile()) fail(`不是普通文件：${current}`)
  }
  return await lstat(path)
}

async function walk(root, directory, accept) {
  await checkPath(root, directory, { directory: true })
  const result = []
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name, 'en')
  )) {
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await walk(root, path, accept)))
    else if (entry.isFile() && accept(path)) result.push(path)
  }
  return result
}

function sameStat(a, b) {
  return (
    a &&
    b &&
    a.isFile() &&
    b.isFile() &&
    !b.isSymbolicLink() &&
    a.dev === b.dev &&
    a.ino === b.ino &&
    a.size === b.size &&
    a.mtimeMs === b.mtimeMs &&
    a.ctimeMs === b.ctimeMs
  )
}

function frontmatter(source, label) {
  const match = source.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m)
  if (!match || match.index !== 0) {
    if (/^\uFEFF?---[ \t]*(?:\r?\n|$)/.test(source)) fail(`${label} 的 frontmatter 未结束`)
    return { data: {}, document: null, body: source }
  }
  const document = parseDocument(match[1], { uniqueKeys: true })
  if (document.errors.length) fail(`${label} 的 YAML 无效：${document.errors[0].message}`)
  let data
  try {
    data = document.toJS({ maxAliasCount: 50 })
  } catch (error) {
    fail(`${label} 的 YAML 无效：${error.message}`)
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    fail(`${label} 的 frontmatter 必须是对象`)
  if (data.publish !== undefined && typeof data.publish !== 'boolean')
    fail(`${label} 的 publish 必须是布尔值 true 或 false`)
  return { data, document, body: source.slice(match[0].length) }
}

function validateNote(data, label) {
  for (const [field, maximum] of [
    ['title', 100],
    ['description', 200],
    ['topic', Infinity]
  ]) {
    if (
      typeof data[field] !== 'string' ||
      (field !== 'description' && !data[field].length) ||
      data[field].length > maximum
    )
      fail(`${label} 的 ${field} 不符合博客 frontmatter 要求`)
  }
  for (const field of ['date', 'updated']) {
    if (field === 'updated' && data[field] === undefined) continue
    if (data[field] === undefined || !Number.isFinite(new Date(data[field]).getTime()))
      fail(`${label} 的 ${field} 无效`)
  }
  if (
    data.tags !== undefined &&
    (!Array.isArray(data.tags) || !data.tags.every((tag) => typeof tag === 'string' && tag.length))
  )
    fail(`${label} 的 tags 必须是字符串数组`)
  if (data.status !== undefined && !['growing', 'ready'].includes(data.status))
    fail(`${label} 的 status 必须是 growing 或 ready`)
  if (data.sample !== undefined && typeof data.sample !== 'boolean')
    fail(`${label} 的 sample 必须是布尔值`)
  if (data.pdf !== undefined && typeof data.pdf !== 'string')
    fail(`${label} 的 pdf 必须是路径字符串`)
}

// This matches Astro 6's glob loader, including its optional frontmatter slug.
export function obsidianNoteId(path, data = {}) {
  const id =
    data.slug ||
    path
      .replace(/\.md$/i, '')
      .split('/')
      .map((part) => githubSlug(part))
      .join('/')
      .replace(/\/index$/, '')
  if (!safeRelative(id) || typeof id !== 'string') fail(`笔记无法生成有效网址：${path}`)
  if (['pdf', 'tags', 'topics'].includes(id.split('/')[0]))
    fail(`笔记网址占用了现有栏目：/notes/${id}`)
  return id
}

function splitReference(value) {
  let target = value.trim()
  if (target.startsWith('[[') && target.endsWith(']]')) target = target.slice(2, -2).split('|')[0]
  else if (target.startsWith('![[') && target.endsWith(']]'))
    target = target.slice(3, -2).split('|')[0]
  const cut = target.search(/[?#]/)
  const suffix = cut < 0 ? '' : target.slice(cut)
  target = cut < 0 ? target : target.slice(0, cut)
  try {
    target = decodeURIComponent(target)
  } catch {
    fail(`链接包含无效 URL 编码：${value}`)
  }
  if (
    target.includes('\0') ||
    target.split(/[\\/]/).some((part) => part.toLowerCase().startsWith('.obsidian'))
  )
    fail(`不读取 .obsidian 或非法附件路径：${value}`)
  return { target, suffix }
}

function escapedLabel(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('[', '\\[').replaceAll(']', '\\]')
}
function escapeTitle(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', ' ')
}
function markdownLink(label, url, { image = false, title } = {}) {
  return `${image ? '!' : ''}[${label}](<${url}>${title ? ` "${escapeTitle(title)}"` : ''})`
}

function applyReplacements(source, replacements, start = 0, end = source.length) {
  let result = source.slice(start, end)
  for (const item of [...replacements].sort((a, b) => b.start - a.start)) {
    if (item.start < start || item.end > end) continue
    result = result.slice(0, item.start - start) + item.value + result.slice(item.end - start)
  }
  return result
}

async function rewriteMarkdown(body, convert, label) {
  const tree = fromMarkdown(body)
  const replacements = []
  const protectedRanges = []
  const range = (node) => ({ start: node.position.start.offset, end: node.position.end.offset })
  async function visit(node) {
    if (['code', 'inlineCode'].includes(node.type)) {
      protectedRanges.push(range(node))
      return
    }
    const changesBefore = replacements.length
    for (const child of node.children || []) await visit(child)
    if (['link', 'image', 'definition'].includes(node.type)) {
      const region = range(node)
      protectedRanges.push(region)
      const next = await convert(node.url)
      if (next === node.url) return
      let value
      if (node.type === 'definition') {
        const original = body.slice(region.start, region.end)
        const prefix = original.match(/^\s*\[[\s\S]*?\]:\s*/)?.[0]
        if (!prefix) fail(`${label} 的引用式链接无法转换`)
        value = `${prefix}<${next}>${node.title ? ` "${escapeTitle(node.title)}"` : ''}`
      } else if (node.type === 'image')
        value = markdownLink(escapedLabel(node.alt || ''), next, { image: true, title: node.title })
      else {
        const first = node.children[0]?.position.start.offset
        const last = node.children.at(-1)?.position.end.offset
        const text =
          first === undefined
            ? ''
            : applyReplacements(body, replacements.slice(changesBefore), first, last)
        value = markdownLink(text, next, { title: node.title })
      }
      replacements.splice(changesBefore)
      replacements.push({ ...region, value })
    } else if (node.type === 'html') {
      const region = range(node)
      protectedRanges.push(region)
      const html = body.slice(region.start, region.end)
      const changes = []
      for (const match of html.matchAll(
        /\b(src|href|poster|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi
      )) {
        const value = match[2] ?? match[3] ?? match[4]
        if (match[1].toLowerCase() === 'srcset') {
          if (value.split(',').some((part) => !external(part.trim().split(/\s/)[0])))
            fail(`${label} 的本地 HTML srcset 请改成 Markdown 图片`)
          continue
        }
        if (!external(value) && value.includes('&'))
          fail(`${label} 的 HTML 附件链接请使用 Markdown，避免实体编码歧义`)
        const next = await convert(value)
        if (next !== value)
          changes.push({
            start: match.index,
            end: match.index + match[0].length,
            value: `${match[1]}="${next.replaceAll('&', '&amp;')}"`
          })
      }
      for (const match of html.matchAll(/url\(\s*['"]?([^'"\s)]+)/gi)) {
        if (!external(match[1]) && !match[1].startsWith('#'))
          fail(`${label} 的本地 CSS url() 请改成 Markdown 图片`)
      }
      if (changes.length) replacements.push({ ...region, value: applyReplacements(html, changes) })
    }
  }
  await visit(tree)
  for (const match of body.matchAll(/!?\[\[([^\]\r\n]+)\]\]/g)) {
    const start = match.index
    let slashCount = 0
    for (let index = start - 1; index >= 0 && body[index] === '\\'; index--) slashCount++
    if (
      slashCount % 2 ||
      protectedRanges.some((item) => start < item.end && start + match[0].length > item.start)
    )
      continue
    const [target, ...aliases] = match[1].split('|')
    const next = await convert(target, { wiki: true })
    const image =
      match[0].startsWith('!') &&
      attachmentExtensions.has(extname(splitReference(target).target).toLowerCase()) &&
      extname(splitReference(target).target).toLowerCase() !== '.pdf'
    const alias = aliases.join('|')
    const text =
      image && /^\d+(?:x\d+)?$/.test(alias)
        ? basename(splitReference(target).target)
        : alias || basename(target.replace(/\.md$/i, ''))
    replacements.push({
      start,
      end: start + match[0].length,
      value: markdownLink(escapedLabel(text), next, { image })
    })
  }
  return applyReplacements(body, replacements)
}

function parseManifest(bytes) {
  if (!bytes) return { version: 1, notes: {}, attachments: {} }
  let value
  try {
    value = JSON.parse(bytes.toString('utf8'))
  } catch {
    fail('同步清单无效，保留原有文件')
  }
  if (value?.version !== 1) fail('同步清单版本不受支持，保留原有文件')
  for (const field of ['notes', 'attachments']) {
    if (!value[field] || typeof value[field] !== 'object' || Array.isArray(value[field]))
      fail('同步清单格式无效')
    for (const [path, digest] of Object.entries(value[field])) {
      if (
        !safeRelative(path) ||
        !/^[a-f0-9]{64}$/.test(digest) ||
        (field === 'notes'
          ? !path.endsWith('.md')
          : path.includes('/') || !/^obsidian-[a-f0-9]{24}\.[a-z]+$/.test(path))
      )
        fail('同步清单含有不安全路径或哈希')
    }
  }
  return value
}

/** Reads the Vault only; changes only manifest-owned copies inside the project. */
export async function syncObsidian({ vaultPath, projectRoot }) {
  if (!isAbsolute(vaultPath || '') || !isAbsolute(projectRoot || ''))
    fail('Vault 和项目路径必须是绝对路径')
  for (const root of [resolve(vaultPath), resolve(projectRoot)]) {
    const stat = await exists(root)
    if (!stat?.isDirectory() || stat.isSymbolicLink()) fail(`目录不存在或是符号链接：${root}`)
  }
  const vault = await realpath(vaultPath)
  const project = await realpath(projectRoot)
  if (within(vault, project) || within(project, vault)) fail('Vault 与博客项目不能互相包含')
  const blog = join(vault, 'Blog')
  await checkPath(vault, blog, { directory: true })
  const notesRoot = join(project, 'src/content/notes')
  const assetsRoot = join(project, 'public/attachments')
  const manifestPath = join(project, 'src/data/obsidian-sync.json')
  await checkPath(project, notesRoot, { missing: true, directory: true })
  await checkPath(project, assetsRoot, { missing: true, directory: true })
  await checkPath(project, manifestPath, { missing: true })
  const manifestBytes = (await exists(manifestPath)) ? await readFile(manifestPath) : null
  const previous = parseManifest(manifestBytes)
  const snapshots = new Map()
  const sourcePaths = new Set()
  async function readSource(path) {
    const before = await checkPath(vault, path)
    const bytes = await readFile(path)
    const after = await checkPath(vault, path)
    if (!sameStat(before, after) || bytes.length !== after.size)
      fail(`读取期间文件发生变化，请重试：${posix(relative(vault, path))}`)
    snapshots.set(path, after)
    sourcePaths.add(path)
    return bytes
  }
  const allNotes = []
  for (const path of await walk(vault, blog, (path) => extname(path).toLowerCase() === '.md')) {
    const output = posix(relative(blog, path)).replace(/\.md$/i, '.md')
    if (!safeRelative(output)) fail(`笔记路径无效：${output}`)
    const bytes = await readSource(path)
    const parsed = frontmatter(new TextDecoder('utf-8', { fatal: true }).decode(bytes), output)
    if (parsed.data.publish === true) validateNote(parsed.data, output)
    allNotes.push({ path, output, ...parsed, published: parsed.data.publish === true })
  }
  const published = allNotes.filter((note) => note.published)
  const routeOwners = new Map()
  const plannedNotes = new Map()
  const plannedAssets = new Map()
  const backup = new Map()
  const currentDigests = new Map()
  async function readOutput(path) {
    const stat = await checkPath(project, path, { missing: true })
    if (!stat) return null
    const bytes = await readFile(path)
    if (bytes.length !== stat.size) fail(`项目文件读取不完整：${path}`)
    return bytes
  }
  // Ownership is verified before any planning can overwrite or remove generated files.
  for (const [field, root] of [
    ['notes', notesRoot],
    ['attachments', assetsRoot]
  ]) {
    for (const [name, expected] of Object.entries(previous[field])) {
      const path = join(root, name)
      const bytes = await readOutput(path)
      if (bytes && hash(bytes) !== expected)
        fail(`生成副本已被手工修改，请先处理：${posix(relative(project, path))}`)
      backup.set(path, bytes)
      currentDigests.set(path, bytes ? hash(bytes) : null)
    }
  }
  function claimRoute(id, name) {
    const normalized = key(id)
    if (routeOwners.has(normalized))
      fail(`笔记网址冲突：${name} 与 ${routeOwners.get(normalized)} 都使用 /notes/${id}`)
    routeOwners.set(normalized, name)
  }
  if (await exists(notesRoot)) {
    for (const path of await walk(project, notesRoot, (path) => extname(path) === '.md')) {
      const name = posix(relative(notesRoot, path))
      if (Object.hasOwn(previous.notes, name)) continue
      const bytes = await readOutput(path)
      const { data } = frontmatter(bytes.toString('utf8'), `现有笔记 ${name}`)
      // Manual draft routes are reserved as well, so publishing them later remains safe.
      claimRoute(obsidianNoteId(name, data), `现有笔记 ${name}`)
    }
  }
  for (const note of published) {
    note.id = obsidianNoteId(note.output, note.data)
    claimRoute(note.id, note.output)
    const destination = join(notesRoot, note.output)
    if (!Object.hasOwn(previous.notes, note.output) && (await exists(destination)))
      fail(`不能覆盖非同步笔记：${note.output}`)
    await checkPath(project, destination, { missing: true })
  }
  let attachmentIndex
  async function indexAttachments() {
    if (!attachmentIndex) {
      attachmentIndex = new Map()
      for (const path of await walk(vault, vault, (path) =>
        attachmentExtensions.has(extname(path).toLowerCase())
      )) {
        const name = key(basename(path))
        const paths = attachmentIndex.get(name) || []
        paths.push(path)
        attachmentIndex.set(name, paths)
      }
    }
    return attachmentIndex
  }
  function candidates(target, note) {
    const explicit = target.startsWith('./') || target.startsWith('../')
    const paths = explicit
      ? [resolve(dirname(note.path), target)]
      : target.startsWith('/')
        ? [resolve(vault, `.${target}`)]
        : [resolve(dirname(note.path), target), resolve(vault, target), resolve(blog, target)]
    return [...new Set(paths)].filter((path) => within(vault, path))
  }
  async function resolveAttachment(target, note) {
    for (const path of candidates(target, note)) {
      if (!(await exists(path))) continue
      await checkPath(vault, path)
      const canonical = await realpath(path)
      if (!within(vault, canonical)) fail(`附件路径超出 Vault：${target}`)
      return canonical
    }
    if (!target.includes('/') && !target.includes('\\')) {
      const matches = (await indexAttachments()).get(key(target)) || []
      if (matches.length === 1) return matches[0]
      if (matches.length > 1) fail(`${note.output} 的附件文件名不唯一，请写完整路径：${target}`)
    }
    fail(`${note.output} 引用的附件不存在或 iCloud 尚未下载：${target}`)
  }
  function resolveNote(target, note) {
    const targetWithExtension = /\.md$/i.test(target) ? target : `${target}.md`
    for (const path of candidates(targetWithExtension, note)) {
      const found = allNotes.find((item) => noteKey(item.path) === noteKey(path))
      if (found) {
        if (!found.published) fail(`${note.output} 链接了未发布笔记：${target}`)
        return found
      }
    }
    if (!target.includes('/') && !target.includes('\\')) {
      const matches = allNotes.filter(
        (item) => noteKey(basename(item.path)) === noteKey(targetWithExtension)
      )
      if (matches.length > 1) fail(`${note.output} 的笔记文件名不唯一，请写完整路径：${target}`)
      if (matches.length === 1 && matches[0].published) return matches[0]
      if (matches.length === 1) fail(`${note.output} 链接了未发布笔记：${target}`)
    }
    fail(`${note.output} 链接的笔记必须位于 Blog 并设置 publish: true：${target}`)
  }
  async function convert(value, note, { wiki = false, pdf = false } = {}) {
    if (wiki && value.startsWith('#')) {
      if (value.startsWith('#^')) fail(`${note.output} 的 Obsidian 块引用暂不支持：${value}`)
      return `#${encodeURIComponent(githubSlug(value.slice(1)))}`
    }
    if (
      !value ||
      external(value) ||
      value.startsWith('#') ||
      /^\/(?:notes|about|projects|blog|search)(?:[/?#]|$)/.test(value) ||
      value === '/'
    ) {
      if (pdf) fail(`${note.output} 的 pdf 必须引用本地 PDF 文件`)
      return value
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(value)) fail(`${note.output} 包含不支持的本地链接协议：${value}`)
    const { target, suffix } = splitReference(value)
    if (target.includes('\\')) fail(`${note.output} 的附件路径请使用 / 分隔：${value}`)
    const extension = extname(target).toLowerCase()
    if (target.startsWith('/attachments/')) {
      const name = target.slice('/attachments/'.length)
      if (!safeRelative(name)) fail(`${note.output} 的网站附件路径无效：${value}`)
      if (Object.hasOwn(previous.attachments, name))
        fail(`${note.output} 请引用 Vault 中的原附件，不要引用同步生成的文件名：${value}`)
      await checkPath(project, join(assetsRoot, name))
      if (pdf && (!/^\/attachments\/[a-zA-Z0-9_-]+\.pdf$/.test(target) || suffix))
        fail(`${note.output} 的 pdf 不符合现有 PDF viewer 路径要求`)
      return value
    }
    if (attachmentExtensions.has(extension)) {
      if (pdf && (extension !== '.pdf' || suffix))
        fail(`${note.output} 的 pdf 必须是 PDF 文件路径，不能带页面片段`)
      const path = await resolveAttachment(target, note)
      const name = `obsidian-${hash(posix(relative(vault, path))).slice(0, 24)}${extension}`
      if (!plannedAssets.has(name)) {
        const destination = join(assetsRoot, name)
        await checkPath(project, destination, { missing: true })
        if (!Object.hasOwn(previous.attachments, name) && (await exists(destination)))
          fail(`不能覆盖非同步附件：${name}`)
        const bytes = await readSource(path)
        if (!bytes.length) fail(`${note.output} 的附件为空或 iCloud 尚未下载完成：${target}`)
        plannedAssets.set(name, bytes)
      }
      return `/attachments/${name}${suffix}`
    }
    if (!pdf && (extension === '.md' || (wiki && !extension))) {
      const found = resolveNote(target, note)
      let fragment = suffix
      if (fragment.startsWith('#')) {
        let heading
        try {
          heading = decodeURIComponent(fragment.slice(1))
        } catch {
          fail(`笔记标题链接编码无效：${value}`)
        }
        if (heading.startsWith('^')) fail(`${note.output} 的 Obsidian 块引用暂不支持：${value}`)
        fragment = `#${encodeURIComponent(githubSlug(heading))}`
      }
      return `/notes/${found.id.split('/').map(encodeURIComponent).join('/')}${fragment}`
    }
    fail(`${note.output} 的本地链接仅支持 Blog 笔记、图片和 PDF：${value}`)
  }
  for (const note of published) {
    if (note.data.pdf !== undefined)
      note.document.set('pdf', await convert(note.data.pdf, note, { pdf: true }))
    const body = await rewriteMarkdown(
      note.body,
      (value, options) => convert(value, note, options),
      note.output
    )
    plannedNotes.set(note.output, Buffer.from(`---\n${note.document.toString()}---\n${body}`))
  }
  // A file changing while other notes are being planned must not produce a mixed snapshot.
  for (const [path, stat] of snapshots) {
    if (!sameStat(stat, await checkPath(vault, path)))
      fail(`规划期间源文件发生变化，请重试：${posix(relative(vault, path))}`)
  }
  // Catch note additions/removals during a run too; never clean up from a partial iCloud view.
  const finalNotes = await walk(vault, blog, (path) => extname(path).toLowerCase() === '.md')
  if (
    finalNotes.length !== allNotes.length ||
    finalNotes.some((path, index) => path !== allNotes[index].path)
  )
    fail('规划期间 Blog 目录发生变化，请重试')
  const next = { version: 1, notes: {}, attachments: {} }
  const changes = []
  for (const [field, root, desired] of [
    ['notes', notesRoot, plannedNotes],
    ['attachments', assetsRoot, plannedAssets]
  ]) {
    for (const [name, bytes] of [...desired].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
      const path = join(root, name)
      next[field][name] = hash(bytes)
      if (!backup.has(path)) {
        backup.set(path, null)
        currentDigests.set(path, null)
      }
      if (currentDigests.get(path) !== next[field][name]) changes.push({ path, bytes })
    }
    for (const name of Object.keys(previous[field])) {
      if (!desired.has(name) && backup.get(join(root, name)))
        changes.push({ path: join(root, name), bytes: null })
    }
  }
  const nextBytes = Buffer.from(`${JSON.stringify(next, null, 2)}\n`)
  if (!manifestBytes?.equals(nextBytes)) {
    backup.set(manifestPath, manifestBytes)
    currentDigests.set(manifestPath, manifestBytes ? hash(manifestBytes) : null)
    changes.push({ path: manifestPath, bytes: nextBytes })
  }
  async function replace(path, bytes) {
    await checkPath(project, path, { missing: true })
    if (bytes === null) {
      await unlink(path)
      return
    }
    await mkdir(dirname(path), { recursive: true })
    await checkPath(project, dirname(path), { directory: true })
    const temporary = join(dirname(path), `.obsidian-sync-${randomUUID()}.tmp`)
    try {
      await writeFile(temporary, bytes, { flag: 'wx' })
      await rename(temporary, path)
    } finally {
      await unlink(temporary).catch((error) => {
        if (error.code !== 'ENOENT') throw error
      })
    }
  }
  const applied = []
  try {
    for (const change of changes) {
      const current = await readOutput(change.path)
      if ((current ? hash(current) : null) !== currentDigests.get(change.path))
        fail(`写入前项目文件已改变，保留原文件：${posix(relative(project, change.path))}`)
      await replace(change.path, change.bytes)
      applied.push(change)
    }
  } catch (error) {
    const rollbackErrors = []
    for (const change of applied.reverse()) {
      try {
        const current = await readOutput(change.path)
        if ((current ? hash(current) : null) !== (change.bytes ? hash(change.bytes) : null))
          fail(`回滚期间文件被其他程序修改：${change.path}`)
        const original = backup.get(change.path)
        if (original === null && current === null) continue
        await replace(change.path, original)
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError.message)
      }
    }
    if (rollbackErrors.length)
      fail(`${error.message}；回滚未完全成功，请检查项目副本：${rollbackErrors.join('；')}`)
    throw error
  }
  return {
    notes: published.length,
    attachments: plannedAssets.size,
    written: changes.filter((item) => item.bytes !== null && item.path !== manifestPath).length,
    removed: changes.filter((item) => item.bytes === null).length,
    sourcePaths: [...sourcePaths].sort()
  }
}
