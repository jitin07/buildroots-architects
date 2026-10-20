import { MeshReflectorMaterial } from '@react-three/drei'
import { HOUSE } from '../config'
import { useArchMaterials } from '../materials/useArchMaterials'
import { useQuality } from '../quality'
import Block from '../house/Block'

const { pool } = HOUSE
const COPING = 0.35

/** Raised reflecting pool with limestone coping and a true planar reflection. */
export default function ReflectingPool() {
  const m = useArchMaterials()
  const { reflectionResolution, tier } = useQuality()
  const w = pool.maxX - pool.minX
  const d = pool.maxZ - pool.minZ

  return (
    <group>
      <Block min={[pool.minX - COPING, 0, pool.minZ - COPING]} max={[pool.maxX + COPING, pool.coping, pool.minZ]} material={m.paver} />
      <Block min={[pool.minX - COPING, 0, pool.maxZ]} max={[pool.maxX + COPING, pool.coping, pool.maxZ + COPING]} material={m.paver} />
      <Block min={[pool.minX - COPING, 0, pool.minZ]} max={[pool.minX, pool.coping, pool.maxZ]} material={m.paver} />
      <Block min={[pool.maxX, 0, pool.minZ]} max={[pool.maxX + COPING, pool.coping, pool.maxZ]} material={m.paver} />

      <mesh rotation-x={-Math.PI / 2} position={[(pool.minX + pool.maxX) / 2, pool.water, (pool.minZ + pool.maxZ) / 2]}>
        <planeGeometry args={[w, d]} />
        {tier === 'low' ? (
          // Low tier: a glossy dark surface reflecting the environment map, instead of
          // re-rendering the whole scene every frame for a true planar reflection.
          <meshStandardMaterial color="#0a1013" roughness={0.05} metalness={0} envMapIntensity={1.2} />
        ) : (
          <MeshReflectorMaterial
            key={reflectionResolution}
            resolution={reflectionResolution}
            // drei multiplies the reflection into the albedo, so the base colour must
            // stay neutral and the env-map glare off for the true reflection to read.
            mirror={1}
            mixStrength={20}
            mixBlur={0.4}
            blur={[40, 10]}
            mixContrast={1}
            depthScale={0}
            color="#3a4046"
            metalness={0}
            roughness={0.9}
            envMapIntensity={0}
          />
        )}
      </mesh>
    </group>
  )
}
