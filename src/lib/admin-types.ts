import type { EditableNote } from './note-schema'

export interface AdminNote {
  path: string
  id: string
  managed: boolean
  overridden: string[]
  data: EditableNote & { date: string; updated?: string }
}
export interface AdminListing {
  revision: string
  notes: AdminNote[]
  topics: { name: string; count: number; pinned: boolean }[]
}
