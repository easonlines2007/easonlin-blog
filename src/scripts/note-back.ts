type ReadingReturn = { url: string; depth: number }
const navigation = window.navigation
const sameDocument = (url: URL) =>
  url.origin === location.origin &&
  url.pathname === location.pathname &&
  url.search === location.search

function previousPage() {
  const index = navigation?.currentEntry?.index ?? -1
  return navigation?.entries().findLast((entry) => {
    if (entry.index >= index || !entry.url) return false
    return !sameDocument(new URL(entry.url))
  })
}

// Persist on this history entry so reload and back/forward retain the arrival path.
// The depth counts in-article TOC jumps on browsers without Navigation API support.
if (!history.state?.noteReadingReturn && document.referrer) {
  const referrer = new URL(document.referrer)
  if (['http:', 'https:'].includes(referrer.protocol) && !sameDocument(referrer)) {
    history.replaceState(
      { ...history.state, noteReadingReturn: { url: referrer.href, depth: 0 } },
      ''
    )
  }
}

const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-note-back]')]
function updateLinks() {
  const source =
    previousPage()?.url ?? (history.state?.noteReadingReturn as ReadingReturn | undefined)?.url
  if (source) links.forEach((link) => (link.href = source))
}
updateLinks()
window.addEventListener('pageshow', updateLinks)
window.addEventListener('popstate', updateLinks)

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    const previous = previousPage()
    if (previous && navigation) {
      event.preventDefault()
      // Traverse straight to the referring document, skipping all heading anchors.
      void navigation.traverseTo(previous.key).finished?.catch(() => location.assign(link.href))
      return
    }
    const source = history.state?.noteReadingReturn as ReadingReturn | undefined
    if (source && history.length > source.depth + 1) {
      event.preventDefault()
      history.go(-(source.depth + 1))
    }
  })
})

export {}
