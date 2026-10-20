/**
 * Shared mutable scroll state. GSAP ScrollTrigger writes it; the R3F render
 * loop reads it every frame. Deliberately not React state, so scrolling never
 * triggers React re-renders.
 */
export const scrollState = {
  /** Overall page progress, 0 at the top and 1 at the end of the experience. */
  progress: 0,
  /** Scroll velocity in px/s as reported by ScrollTrigger. */
  velocity: 0,
}
