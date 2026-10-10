import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import GithubSlugger from 'github-slugger'

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath)
export const parseMarkdown = (markdown) => parser.parse(markdown)
export function walk(node, visit, parent) {
  visit(node, parent)
  for (const child of node.children ?? []) walk(child, visit, node)
}

export function translationSegments(markdown) {
  const segments = []
  walk(parseMarkdown(markdown), (node, parent) => {
    if (
      node.type === 'text' &&
      /\p{Script=Han}|[àèéíïòóúüç]|\b(?:directori|fitxers|comandes|fase|bloc de codi|alineament|banc de registres|arquitectura|registres de pipeline|particionat|microoperacions|nombres enters|rendiment|Justifica|Quants|Raona|Podem|Indica)\b/u.test(
        node.value
      )
    ) {
      const siblings = parent?.children ?? []
      const index = siblings.indexOf(node)
      const inline = new Set(['strong', 'emphasis', 'inlineCode', 'inlineMath', 'link'])
      segments.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        text: node.value,
        type: 'text',
        spaceBefore: inline.has(siblings[index - 1]?.type),
        spaceAfter: inline.has(siblings[index + 1]?.type)
      })
    }
    if (node.type === 'image' && /\p{Script=Han}/u.test(node.alt ?? '')) {
      const raw = markdown.slice(node.position.start.offset, node.position.end.offset)
      const start = node.position.start.offset + raw.indexOf('[') + 1
      segments.push({
        start,
        end: start + raw.slice(raw.indexOf('[') + 1).indexOf(']'),
        text: node.alt,
        type: 'alt'
      })
    }
    // Translate labels only; the graph syntax and mathematical expressions are retained.
    if (node.type === 'code' && node.lang === 'mermaid') {
      const raw = markdown.slice(node.position.start.offset, node.position.end.offset)
      for (const match of raw.matchAll(
        /[\p{Script=Han}][\p{Script=Han}，、：；？！“”‘’（）· ]*/gu
      )) {
        const start = node.position.start.offset + match.index
        segments.push({ start, end: start + match[0].length, text: match[0], type: 'diagram' })
      }
    }
  })
  return segments
}

export function applyTextTranslations(markdown, dictionary) {
  let result = markdown
  const segments = translationSegments(markdown)
  const translatedStarts = new Set(segments.map((s) => s.start))
  walk(parseMarkdown(markdown), (node) => {
    if (
      node.type === 'text' &&
      /[。，；：“”‘’（）！？、]/u.test(node.value) &&
      !translatedStarts.has(node.position.start.offset)
    ) {
      segments.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        text: node.value,
        type: 'punctuation'
      })
    }
  })
  const punctuation = {
    '。': '.',
    '，': ', ',
    '、': ', ',
    '；': '; ',
    '：': ': ',
    '“': '“',
    '”': '”',
    '‘': '‘',
    '’': '’',
    '（': '(',
    '）': ')',
    '！': '!',
    '？': '?'
  }
  for (const segment of segments.sort((a, b) => b.start - a.start)) {
    const translation = segment.type === 'punctuation' ? segment.text : dictionary[segment.text]
    if (typeof translation !== 'string' || !translation.trim())
      throw new Error(`Missing translation: ${segment.text.slice(0, 80)}`)
    const raw = markdown.slice(segment.start, segment.end)
    let replacement = translation.trim()
    replacement = replacement.replace(/[。，；：“”‘’（）！？、]/gu, (mark) => punctuation[mark])
    if (segment.type === 'diagram')
      replacement = replacement.replace(/["\[\]{}<>()]/g, '').replace(/:$/u, ': ')
    else replacement = replacement.replace(/([\\*_[\]<>#`|])/g, '\\$1')
    if (segment.spaceBefore && /^[\w(]/u.test(replacement)) replacement = ' ' + replacement
    if (segment.spaceAfter && /[\w.,;:!?)”’]$/u.test(replacement)) replacement += ' '
    const leading = raw.match(/^\s*/)[0]
    const trailing = raw.match(/\s*$/)[0]
    result =
      result.slice(0, segment.start) + leading + replacement + trailing + result.slice(segment.end)
  }
  // Mermaid requires quoted subgraph titles when translated titles contain parentheses.
  const diagrams = []
  walk(parseMarkdown(result), (node) => {
    if (node.type === 'code' && node.lang === 'mermaid') diagrams.push(node)
  })
  for (const node of diagrams.reverse()) {
    const start = node.position.start.offset,
      end = node.position.end.offset
    const code = result
      .slice(start, end)
      .replace(
        /^(\s*subgraph\s+)([^\n\[\]"]+)$/gm,
        (_, prefix, title) => `${prefix}"${title.trim()}"`
      )
    result = result.slice(0, start) + code + result.slice(end)
  }
  return result
}

export function headingIds(markdown) {
  const slugger = new GithubSlugger()
  const ids = []
  walk(parseMarkdown(markdown), (node) => {
    if (node.type !== 'heading') return
    const text = (node.children ?? [])
      .map(function content(child) {
        return child.type === 'image'
          ? (child.alt ?? '')
          : (child.value ?? (child.children ?? []).map(content).join(''))
      })
      .join('')
    ids.push(slugger.slug(text))
  })
  return ids
}

export function localizeMarkdownLinks(markdown, sourcePath, headingMaps, publicPaths) {
  const edits = []
  walk(parseMarkdown(markdown), (node) => {
    if (!['link', 'definition'].includes(node.type)) return
    if (!node.url.startsWith('/') && !node.url.startsWith('#')) return
    const url = new URL(node.url, `https://blog.invalid${sourcePath}`)
    const lookupPath = decodeURI(url.pathname).replace(/\/$/, '') || '/'
    if (url.origin !== 'https://blog.invalid' || !publicPaths.has(lookupPath)) return
    const anchor = decodeURIComponent(url.hash.slice(1))
    const target = headingMaps.get(lookupPath)?.get(anchor) ?? anchor
    const localized = `/en${url.pathname}${url.search}${target ? `#${encodeURIComponent(target)}` : ''}`
    const raw = markdown.slice(node.position.start.offset, node.position.end.offset)
    const index = raw.lastIndexOf(node.url)
    if (index < 0) throw new Error(`Cannot locate internal link: ${node.url}`)
    const start = node.position.start.offset + index
    edits.push({ start, end: start + node.url.length, replacement: localized })
  })
  for (const edit of edits.sort((a, b) => b.start - a.start))
    markdown = markdown.slice(0, edit.start) + edit.replacement + markdown.slice(edit.end)
  return markdown
}
