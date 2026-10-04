import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getNotes } from '../lib/notes'
import { noteUrl } from '../lib/note-utils'
import { theme } from '../site.config'
export async function GET(context: APIContext) {
  return rss({
    title: theme.title,
    description: theme.description!,
    site: context.site!,
    items: (await getNotes()).map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.updated ?? note.data.date,
      link: noteUrl(note.id)
    })),
    customData: '<language>zh-cn</language>'
  })
}
