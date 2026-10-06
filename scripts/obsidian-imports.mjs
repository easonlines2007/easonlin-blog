import { fromMarkdown } from 'mdast-util-from-markdown'

function headingText(node) {
  return node.value ?? (node.children || []).map(headingText).join('')
}

// Split the exported copy at real Markdown headings; source files and fenced examples stay intact.
export function expandObsidianNote(note, rule) {
  if (!rule || !note.published) return [note]
  if (!Array.isArray(rule.modules) || !rule.modules.length) {
    throw new Error(`Obsidian 导入：${note.output} 的模块配置无效。`)
  }
  const headings = fromMarkdown(note.body).children.filter(
    (node) =>
      node.type === 'heading' &&
      node.depth === 1 &&
      /^#\s/.test(note.body.slice(node.position.start.offset))
  )
  if (
    headings.length !== rule.modules.length ||
    headings.some((heading, index) => headingText(heading) !== rule.modules[index].heading)
  ) {
    throw new Error(`Obsidian 导入：${note.output} 的一级目录已变化，请核对模块配置。`)
  }
  // The opening attribution and licence accompany each module; the full introduction opens part one.
  const introduction = note.body.slice(0, headings[0].position.start.offset)
  const attribution = introduction.split(/^---\s*$/m)[0].trim()
  return headings.map((heading, index) => {
    const module = rule.modules[index]
    const data = {
      ...note.data,
      title: module.heading,
      description: module.description,
      topic: rule.topic,
      tags: rule.tags,
      order: index + 1
    }
    delete data.slug
    const document = note.document.clone()
    document.delete('slug')
    for (const [field, value] of Object.entries(data)) document.set(field, value)
    const prefix = index === 0 ? introduction : `${attribution}\n\n---\n\n`
    return {
      ...note,
      output: module.output,
      data,
      document,
      body:
        prefix +
        note.body.slice(heading.position.end.offset, headings[index + 1]?.position.start.offset)
    }
  })
}
