import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { FULL_MOTION_QUERY, REDUCED_MOTION_QUERY } from '../lib/motion'

/**
 * Reveals every [data-reveal] element inside `scope` as it enters the
 * viewport: a short rise and fade, batched so siblings stagger. Plays once
 * (no reverse) so nothing flickers when scrolling back. Opacity only with
 * reduced motion. All triggers are reverted on unmount.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ reduced: REDUCED_MOTION_QUERY, full: FULL_MOTION_QUERY }, (ctx) => {
        const reduced = Boolean(ctx.conditions?.reduced)
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current)
        gsap.set(items, { opacity: 0, y: reduced ? 0 : 28 })
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: reduced ? 0.4 : 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
        })
      })
      return () => mm.revert()
    },
    { scope },
  )
}
