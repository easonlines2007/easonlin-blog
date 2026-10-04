import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const source = new URL('../src/assets/avatar.png', import.meta.url)
const icons = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512]
]
for (const [name, size] of icons) {
  await sharp(source.pathname)
    .resize(size, size, { fit: 'contain', background: '#f7f6f2' })
    .png()
    .toFile(new URL(`../public/${name}`, import.meta.url).pathname)
}
// ICO can contain PNG data, preserving the same artwork for legacy favicon requests.
const png = await sharp(source.pathname).resize(32, 32).png().toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header[6] = 32
header[7] = 32
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(header.length, 18)
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, png]))
