import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getNotes } from '../lib/notes'
import { getEssays } from '../lib/essays'
import { essayUrl, writingTimestamp } from '../lib/essay-utils'
import { noteUrl } from '../lib/note-utils'
import { theme } from '../site.config'
import { localeFromPath, localizePath, useTranslations } from '../lib/i18n'
export async function GET(context: APIContext) {
  const locale = localeFromPath(context.url.pathname)
  const t = useTranslations(locale)
  const [notes, essays] = await Promise.all([getNotes(locale), getEssays(locale)])
  const items = [
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.updated ?? note.data.date,
      link: localizePath(noteUrl(note.id), locale)
    })),
    ...essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: new Date(writingTimestamp(essay.data.written)),
      link: localizePath(essayUrl(essay.id), locale)
    }))
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime() || a.link.localeCompare(b.link))
  return rss({
    title: theme.title,
    description: t(theme.description!),
    site: context.site!,
    items,
    customData: `<language>${locale === 'en' ? 'en' : 'zh-cn'}</language>`
  })
}
