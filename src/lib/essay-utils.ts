export interface EssayMeta {
  id: string
  data: { written: string }
}

// Keep the source's precision: a month-only date must never acquire an invented day.
export function isWritingDate(value: string): boolean {
  if (!/^\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?$/.test(value)) return false
  const fullDate = value.length === 7 ? `${value}-01` : value
  const date = new Date(`${fullDate}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === fullDate
}

export function writingTimestamp(written: string): number {
  if (!isWritingDate(written)) throw new Error(`无效的随笔写作日期：${written}`)
  return new Date(`${written.length === 7 ? `${written}-01` : written}T00:00:00Z`).getTime()
}

export function formatWritingDate(written: string, locale: 'zh' | 'en' = 'zh'): string {
  if (!isWritingDate(written)) throw new Error(`无效的随笔写作日期：${written}`)
  const [year, month, day] = written.split('-').map(Number)
  if (locale === 'en')
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      ...(day && { day: 'numeric' }),
      timeZone: 'UTC'
    }).format(new Date(writingTimestamp(written)))
  return `${year}年${month}月${day ? `${day}日` : ''}`
}

export function sortEssays<T extends EssayMeta>(essays: T[]): T[] {
  return [...essays].sort(
    (a, b) =>
      writingTimestamp(b.data.written) - writingTimestamp(a.data.written) ||
      a.id.localeCompare(b.id, 'zh-CN')
  )
}

export const essayUrl = (id: string) => `/blog/${id.split('/').map(encodeURIComponent).join('/')}`
