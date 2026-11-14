const layout = document.querySelector<HTMLElement>('.note-layout.has-toc')
const toggle = document.querySelector<HTMLButtonElement>('[data-note-toc-toggle]')
const contents = document.getElementById('note-toc-content')
const title = document.querySelector<HTMLElement>('[data-note-toc-title]')

if (layout && toggle && contents && title) {
  const storageKey = 'notes-toc'
  const wideScreen = matchMedia('(min-width: 1100px)')
  let preference: string | null = null
  try {
    preference = localStorage.getItem(storageKey)
  } catch {
    // The control also works when the browser blocks storage.
  }

  const apply = (collapsed: boolean) => {
    layout.dataset.tocCollapsed = String(collapsed)
    contents.hidden = collapsed
    title.hidden = collapsed
    toggle.setAttribute('aria-expanded', String(!collapsed))
    const label = collapsed ? toggle.dataset.labelExpand! : toggle.dataset.labelCollapse!
    toggle.setAttribute('aria-label', label)
    toggle.title = label
  }

  const restore = () => {
    apply(preference === 'collapsed' || (preference !== 'expanded' && !wideScreen.matches))
  }

  restore()
  toggle.hidden = false
  toggle.addEventListener('click', () => {
    const offset =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-offset')) ||
      112
    // Keep the paragraph being read in place when different line wrapping changes its height.
    const anchor = [...document.querySelectorAll<HTMLElement>('#article-content > *')].find(
      (element) => element.getBoundingClientRect().bottom > offset
    )
    const before = anchor?.getBoundingClientRect().top
    const article = document.getElementById('article-content')
    const reading = article ? article.getBoundingClientRect().top < offset : false
    const collapsed = layout.dataset.tocCollapsed !== 'true'
    preference = collapsed ? 'collapsed' : 'expanded'
    apply(collapsed)
    if (reading && anchor && before !== undefined) {
      window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' })
    }
    try {
      localStorage.setItem(storageKey, preference)
    } catch {
      // Keep this page's choice when storage is unavailable.
    }
  })
  wideScreen.addEventListener('change', restore)
}

export {}
