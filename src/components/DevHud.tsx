import { useEffect, useRef } from 'react'
import { scrollState } from '../lib/scrollState'
import { journeyState, PHASES } from '../scenes/camera/keyframes'

/** Development-only readout of scroll progress. Never rendered in production. */
export default function DevHud() {
  const value = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (value.current) {
        const phase = PHASES[journeyState.phase]?.id ?? '-'
        value.current.textContent = `${scrollState.progress.toFixed(3)} · u ${journeyState.u.toFixed(3)} · ${phase} · door ${journeyState.door.toFixed(2)}`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="t-caption t-numeral"
      style={{
        position: 'fixed',
        right: 'var(--gutter)',
        bottom: 'var(--gutter)',
        zIndex: 'var(--z-nav)',
        padding: '0.5rem 0.75rem',
        border: '1px solid var(--line)',
        background: 'var(--frost)',
        pointerEvents: 'none',
      }}
    >
      dev · scroll <span ref={value}>0.000</span>
    </div>
  )
}
