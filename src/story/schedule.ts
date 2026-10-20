import { PHASES } from '../scenes/camera/keyframes'

/**
 * The master timeline's schedule, in timeline units. One unit is scrolled in
 * SCROLL_PER_UNIT viewport heights. Every section reads its start and length
 * from here, so the whole composition is retimed in one place.
 */
export const SCROLL_PER_UNIT = 0.9

/** Start time of each camera phase (derived from PHASES so they never drift apart). */
export const PHASE_START: Record<string, number> = {}
{
  let t = 0
  for (const phase of PHASES) {
    PHASE_START[phase.id] = t
    t += phase.duration
  }
}
export const CAMERA_END = PHASES.reduce((sum, p) => sum + p.duration, 0)

export type Span = { start: number; end: number }

export const SCHEDULE = {
  /** Opening statement lifts away as the camera starts moving. */
  heroOut: { start: PHASE_START.approach, end: PHASE_START.approach + 0.5 },

  /** Section A — one word per camera moment. */
  words: {
    form: { start: 0.85, end: 2.3 },
    space: { start: 2.55, end: 3.6 },
    light: { start: 3.95, end: 5.2 },
    living: { start: 5.45, end: 6.9 },
  } satisfies Record<string, Span>,

  /** Section B — the frosted glass rises, a clear slit opens with the door, then clears. */
  frost: {
    in: { start: 3.75, end: 4.25 },
    open: { start: 4.35, end: 5.15 },
    out: { start: 5.15, end: 5.6 },
  },

  /** Darkening veil that keeps C and D legible over the bright interior. */
  veil: { start: 7.0, end: 7.4 },

  /** Section C — three lines, then out. */
  philosophy: { lines: [7.3, 7.9, 8.5], settle: 8.85, out: { start: 9.0, end: 9.35 } },

  /** Section D — data. */
  stats: { in: { start: 9.4, end: 10.1 }, out: { start: 10.9, end: 11.2 } },

  /** Section E — star aperture opens onto the showreel. */
  aperture: { start: 11.2, end: 12.3 },

  /** Section F — showreel zoom runs from the aperture to the end; info after the aperture. */
  showreel: { zoom: { start: 11.2, end: 13.8 }, info: { start: 12.3, end: 12.75 } },

  total: 13.8,
}
