import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getNotes } from '../lib/notes'
import { getEssays } from '../lib/essays'
import { essayUrl, writingTimestamp } from '../lib/essay-utils'
import { noteUrl } from '../lib/note-utils'
import { theme } from '../site.config'
export async function GET(context: APIContext) {
  const [notes, essays] = await Promise.all([getNotes(), getEssays()])
  const items = [
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.updated ?? note.data.date,
      link: noteUrl(note.id)
    })),
    ...essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: new Date(writingTimestamp(essay.data.written)),
      link: essayUrl(essay.id)
    }))
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime() || a.link.localeCompare(b.link))
  return rss({
    title: theme.title,
    description: theme.description!,
    site: context.site!,
    items,
    customData: '<language>zh-cn</language>'
  })
}
