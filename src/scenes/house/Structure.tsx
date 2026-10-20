import { HOUSE } from '../config'
import { useArchMaterials } from '../materials/useArchMaterials'
import Block from './Block'

const { plinth, ground, midSlab, upper, roof, stoneCore } = HOUSE

/**
 * Primary structure: stone terrace plinth, the cantilevered concrete slabs,
 * the opaque concrete walls of both floors and the natural-stone core.
 */
export default function Structure() {
  const m = useArchMaterials()
  const wall = 0.3

  return (
    <group>
      {/* Terrace plinth with entry steps down to the garden path */}
      <Block min={[plinth.minX, 0, plinth.minZ]} max={[plinth.maxX, plinth.top, plinth.maxZ]} material={m.paver} />
      <Block min={[4.4, 0, plinth.maxZ]} max={[8.4, 0.3, plinth.maxZ + 0.45]} material={m.paver} />
      <Block min={[4.4, 0, plinth.maxZ + 0.45]} max={[8.4, 0.15, plinth.maxZ + 0.9]} material={m.paver} />

      {/* Ground floor: rear wall and the solid east wall behind the entry */}
      <Block min={[ground.minX, ground.floor, ground.minZ]} max={[ground.maxX, ground.ceiling, ground.minZ + wall]} material={m.concrete} />
      <Block min={[ground.maxX - wall, ground.floor, ground.minZ]} max={[ground.maxX, ground.ceiling, -0.6]} material={m.concrete} />
      <Block min={[ground.minX, ground.floor, stoneCore.maxZ]} max={[ground.minX + wall, ground.ceiling, ground.maxZ]} material={m.concrete} />

      {/* Mid slab: canopy over the terrace and floor of the cantilevered upper volume */}
      <Block min={[midSlab.minX, midSlab.bottom, midSlab.minZ]} max={[midSlab.maxX, midSlab.top, midSlab.maxZ]} material={m.concrete} />
      {/* Timber soffit beneath the cantilever */}
      <Block min={[ground.maxX, midSlab.bottom - 0.04, midSlab.minZ + 0.05]} max={[midSlab.maxX - 0.05, midSlab.bottom, midSlab.maxZ - 0.05]} material={m.timber} />

      {/* Upper floor: rear wall and solid west end */}
      <Block min={[upper.minX, upper.floor, upper.minZ]} max={[upper.maxX, upper.ceiling, upper.minZ + wall]} material={m.concrete} />
      <Block min={[upper.minX, upper.floor, upper.minZ]} max={[upper.minX + 1.4, upper.ceiling, upper.maxZ]} material={m.concrete} />

      {/* Roof slab with a slim shadow-gap reveal beneath */}
      <Block min={[roof.minX, roof.bottom + 0.06, roof.minZ]} max={[roof.maxX, roof.top, roof.maxZ]} material={m.concrete} />
      <Block min={[upper.minX + 0.1, roof.bottom, upper.minZ + 0.1]} max={[upper.maxX - 0.1, roof.bottom + 0.06, upper.maxZ - 0.1]} material={m.frame} />

      {/* Natural stone core rising above the roofline */}
      <Block min={[stoneCore.minX, plinth.top, stoneCore.minZ]} max={[stoneCore.maxX, stoneCore.top, stoneCore.maxZ]} material={m.stone} />
      {/* Stone blade wall running out into the garden, framing the terrace */}
      <Block min={[stoneCore.minX, 0, stoneCore.maxZ]} max={[stoneCore.minX + 0.5, 2.2, 10.6]} material={m.stone} />
    </group>
  )
}
