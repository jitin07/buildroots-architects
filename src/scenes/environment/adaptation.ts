import { MathUtils } from 'three'
import { keyU } from '../camera/journey'

/**
 * Simple eye adaptation: interiors are lit brightly enough to glow from the
 * garden, so exposure eases down as the camera crosses the threshold and
 * back up when scrolling out again.
 */
const ADAPT_START = keyU(4) + 0.03
const ADAPT_END = keyU(5)
const INTERIOR_EXPOSURE = 0.6

export function exposureAt(u: number) {
  const t = MathUtils.smoothstep(u, ADAPT_START, ADAPT_END)
  return MathUtils.lerp(1, INTERIOR_EXPOSURE, t)
}
