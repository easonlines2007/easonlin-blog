import { z } from 'astro/zod'
import { isWritingDate } from './essay-utils'

export const essaySchema = z.object({
  title: z.string().min(1).max(150),
  written: z.string().refine(isWritingDate, '写作日期应为 YYYY-MM 或 YYYY-MM-DD'),
  description: z.string().max(200).optional()
})
