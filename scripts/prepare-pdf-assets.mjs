import { cp, mkdir, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// PDF.js loads these resources on demand; keep them on the same origin.
const require = createRequire(import.meta.url)
const source = dirname(require.resolve('pdfjs-dist/package.json'))
const destination = fileURLToPath(new URL('../public/pdfjs/', import.meta.url))
// This ignored directory is generated only. Recreate it so old versions and
// iCloud conflict copies cannot leak into the next build.
await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await Promise.all(
  ['cmaps', 'standard_fonts', 'wasm', 'iccs', 'LICENSE'].map((name) =>
    cp(join(source, name), join(destination, name), { recursive: true })
  )
)
