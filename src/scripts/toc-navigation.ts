/** Keep a requested heading aligned while lazy diagrams and the header settle. */
export function setupTocNavigation(links: HTMLAnchorElement[]) {
  const ids = new Set(links.map((link) => decodeURIComponent(link.hash.slice(1))))
  let navigation:
    | { target: HTMLElement; events: AbortController; timer?: ReturnType<typeof setTimeout> }
    | undefined

  function stop() {
    if (!navigation) return
    clearTimeout(navigation.timer)
    navigation.events.abort()
    navigation = undefined
  }

  function destination(target: HTMLElement) {
    const offset =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-offset')) ||
      112
    return Math.max(
      0,
      Math.min(
        window.scrollY + target.getBoundingClientRect().top - offset,
        document.documentElement.scrollHeight - window.innerHeight
      )
    )
  }

  function realign() {
    if (!navigation) return
    const current = navigation
    clearTimeout(current.timer)
    // Wait for both smooth scrolling and layout changes to go quiet. No idle frame loop.
    current.timer = setTimeout(() => {
      if (navigation !== current) return
      const top = destination(current.target)
      if (Math.abs(top - window.scrollY) > 1) {
        window.scrollTo({ top, behavior: 'instant' })
      }
    }, 160)
  }

  function navigate(target: HTMLElement, behavior: ScrollBehavior) {
    stop()
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement) parent.open = true
    }
    if (!target.hasAttribute('tabindex')) {
      target.tabIndex = -1
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    }
    target.focus({ preventScroll: true })
    const events = new AbortController()
    navigation = { target, events }
    // Reading or choosing another destination must never fight an earlier jump.
    const cancel = () => {
      stop()
      window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    }
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      window.addEventListener(event, cancel, {
        passive: true,
        capture: true,
        signal: events.signal
      })
    }
    window.addEventListener('pagehide', stop, { signal: events.signal })
    window.addEventListener('scroll', realign, { passive: true, signal: events.signal })
    window.scrollTo({ top: destination(target), behavior })
    realign()
  }

  function hashTarget(hash: string) {
    try {
      const id = decodeURIComponent(hash.slice(1))
      return ids.has(id) ? document.getElementById(id) : null
    } catch {
      return null
    }
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('[data-toc-link]')
        : null
    if (!link || !links.includes(link)) return
    const target = hashTarget(link.hash)
    if (!target) return
    event.preventDefault()
    const mobileToc = link.closest<HTMLDetailsElement>('.mobile-toc')
    if (mobileToc) mobileToc.open = false
    if (location.hash !== link.hash) history.pushState(null, '', link.hash)
    navigate(target, matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')
  })

  function followHash() {
    stop()
    const target = hashTarget(location.hash)
    if (target) navigate(target, 'instant')
  }
  window.addEventListener('hashchange', followHash)
  if (location.hash) followHash()
  return realign
}
