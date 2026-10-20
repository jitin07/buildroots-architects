import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import fallbackImage from '../assets/media/hero-poster.webp'
import { EXPERIENCE_READY } from '../lib/loading'
import { hasWebGL } from '../lib/webgl'

// The WebGL bundle (three, R3F) loads as its own chunk so the page shell paints first.
const Experience3D = lazy(() => import('./Experience3D'))

/**
 * The 3D layer with graceful degradation. Without WebGL, if the 3D chunk
 * fails to download, if the renderer throws, or if the GPU context is lost,
 * the stage shows a still render of the house instead — the story's text,
 * frosted glass, aperture and showreel all keep working over it.
 */
export default function Scene() {
  const [failed, setFailed] = useState(() => !hasWebGL())

  if (failed) return <SceneFallback />
  return (
    <SceneErrorBoundary onError={() => setFailed(true)}>
      <Suspense fallback={null}>
        <Experience3D onContextLost={() => setFailed(true)} />
      </Suspense>
    </SceneErrorBoundary>
  )
}

function SceneFallback() {
  // Let the loading screen finish immediately rather than waiting for a canvas.
  useEffect(() => void window.dispatchEvent(new Event(EXPERIENCE_READY)), [])
  return (
    <div className="experience-canvas experience-fallback" aria-hidden="true">
      <img src={fallbackImage} alt="" width={1280} height={720} />
    </div>
  )
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[scene] 3D experience unavailable, showing still image instead.', error)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
