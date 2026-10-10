import { getCollection, type CollectionEntry } from 'astro:content'
import { sortEssays } from './essay-utils'
import type { Locale } from './i18n'
import { translatedEntries } from './translation-utils'

export async function getEssays(locale: Locale = 'zh') {
  const essays = sortEssays(await getCollection('essays'))
  return locale === 'en'
    ? translatedEntries(essays, await getCollection('translations'), 'essays')
    : essays.map((entry) => ({
        ...entry,
        translation: undefined as CollectionEntry<'translations'> | undefined
      }))
}
