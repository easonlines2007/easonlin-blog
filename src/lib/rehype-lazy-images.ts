interface Node {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

export default function rehypeLazyImages() {
  return function visit(node: Node) {
    if (node.type === 'element' && node.tagName === 'img') {
      node.properties = { ...node.properties, loading: 'lazy', decoding: 'async' }
    }
    node.children?.forEach(visit)
  }
}
