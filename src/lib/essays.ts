import { getCollection } from 'astro:content'
import { sortEssays } from './essay-utils'

export async function getEssays() {
  return sortEssays(await getCollection('essays'))
}
