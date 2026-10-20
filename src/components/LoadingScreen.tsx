import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { brand } from '../content/copy'
import { gsap, useGSAP } from '../lib/gsap'
import { EXPERIENCE_READY, LOAD_PROGRESS, type LoadProgress } from '../lib/loading'
import './LoadingScreen.css'

const MIN_VISIBLE_MS = 700
const MAX_WAIT_MS = 8000

/** Covers the page until the WebGL layer and its assets are ready, then fades away. */
export default function LoadingScreen() {
  const root = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState<LoadProgress>({ active: false, progress: 0 })
  const [minElapsed, setMinElapsed] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [gone, setGone] = useState(false)
  const ready = minElapsed && canvasReady && !load.active

  // Take over from the static HTML loader (index.html) without a visible change.
  useLayoutEffect(() => {
    document.querySelector('.boot-loader')?.remove()
  }, [])

  useEffect(() => {
    const minTimer = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS)
    // Never trap the visitor behind the loader if WebGL fails to start.
    const fallback = window.setTimeout(() => setCanvasReady(true), MAX_WAIT_MS)
    const onReady = () => {
      performance.mark('buildroots:experience-ready-received')
      setCanvasReady(true)
    }
    const onProgress = (e: Event) => setLoad((e as CustomEvent<LoadProgress>).detail)

    window.addEventListener(EXPERIENCE_READY, onReady)
    window.addEventListener(LOAD_PROGRESS, onProgress)
    return () => {
      window.clearTimeout(minTimer)
      window.clearTimeout(fallback)
      window.removeEventListener(EXPERIENCE_READY, onReady)
      window.removeEventListener(LOAD_PROGRESS, onProgress)
    }
  }, [])

  useGSAP(
    () => {
      if (!ready) return
      gsap.to(root.current, {
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          performance.mark('buildroots:loader-hidden')
          setGone(true)
        },
      })
    },
    { dependencies: [ready], scope: root },
  )

  if (gone) return null

  const percent = ready ? 100 : Math.round(load.progress)

  return (
    <div ref={root} className="loader" role="status" aria-live="polite">
      <span className="loader__name">{brand.name}</span>
      <span className="loader__value t-caption t-numeral">{percent}%</span>
      <span className="visually-hidden">Loading</span>
    </div>
  )
}
