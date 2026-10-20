import { HOUSE } from '../config'
import { useArchMaterials } from '../materials/useArchMaterials'
import Block from './Block'

const { ground, stoneCore } = HOUSE
const gf = ground.floor
/** Interior face of the rear wall's plaster lining. */
const REAR = ground.minZ + 0.32

/**
 * Ground-floor furnishing seen at close range in the interior shots. Simple
 * massing, but proportioned to real furniture (seat 0.42 m, table 0.75 m,
 * island 0.92 m) so the rooms read at the correct scale.
 */
export default function Furniture() {
  const m = useArchMaterials()

  return (
    <group>
      {/* ── Living: stone hearth wall with a linear fire ── */}
      <Block min={[stoneCore.maxX, gf + 0.45, -2.6]} max={[stoneCore.maxX + 0.04, gf + 0.8, 0.4]} material={m.fire} castShadow={false} />
      <Block min={[stoneCore.maxX, gf, -2.9]} max={[stoneCore.maxX + 0.45, gf + 0.38, 0.7]} material={m.paver} />
      <pointLight position={[-7.6, gf + 0.8, -1.1]} color="#ff9a52" intensity={6} distance={6} decay={2} />

      {/* Rug, sofa, coffee table, armchairs */}
      <Block min={[-7.4, gf, -3.95]} max={[-1.9, gf + 0.025, -0.15]} material={m.rug} castShadow={false} />
      <Block min={[-6.6, gf, -3.75]} max={[-2.6, gf + 0.42, -2.75]} material={m.upholstery} />
      <Block min={[-6.6, gf, -3.95]} max={[-2.6, gf + 0.8, -3.6]} material={m.upholstery} />
      <Block min={[-6.85, gf, -3.95]} max={[-6.6, gf + 0.6, -2.75]} material={m.upholstery} />
      <Block min={[-2.6, gf, -3.95]} max={[-2.35, gf + 0.6, -2.75]} material={m.upholstery} />
      <Block min={[-5.3, gf, -2.1]} max={[-3.9, gf + 0.34, -1.2]} material={m.walnut} />
      <mesh position={[-4.3, gf + 0.42, -1.6]} material={m.ceramic} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.16, 20]} />
      </mesh>
      {[-6.0, -3.2].map((x) => (
        <group key={x}>
          <Block min={[x - 0.42, gf, -0.95]} max={[x + 0.42, gf + 0.4, -0.2]} material={m.linen} />
          <Block min={[x - 0.42, gf, -0.35]} max={[x + 0.42, gf + 0.78, -0.15]} material={m.linen} />
        </group>
      ))}

      {/* Floor lamp beside the sofa */}
      <Block min={[-2.05, gf, -3.6]} max={[-2.01, gf + 1.55, -3.56]} material={m.frame} />
      <mesh position={[-2.03, gf + 1.62, -3.58]} material={m.lamp}>
        <sphereGeometry args={[0.14, 20, 16]} />
      </mesh>

      {/* Artwork on the rear wall above the sofa */}
      <Block min={[-5.7, gf + 1.25, REAR]} max={[-3.5, gf + 2.45, REAR + 0.04]} material={m.walnut} />
      <Block min={[-5.62, gf + 1.33, REAR + 0.04]} max={[-3.58, gf + 2.37, REAR + 0.05]} material={m.artwork} />

      {/* ── Dining: oak table, six chairs, pendant trio ── */}
      <Block min={[-0.6, gf + 0.71, -1.65]} max={[2.6, gf + 0.75, -0.55]} material={m.walnut} />
      <Block min={[-0.35, gf, -1.35]} max={[-0.25, gf + 0.71, -0.85]} material={m.walnut} />
      <Block min={[2.25, gf, -1.35]} max={[2.35, gf + 0.71, -0.85]} material={m.walnut} />
      {[0.0, 1.0, 2.0].flatMap((x) => [
        <DiningChair key={`n${x}`} x={x} z={-2.0} facing={1} />,
        <DiningChair key={`s${x}`} x={x} z={-0.2} facing={-1} />,
      ])}
      {[0.2, 1.0, 1.8].map((x) => (
        <group key={x}>
          <Block min={[x - 0.006, gf + 1.75, -1.106]} max={[x + 0.006, ground.ceiling - 0.04, -1.094]} material={m.frame} castShadow={false} />
          <mesh position={[x, gf + 1.7, -1.1]} material={m.lamp}>
            <sphereGeometry args={[0.13, 24, 18]} />
          </mesh>
        </group>
      ))}

      {/* ── Kitchen: island and full-height joinery on the east wall ── */}
      <Block min={[3.4, gf, -2.8]} max={[6.0, gf + 0.88, -1.8]} material={m.walnut} />
      <Block min={[3.35, gf + 0.88, -2.85]} max={[6.05, gf + 0.92, -1.75]} material={m.ceramic} />
      <Block min={[6.1, gf, -4.28]} max={[6.7, gf + 2.5, -1.0]} material={m.walnut} />

      {/* Potted olive in the corner beside the hearth */}
      <Block min={[-8.0, gf, 1.9]} max={[-7.5, gf + 0.5, 2.4]} material={m.ceramic} />
      {[
        [-7.75, 1.3, 2.15, 0.4],
        [-7.55, 1.6, 2.05, 0.3],
        [-7.9, 1.65, 2.25, 0.28],
      ].map(([x, y, z, r]) => (
        <mesh key={`${x}${y}`} position={[x, gf + y, z]} material={m.foliage} castShadow>
          <icosahedronGeometry args={[r, 3]} />
        </mesh>
      ))}
      <Block min={[-7.77, gf + 0.5, 2.13]} max={[-7.73, gf + 1.1, 2.17]} material={m.bark} />
    </group>
  )
}

function DiningChair({ x, z, facing }: { x: number; z: number; facing: 1 | -1 }) {
  const m = useArchMaterials()
  // Back rest sits on the side away from the table.
  const backZ = facing === 1 ? z - 0.22 : z + 0.18
  return (
    <group>
      <Block min={[x - 0.22, gf, z - 0.22]} max={[x + 0.22, gf + 0.45, z + 0.22]} material={m.linen} />
      <Block min={[x - 0.22, gf, backZ]} max={[x + 0.22, gf + 0.85, backZ + 0.04]} material={m.walnut} />
    </group>
  )
}
