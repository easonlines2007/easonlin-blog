export type ListSortOrder = 'default' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

export interface SortableListItem {
  title: string
  date: number
  index: number
}

export function sortListItems<T extends SortableListItem>(
  items: T[],
  order: ListSortOrder,
  locale = 'zh-CN'
): T[] {
  const titleCollator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' })
  return [...items].sort((a, b) => {
    let difference = 0

    if (order === 'date-asc' || order === 'date-desc') {
      const aHasDate = Number.isFinite(a.date)
      const bHasDate = Number.isFinite(b.date)
      // Missing dates belong at the end for either direction.
      if (aHasDate !== bHasDate) return aHasDate ? -1 : 1
      if (aHasDate && bHasDate) {
        difference = order === 'date-asc' ? a.date - b.date : b.date - a.date
      }
    } else if (order === 'title-asc' || order === 'title-desc') {
      difference = titleCollator.compare(a.title, b.title)
      if (order === 'title-desc') difference *= -1
    }

    return difference || a.index - b.index
  })
}
