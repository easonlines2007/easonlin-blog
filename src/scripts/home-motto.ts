import { localeFromPath, useTranslations, formatMessage } from '../lib/i18n.ts'
interface MottoState {
  text: string
  updatedAt: string | null
  revision: string | null
  canEdit: boolean
  configured: boolean
}

class MottoRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

/** Keep the published value separate from the author's draft until the server accepts it. */
export function setupHomeMotto(root: HTMLElement) {
  const t = useTranslations(
    localeFromPath(typeof location === 'undefined' ? '/' : location.pathname)
  )
  const editor = root.querySelector<HTMLElement>('[data-motto-text]')!
  const editButton = root.querySelector<HTMLButtonElement>('[data-motto-edit]')!
  const logoutButton = root.querySelector<HTMLButtonElement>('[data-motto-logout]')!
  const feedback = root.querySelector<HTMLElement>('[data-motto-feedback]')!
  const status = root.querySelector<HTMLElement>('[data-motto-status]')!
  const retryButton = root.querySelector<HTMLButtonElement>('[data-motto-retry]')!
  const latestButton = root.querySelector<HTMLButtonElement>('[data-motto-use-latest]')!
  const dialog = root.querySelector<HTMLDialogElement>('[data-motto-dialog]')!
  const loginForm = root.querySelector<HTMLFormElement>('[data-motto-login]')!
  const password = root.querySelector<HTMLInputElement>('[data-motto-password]')!
  const loginStatus = root.querySelector<HTMLElement>('[data-motto-login-status]')!
  const submitButton = root.querySelector<HTMLButtonElement>('[data-motto-submit]')!
  const cancelButton = root.querySelector<HTMLButtonElement>('[data-motto-cancel]')!
  const fallback = editor.textContent?.trim() ?? ''

  let published: MottoState = {
    text: fallback,
    updatedAt: null,
    revision: null,
    canEdit: false,
    configured: true
  }
  let saving = false
  let authenticating = false
  let loggingOut = false
  let composing = false
  let sequence = 0
  let conflict: MottoState | null = null
  let conflicted = false
  let savedMessageTimer = 0
  let focusEditorAfterLogin = false

  const normalize = (text: string) =>
    text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\u00a0/g, ' ')
      .trim()
  const draft = () => normalize(editor.textContent ?? '')
  const dirty = () => draft() !== published.text

  function showStatus(message: string, retry = false) {
    clearTimeout(savedMessageTimer)
    feedback.hidden = !message
    status.textContent = t(message)
    retryButton.hidden = !retry
    latestButton.hidden = !conflicted
  }

  function applyState(next: MottoState, preserveDraft = false) {
    published = next
    if (!preserveDraft) editor.textContent = next.text
    logoutButton.hidden = !next.canEdit
    root.dataset.canEdit = String(next.canEdit)
    if (next.canEdit) {
      editor.contentEditable = 'plaintext-only'
      editor.tabIndex = 0
      editor.setAttribute('role', 'textbox')
      editor.setAttribute('aria-label', t('首页格言，按 Enter 保存，Escape 取消'))
      editor.setAttribute('aria-multiline', 'false')
    } else {
      editor.removeAttribute('contenteditable')
      editor.removeAttribute('tabindex')
      editor.removeAttribute('role')
      editor.removeAttribute('aria-label')
      editor.removeAttribute('aria-multiline')
    }
  }

  async function requestJson(url: string, options: RequestInit = {}): Promise<unknown> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)
    try {
      const response = await fetch(
        url.startsWith('/api/motto') &&
          localeFromPath(typeof location === 'undefined' ? '/' : location.pathname) === 'en'
          ? `${url}?lang=en`
          : url,
        {
          ...options,
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
          headers: { Accept: 'application/json', ...options.headers }
        }
      )
      const data: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const message =
          data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
            ? data.error
            : t('暂时没有连接上，请稍后重试。')
        throw new MottoRequestError(message, response.status)
      }
      return data
    } finally {
      clearTimeout(timeout)
    }
  }

  async function request(url: string, options: RequestInit = {}): Promise<MottoState> {
    const data = await requestJson(url, options)
    if (
      !data ||
      typeof data !== 'object' ||
      !('text' in data) ||
      typeof data.text !== 'string' ||
      !('revision' in data) ||
      (data.revision !== null && typeof data.revision !== 'string') ||
      !('canEdit' in data) ||
      typeof data.canEdit !== 'boolean' ||
      !('configured' in data) ||
      typeof data.configured !== 'boolean'
    ) {
      throw new Error(t('暂时无法读取格言，请稍后重试。'))
    }
    return data as MottoState
  }

  async function requestSession(method: 'POST' | 'DELETE', secret?: string): Promise<boolean> {
    const data = await requestJson('/api/motto-session', {
      method,
      ...(secret !== undefined && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: secret })
      })
    })
    if (
      !data ||
      typeof data !== 'object' ||
      !('canEdit' in data) ||
      typeof data.canEdit !== 'boolean'
    ) {
      throw new Error(t('暂时无法验证作者身份。'))
    }
    return data.canEdit
  }

  function errorMessage(error: unknown) {
    if (error instanceof MottoRequestError) return t(error.message)
    return t('连接失败，输入已保留，请稍后重试。')
  }

  function focusEditor() {
    editor.focus()
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  function restorePublished() {
    conflict = null
    conflicted = false
    editor.textContent = published.text
    showStatus('')
  }

  async function saveDraft(): Promise<boolean> {
    if (saving || loggingOut || !published.canEdit) return !dirty()
    if (conflicted) return false
    const text = draft()
    if (text === published.text) return true
    if (!text) {
      showStatus(t('格言不能留空，输入已保留。'))
      return false
    }
    if (Array.from(text).length > 120) {
      showStatus(t('请把格言控制在 120 个字以内，输入已保留。'))
      return false
    }

    let saveAgain = false
    saving = true
    sequence += 1
    retryButton.disabled = true
    logoutButton.disabled = true
    editor.setAttribute('aria-busy', 'true')
    showStatus(t('正在保存…'))
    try {
      const next = await request('/api/motto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, revision: published.revision })
      })
      // Typing may continue while the request is in flight; keep that newer draft.
      const hasNewerDraft = draft() !== text
      applyState(next, hasNewerDraft)
      if (hasNewerDraft) {
        saveAgain = document.activeElement !== editor
        showStatus(t('上一句已保存；当前输入还有修改，按 Enter 保存。'))
      } else {
        showStatus(t('已保存。'))
        savedMessageTimer = window.setTimeout(() => showStatus(''), 2400)
      }
      return !hasNewerDraft
    } catch (error) {
      if (error instanceof MottoRequestError && error.status === 409) {
        conflicted = true
        try {
          conflict = await request('/api/motto')
          showStatus(
            formatMessage(t('格言已在另一处修改。你的输入已保留。最新格言：{0}'), [conflict.text])
          )
        } catch {
          showStatus(t('格言已在另一处修改。你的输入已保留；先读取最新格言再继续。'))
        }
      } else if (error instanceof MottoRequestError && error.status === 401) {
        applyState({ ...published, canEdit: false }, true)
        showStatus(t('作者登录已过期，输入已保留。点“编辑”重新登录后再保存。'))
      } else {
        showStatus(errorMessage(error), true)
      }
      return false
    } finally {
      saving = false
      retryButton.disabled = false
      logoutButton.disabled = false
      editor.removeAttribute('aria-busy')
      if (saveAgain) void saveDraft()
    }
  }

  async function loadLatest() {
    const token = ++sequence
    try {
      const next = await request('/api/motto')
      if (token === sequence && !dirty() && !saving) applyState(next)
    } catch {
      // The pre-rendered motto stays readable even when the service is unavailable.
    } finally {
      root.setAttribute('data-motto-ready', '')
      root.removeAttribute('data-motto-loading')
      root.removeAttribute('aria-busy')
    }
  }

  editButton.addEventListener('click', () => {
    if (published.canEdit) {
      focusEditor()
      return
    }
    if (!published.configured) {
      showStatus(t('格言暂时无法修改，请稍后再试。'))
      return
    }
    loginStatus.textContent = ''
    focusEditorAfterLogin = false
    password.value = ''
    dialog.showModal()
    password.focus()
  })

  cancelButton.addEventListener('click', () => dialog.close())
  dialog.addEventListener('close', () => {
    password.value = ''
    if (focusEditorAfterLogin) focusEditor()
    else editButton.focus()
  })
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (authenticating || !password.value) return
    authenticating = true
    sequence += 1
    submitButton.disabled = true
    password.disabled = true
    loginStatus.textContent = t('正在验证…')
    const secret = password.value
    password.value = ''
    try {
      const canEdit = await requestSession('POST', secret)
      if (!canEdit) throw new MottoRequestError(t('作者口令未通过，请重新输入。'), 401)
      const next = await request('/api/motto')
      if (!next.canEdit || !next.configured) {
        throw new MottoRequestError(t('格言暂时无法修改，请稍后再试。'), 503)
      }
      const preserveDraft = dirty()
      if (preserveDraft && next.revision !== published.revision && next.text !== published.text) {
        conflict = next
        conflicted = true
        applyState({ ...published, canEdit: true, configured: next.configured }, true)
        showStatus(
          formatMessage(t('格言已在另一处修改。你的输入已保留。最新格言：{0}'), [next.text])
        )
      } else {
        applyState(next, preserveDraft)
        if (preserveDraft) showStatus(t('已重新登录，之前的输入已保留，按 Enter 保存。'))
        else showStatus(t('按 Enter 或点页面其他位置保存，Esc 取消。'))
      }
      focusEditorAfterLogin = true
      dialog.close()
    } catch (error) {
      loginStatus.textContent =
        error instanceof MottoRequestError ? error.message : t('连接失败，请稍后再试。')
    } finally {
      authenticating = false
      submitButton.disabled = false
      password.disabled = false
      if (dialog.open) password.focus()
    }
  })

  editor.addEventListener('keydown', (event) => {
    // Safari can report isComposing=false for the Enter key that confirms an IME candidate.
    if (event.isComposing || composing || event.keyCode === 229 || loggingOut) return
    if (event.key === 'Enter') {
      event.preventDefault()
      void saveDraft()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (!saving) {
        restorePublished()
        editor.blur()
      }
    }
  })
  editor.addEventListener('beforeinput', (event) => {
    if (
      loggingOut ||
      event.inputType === 'insertParagraph' ||
      event.inputType === 'insertLineBreak'
    ) {
      event.preventDefault()
    }
  })
  editor.addEventListener('input', () => {
    if (!published.canEdit || saving || loggingOut || conflicted) return
    showStatus(dirty() ? t('编辑中，按 Enter 保存，Esc 取消。') : '')
  })
  editor.addEventListener('blur', (event) => {
    if (event.relatedTarget !== logoutButton && event.relatedTarget !== latestButton) {
      void saveDraft()
    }
  })
  editor.addEventListener('paste', (event) => {
    event.preventDefault()
    if (!published.canEdit || loggingOut) return
    const text = normalize(event.clipboardData?.getData('text/plain') ?? '')
    if (!text) return
    const selection = window.getSelection()
    if (!selection?.rangeCount || !editor.contains(selection.anchorNode)) return
    const range = selection.getRangeAt(0)
    range.deleteContents()
    const node = document.createTextNode(text)
    range.insertNode(node)
    range.setStartAfter(node)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    editor.dispatchEvent(new Event('input', { bubbles: true }))
  })
  editor.addEventListener('compositionstart', () => {
    composing = true
  })
  editor.addEventListener('compositionend', () => {
    composing = false
  })
  editor.addEventListener('drop', (event) => event.preventDefault())
  retryButton.addEventListener('click', () => void saveDraft())
  latestButton.addEventListener('click', async () => {
    latestButton.disabled = true
    try {
      const next = conflict ?? (await request('/api/motto'))
      conflict = null
      conflicted = false
      applyState(next)
      showStatus(t('已采用最新格言，现在可以重新编辑。'))
      if (next.canEdit) focusEditor()
    } catch (error) {
      showStatus(errorMessage(error))
    } finally {
      latestButton.disabled = false
    }
  })
  logoutButton.addEventListener('click', async () => {
    if (saving || !(await saveDraft())) return
    loggingOut = true
    editor.contentEditable = 'false'
    editor.removeAttribute('tabindex')
    editor.blur()
    editButton.disabled = true
    logoutButton.disabled = true
    sequence += 1
    try {
      const canEdit = await requestSession('DELETE')
      if (canEdit) throw new MottoRequestError(t('暂时未能退出编辑，请重试。'), 503)
      const next = await request('/api/motto').catch(() => ({ ...published, canEdit: false }))
      applyState(next)
      showStatus(t('已退出编辑。'))
      savedMessageTimer = window.setTimeout(() => showStatus(''), 2400)
    } catch (error) {
      showStatus(errorMessage(error))
    } finally {
      loggingOut = false
      applyState(published, true)
      editButton.disabled = false
      logoutButton.disabled = false
    }
  })
  window.addEventListener('beforeunload', (event) => {
    if (dirty()) event.preventDefault()
  })

  void loadLatest()
}
