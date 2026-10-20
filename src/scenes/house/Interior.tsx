import { HOUSE } from '../config'
import { useArchMaterials } from '../materials/useArchMaterials'
import Block from './Block'
import Furniture from './Furniture'

const { ground, upper, midSlab } = HOUSE

type Props = {
  /** Number of warm interior point lights per floor (fewer on low-end devices). */
  lightsPerFloor: number
}

/**
 * Warmly lit interiors visible through the glazing: floors, a ceiling light
 * cove, simple furniture massing and pendant lights. Kept deliberately
 * low-detail — it reads as inhabited from outside without costing much.
 */
export default function Interior({ lightsPerFloor }: Props) {
  const m = useArchMaterials()
  const gf = ground.floor
  const uf = upper.floor

  const gfLights = lightPositions(ground.minX + 1.5, ground.maxX - 1.5, lightsPerFloor)
  const ufLights = lightPositions(upper.minX + 2.5, upper.maxX - 1.5, lightsPerFloor)

  return (
    <group>
      {/* Floors and ceilings */}
      <Block min={[ground.minX, gf, ground.minZ]} max={[ground.maxX, gf + 0.02, ground.maxZ]} material={m.interiorFloor} castShadow={false} />
      <Block min={[upper.minX, uf, upper.minZ]} max={[upper.maxX, uf + 0.02, upper.maxZ - 0.5]} material={m.interiorFloor} castShadow={false} />
      <Block min={[ground.minX, ground.ceiling - 0.04, ground.minZ]} max={[ground.maxX, ground.ceiling, ground.maxZ]} material={m.interiorWall} castShadow={false} />
      <Block min={[upper.minX, upper.ceiling - 0.04, upper.minZ]} max={[upper.maxX, upper.ceiling, upper.maxZ]} material={m.interiorWall} castShadow={false} />

      {/* Rear walls inside (warm plaster) */}
      <Block min={[ground.minX, gf, ground.minZ + 0.3]} max={[ground.maxX - 0.3, ground.ceiling, ground.minZ + 0.32]} material={m.interiorWall} castShadow={false} />
      <Block min={[upper.minX, uf, upper.minZ + 0.3]} max={[upper.maxX, upper.ceiling, upper.minZ + 0.32]} material={m.interiorWall} castShadow={false} />

      {/* Linear light coves */}
      <Block min={[ground.minX + 0.6, ground.ceiling - 0.06, ground.minZ + 0.6]} max={[ground.maxX - 0.6, ground.ceiling - 0.04, ground.minZ + 1.2]} material={m.ceilingGlow} castShadow={false} />
      <Block min={[upper.minX + 1.8, upper.ceiling - 0.06, upper.minZ + 0.6]} max={[upper.maxX - 0.6, upper.ceiling - 0.04, upper.minZ + 1.2]} material={m.ceilingGlow} castShadow={false} />

      <Furniture />

      {/* Upper floor: bed and a reading lamp */}
      <Block min={[5.5, uf, -3.8]} max={[8.0, uf + 0.5, -1.6]} material={m.upholstery} />
      <Block min={[5.3, uf, -4.0]} max={[8.2, uf + 1.1, -3.8]} material={m.walnut} />
      <mesh position={[9.2, uf + 1.3, -3.4]} material={m.lamp}>
        <sphereGeometry args={[0.1, 16, 12]} />
      </mesh>

      {/* Downlights in the canopy soffit along the terrace */}
      {canopyDownlights().map((x) => (
        <mesh key={x} position={[x, midSlab.bottom - 0.005, midSlab.maxZ - 0.6]} rotation-x={Math.PI / 2} material={m.lamp}>
          <circleGeometry args={[0.06, 16]} />
        </mesh>
      ))}

      {/* Warm interior light spill */}
      {gfLights.map((x) => (
        <pointLight key={`g${x}`} position={[x, ground.ceiling - 0.5, -1]} color="#ffbd7f" intensity={70} distance={13} decay={2} />
      ))}
      {ufLights.map((x) => (
        <pointLight key={`u${x}`} position={[x, upper.ceiling - 0.5, -1]} color="#ffbd7f" intensity={60} distance={12} decay={2} />
      ))}
      {/* Light pooling on the terrace under the canopy */}
      <pointLight position={[-3, midSlab.bottom - 0.3, ground.maxZ + 0.7]} color="#ffcf9a" intensity={5} distance={7} decay={2} />
      <pointLight position={[9, midSlab.bottom - 0.3, 2]} color="#ffcf9a" intensity={5} distance={7} decay={2} />
    </group>
  )
}

function lightPositions(from: number, to: number, count: number) {
  if (count <= 1) return [(from + to) / 2]
  return Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1))
}

function canopyDownlights() {
  const xs: number[] = []
  for (let x = HOUSE.midSlab.minX + 1; x <= HOUSE.midSlab.maxX - 1; x += 2.2) xs.push(x)
  return xs
}
