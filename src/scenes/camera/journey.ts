import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'
import { JOURNEY_KEYS, KEY_COUNT } from './keyframes'

export * from './keyframes'

/**
 * The cinematic camera journey: keyframed positions and look-at targets joined
 * by centripetal Catmull-Rom splines (no overshoot, so the path never swings
 * wide into walls between keys), with field of view and pointer sway
 * interpolated alongside.
 *
 * GSAP owns *when* the camera is where (a scrubbed timeline tweening
 * `journeyState.u`); this module owns *where* each value of u lands.
 * Key i sits exactly at u = i / (keys - 1).
 */

const positionCurve = new CatmullRomCurve3(
  JOURNEY_KEYS.map((k) => new Vector3(...k.position)),
  false,
  'centripetal',
)
const targetCurve = new CatmullRomCurve3(
  JOURNEY_KEYS.map((k) => new Vector3(...k.target)),
  false,
  'centripetal',
)

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Writes the camera position and target at path position u; returns FOV and sway. */
export function sampleJourney(u: number, position: Vector3, target: Vector3) {
  const t = MathUtils.clamp(u, 0, 1)
  positionCurve.getPoint(t, position)
  targetCurve.getPoint(t, target)

  const scaled = t * (KEY_COUNT - 1)
  const i = Math.min(Math.floor(scaled), KEY_COUNT - 2)
  const f = smooth(scaled - i)
  const a = JOURNEY_KEYS[i]
  const b = JOURNEY_KEYS[i + 1]
  return {
    fov: MathUtils.lerp(a.fov, b.fov, f),
    sway: MathUtils.lerp(a.sway, b.sway, f),
  }
}

/** Dense samples of the path for the dev-time clearance check. */
export function samplePath(steps: number) {
  const pos = new Vector3()
  const tgt = new Vector3()
  return Array.from({ length: steps + 1 }, (_, s) => {
    const u = s / steps
    sampleJourney(u, pos, tgt)
    return { u, position: pos.clone() }
  })
}
