// Integrate the velocity curve: a short ramp, steady travel, then a soft landing.
function scrollProgress(t: number) {
  const ramp = 0.1
  const landing = 0.42
  const cruiseEnd = 1 - landing
  const travel = ramp / 2 + (cruiseEnd - ramp) + landing / 4
  if (t < ramp) return (t * t) / (2 * ramp * travel)
  if (t <= cruiseEnd) return (t - ramp / 2) / travel
  return 1 - (landing / (4 * travel)) * ((1 - t) / landing) ** 4
}

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

    const duration = Math.min(1050, 280 + 9 * Math.sqrt(distance))
    let elapsed = 0
    const initialEnd = end
    let correction = 0
    let previousTime = performance.now()
    function step(now: number) {
      if (geometryDirty) {
        end = destination(target)
        geometryDirty = false
      }
      // A slow paint should lengthen the trip, not skip the landing frames.
      const delta = Math.min(32, Math.max(0, now - previousTime))
      previousTime = now
      elapsed += delta
      const t = Math.min(1, elapsed / duration)
      // Give late layout changes their own settling time, even on the last frame.
      const shift = end - initialEnd
      correction += (shift - correction) * (1 - Math.exp(-delta / 55))
      const done = reducedMotion.matches || (t === 1 && Math.abs(shift - correction) < 0.5)
      const top = done ? end : start + (initialEnd - start) * scrollProgress(t) + correction
      window.scrollTo({ top, behavior: 'instant' })
      frame = done ? 0 : requestAnimationFrame(step)
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
