import { sortListItems, type ListSortOrder } from '../lib/list-sort'
const locale = document.documentElement.lang === 'en' ? 'en' : 'zh'

document.querySelectorAll<HTMLElement>('[data-sortable-listing]').forEach((root) => {
  const list = root.querySelector<HTMLElement>('[data-list-items]')
  const select = root.querySelector<HTMLSelectElement>('[data-list-sort]')
  if (!list || !select) return

  const items = [...list.querySelectorAll<HTMLElement>('[data-list-item]')].map(
    (element, index) => ({
      element,
      title: element.dataset.sortTitle ?? '',
      date: Number(element.dataset.sortDate ?? NaN),
      index
    })
  )
  const orders: ListSortOrder[] = ['default', 'date-desc', 'date-asc', 'title-asc', 'title-desc']
  select.disabled = false
  select.addEventListener('change', () => {
    const order = orders.find((value) => value === select.value) ?? 'default'
    // Move the existing cards so status filters retain their state.
    list.append(
      ...sortListItems(items, order, locale === 'en' ? 'en' : 'zh-CN').map((item) => item.element)
    )
  })

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-status-filter]')]
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const status = button.dataset.statusFilter
      let visible = 0
      items.forEach(({ element }) => {
        element.hidden = status !== 'all' && element.dataset.noteStatus !== status
        if (!element.hidden) visible++
      })
      buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)))
      const count = root.querySelector<HTMLElement>('[data-note-count]')
      if (count)
        count.textContent =
          locale === 'en'
            ? `${visible} ${count.dataset.countLabel}`
            : `共 ${visible} 篇${count.dataset.countLabel}`
      const empty = root.querySelector<HTMLElement>('[data-filter-empty]')
      if (empty) empty.hidden = visible > 0
    })
  )
})
