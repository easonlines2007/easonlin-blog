/** Keep a requested heading aligned while lazy diagrams and the header settle. */
export function setupTocNavigation(links: HTMLAnchorElement[]) {
  const ids = new Set(links.map((link) => decodeURIComponent(link.hash.slice(1))))
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  let navigation: { target: HTMLElement; events: AbortController; smooth: boolean } | undefined
  let frame = 0
  let geometryDirty = false

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
    navigation?.events.abort()
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

  function scrollToHeading() {
    if (!navigation) return
    const { target, smooth } = navigation
    const start = window.scrollY
    let end = destination(target)
    geometryDirty = false
    const distance = Math.abs(end - start)
    if (distance <= 1) return
    if (!smooth || reducedMotion.matches) {
      window.scrollTo({ top: end, behavior: 'instant' })
      return
    }

    // Keep long chapter jumps brief, with a gentle start and landing.
    const duration = Math.min(520, 180 + 6 * Math.sqrt(distance))
    const started = performance.now()
    let segmentStart = start
    let segmentProgress = 0
    let previousProgress = 0
    function step(now: number) {
      if (geometryDirty) {
        const nextEnd = destination(target)
        if (Math.abs(nextEnd - end) > 1) {
          segmentStart = window.scrollY
          segmentProgress = previousProgress
          end = nextEnd
        }
        geometryDirty = false
      }
      const t = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (now - started) / duration))
      const eased = t * t * (3 - 2 * t)
      const progress = (eased - segmentProgress) / (1 - segmentProgress)
      window.scrollTo({ top: segmentStart + (end - segmentStart) * progress, behavior: 'instant' })
      previousProgress = eased
      frame = t < 1 ? requestAnimationFrame(step) : 0
    }
    frame = requestAnimationFrame(step)
  }

  function realign() {
    if (!navigation) return
    geometryDirty = true
    // Reuse the current animation when images or the header change size.
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0
        scrollToHeading()
      })
  }

  function navigate(target: HTMLElement, smooth: boolean) {
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
    navigation = { target, events, smooth }
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      window.addEventListener(event, stop, {
        passive: true,
        capture: true,
        signal: events.signal
      })
    }
    window.addEventListener('pagehide', stop, { signal: events.signal })
    scrollToHeading()
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
    if (location.hash !== link.hash) {
      const state = { ...history.state }
      if (state.noteReadingReturn) {
        state.noteReadingReturn = {
          ...state.noteReadingReturn,
          depth: state.noteReadingReturn.depth + 1
        }
      }
      history.pushState(state, '', link.hash)
    }
    navigate(target, true)
  })

  function followHash() {
    stop()
    const target = hashTarget(location.hash)
    if (target) navigate(target, false)
  }
  window.addEventListener('hashchange', followHash)
  if (location.hash) followHash()
  return realign
}
