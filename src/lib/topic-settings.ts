import { z } from 'astro/zod'

export const topicSettingsPath = 'src/data/topic-settings.json'
export const topicSettingsSchema = z
  .object({
    pinned: z.array(z.string().min(1)).refine((topics) => new Set(topics).size === topics.length)
  })
  .strict()

export function sortTopics<T extends readonly [string, number]>(
  topics: T[],
  pinned: readonly string[]
): T[] {
  const ranks = new Map(pinned.map((topic, index) => [topic, index]))
  return [...topics].sort(
    (a, b) => (ranks.get(a[0]) ?? pinned.length) - (ranks.get(b[0]) ?? pinned.length)
  )
}
