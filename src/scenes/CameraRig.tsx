import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { journeyState, sampleJourney } from './camera/journey'
import { exposureAt } from './environment/adaptation'

/** Aspect ratio the keyframe FOVs were composed for. */
const REFERENCE_ASPECT = 16 / 9
/** Share of the reference horizontal view kept on a tall phone screen. */
const PORTRAIT_COVERAGE = 0.7
const MAX_FOV = 72
const SWAY = { x: 0.55, y: 0.22, damping: 2.5 }

/**
 * Places the camera on the journey path every frame.
 *
 * Position, target and FOV come straight from the scrubbed GSAP value
 * (journeyState.u) with no extra smoothing here, so the camera can never lag
 * or drift out of sync with the timeline — ScrollTrigger's scrub already
 * eases it. Narrow screens get a wider vertical FOV instead of a camera
 * pull-back, which would push the camera through walls indoors. Pointer sway
 * is scaled per keyframe and disabled for reduced motion.
 */
export default function CameraRig() {
  const reducedMotion = useReducedMotion()
  const invalidate = useThree((s) => s.invalidate)
  const pointer = useRef({ x: 0, y: 0 })
  const sway = useRef({ x: 0, y: 0 })
  const scratch = useRef({ position: new Vector3(), target: new Vector3(), right: new Vector3(), up: new Vector3() })

  useEffect(() => {
    if (reducedMotion) {
      pointer.current.x = pointer.current.y = 0
      return
    }
    const onMove = (e: PointerEvent) => {
      // Mouse only: on touch screens a scrolling finger must not swing the camera.
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      invalidate()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion, invalidate])

  useFrame(({ camera, size, gl }, delta) => {
    // Used directly on the low tier; with post-processing the Exposure effect applies it.
    gl.toneMappingExposure = exposureAt(journeyState.u)

    const cam = camera as PerspectiveCamera
    const { position, target, right, up } = scratch.current
    const sample = sampleJourney(journeyState.u, position, target)

    // Pointer sway, damped, in the camera's own right/up plane.
    sway.current.x = MathUtils.damp(sway.current.x, pointer.current.x, SWAY.damping, delta)
    sway.current.y = MathUtils.damp(sway.current.y, pointer.current.y, SWAY.damping, delta)
    // Keep drawing until the sway has settled; then the loop goes idle.
    if (Math.abs(sway.current.x - pointer.current.x) + Math.abs(sway.current.y - pointer.current.y) > 0.002) invalidate()
    if (sample.sway > 0) {
      right.subVectors(target, position).cross(cam.up).normalize()
      up.copy(cam.up)
      position.addScaledVector(right, sway.current.x * SWAY.x * sample.sway)
      position.addScaledVector(up, -sway.current.y * SWAY.y * sample.sway)
    }

    cam.position.copy(position)
    cam.lookAt(target)

    const fov = responsiveFov(sample.fov, size.width / Math.max(1, size.height))
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
  })

  return null
}

/** Widens the vertical FOV on narrower screens so the composition's width mostly survives. */
function responsiveFov(baseFov: number, aspect: number) {
  if (aspect >= REFERENCE_ASPECT) return baseFov
  const hRef = 2 * Math.atan(Math.tan(MathUtils.degToRad(baseFov) / 2) * REFERENCE_ASPECT)
  const t = MathUtils.clamp((aspect - 0.5) / (REFERENCE_ASPECT - 0.5), 0, 1)
  const h = hRef * MathUtils.lerp(PORTRAIT_COVERAGE, 1, t)
  const v = MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect))
  return MathUtils.clamp(v, baseFov, MAX_FOV)
}
