import { useRef, type ReactNode } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollState } from '../lib/scrollState'

/**
 * The page's main content: the pinned story followed by the business
 * sections. Also reports overall scroll progress (used by the dev HUD).
 */
export default function ScrollExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scrollState.progress = self.progress
          scrollState.velocity = self.getVelocity()
        },
      })
    },
    { scope: root },
  )

  return (
    <main ref={root} className="scroll-experience site-content">
      {children}
    </main>
  )
}
