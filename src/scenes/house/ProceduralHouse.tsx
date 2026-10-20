import { useQuality } from '../quality'
import Facades from './Facades'
import Interior from './Interior'
import Structure from './Structure'

/**
 * The BuildRoots house assembled from reusable modules, sized from
 * HOUSE in scenes/config.ts.
 */
export default function ProceduralHouse() {
  const quality = useQuality()

  return (
    <group name="house">
      <Structure />
      <Facades />
      <Interior lightsPerFloor={quality.interiorLights} />
    </group>
  )
}
