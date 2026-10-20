import { useThree } from '@react-three/fiber'
import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Texture,
} from 'three'
import {
  concreteTextures,
  lawnTextures,
  paverTextures,
  stoneTextures,
  timberTextures,
  type SurfaceTextures,
} from './textures'

/**
 * The shared PBR material library for the site. Every architectural and
 * landscape module pulls from here, so a replacement model can map its own
 * meshes onto the same look, and materials are created exactly once.
 */
export type ArchMaterials = ReturnType<typeof createMaterials>

let cached: ArchMaterials | null = null

function getMaterials(maxAnisotropy: number): ArchMaterials {
  if (!cached) {
    const start = performance.now()
    cached = createMaterials(Math.min(8, maxAnisotropy))
    if (import.meta.env.DEV) console.info(`[scene] procedural textures built in ${(performance.now() - start).toFixed(0)}ms`)
  }
  return cached
}

export function useArchMaterials(): ArchMaterials {
  const gl = useThree((s) => s.gl)
  return getMaterials(gl.capabilities.getMaxAnisotropy())
}

function applyTiling(t: SurfaceTextures) {
  const textures = [t.map, t.roughnessMap, t.bumpMap].filter(Boolean) as Texture[]
  for (const tex of textures) tex.repeat.set(1 / t.tileSize, 1 / t.tileSize)
  return t
}

function createMaterials(anisotropy: number) {
  const concrete = applyTiling(concreteTextures(anisotropy))
  const stone = applyTiling(stoneTextures(anisotropy))
  const timber = applyTiling(timberTextures(anisotropy))
  const pavers = applyTiling(paverTextures(anisotropy))
  const lawn = applyTiling(lawnTextures(anisotropy))

  return {
    /** Smooth white architectural concrete for slabs, walls and the roof. */
    concrete: new MeshStandardMaterial({
      name: 'concrete',
      map: concrete.map,
      roughnessMap: concrete.roughnessMap,
      bumpMap: concrete.bumpMap,
      bumpScale: 0.6,
      roughness: 0.92,
      metalness: 0,
    }),

    /** Coursed natural stone for the core and garden walls. */
    stone: new MeshStandardMaterial({
      name: 'stone',
      map: stone.map,
      roughnessMap: stone.roughnessMap,
      bumpMap: stone.bumpMap,
      bumpScale: 2.2,
      roughness: 1,
      metalness: 0,
    }),

    /** Vertical-grain timber for fins, soffit and the entry door. */
    timber: new MeshStandardMaterial({
      name: 'timber',
      map: timber.map,
      roughnessMap: timber.roughnessMap,
      roughness: 0.75,
      metalness: 0,
    }),

    /** Limestone terrace pavers and coping. */
    paver: new MeshStandardMaterial({
      name: 'paver',
      map: pavers.map,
      bumpMap: pavers.bumpMap,
      bumpScale: 0.8,
      roughness: 0.82,
      metalness: 0,
    }),

    lawn: new MeshStandardMaterial({ name: 'lawn', map: lawn.map, roughness: 1, metalness: 0 }),

    /**
     * Low-iron architectural glazing. Not using transmission (an extra full
     * scene render per frame); a transparent reflective coat over lit
     * interiors reads correctly at architectural viewing distances.
     */
    glass: new MeshPhysicalMaterial({
      name: 'glass',
      color: new Color('#d6dcda'),
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.12,
      envMapIntensity: 0.8,
      clearcoat: 0.5,
      clearcoatRoughness: 0.02,
      depthWrite: false,
      side: DoubleSide,
    }),

    /** Dark bronze anodised aluminium for mullions and frames. */
    frame: new MeshStandardMaterial({ name: 'frame', color: '#2a2622', roughness: 0.38, metalness: 0.75 }),

    interiorWall: new MeshStandardMaterial({ name: 'interiorWall', color: '#f4e8d6', roughness: 0.9 }),
    interiorFloor: new MeshStandardMaterial({ name: 'interiorFloor', color: '#b9ad9c', roughness: 0.55 }),
    upholstery: new MeshStandardMaterial({ name: 'upholstery', color: '#d9d1c4', roughness: 0.95 }),
    walnut: new MeshStandardMaterial({ name: 'walnut', color: '#4a3020', roughness: 0.55 }),

    /** Warm 2700K emissive used for light fittings; bright enough to bloom. */
    lamp: new MeshStandardMaterial({
      name: 'lamp',
      color: '#000000',
      emissive: new Color('#ffc27a'),
      emissiveIntensity: 3.2,
      toneMapped: false,
    }),

    /** Soft glowing ceiling panels that read as recessed lighting. */
    ceilingGlow: new MeshStandardMaterial({
      name: 'ceilingGlow',
      color: '#000000',
      emissive: new Color('#ffe2bd'),
      emissiveIntensity: 2.6,
    }),

    /** Linear fireplace flame bed. */
    fire: new MeshStandardMaterial({
      name: 'fire',
      color: '#000000',
      emissive: new Color('#ff8a3a'),
      emissiveIntensity: 5,
      toneMapped: false,
    }),
    rug: new MeshStandardMaterial({ name: 'rug', color: '#9a8f80', roughness: 1 }),
    linen: new MeshStandardMaterial({ name: 'linen', color: '#b9ab97', roughness: 0.95 }),
    artwork: new MeshStandardMaterial({ name: 'artwork', color: '#a86b4f', roughness: 0.85 }),
    ceramic: new MeshStandardMaterial({ name: 'ceramic', color: '#e8e2d8', roughness: 0.4 }),

    bark: new MeshStandardMaterial({ name: 'bark', color: '#3b2f27', roughness: 0.95 }),
    foliage: new MeshStandardMaterial({ name: 'foliage', color: '#3b4a30', roughness: 0.9, flatShading: true }),
    foliageDark: new MeshStandardMaterial({ name: 'foliageDark', color: '#28331f', roughness: 0.9, flatShading: true }),
    gravel: new MeshStandardMaterial({ name: 'gravel', color: '#5c5852', roughness: 1 }),
  }
}
