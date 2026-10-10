import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { publicSources, readMarkdown } from './translations.mjs'
import { parseMarkdown, walk } from './translation-markdown.mjs'

const failures = []
const protectedValues = (markdown) => {
  const values = []
  walk(parseMarkdown(markdown), (node) => {
    if (
      ['math', 'inlineMath', 'inlineCode'].includes(node.type) ||
      (node.type === 'code' && node.lang !== 'mermaid')
    )
      values.push([node.type, node.value])
    if (node.type === 'image') values.push(['image', node.url])
  })
  return values
}
for (const source of publicSources()) {
  const file = `src/content/translations/en/${source.kind}/${source.id}.md`
  if (!existsSync(file)) {
    failures.push(`Missing translation: ${file}`)
    continue
  }
  const translation = readMarkdown(file)
  if (
    translation.data.translationMethod === 'machine-assisted' &&
    JSON.stringify(protectedValues(source.body)) !==
      JSON.stringify(protectedValues(translation.body))
  ) {
    failures.push(`Protected code, math, or image references changed: ${file}`)
  }
}

if (!existsSync('dist/en/index.html'))
  throw new Error('Build the website before running translations:verify.')
const files = readdirSync('dist', { recursive: true }).filter((file) => file.endsWith('.html'))
const pages = new Map(
  files.map((file) => {
    const html = readFileSync(join('dist', file), 'utf8')
    return [
      file,
      { html, ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])) }
    ]
  })
)
const resolveTarget = (url) => {
  let target = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html'
  if (existsSync(join('dist', target, 'index.html'))) target = join(target, 'index.html')
  return target
}
let englishPages = 0,
  articlePages = 0
for (const [file, { html }] of pages) {
  if (!file.startsWith('en/')) continue
  englishPages++
  if (html.includes('data-pagefind-body')) articlePages++
  const readable = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
  if (!html.includes('data-pagefind-body')) {
    const text = readable.replace(/<[^>]*>/g, '')
    if (text.match(/[\p{Script=Han}]+/gu)?.some((word) => word !== '中'))
      failures.push(`Untranslated interface text: ${file}`)
  }
  for (const [, label] of readable.matchAll(/\b(?:alt|aria-label)="([^"]+)"/g)) {
    if (/\p{Script=Han}/u.test(label) && label !== '切换到中文')
      failures.push(`Untranslated accessible label in ${file}: ${label}`)
  }
  if (!/<html\b[^>]*lang="en"/.test(html)) failures.push(`Wrong document language: ${file}`)
  for (const [tag] of html.matchAll(/<(?:a|link)\b[^>]*>/g)) {
    const href = tag.match(/\bhref="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&')
    if (!href) continue
    const url = new URL(href, 'https://blog.invalid/' + file.replace(/index\.html$/, ''))
    const alternate = /\bhreflang=/.test(tag)
    if (!alternate && url.origin !== 'https://blog.invalid') continue
    const target = resolveTarget(url)
    if (!existsSync(join('dist', target))) {
      failures.push(`Broken link in ${file}: ${href}`)
      continue
    }
    if (
      url.hash &&
      pages.has(target) &&
      !pages.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))
    )
      failures.push(`Missing anchor in ${file}: ${href}`)
  }
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]
  if (!canonical || !new URL(canonical).pathname.startsWith('/en/'))
    failures.push(`Wrong canonical: ${file}`)
}
console.log(`${pages.size} pages; ${englishPages} English pages; ${articlePages} English articles.`)
for (const failure of failures) console.error(failure)
console.log(`${failures.length} translation verification failures.`)
if (failures.length) process.exitCode = 1
