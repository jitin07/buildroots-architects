import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'

/**
 * Procedural surface textures drawn on 2D canvases at startup: no image
 * downloads, and each one tiles seamlessly at a known real-world size so
 * world-scaled UVs (see geometry.ts) keep texel density consistent.
 */

type Painter = (ctx: CanvasRenderingContext2D, size: number, rand: () => number) => void

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function makeTexture(size: number, seed: number, paint: Painter, color: boolean, anisotropy: number): Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  paint(ctx, size, seeded(seed))
  const tex = new CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = RepeatWrapping
  tex.anisotropy = anisotropy
  if (color) tex.colorSpace = SRGBColorSpace
  return tex
}

/** Draws soft value noise by layering blurred random blotches (tiles because blotches wrap). */
function blotches(ctx: CanvasRenderingContext2D, size: number, rand: () => number, count: number, radius: number, alpha: number, light: boolean) {
  for (let i = 0; i < count; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = radius * (0.4 + rand())
    const a = alpha * rand()
    const shade = light ? 255 : 0
    // Draw wrapped copies only where the blotch actually crosses an edge (keeps tiling, ~7× fewer draws).
    const offsets = (p: number) => [-size, 0, size].filter((o) => p + o + r > 0 && p + o - r < size)
    for (const dx of offsets(x)) {
      for (const dy of offsets(y)) {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r)
        g.addColorStop(0, `rgba(${shade},${shade},${shade},${a})`)
        g.addColorStop(1, `rgba(${shade},${shade},${shade},0)`)
        ctx.fillStyle = g
        ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2)
      }
    }
  }
}

function grain(ctx: CanvasRenderingContext2D, size: number, rand: () => number, amount: number) {
  const img = ctx.getImageData(0, 0, size, size)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * amount
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
}

export type SurfaceTextures = {
  /** Size in metres that one texture repeat covers. */
  tileSize: number
  map?: Texture
  roughnessMap?: Texture
  bumpMap?: Texture
}

/** Board-formed-free smooth architectural concrete: subtle mottling and pores. 4 m tile. */
export function concreteTextures(anisotropy: number): SurfaceTextures {
  const map = makeTexture(1024, 11, (ctx, s, r) => {
    ctx.fillStyle = '#d8d6d1'
    ctx.fillRect(0, 0, s, s)
    blotches(ctx, s, r, 160, s * 0.12, 0.05, false)
    blotches(ctx, s, r, 120, s * 0.08, 0.06, true)
    grain(ctx, s, r, 10)
  }, true, anisotropy)
  const roughnessMap = makeTexture(512, 12, (ctx, s, r) => {
    ctx.fillStyle = '#d0d0d0'
    ctx.fillRect(0, 0, s, s)
    blotches(ctx, s, r, 120, s * 0.1, 0.18, false)
    grain(ctx, s, r, 24)
  }, false, anisotropy)
  return { tileSize: 4, map, roughnessMap, bumpMap: roughnessMap }
}

/** Coursed natural stone: irregular course heights, random block lengths, mixed warm/grey tones. 3.2 m tile. */
export function stoneTextures(anisotropy: number): SurfaceTextures {
  const paintBlocks = (ctx: CanvasRenderingContext2D, s: number, r: () => number, forBump: boolean) => {
    ctx.fillStyle = forBump ? '#1a1a1a' : '#3a3631'
    ctx.fillRect(0, 0, s, s)
    // Course heights vary between ~0.25 m and ~0.55 m and sum to the tile height.
    const weights = Array.from({ length: 8 }, () => 0.6 + r() * 0.9)
    const total = weights.reduce((a, b) => a + b, 0)
    const joint = Math.max(3, s / 300)
    let y = 0
    for (const wgt of weights) {
      const rowH = (wgt / total) * s
      let x = -r() * s * 0.3
      while (x < s) {
        const w = rowH * (1.4 + r() * 2.6)
        if (forBump) {
          const tone = 140 + r() * 90
          ctx.fillStyle = `rgb(${tone},${tone},${tone})`
        } else {
          const base = 0.78 + r() * 0.34
          const warmth = r()
          // Blend between a warm sandstone and a cool limestone grey.
          const red = 168 * warmth + 142 * (1 - warmth)
          const green = 150 * warmth + 140 * (1 - warmth)
          const blue = 122 * warmth + 134 * (1 - warmth)
          ctx.fillStyle = `rgb(${red * base},${green * base},${blue * base})`
        }
        for (const off of [0, -s]) ctx.fillRect(x + off + joint / 2, y + joint / 2, w - joint, rowH - joint)
        x += w
      }
      y += rowH
    }
    if (!forBump) {
      blotches(ctx, s, r, 260, s * 0.025, 0.14, false)
      blotches(ctx, s, r, 160, s * 0.02, 0.1, true)
    }
    grain(ctx, s, r, forBump ? 50 : 22)
  }
  const map = makeTexture(1024, 21, (c, s, r) => paintBlocks(c, s, r, false), true, anisotropy)
  const bumpMap = makeTexture(1024, 21, (c, s, r) => paintBlocks(c, s, r, true), false, anisotropy)
  return { tileSize: 3.2, map, bumpMap, roughnessMap: bumpMap }
}

/** Vertical-grain timber (stained oak / cedar). 1.2 m tile, grain runs along V. */
export function timberTextures(anisotropy: number): SurfaceTextures {
  const map = makeTexture(512, 31, (ctx, s, r) => {
    ctx.fillStyle = '#7a4a2c'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 260; i++) {
      const x = r() * s
      const w = 0.5 + r() * 2.5
      const light = r() > 0.5
      ctx.fillStyle = light ? `rgba(196,140,92,${0.08 + r() * 0.18})` : `rgba(40,20,10,${0.1 + r() * 0.25})`
      ctx.beginPath()
      ctx.moveTo(x, 0)
      // Gentle sinuous grain that starts and ends at the same x so it tiles.
      const amp = r() * 6
      const phase = r() * Math.PI * 2
      for (let y = 0; y <= s; y += 8) {
        ctx.lineTo(x + Math.sin((y / s) * Math.PI * 2 + phase) * amp, y)
      }
      ctx.lineTo(x + w, s)
      ctx.lineTo(x + w, 0)
      ctx.fill()
    }
    grain(ctx, s, r, 12)
  }, true, anisotropy)
  const roughnessMap = makeTexture(256, 32, (ctx, s, r) => {
    ctx.fillStyle = '#9a9a9a'
    ctx.fillRect(0, 0, s, s)
    grain(ctx, s, r, 50)
  }, false, anisotropy)
  return { tileSize: 1.2, map, roughnessMap }
}

/** Large-format limestone pavers with fine joints. 2.4 m tile (4 × 2 pavers). */
export function paverTextures(anisotropy: number): SurfaceTextures {
  const paint = (forBump: boolean) => (ctx: CanvasRenderingContext2D, s: number, r: () => number) => {
    ctx.fillStyle = forBump ? '#303030' : '#6f6a62'
    ctx.fillRect(0, 0, s, s)
    const cols = 2
    const rows = 4
    const j = Math.max(2, s / 400)
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        const t = 0.92 + r() * 0.12
        ctx.fillStyle = forBump ? '#c8c8c8' : `rgb(${190 * t},${183 * t},${170 * t})`
        ctx.fillRect((cx * s) / cols + j, (cy * s) / rows + j, s / cols - j * 2, s / rows - j * 2)
      }
    }
    if (!forBump) blotches(ctx, s, r, 140, s * 0.05, 0.07, false)
    grain(ctx, s, r, forBump ? 20 : 10)
  }
  const map = makeTexture(1024, 41, paint(false), true, anisotropy)
  const bumpMap = makeTexture(512, 41, paint(true), false, anisotropy)
  return { tileSize: 2.4, map, bumpMap }
}

/** Mown lawn: mottled greens. 6 m tile. */
export function lawnTextures(anisotropy: number): SurfaceTextures {
  const map = makeTexture(512, 51, (ctx, s, r) => {
    ctx.fillStyle = '#34502a'
    ctx.fillRect(0, 0, s, s)
    blotches(ctx, s, r, 220, s * 0.08, 0.12, false)
    blotches(ctx, s, r, 160, s * 0.06, 0.08, true)
    grain(ctx, s, r, 26)
  }, true, anisotropy)
  return { tileSize: 6, map }
}
