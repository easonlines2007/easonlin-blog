import { createHash } from 'node:crypto'

export const sourceHash = (
  markdown: string,
  metadata?: { title: string; description?: string }
) => {
  const hash = createHash('sha256').update(markdown.replace(/\r\n/g, '\n'))
  if (metadata)
    hash.update(
      '\n' + JSON.stringify({ title: metadata.title, description: metadata.description ?? '' })
    )
  return hash.digest('hex')
}

export interface TranslationMeta {
  data: {
    kind: 'notes' | 'essays'
    source: string
    publish: boolean
    sourceHash: string
    title: string
    description?: string
  }
}

// Select only from public originals: orphaned translations and translations of drafts never publish.
export function translatedEntries<
  T extends { id: string; data: { title: string; description?: string } },
  U extends TranslationMeta
>(originals: T[], translations: U[], kind: 'notes' | 'essays') {
  const bySource = new Map<string, U>()
  for (const translation of translations) {
    if (translation.data.kind !== kind || !translation.data.publish) continue
    if (bySource.has(translation.data.source))
      throw new Error(`Duplicate English translation: ${kind}/${translation.data.source}`)
    bySource.set(translation.data.source, translation)
  }
  return originals.flatMap((original) => {
    const translation = bySource.get(original.id)
    return translation
      ? [
          {
            ...original,
            data: {
              ...original.data,
              title: translation.data.title,
              description: translation.data.description ?? ''
            },
            translation
          }
        ]
      : []
  })
}
