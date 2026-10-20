import { createContext, useContext } from 'react'

/**
 * Rendering quality tiers. The initial tier is a device guess; drei's
 * PerformanceMonitor steps it down at runtime if the frame rate drops.
 */
export type Tier = 'high' | 'medium' | 'low'

export type QualitySettings = {
  tier: Tier
  dpr: [number, number]
  postprocessing: boolean
  ambientOcclusion: boolean
  multisampling: number
  shadowMapSize: number
  reflectionResolution: number
  interiorLights: number
}

export const QUALITY: Record<Tier, QualitySettings> = {
  high: {
    tier: 'high',
    dpr: [1, 2],
    postprocessing: true,
    ambientOcclusion: true,
    multisampling: 4,
    shadowMapSize: 2048,
    reflectionResolution: 1024,
    interiorLights: 3,
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.5],
    postprocessing: true,
    ambientOcclusion: false,
    multisampling: 2,
    shadowMapSize: 2048,
    reflectionResolution: 512,
    interiorLights: 2,
  },
  low: {
    tier: 'low',
    dpr: [1, 1],
    postprocessing: false,
    ambientOcclusion: false,
    multisampling: 0,
    shadowMapSize: 1024,
    reflectionResolution: 256,
    interiorLights: 1,
  },
}

export function initialTier(): Tier {
  if (typeof window === 'undefined') return 'medium'
  const nav = navigator as Navigator & { deviceMemory?: number }
  const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 8
  if (mobile) return cores >= 8 && memory >= 6 ? 'medium' : 'low'
  return cores >= 8 && memory >= 8 ? 'high' : 'medium'
}

export function lowerTier(tier: Tier): Tier {
  return tier === 'high' ? 'medium' : 'low'
}

export const QualityContext = createContext<QualitySettings>(QUALITY.medium)

export const useQuality = () => useContext(QualityContext)
