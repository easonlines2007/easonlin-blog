import type { MarkdownHeading } from 'astro'

// A Markdown document may start with h1, h2, or h3 independently of the page title.
export function getTocHeadings(headings: readonly MarkdownHeading[]) {
  const items = headings.filter(
    (heading) =>
      heading.depth >= 1 &&
      heading.depth <= 3 &&
      heading.slug.length > 0 &&
      heading.text.trim().length > 0
  )
  const baseDepth = Math.min(...items.map((heading) => heading.depth))
  return items.map((heading) => ({ ...heading, level: heading.depth - baseDepth }))
}
