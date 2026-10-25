import { fromMarkdown } from 'mdast-util-from-markdown'

// Extract selected paragraphs from the source (or its aligned translation).
const selections: Record<string, number> = {
  'future-loss': 6,
  'ordinary-person': 5,
  'information-overload': 3,
  nineteen: 2,
  fantasy: 1,
  'no-regrets': 4,
  unfinished: 1,
  'ability-and-desire': 2
}

type TextNode = {
  type: string
  value?: string
  url?: string
  alt?: string | null
  children?: TextNode[]
}
function plainText(node: TextNode): string {
  if (node.type === 'image' || node.type === 'imageReference' || node.type === 'html') return ''
  if (node.type === 'break') return '\n'
  return node.value ?? node.children?.map(plainText).join('') ?? ''
}

function firstImage(node: TextNode): { src: string; alt: string } | undefined {
  if (node.type === 'image' && node.url) return { src: node.url, alt: node.alt ?? '' }
  for (const child of node.children ?? []) {
    const image = firstImage(child)
    if (image) return image
  }
}

export function essayPresentation(entry: {
  id: string
  body?: string
  translation?: { body?: string }
}) {
  const tree = fromMarkdown(entry.translation?.body ?? entry.body ?? '')
  const paragraphs = tree.children
    .filter((node) => node.type === 'paragraph')
    .map(plainText)
    .map((text) => text.trim())
    .filter(Boolean)
  const excerpt = paragraphs[selections[entry.id] ?? 0] ?? paragraphs[0] ?? ''
  const short = paragraphs.length === 1 && excerpt.includes('\n')
  return { excerpt, short, image: firstImage(tree) }
}
