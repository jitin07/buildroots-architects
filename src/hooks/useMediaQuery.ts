import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION_QUERY } from '../lib/motion'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY)
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
