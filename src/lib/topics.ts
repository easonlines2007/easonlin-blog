import rawSettings from '../data/topic-settings.json'
import { countValues, type NoteMeta } from './note-utils'
import { sortTopics, topicSettingsSchema } from './topic-settings'

const settings = topicSettingsSchema.parse(rawSettings)
export const isTopicPinned = (topic: string) => settings.pinned.includes(topic)
export const getTopics = (notes: NoteMeta[]) =>
  sortTopics(countValues(notes, 'topic'), settings.pinned)
