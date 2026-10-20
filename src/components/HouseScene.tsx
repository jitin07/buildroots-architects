import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import CameraRig from '../scenes/CameraRig'
import HouseModel from '../scenes/HouseModel'
import Lighting from '../scenes/environment/Lighting'
import PostFX from '../scenes/environment/PostFX'
import Garden from '../scenes/site/Garden'
import ReflectingPool from '../scenes/site/ReflectingPool'
import { EXPERIENCE_READY } from '../lib/loading'

/** Scene composition: environment, site, house, camera and post-processing. */
export default function HouseScene() {
  return (
    <>
      <Lighting />
      <Garden />
      <ReflectingPool />
      <HouseModel />
      <CameraRig />
      <PostFX />
      <SceneReady />
    </>
  )
}

/**
 * Pre-compiles every shader, then waits two rendered frames before telling
 * the loading screen the scene is ready, so the reveal never shows a hitch.
 */
function SceneReady() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    // Dev-only handle for inspecting the scene from the browser console.
    if (import.meta.env.DEV) Object.assign(window, { __buildroots: { gl, scene, camera } })
    const mounted = performance.now()
    let cancelled = false
    let raf = 0
    gl.compileAsync(scene, camera).finally(() => {
      if (cancelled) return
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          if (import.meta.env.DEV) {
            const now = performance.now()
            console.info(`[scene] mounted at ${mounted.toFixed(0)}ms, ready at ${now.toFixed(0)}ms`)
          }
          performance.mark('buildroots:scene-ready')
          window.dispatchEvent(new Event(EXPERIENCE_READY))
        })
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [gl, scene, camera])

  return null
}
