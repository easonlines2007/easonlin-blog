/** Keep chronological DOM order while the two columns retain their natural heights. */
export function setupEssayMasonry() {
  const list = document.querySelector<HTMLOListElement>('[data-essay-masonry]')
  if (!list) return

  const entries = [...list.querySelectorAll<HTMLElement>('[data-list-item]')]
  const desktop = matchMedia('(min-width: 601px)')
  let frame = 0

  function layout() {
    frame = 0
    if (!desktop.matches) {
      delete list!.dataset.masonry
      entries.forEach((entry) => entry.style.removeProperty('grid-row-end'))
      return
    }

    const rowUnit =
      Number.parseFloat(getComputedStyle(list!).getPropertyValue('--journal-row-unit')) || 2
    // Read all natural content heights before writing any grid spans.
    const spans = entries.map((entry) => {
      const article = entry.querySelector<HTMLElement>('.journal-entry-inner')!
      const style = getComputedStyle(entry)
      const inset =
        Number.parseFloat(style.paddingTop) +
        Number.parseFloat(style.paddingBottom) +
        Number.parseFloat(style.borderBottomWidth)
      return Math.ceil((article.getBoundingClientRect().height + inset) / rowUnit)
    })
    entries.forEach((entry, index) => {
      const span = `span ${spans[index]}`
      if (entry.style.gridRowEnd !== span) entry.style.gridRowEnd = span
    })
    list!.dataset.masonry = 'ready'
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(layout)
  }

  const observer = new ResizeObserver(schedule)
  entries.forEach((entry) => observer.observe(entry.querySelector('.journal-entry-inner')!))
  desktop.addEventListener('change', schedule)
  document.fonts.ready.then(schedule)
  layout()
}
