const duration = 1800
const settleAt = 0.4
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Animate the actual hero elements so the final layout never swaps or jumps. */
export async function startHomeEntrance() {
  const root = document.documentElement
  if (root.dataset.homeEntrance !== 'pending') return

  const avatar = document.querySelector<HTMLElement>('[data-intro-avatar]')
  const name = document.querySelector<HTMLElement>('[data-intro-name]')
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const animations: Animation[] = []
  const events = new AbortController()
  let finished = false

  function finish() {
    if (finished) return
    finished = true
    delete root.dataset.homeEntrance
    animations.forEach((animation) => animation.cancel())
    events.abort()
  }

  if (!avatar || !name || motion.matches || window.scrollY > 0) {
    finish()
    return
  }

  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'resize', 'pagehide']) {
    window.addEventListener(event, finish, { passive: true, signal: events.signal })
  }
  motion.addEventListener('change', finish, { signal: events.signal })

  try {
    const picture = avatar.querySelector('img')
    // Measure the name in its display font before moving it into place.
    await Promise.race([
      Promise.all([
        document.fonts.load('400 48px "Schoolbell"', name.textContent ?? 'Eason Lin'),
        picture?.decode().catch(() => {})
      ]),
      new Promise((resolve) => setTimeout(resolve, 600))
    ])
    if (finished || root.dataset.homeEntrance !== 'pending') return
    try {
      sessionStorage.setItem('notes-intro-seen', 'true')
    } catch {}

    const avatarScale = 1.12
    const nameScale = 1.06
    const gap = 28
    const avatarHeight = avatar.offsetHeight * avatarScale
    const nameHeight = name.offsetHeight * nameScale
    const groupTop = (window.innerHeight - avatarHeight - gap - nameHeight) / 2
    const centerX = window.innerWidth / 2

    function moveIntoPlace(element: HTMLElement, centerY: number, scale: number, rotation: number) {
      const box = element.getBoundingClientRect()
      const x = centerX - (box.left + box.width / 2)
      const y = centerY - (box.top + box.height / 2)
      const start = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`
      animations.push(
        element.animate(
          [
            { opacity: 0, transform: start, offset: 0, easing: 'ease-out' },
            { opacity: 1, transform: start, offset: 0.24 },
            { opacity: 1, transform: start, offset: settleAt, easing: ease },
            { opacity: 1, transform: `rotate(${rotation}deg)`, offset: 1 }
          ],
          { duration, fill: 'both' }
        )
      )
    }

    moveIntoPlace(avatar, groupTop + avatarHeight / 2, avatarScale, 0)
    moveIntoPlace(name, groupTop + avatarHeight + gap + nameHeight / 2, nameScale, 0)

    // Keep every other element hidden until both moving elements have landed.
    // Sequencing on completion also holds if rendering is delayed or interrupted.
    await Promise.all(animations.map((animation) => animation.finished))
    if (finished) return

    const remaining = document.querySelectorAll<HTMLElement>(
      '.site-header, [data-intro-reveal], .site-footer'
    )
    remaining.forEach((element, index) => {
      animations.push(
        element.animate(
          [
            { opacity: 0, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: 720,
            delay: Math.min(index * 28, 168),
            easing: ease,
            fill: 'both'
          }
        )
      )
    })

    await Promise.all(animations.map((animation) => animation.finished))
  } catch {
    // Interrupted animations and unsupported APIs must always leave a usable homepage.
  } finally {
    finish()
  }
}
