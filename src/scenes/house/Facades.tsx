import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, type Group, type InstancedMesh } from 'three'
import { journeyState } from '../camera/journey'
import { HOUSE } from '../config'
import { worldBox } from '../materials/geometry'
import { useArchMaterials } from '../materials/useArchMaterials'
import Block from './Block'
import Glazing from './Glazing'

const { ground, upper, entry, midSlab } = HOUSE

const FIN = { width: 0.07, depth: 0.28, spacing: 0.32 }

/** Glazed facades, the timber fin screen and the pivot entry door. */
export default function Facades() {
  const m = useArchMaterials()

  return (
    <group>
      {/* Ground floor: full-height glazing across the garden front, either side of the door */}
      <Glazing axis="z" at={ground.maxZ} from={ground.minX} to={entry.doorMinX} bottom={ground.floor} top={ground.ceiling} bay={2.6} />
      <Glazing axis="z" at={ground.maxZ} from={entry.doorMaxX} to={ground.maxX - 0.3} bottom={ground.floor} top={ground.ceiling} bay={0.6} />
      {/* Ground floor east return: glazing to the front corner */}
      <Glazing axis="x" at={ground.maxX - 0.15} from={-0.6} to={ground.maxZ} bottom={ground.floor} top={ground.ceiling} bay={2} />

      <PivotDoor />

      {/* Upper floor: glazing set back behind the fin screen */}
      <Glazing axis="z" at={upper.maxZ - 0.5} from={upper.minX + 1.4} to={upper.maxX - 0.2} bottom={upper.floor} top={upper.ceiling} bay={3} />
      {/* Cantilever end: a single framed picture window over the garden */}
      <Glazing axis="x" at={upper.maxX - 0.1} from={upper.minZ + 0.3} to={upper.maxZ - 0.5} bottom={upper.floor} top={upper.ceiling} bay={2.6} />
      <Block min={[upper.maxX - 0.3, upper.floor, upper.maxZ - 0.5]} max={[midSlab.maxX, upper.ceiling, upper.maxZ]} material={m.concrete} />

      <FinScreen />
    </group>
  )
}

/** Vertical timber fins across the upper front, as one instanced draw call. */
function FinScreen() {
  const m = useArchMaterials()
  const from = upper.minX + 1.6
  const to = upper.maxX - 0.4
  const count = Math.floor((to - from) / FIN.spacing) + 1
  const height = upper.ceiling - upper.floor
  const z = upper.maxZ - FIN.depth / 2

  const ref = useMemo(() => {
    const dummy = new Object3D()
    return (mesh: InstancedMesh | null) => {
      if (!mesh) return
      for (let i = 0; i < count; i++) {
        dummy.position.set(from + i * FIN.spacing, upper.floor + height / 2, z)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [count, from, height, z])

  return (
    <instancedMesh
      ref={ref}
      args={[worldBox(FIN.width, height, FIN.depth), m.timber, count]}
      castShadow
      receiveShadow
    />
  )
}

const DOOR = { pivotOffset: 0.4, thickness: 0.1, maxAngle: Math.PI * 0.48 }

/**
 * Full-height timber pivot door. The pivot sits 0.4 m in from the west jamb,
 * so the long leaf swings outward under the canopy and leaves a 1.35 m clear
 * opening on the east side for the camera to pass through. Opening is driven
 * by the scroll journey (journeyState.door).
 */
function PivotDoor() {
  const m = useArchMaterials()
  const leaf = useRef<Group>(null)
  const width = entry.doorMaxX - entry.doorMinX
  const height = ground.ceiling - 0.05 - ground.floor
  const z = ground.maxZ - DOOR.thickness / 2 + 0.02

  useFrame(() => {
    if (leaf.current) leaf.current.rotation.y = -journeyState.door * DOOR.maxAngle
  })

  return (
    <group ref={leaf} position={[entry.doorMinX + DOOR.pivotOffset, ground.floor, z]}>
      <Block min={[-DOOR.pivotOffset, 0, -DOOR.thickness / 2]} max={[width - DOOR.pivotOffset, height, DOOR.thickness / 2]} material={m.timber} />
      {/* Full-height pull on both faces */}
      <Block min={[width - DOOR.pivotOffset - 0.32, 0.6, DOOR.thickness / 2]} max={[width - DOOR.pivotOffset - 0.28, 2.4, DOOR.thickness / 2 + 0.08]} material={m.frame} />
      <Block min={[width - DOOR.pivotOffset - 0.32, 0.6, -DOOR.thickness / 2 - 0.08]} max={[width - DOOR.pivotOffset - 0.28, 2.4, -DOOR.thickness / 2]} material={m.frame} />
    </group>
  )
}
