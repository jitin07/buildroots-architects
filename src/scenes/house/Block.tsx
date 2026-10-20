import type { Material } from 'three'
import { worldBox } from '../materials/geometry'

export type Vec3 = readonly [number, number, number]

type Props = {
  /** Minimum corner (x, y, z) in metres. */
  min: Vec3
  /** Maximum corner (x, y, z) in metres. */
  max: Vec3
  material: Material
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * The basic architectural primitive: an axis-aligned box defined by its
 * extents, with world-scaled UVs so textures keep real-world size.
 */
export default function Block({ min, max, material, castShadow = true, receiveShadow = true }: Props) {
  const w = max[0] - min[0]
  const h = max[1] - min[1]
  const d = max[2] - min[2]
  return (
    <mesh
      geometry={worldBox(w, h, d)}
      material={material}
      position={[(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}
