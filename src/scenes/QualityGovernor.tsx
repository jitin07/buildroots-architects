import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/** Frames closer together than this count as continuous animation (scrolling). */
const ACTIVE_GAP_MS = 100
const SAMPLE_FRAMES = 90
const MIN_FPS = 40
const COOLDOWN_MS = 3000

/**
 * Frame-rate governor that works with on-demand rendering: it measures only
 * the gaps between consecutive animated frames (idle pauses are ignored) and
 * steps quality down when the average during motion stays below MIN_FPS.
 * A cooldown after each decision stops one hitch from cascading.
 */
export default function QualityGovernor({ onDecline }: { onDecline: () => void }) {
  const state = useRef({ last: 0, sum: 0, count: 0, cooldownUntil: 0 })

  useFrame(() => {
    const now = performance.now()
    const s = state.current
    const gap = now - s.last
    s.last = now
    if (gap > ACTIVE_GAP_MS || now < s.cooldownUntil) return
    s.sum += gap
    s.count++
    if (s.count < SAMPLE_FRAMES) return
    const fps = 1000 / (s.sum / s.count)
    s.sum = 0
    s.count = 0
    if (fps < MIN_FPS) {
      s.cooldownUntil = now + COOLDOWN_MS
      onDecline()
    }
  })

  return null
}
