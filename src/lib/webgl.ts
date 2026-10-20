/**
 * WebGL capability check, run before the 3D chunk is requested. In
 * development, `?no-webgl` forces the fallback so it can be tested.
 */
export function hasWebGL(): boolean {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('no-webgl')) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    // Release the probe context straight away.
    ;(gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
