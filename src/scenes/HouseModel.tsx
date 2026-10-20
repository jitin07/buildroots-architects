import ProceduralHouse from './house/ProceduralHouse'

/**
 * The single swap point for the architectural model.
 *
 * Today it renders the procedural house. To use a detailed model instead,
 * render an imported GLB here (e.g. drei's useGLTF), positioned so its ground
 * floor sits on y = HOUSE.plinth.top with the main facade facing +Z, and map
 * its meshes onto useArchMaterials() or keep its own PBR materials. Landscape,
 * lighting and the camera rig only depend on HOUSE_ANCHORS in config.ts.
 */
export default function HouseModel() {
  return <ProceduralHouse />
}
