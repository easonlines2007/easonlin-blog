export interface NoteMeta {
  id: string
  data: {
    publish: boolean
    date: Date
    updated?: Date
    topic: string
    order?: number
    tags: string[]
    status: 'growing' | 'ready' | 'completed'
  }
}

export function publishedNotes<T extends NoteMeta>(notes: T[]): T[] {
  return notes
    .filter((note) => note.data.publish)
    .sort(
      (a, b) =>
        (b.data.updated ?? b.data.date).getTime() - (a.data.updated ?? a.data.date).getTime() ||
        a.id.localeCompare(b.id)
    )
}

export const noteUrl = (id: string) => `/notes/${id.split('/').map(encodeURIComponent).join('/')}`
export const tagUrl = (tag: string) => `/notes/tags/${encodeURIComponent(tag)}`
export const topicUrl = (topic: string) => `/notes/topics/${encodeURIComponent(topic)}`
export const statusUrl = (status: NoteMeta['data']['status']) => `/notes/status/${status}`
export const statusLabels = { growing: '进行中', ready: '已整理', completed: '已完成' } as const

// Unnumbered notes retain the collection's date order; course modules use reading order.
export function sortTopicNotes<T extends NoteMeta>(notes: T[]): T[] {
  return [...notes].sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity))
}

export const formatDate = (date: Date, locale: 'zh' | 'en' = 'zh') =>
  new Intl.DateTimeFormat(locale === 'en' ? 'en' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date)

export function countValues(notes: NoteMeta[], field: 'tags' | 'topic') {
  const counts = new Map<string, number>()
  for (const note of notes) {
    for (const value of field === 'tags' ? note.data.tags : [note.data.topic]) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
}
