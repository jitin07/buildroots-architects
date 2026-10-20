import { BoxGeometry } from 'three'

const cache = new Map<string, BoxGeometry>()

/**
 * A box whose UVs are measured in metres instead of 0–1 per face, so a
 * texture with `repeat = 1 / tileSize` keeps the same real-world scale on
 * every face of every box. Geometries are cached by dimension.
 */
export function worldBox(w: number, h: number, d: number): BoxGeometry {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`
  let geo = cache.get(key)
  if (geo) return geo

  geo = new BoxGeometry(w, h, d)
  const uv = geo.attributes.uv
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z; 4 vertices each.
  const faceSize: Array<[number, number]> = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ]
  for (let face = 0; face < 6; face++) {
    const [su, sv] = faceSize[face]
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v
      uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    }
  }
  uv.needsUpdate = true
  cache.set(key, geo)
  return geo
}

/** Converts a min/max extent pair into the box size and centre used by <mesh>. */
export function span(min: number, max: number): [size: number, centre: number] {
  return [max - min, (min + max) / 2]
}
