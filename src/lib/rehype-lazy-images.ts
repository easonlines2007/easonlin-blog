import { resolve, sep } from 'node:path'
import sharp from 'sharp'

interface Node {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const publicDirectory = resolve('public')
const dimensions = new Map<string, Promise<{ width: number; height: number } | undefined>>()

function imageDimensions(src: string) {
  if (!src.startsWith('/attachments/')) return
  let path: string
  try {
    path = resolve(publicDirectory, `.${decodeURIComponent(src.split(/[?#]/)[0])}`)
  } catch {
    return
  }
  if (!path.startsWith(`${publicDirectory}${sep}`)) return
  let result = dimensions.get(path)
  if (!result) {
    result = sharp(path)
      .metadata()
      .then(({ width, height, orientation }) => {
        if (!width || !height) return
        // Match the browser's EXIF-oriented intrinsic dimensions.
        return orientation && orientation >= 5
          ? { width: height, height: width }
          : { width, height }
      })
      .catch(() => undefined)
    dimensions.set(path, result)
  }
  return result
}

export default function rehypeLazyImages() {
  return async function visit(node: Node): Promise<void> {
    if (node.type === 'element' && node.tagName === 'img') {
      node.properties = { ...node.properties, loading: 'lazy', decoding: 'async' }
      const { src, width, height } = node.properties
      // Reserve space before lazy images load without overriding an author's sizing.
      if (typeof src === 'string' && width == null && height == null) {
        const size = await imageDimensions(src)
        if (size) Object.assign(node.properties, size)
      }
    }
    if (node.children) await Promise.all(node.children.map(visit))
  }
}
