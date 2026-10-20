/**
 * Camera journey data: keyframes, story phases and the live journey state.
 * Deliberately free of three.js imports so the page shell (the GSAP timeline
 * in StoryStage) can use it without pulling three into the main bundle.
 * The path maths lives in journey.ts.
 */

type V3 = readonly [number, number, number]

export type Keyframe = {
  position: V3
  target: V3
  /** Vertical FOV in degrees for a 16:9 frame (widened on narrower screens). */
  fov: number
  /** Pointer parallax strength, 0–1. Kept low indoors to stay clear of geometry. */
  sway: number
}

// Coordinates in metres; see HOUSE in ../config.ts. Eye height indoors is
// floor (0.45) + ~1.6 m. The camera enters through the pivot door opening at
// x ≈ 5.75 (door x 4.6–6.4), well clear of the swung door leaf at x ≈ 5.0.
export const JOURNEY_KEYS: Keyframe[] = [
  // 0 · Phase 1 — wide establishing shot across the pool
  { position: [18, 2.3, 40], target: [2, 3.3, 1], fov: 30, sway: 1 },
  // 1 · Phase 2 — closing in, the facade fills the frame
  { position: [7.5, 1.95, 21], target: [-0.5, 3.0, 2], fov: 34, sway: 0.8 },
  // 2 · Phase 3 start — on the lawn at the west end of the glass wall
  { position: [-5.5, 2.1, 7.7], target: [-0.8, 2.05, 3.4], fov: 40, sway: 0.4 },
  // 3 · Phase 3 end — tracking east along the glazing, interior sliding past
  { position: [2.6, 2.05, 5.7], target: [6.2, 2.0, 3.0], fov: 40, sway: 0.3 },
  // 4 · Phase 4 — square to the entry as the pivot door swings open
  { position: [5.75, 2.05, 7.2], target: [5.7, 2.0, 0], fov: 42, sway: 0.2 },
  // 5 · Phase 4 end — crossing the threshold
  { position: [5.75, 2.05, 3.4], target: [3.2, 1.9, -2.4], fov: 46, sway: 0.05 },
  // 6 · Phase 5 — inside, turning towards the living space
  { position: [5.15, 2.05, 1.3], target: [-0.5, 1.75, -1.6], fov: 46, sway: 0.1 },
  // 7 · Phase 6 — the final composed interior view
  { position: [4.2, 2.15, 2.6], target: [-5.2, 1.3, -2.2], fov: 42, sway: 0.15 },
  // 8 · Linger — a slow drift towards the hearth beneath the philosophy and data sections
  { position: [3.5, 2.1, 1.7], target: [-5.6, 1.35, -2.5], fov: 40, sway: 0.15 },
]

export const KEY_COUNT = JOURNEY_KEYS.length
export const keyU = (index: number) => index / (KEY_COUNT - 1)

/** A story phase: a span of keys and its share of the scroll. */
export type Phase = {
  id: string
  fromKey: number
  toKey: number
  /** Relative scroll length. */
  duration: number
  ease: string
}

export const PHASES: Phase[] = [
  { id: 'wide', fromKey: 0, toKey: 0, duration: 0.6, ease: 'none' },
  { id: 'approach', fromKey: 0, toKey: 2, duration: 1.8, ease: 'sine.inOut' },
  { id: 'glass', fromKey: 2, toKey: 3, duration: 1.3, ease: 'sine.inOut' },
  { id: 'threshold', fromKey: 3, toKey: 5, duration: 1.6, ease: 'sine.inOut' },
  { id: 'interior', fromKey: 5, toKey: 6, duration: 1.0, ease: 'sine.inOut' },
  { id: 'dwell', fromKey: 6, toKey: 7, duration: 1.1, ease: 'sine.out' },
  { id: 'linger', fromKey: 7, toKey: 8, duration: 2.8, ease: 'sine.inOut' },
]

/** Live journey values written by the GSAP timeline and read in the render loop. */
export const journeyState = {
  /** Position along the path, 0–1. */
  u: 0,
  /** Pivot door opening, 0 (closed) – 1 (open). */
  door: 0,
  /** Index into PHASES of the phase currently playing. */
  phase: 0,
}
