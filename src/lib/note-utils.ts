export interface NoteMeta {
  id: string
  data: {
    publish: boolean
    date: Date
    updated?: Date
    topic: string
    tags: string[]
    status: 'growing' | 'ready'
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
export const statusLabels = { growing: '进行中', ready: '已整理' } as const

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
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
