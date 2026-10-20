/**
 * On-demand rendering bridge. The canvas renders only when something changes
 * (scroll timeline, pointer sway, resize) instead of 60 times a second, so an
 * idle page costs almost nothing on the CPU, GPU or battery. The R3F canvas
 * registers its invalidate function here; DOM-side code calls requestRender().
 */
let invalidate: (() => void) | null = null

export function setRenderInvalidator(fn: (() => void) | null) {
  invalidate = fn
}

export function requestRender() {
  invalidate?.()
}
