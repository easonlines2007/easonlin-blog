/** The stable outer wrapper owns entrance motion; only its inner card tilts. */
export function setupAvatarTilt(avatar: HTMLElement) {
  const enabled = matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  )
  const properties = ['--avatar-tilt-x', '--avatar-tilt-y', '--avatar-glare-x', '--avatar-glare-y']
  let frame = 0
  let pointerX = 0
  let pointerY = 0

  function reset() {
    cancelAnimationFrame(frame)
    frame = 0
    delete avatar.dataset.avatarTilting
    properties.forEach((property) => avatar.style.removeProperty(property))
  }

  function update(event: PointerEvent) {
    if (
      event.pointerType !== 'mouse' ||
      !enabled.matches ||
      document.documentElement.dataset.homeEntrance === 'pending'
    )
      return
    pointerX = event.clientX
    pointerY = event.clientY
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (!enabled.matches || document.documentElement.dataset.homeEntrance === 'pending') {
        reset()
        return
      }
      const bounds = avatar.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height))
      avatar.style.setProperty('--avatar-tilt-x', `${((0.5 - y) * 28).toFixed(2)}deg`)
      avatar.style.setProperty('--avatar-tilt-y', `${((x - 0.5) * 28).toFixed(2)}deg`)
      avatar.style.setProperty('--avatar-glare-x', `${(x * 100).toFixed(1)}%`)
      avatar.style.setProperty('--avatar-glare-y', `${(y * 100).toFixed(1)}%`)
      avatar.dataset.avatarTilting = 'true'
    })
  }

  avatar.addEventListener('pointerenter', update)
  avatar.addEventListener('pointermove', update)
  avatar.addEventListener('pointerleave', reset)
  avatar.addEventListener('pointercancel', reset)
  enabled.addEventListener('change', reset)
  window.addEventListener('blur', reset)
  window.addEventListener('resize', reset)
  window.addEventListener('pagehide', reset)
}
