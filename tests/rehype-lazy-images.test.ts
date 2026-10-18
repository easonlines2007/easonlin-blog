import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { join, basename } from 'node:path'
import sharp from 'sharp'
import rehypeLazyImages from '../src/lib/rehype-lazy-images.ts'

test('lazy attachments reserve intrinsic dimensions while preserving author sizing and fallback images', async () => {
  const directory = await mkdtemp(join(process.cwd(), 'public/attachments/image-sizing-test-'))
  try {
    await sharp({ create: { width: 24, height: 12, channels: 4, background: '#ffffff' } })
      .png()
      .toFile(join(directory, 'test image.png'))
    await sharp({ create: { width: 24, height: 12, channels: 3, background: '#ffffff' } })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toFile(join(directory, 'rotated.jpg'))
    const src = `/attachments/${basename(directory)}/test%20image.png`
    const image = (properties: Record<string, unknown>) => ({
      type: 'element',
      tagName: 'img',
      properties
    })
    const normal = image({ src, alt: 'Keep this label' })
    const sized = image({ src, width: 10 })
    const remote = image({ src: 'https://example.com/photo.png' })
    const missing = image({ src: '/attachments/missing-performance-test.png' })
    const malformed = image({ src: '/attachments/%invalid.png' })
    const rotated = image({ src: `/attachments/${basename(directory)}/rotated.jpg` })
    await rehypeLazyImages()({
      type: 'root',
      children: [normal, sized, remote, missing, malformed, rotated]
    })
    assert.deepEqual(normal.properties, {
      src,
      alt: 'Keep this label',
      loading: 'lazy',
      decoding: 'async',
      width: 24,
      height: 12
    })
    assert.equal(sized.properties.width, 10)
    assert.equal(sized.properties.height, undefined)
    for (const node of [remote, missing, malformed]) {
      assert.equal(node.properties.width, undefined)
      assert.equal(node.properties.loading, 'lazy')
    }
    assert.equal(rotated.properties.width, 12)
    assert.equal(rotated.properties.height, 24)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
