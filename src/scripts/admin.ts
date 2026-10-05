import type { AdminListing, AdminNote } from '../lib/admin-types'

const element = <T extends HTMLElement>(id: string) => document.getElementById(`admin-${id}`) as T
const login = element<HTMLFormElement>('login')
const workspace = element<HTMLDivElement>('workspace')
const form = element<HTMLFormElement>('form')
const fields = element<HTMLFieldSetElement>('fields')
const message = element<HTMLParagraphElement>('message')
const password = element<HTMLInputElement>('password')
const title = element<HTMLInputElement>('title')
const description = element<HTMLTextAreaElement>('description')
const topic = element<HTMLInputElement>('topic')
const tags = element<HTMLInputElement>('tags')
const publish = element<HTMLInputElement>('publish')
const filename = element<HTMLInputElement>('filename')
const markdown = element<HTMLTextAreaElement>('markdown')
const upload = element<HTMLInputElement>('upload')
const list = element<HTMLUListElement>('list')
const search = element<HTMLInputElement>('search')
const filter = element<HTMLSelectElement>('filter')
let listing: AdminListing = { revision: '', notes: [] }
let selected: AdminNote | null = null
let editorRevision = ''
let dirty = false
let busy = false

function notice(text: string, error = false) {
  message.textContent = text
  message.dataset.error = String(error)
  const feedback = element('form-message')
  feedback.textContent = text
  feedback.dataset.error = String(error)
}
function confirmAction(text: string): Promise<boolean> {
  const dialog = element<HTMLDialogElement>('confirm')
  if (dialog.open) return Promise.resolve(false)
  element('confirm-text').textContent = text
  dialog.returnValue = 'cancel'
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), {
      once: true
    })
    dialog.showModal()
  })
}
function lock() {
  login.hidden = false
  workspace.hidden = true
  password.value = ''
}
async function api<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: 'same-origin',
    cache: 'no-store',
    signal: AbortSignal.timeout(60_000),
    ...(body === undefined
      ? {}
      : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  })
  if (!response.headers.get('content-type')?.includes('application/json'))
    throw new Error('管理接口未启动。请在 Vercel 环境访问，或按 README 启动本地完整预览。')
  const data = await response.json()
  if (response.status === 401) lock()
  if (!response.ok) throw new Error(data.error || '操作失败，请稍后重试。')
  return data as T
}
function failure(error: unknown) {
  notice(
    error instanceof Error && error.name !== 'TimeoutError'
      ? error.message
      : '未能确认操作结果，请重新加载检查后再试。',
    true
  )
}
async function perform(action: () => Promise<void>) {
  if (busy) return
  busy = true
  fields.disabled = true
  workspace.setAttribute('aria-busy', 'true')
  for (const button of document.querySelectorAll<HTMLButtonElement>('.admin button'))
    button.disabled = true
  try {
    await action()
  } catch (error) {
    failure(error)
  } finally {
    busy = false
    fields.disabled = false
    workspace.removeAttribute('aria-busy')
    for (const button of document.querySelectorAll<HTMLButtonElement>('.admin button'))
      button.disabled = false
  }
}
const tagValues = () => [
  ...new Set(
    tags.value
      .split(/[,，\n]/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  )
]
function renderTags() {
  const container = element<HTMLDivElement>('tag-list')
  container.replaceChildren()
  for (const tag of tagValues()) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'tag'
    button.textContent = `${tag} ×`
    button.setAttribute('aria-label', `移除标签 ${tag}`)
    button.addEventListener('click', () => {
      if (busy) return
      tags.value = tagValues()
        .filter((value) => value !== tag)
        .join(', ')
      dirty = true
      renderTags()
      tags.focus()
    })
    container.append(button)
  }
}
function renderList() {
  const query = search.value.trim().toLocaleLowerCase()
  const notes = listing.notes.filter((note) => {
    const status = filter.value === 'all' || note.data.publish === (filter.value === 'published')
    return (
      status &&
      [note.path, note.data.title, note.data.topic, ...note.data.tags]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query)
    )
  })
  list.replaceChildren()
  for (const note of notes) {
    const item = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'admin-note'
    button.setAttribute('aria-current', String(selected?.path === note.path))
    const heading = document.createElement('strong')
    heading.textContent = note.data.title
    const meta = document.createElement('small')
    meta.textContent = `${note.managed ? 'Obsidian' : '网页 / 仓库'} · ${note.data.publish ? '已发布' : '未发布'} · ${note.data.topic}`
    button.append(heading, meta)
    button.addEventListener('click', async () => {
      if (!busy && (await discard())) openEditor(note)
    })
    item.append(button)
    list.append(item)
  }
  element('empty').hidden = notes.length > 0
  element('count').textContent =
    `${listing.notes.length} 篇文章 · ${listing.notes.filter((note) => note.data.publish).length} 篇已发布`
}
async function discard() {
  return !dirty || (await confirmAction('还有未保存的修改，确定放弃这些修改吗？'))
}
function openEditor(note: AdminNote | null, preserveFeedback = false) {
  selected = note
  editorRevision = listing.revision
  dirty = false
  if (!preserveFeedback) element('form-message').textContent = ''
  form.reset()
  title.value = note?.data.title ?? ''
  description.value = note?.data.description ?? ''
  topic.value = note?.data.topic ?? '随笔'
  tags.value = note?.data.tags.join(', ') ?? ''
  publish.checked = note?.data.publish ?? false
  element('create').hidden = note !== null
  filename.required = note === null
  markdown.required = note === null
  element('editor-title').textContent = note ? '文章信息' : '新的记录'
  element('source').textContent = note?.managed
    ? '正文继续在 Obsidian 修改；这里的文章信息只用于网站，下架后原文仍会保留。'
    : note
      ? `保存位置：${note.path}。正文保持不变。`
      : '填好文章信息，上传或粘贴 Markdown，便可保存一篇新文章。'
  element('reset').hidden = !note?.managed || !note.overridden.length
  element('delete').hidden = !note || note.managed
  const view = element<HTMLAnchorElement>('view')
  view.hidden = !note?.data.publish
  view.href = note ? `/notes/${note.id.split('/').map(encodeURIComponent).join('/')}` : '#'
  element('placeholder').hidden = true
  form.hidden = false
  renderTags()
  renderList()
  title.focus({ preventScroll: true })
}
async function loadList() {
  listing = await api<AdminListing>('/api/admin-notes')
  login.hidden = true
  workspace.hidden = false
  const topics = element<HTMLDataListElement>('topics')
  topics.replaceChildren(
    ...[...new Set(listing.notes.map((note) => note.data.topic))].map((value) => {
      const option = document.createElement('option')
      option.value = value
      return option
    })
  )
  renderList()
}
async function save(method: 'POST' | 'PUT' | 'DELETE', extra: Record<string, unknown> = {}) {
  const path = selected?.path ?? `web/${filename.value.trim().replace(/\.md$/i, '')}.md`
  const result = await api<{ revision: string; unchanged: boolean; url?: string }>(
    '/api/admin-notes',
    method,
    {
      path,
      revision: editorRevision,
      fields: {
        title: title.value,
        description: description.value,
        topic: topic.value,
        tags: tagValues(),
        publish: publish.checked
      },
      ...(selected ? {} : { markdown: markdown.value }),
      ...extra
    }
  )
  dirty = false
  editorRevision = result.revision
  const link = element<HTMLAnchorElement>('commit')
  link.hidden = !result.url
  if (result.url) link.href = result.url
  notice(
    result.unchanged ? '内容没有变化，无需重新部署。' : '已提交到 GitHub，等待 Vercel 部署后生效。'
  )
  try {
    await loadList()
    const current = listing.notes.find((note) => note.path === path)
    if (current) openEditor(current, true)
    else {
      selected = null
      form.hidden = true
      element('placeholder').hidden = false
      renderList()
    }
  } catch {
    // A successful commit must never be reported as a failed save if the subsequent read fails.
    form.hidden = true
    element('placeholder').hidden = false
    selected = null
    notice('保存已完成，但列表暂未刷新。请点击重新加载，勿重复提交。')
  }
}

form.addEventListener('input', () => {
  dirty = true
})
tags.addEventListener('input', renderTags)
search.addEventListener('input', renderList)
filter.addEventListener('change', renderList)
form.addEventListener('submit', (event) => {
  event.preventDefault()
  void perform(async () => {
    notice('正在保存…')
    await save(selected ? 'PUT' : 'POST')
  })
})
login.addEventListener('submit', (event) => {
  event.preventDefault()
  void perform(async () => {
    notice('正在登录…')
    try {
      await api('/api/admin-session', 'POST', { password: password.value })
    } finally {
      password.value = ''
    }
    await loadList()
    notice(dirty ? '已登录，未保存的输入仍然保留。' : '选择文章开始整理。')
  })
})
element('new').addEventListener('click', async () => {
  if (!busy && (await discard())) openEditor(null)
})
element('refresh').addEventListener('click', async () => {
  if (busy || !(await discard())) return
  void perform(async () => {
    await loadList()
    const current = listing.notes.find((note) => note.path === selected?.path)
    if (current) openEditor(current)
    else {
      selected = null
      dirty = false
      form.hidden = true
      element('placeholder').hidden = false
    }
    notice('已读取仓库中的最新内容。')
  })
})
element('logout').addEventListener('click', async () => {
  if (busy || !(await discard())) return
  void perform(async () => {
    await api('/api/admin-session', 'DELETE')
    lock()
    form.reset()
    form.hidden = true
    listing = { revision: '', notes: [] }
    selected = null
    dirty = false
    list.replaceChildren()
    element('commit').hidden = true
    notice('已退出文章管理。')
  })
})
element('reset').addEventListener('click', async () => {
  if (
    busy ||
    !(await confirmAction('恢复这篇文章的全部 Obsidian 属性？网站侧的标签和发布设置也会清除。'))
  )
    return
  void perform(() => save('PUT', { reset: true }))
})
element('delete').addEventListener('click', async () => {
  if (
    busy ||
    !selected ||
    !(await confirmAction(`确定从仓库删除「${selected.data.title}」？只想下架可取消“在网站发布”。`))
  )
    return
  void perform(() => save('DELETE'))
})
upload.addEventListener('change', () => {
  const file = upload.files?.[0]
  if (!file || busy) return
  void perform(async () => {
    if (!/\.md$/i.test(file.name) || file.size > 256 * 1024)
      throw new Error('请选择不超过 256 KB 的 .md 文件。')
    markdown.value = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer())
    const name = file.name.replace(/\.md$/i, '')
    if (!filename.value) filename.value = name
    if (!title.value) title.value = name.slice(0, 100)
    dirty = true
    notice('Markdown 已载入，请确认文章信息后保存。')
  })
})
window.addEventListener('beforeunload', (event) => {
  if (dirty || busy) event.preventDefault()
})
void perform(async () => {
  const session = await api<{ authenticated: boolean }>('/api/admin-session')
  if (session.authenticated) {
    await loadList()
    notice('选择文章开始整理。')
  } else {
    lock()
    notice('登录后管理文章与标签。')
  }
})
