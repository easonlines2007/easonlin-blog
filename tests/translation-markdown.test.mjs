import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  applyTextTranslations,
  headingIds,
  localizeMarkdownLinks,
  translationSegments,
  parseMarkdown,
  walk
} from '../scripts/translation-markdown.mjs'

test('translate prose, table cells and diagram labels while preserving code, math and attachment URLs', () => {
  const original =
    '## 标题\n\n正文 `变量` $\\text{中文} + x$\n\n```python\nprint("中文")\n```\n\n$$\nA \\mathbf{x} = b\n$$\n\n| 表头 |\n| --- |\n| 内容 |\n\n![配图](/attachments/image.png)\n\n```mermaid\ngraph LR\n A[起点] --> B[终点]\n```\n'
  const dictionary = {
    标题: 'Heading',
    正文: 'Body',
    '正文 ': 'Body',
    表头: 'Column',
    内容: 'Content',
    配图: 'Diagram',
    起点: 'Start',
    终点: 'End'
  }
  const translated = applyTextTranslations(original, dictionary)
  assert.match(translated, /## Heading/)
  assert.match(translated, /\| Column \|/)
  assert.match(translated, /A\[Start\] --> B\[End\]/)
  const protectedValues = (text) => {
    const values = []
    walk(parseMarkdown(text), (n) => {
      if (
        ['inlineCode', 'math', 'inlineMath'].includes(n.type) ||
        (n.type === 'code' && n.lang !== 'mermaid')
      )
        values.push(n.value)
      if (n.type === 'image') values.push(n.url)
    })
    return values
  }
  assert.deepEqual(protectedValues(translated), protectedValues(original))
  assert.ok(!translationSegments(original).some((s) => s.text === '变量'))
})

test('localized article links resolve translated heading fragments while external and attachment links stay intact', () => {
  const markdown =
    '[jump](#中文) [next](/notes/other#原文) [image](/attachments/file.pdf) [external](https://example.com/)'
  const maps = new Map([
    ['/notes/self', new Map([['中文', 'english']])],
    ['/notes/other', new Map([['原文', 'translated']])]
  ])
  const result = localizeMarkdownLinks(markdown, '/notes/self', maps, new Set(maps.keys()))
  assert.match(result, /\(\/en\/notes\/self#english\)/)
  assert.match(result, /\(\/en\/notes\/other#translated\)/)
  assert.match(result, /\(\/attachments\/file.pdf\)/)
  assert.match(result, /\(https:\/\/example.com\/\)/)
  assert.deepEqual(headingIds('## Same\n\n## Same\n'), ['same', 'same-1'])
  assert.throws(() => applyTextTranslations('缺少译文', {}), /Missing translation/)
})

test('English words retain emphasis boundaries and normalize Chinese prose punctuation', () => {
  const result = applyTextTranslations('一个**核心机制**执行`f`。\n\n## 标题', {
    一个: 'A',
    核心机制: 'core mechanism',
    执行: 'executes',
    标题: '# A heading'
  })
  assert.match(result, /A \*\*core mechanism\*\* executes `f`\./)
  assert.equal(headingIds(result).length, 1)
  assert.match(result, /## \\# A heading/)
})

test('translated Mermaid subgraph titles remain valid around existing English parentheses', () => {
  const result = applyTextTranslations(
    '```mermaid\ngraph LR\n subgraph 应用 (Use of Data)\n  A[起点]\n end\n```',
    { 应用: 'Application', '应用 ': 'Application', 起点: 'Start' }
  )
  assert.match(result, /subgraph "Application \(Use of Data\)"/)
})
