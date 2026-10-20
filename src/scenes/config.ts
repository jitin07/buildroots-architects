/**
 * Scene dimensions and camera shots, in metres. Y is up, the house's ground
 * floor footprint is centred on the origin and the main facade faces +Z.
 *
 * Every architectural module reads from here, so proportions are tuned in one
 * place and a replacement model (e.g. an imported GLB) only needs to honour
 * HOUSE_ANCHORS for the camera work to keep functioning.
 */

export const HOUSE = {
  plinth: { top: 0.45, minX: -13, maxX: 12, minZ: -7, maxZ: 7.2 },

  ground: {
    floor: 0.45,
    ceiling: 3.55,
    minX: -8.5,
    maxX: 7,
    minZ: -4.6,
    maxZ: 3.4,
  },

  /** Slab between floors, projecting forward as a canopy over the terrace. */
  midSlab: { bottom: 3.55, top: 3.9, minX: -9.2, maxX: 11.4, minZ: -4.9, maxZ: 4.6 },

  /** Upper volume cantilevers past the ground floor on the +X side. */
  upper: {
    floor: 3.9,
    ceiling: 6.9,
    minX: -6.6,
    maxX: 11,
    minZ: -4.4,
    maxZ: 3.9,
  },

  roof: { bottom: 6.9, top: 7.22, minX: -7.1, maxX: 11.5, minZ: -4.9, maxZ: 4.4 },

  /** Vertical natural-stone core rising through both floors and above the roof. */
  stoneCore: { minX: -10.6, maxX: -8.5, minZ: -5, maxZ: 1.8, top: 7.9 },

  pool: { minX: -8.6, maxX: 3.6, minZ: 8.4, maxZ: 17.5, water: 0.1, coping: 0.14 },

  entry: { doorMinX: 4.6, doorMaxX: 6.4 },
} as const

/** Points of interest a camera rig can aim at, independent of the model used. */
export const HOUSE_ANCHORS = {
  centre: [0.5, 3.4, 0] as const,
  entry: [5.5, 1.8, 3.4] as const,
  livingRoom: [-2, 1.8, -1] as const,
}
