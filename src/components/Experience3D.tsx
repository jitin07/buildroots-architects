import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { emitLoadProgress } from '../lib/loading'
import { SCENE_COVERED, storyState } from '../lib/storyState'
import { setRenderInvalidator } from '../lib/renderLoop'
import { QUALITY, QualityContext, initialTier, lowerTier, type Tier } from '../scenes/quality'
import { JOURNEY_KEYS } from '../scenes/camera/journey'
import QualityGovernor from '../scenes/QualityGovernor'
import HouseScene from './HouseScene'

/** Fixed full-screen WebGL layer that lives behind the whole page. */
export default function Experience3D({ onContextLost }: { onContextLost?: () => void }) {
  const [tier, setTier] = useState<Tier>(initialTier)
  const quality = QUALITY[tier]

  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        dpr={quality.dpr}
        // Render only when something changes (see lib/renderLoop.ts).
        frameloop="demand"
        camera={{ fov: JOURNEY_KEYS[0].fov, near: 0.15, far: 600, position: [...JOURNEY_KEYS[0].position] }}
        gl={{
          antialias: !quality.postprocessing,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: SRGBColorSpace,
        }}
        // three r18x removed PCFSoftShadowMap, which R3F's `shadows` default requests.
        shadows="percentage"
        onCreated={({ gl }) => {
          // A lost GPU context (driver reset, memory pressure on mobile) falls back to the still image.
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            onContextLost?.()
          })
        }}
      >
        <QualityContext.Provider value={quality}>
          {/* Step quality down if the device can't hold a steady frame rate while animating. */}
          <QualityGovernor onDecline={() => setTier((t) => lowerTier(t))} />
          <PauseWhenCovered />
          <Suspense fallback={null}>
            <HouseScene />
          </Suspense>
        </QualityContext.Provider>
      </Canvas>
      <LoadProgressReporter />
    </div>
  )
}

/** Forwards three.js asset loading progress to the (non-3D) loading screen. */
function LoadProgressReporter() {
  const { active, progress } = useProgress()
  useEffect(() => emitLoadProgress({ active, progress }), [active, progress])
  return null
}

/** Stops rendering entirely while the showreel covers the scene; renders on demand otherwise. */
function PauseWhenCovered() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    setRenderInvalidator(invalidate)
    return () => setRenderInvalidator(null)
  }, [invalidate])
  useEffect(() => {
    const apply = (covered: boolean) => {
      setFrameloop(covered ? 'never' : 'demand')
      if (!covered) invalidate()
    }
    apply(storyState.sceneCovered)
    const onChange = (e: Event) => apply((e as CustomEvent<boolean>).detail)
    window.addEventListener(SCENE_COVERED, onChange)
    return () => window.removeEventListener(SCENE_COVERED, onChange)
  }, [setFrameloop, invalidate])
  return null
}
