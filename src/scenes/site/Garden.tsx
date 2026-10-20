import { useMemo } from 'react'
import { BufferGeometry, Color, IcosahedronGeometry, MeshStandardMaterial, Object3D, Vector3, type InstancedMesh } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { worldBox } from '../materials/geometry'
import { useArchMaterials } from '../materials/useArchMaterials'

/**
 * Lawn, stepping-stone path, trees and shrub planting. All repeated elements
 * are instanced: the whole garden is a handful of draw calls.
 */
export default function Garden() {
  const m = useArchMaterials()

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow material={m.lawn}>
        <circleGeometry args={[140, 64]} />
      </mesh>
      <SteppingPath />
      <Trees />
    </group>
  )
}

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Large-format stepping stones curving from the garden up to the entry steps. */
function SteppingPath() {
  const m = useArchMaterials()
  const stones = useMemo(() => {
    // Quadratic curve: entry steps → bend → foreground garden.
    const p0 = [6.4, 9.3]
    const p1 = [7, 15.5]
    const p2 = [17, 22.5]
    const out: Array<{ x: number; z: number; angle: number }> = []
    const count = 16
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const a = (1 - t) * (1 - t)
      const b = 2 * (1 - t) * t
      const c = t * t
      const x = a * p0[0] + b * p1[0] + c * p2[0]
      const z = a * p0[1] + b * p1[1] + c * p2[1]
      const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
      const dz = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
      out.push({ x, z, angle: Math.atan2(dx, dz) })
    }
    return out
  }, [])

  const ref = useMemo(() => {
    const dummy = new Object3D()
    return (mesh: InstancedMesh | null) => {
      if (!mesh) return
      stones.forEach((s, i) => {
        dummy.position.set(s.x, 0.025, s.z)
        dummy.rotation.set(0, s.angle, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [stones])

  // Low bollard lights beside every third stone, alternating sides of the path.
  const bollards = useMemo(
    () =>
      stones
        .filter((_, i) => i % 3 === 1)
        .map((st, i) => {
          const side = i % 2 === 0 ? 1.15 : -1.15
          return { x: st.x + Math.cos(st.angle) * side, z: st.z - Math.sin(st.angle) * side }
        }),
    [stones],
  )

  const placeAt = useMemo(
    () => (y: number) => {
      const dummy = new Object3D()
      return (mesh: InstancedMesh | null) => {
        if (!mesh) return
        bollards.forEach((b, i) => {
          dummy.position.set(b.x, y, b.z)
          dummy.updateMatrix()
          mesh.setMatrixAt(i, dummy.matrix)
        })
        mesh.instanceMatrix.needsUpdate = true
        mesh.computeBoundingSphere()
      }
    },
    [bollards],
  )

  return (
    <group>
      <instancedMesh ref={ref} args={[worldBox(1.5, 0.06, 0.62), m.paver, stones.length]} receiveShadow />
      <instancedMesh ref={placeAt(0.28)} args={[worldBox(0.12, 0.56, 0.12), m.frame, bollards.length]} castShadow />
      <instancedMesh ref={placeAt(0.5)} args={[worldBox(0.125, 0.06, 0.125), m.lamp, bollards.length]} />
    </group>
  )
}

type TreeSpec = { x: number; z: number; height: number; spread: number; shape: 'round' | 'columnar' }

const TREES: TreeSpec[] = [
  // Feature tree framing the left of the composition
  { x: -17, z: 10, height: 7.5, spread: 4.2, shape: 'round' },
  // Canopy behind the house so the roofline reads against foliage
  { x: -8, z: -12, height: 10, spread: 4.5, shape: 'round' },
  { x: 1, z: -13, height: 11, spread: 5, shape: 'round' },
  { x: 10, z: -11, height: 9.5, spread: 4.2, shape: 'round' },
  { x: 17, z: -6, height: 8, spread: 3.8, shape: 'round' },
  { x: -15, z: -6, height: 9, spread: 4, shape: 'round' },
  // Right side and foreground framing
  { x: 19, z: 5, height: 6.5, spread: 3, shape: 'round' },
  { x: 27, z: 14, height: 8, spread: 3.8, shape: 'round' },
  // Columnar trees along the stone garden wall
  { x: -12.4, z: 13.8, height: 6.5, spread: 1.1, shape: 'columnar' },
  { x: -12.4, z: 16.6, height: 7, spread: 1.1, shape: 'columnar' },
  { x: -12.4, z: 19.4, height: 6.2, spread: 1.1, shape: 'columnar' },
]

/** Procedural deciduous and columnar trees, a distant tree line, and shrub planting. */
function Trees() {
  const m = useArchMaterials()

  const { trunks, clumps, foliageMaterial, clumpGeometry } = useMemo(() => {
    const rand = seeded(7)
    const trunkList: Array<{ x: number; z: number; h: number; r: number }> = []
    const clumpList: Array<{ x: number; y: number; z: number; s: number; tint: number }> = []

    for (const t of TREES) {
      if (t.shape === 'round') {
        const trunkH = t.height * 0.45
        trunkList.push({ x: t.x, z: t.z, h: trunkH, r: 0.12 + t.spread * 0.03 })
        const crownY = trunkH + (t.height - trunkH) * 0.5
        const n = 46
        for (let i = 0; i < n; i++) {
          // Points in a slightly flattened ellipsoid, biased toward the surface.
          const u = rand() * Math.PI * 2
          const v = Math.acos(2 * rand() - 1)
          const r = 0.55 + 0.45 * Math.cbrt(rand())
          const ry = (t.height - trunkH) * 0.5
          clumpList.push({
            x: t.x + Math.sin(v) * Math.cos(u) * t.spread * 0.8 * r,
            y: crownY + Math.cos(v) * ry * 0.85 * r,
            z: t.z + Math.sin(v) * Math.sin(u) * t.spread * 0.8 * r,
            s: t.spread * (0.22 + rand() * 0.16),
            tint: rand(),
          })
        }
      } else {
        trunkList.push({ x: t.x, z: t.z, h: 0.8, r: 0.1 })
        const n = 18
        for (let i = 0; i < n; i++) {
          const y = 0.7 + (i / n) * (t.height - 0.9)
          const taper = Math.sin(((i + 1) / (n + 1)) * Math.PI) * 0.85 + 0.25
          clumpList.push({
            x: t.x + (rand() - 0.5) * 0.25,
            y,
            z: t.z + (rand() - 0.5) * 0.25,
            s: t.spread * 0.55 * taper,
            tint: rand() * 0.5,
          })
        }
      }
    }

    // Distant tree line behind and around the site, softened by fog.
    for (let i = 0; i < 70; i++) {
      const angle = Math.PI * 0.75 + rand() * Math.PI * 1.6
      const dist = 48 + rand() * 30
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist * 0.8 - 8
      const h = 7 + rand() * 9
      clumpList.push({ x, y: h * 0.6, z, s: 3.5 + rand() * 3.5, tint: 0.9 + rand() * 0.1 })
      clumpList.push({ x: x + 2, y: h * 0.35, z: z + 1, s: 3 + rand() * 2.5, tint: 0.9 + rand() * 0.1 })
    }

    // Low shrub planting at the terrace edges and around the feature tree.
    const shrubBeds: Array<[number, number, number, number]> = [
      [-12.6, -9.6, 7.5, 8.4],
      [8.8, 11.8, 7.5, 8.6],
      [12.2, 13.4, -6, 6.6],
      [-19, -15, 8, 12],
      [4.8, 8, 12.5, 13.5],
    ]
    for (const [x0, x1, z0, z1] of shrubBeds) {
      const count = Math.round(((x1 - x0) * (z1 - z0)) / 0.7)
      for (let i = 0; i < count; i++) {
        const s = 0.35 + rand() * 0.35
        clumpList.push({ x: x0 + rand() * (x1 - x0), y: s * 0.55, z: z0 + rand() * (z1 - z0), s, tint: 0.3 + rand() * 0.6 })
      }
    }

    return {
      trunks: trunkList,
      clumps: clumpList,
      clumpGeometry: lumpyBlob(),
      foliageMaterial: new MeshStandardMaterial({ color: '#ffffff', roughness: 0.92 }),
    }
  }, [])

  const clumpRef = useMemo(() => {
    const dummy = new Object3D()
    const light = new Color('#4d5d3a')
    const dark = new Color('#1f2a1a')
    const c = new Color()
    return (mesh: InstancedMesh | null) => {
      if (!mesh) return
      clumps.forEach((k, i) => {
        dummy.position.set(k.x, k.y, k.z)
        dummy.rotation.set(k.tint * 3, k.tint * 5, 0)
        dummy.scale.set(k.s, k.s * 0.85, k.s)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(i, c.copy(light).lerp(dark, k.tint))
      })
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [clumps])

  const trunkRef = useMemo(() => {
    const dummy = new Object3D()
    return (mesh: InstancedMesh | null) => {
      if (!mesh) return
      trunks.forEach((t, i) => {
        dummy.position.set(t.x, t.h / 2, t.z)
        dummy.scale.set(t.r, t.h, t.r)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [trunks])

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, m.bark, trunks.length]} castShadow>
        <cylinderGeometry args={[0.7, 1, 1, 8]} />
      </instancedMesh>
      <instancedMesh ref={clumpRef} args={[clumpGeometry, foliageMaterial, clumps.length]} castShadow receiveShadow />
    </group>
  )
}

/**
 * A foliage clump: a subdivided sphere with low-frequency lumps pushed in and
 * out, so canopies and shrubs read as leaf masses rather than geometric balls.
 */
function lumpyBlob(): BufferGeometry {
  const geo = mergeVertices(new IcosahedronGeometry(1, 3))
  const pos = geo.attributes.position
  const v = new Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n =
      Math.sin(v.x * 4.1 + 1.3) * Math.sin(v.y * 3.7 + 0.4) * Math.sin(v.z * 4.6 + 2.1) * 0.22 +
      Math.sin(v.x * 9.3) * Math.sin(v.y * 8.1 + 1) * Math.sin(v.z * 9.7) * 0.07
    v.multiplyScalar(1 + n)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}
