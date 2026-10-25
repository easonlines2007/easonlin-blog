import type { APIRoute, GetStaticPaths } from 'astro'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { getEssays } from '@/lib/essays'
import { essayPresentation } from '@/lib/essay-presentation'

// Emit small static covers while preserving the original images in each essay.
export const getStaticPaths = (async () => {
  const essays = await getEssays()
  return essays.flatMap((essay) => {
    const { image } = essayPresentation(essay)
    return image?.src.startsWith('/essays/')
      ? [{ params: { id: essay.id }, props: { source: image.src } }]
      : []
  })
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const source = resolve('public', (props.source as string).slice(1))
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 880, height: 550, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
  return new Response(new Uint8Array(buffer), { headers: { 'Content-Type': 'image/webp' } })
}
