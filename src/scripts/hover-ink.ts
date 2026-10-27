// Reveal the existing hover styling through a soft circle, including text and frames.
// The cover is inert; the original link keeps its native hit area and focus behavior.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const interactive = 'a[href], button:enabled, summary'
let current: HTMLElement | null = null
let cover: HTMLElement | null = null
let frame = 0

function clearInk() {
  cancelAnimationFrame(frame)
  cover?.remove()
  cover = null
  current?.removeAttribute('data-ink-source')
  current = null
}

function findLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const link = target.closest<HTMLElement>(interactive)
  if (!link?.closest('main, .site-footer, .header-actions')) return null
  // Keep the avatar, photo covers, character flips and heatmap's own interactions.
  if (link.closest('.avatar, .contact-trigger, .character-link, .activity-cell, [data-ink-cover]'))
    return null
  return link
}

function revealInk(link: HTMLElement, x: number, y: number) {
  clearInk()
  const surface = link.matches('.entry-link')
    ? (link.closest<HTMLElement>('.entry-surface') ?? link)
    : (link.closest<HTMLElement>('.journal-entry h2') ?? link)
  const bounds = surface.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  // Inline links spanning several lines retain their natural wrapping and feedback.
  if (surface.getClientRects().length > 1) return

  const clone = surface.cloneNode(true) as HTMLElement
  clone.setAttribute('data-ink-cover', '')
  clone.setAttribute('aria-hidden', 'true')
  clone.inert = true
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    margin: '0',
    opacity: '0'
  })
  // Resolve the unhovered clone in the same CSS context before moving it to body.
  surface.after(clone)
  const nodes = [clone, ...clone.querySelectorAll<HTMLElement | SVGElement>('*')]
  const styles = nodes.map((node) => {
    const computed = getComputedStyle(node)
    return Array.from(computed, (name) => `${name}:${computed.getPropertyValue(name)};`).join('')
  })
  nodes.forEach((node, index) => {
    node.style.cssText = styles[index]
    node.removeAttribute('id')
    node.removeAttribute('autofocus')
  })

  // Transparent cards and text need the paper beneath them to hide the hover ink.
  let paper = surface.parentElement
  let background = getComputedStyle(document.body).backgroundColor
  while (paper) {
    const color = getComputedStyle(paper).backgroundColor
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
      background = color
      break
    }
    paper = paper.parentElement
  }
  const wrapper = document.createElement('div')
  wrapper.setAttribute('data-ink-cover', '')
  wrapper.setAttribute('aria-hidden', 'true')
  wrapper.inert = true
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    borderRadius: getComputedStyle(surface).borderRadius,
    background,
    zIndex: '40'
  })
  Object.assign(clone.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    margin: '0',
    transform: 'none',
    opacity: '1',
    visibility: 'visible'
  })
  wrapper.append(clone)
  document.body.append(wrapper)
  current = link
  cover = wrapper
  link.setAttribute('data-ink-source', '')

  const originX = Math.max(0, Math.min(bounds.width, x - bounds.left))
  const originY = Math.max(0, Math.min(bounds.height, y - bounds.top))
  const radius = Math.hypot(
    Math.max(originX, bounds.width - originX),
    Math.max(originY, bounds.height - originY)
  )
  // Filled rows share the card timing; directory rules keep their slower reveal.
  const homeDirectory = surface.matches('.home-section')
  const feather = Math.min(32, Math.max(12, radius * 0.08))
  const duration = homeDirectory ? 760 : 620
  const started = performance.now()
  function draw(now: number) {
    const progress = Math.min(1, (now - started) / duration)
    const eased = homeDirectory ? progress * progress * (3 - 2 * progress) : 1 - (1 - progress) ** 3
    const edge = eased * (radius + feather * 2) - feather
    wrapper.style.maskImage = `radial-gradient(circle at ${originX}px ${originY}px, transparent ${Math.max(0, edge - feather)}px, #000 ${Math.max(0, edge + feather)}px)`
    if (progress < 1) frame = requestAnimationFrame(draw)
    else {
      wrapper.remove()
      cover = null
    }
  }
  frame = requestAnimationFrame(draw)
}

document.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches) return
  const link = findLink(event.target)
  if (!link || link === current) return
  revealInk(link, event.clientX, event.clientY)
})
document.addEventListener('pointerout', (event) => {
  if (current && findLink(event.relatedTarget) !== current) clearInk()
})
// Remove fixed covers before the underlying layout or theme can change.
window.addEventListener('scroll', clearInk, { passive: true, capture: true })
window.addEventListener('resize', clearInk, { passive: true })
document.addEventListener('pointerdown', clearInk)
document.addEventListener('keydown', clearInk)
window.addEventListener('pagehide', clearInk)
reducedMotion.addEventListener('change', clearInk)
new MutationObserver(clearInk).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
})
