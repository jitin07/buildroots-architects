import { useRef, type ReactNode } from 'react'
import { hero } from '../content/copy'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { FULL_MOTION_QUERY, REDUCED_MOTION_QUERY } from '../lib/motion'
import { requestRender } from '../lib/renderLoop'
import { setSceneCovered } from '../lib/storyState'
import { journeyState, PHASES } from '../scenes/camera/keyframes'
import TypographySection from '../components/TypographySection'
import {
  buildAperture,
  buildCamera,
  buildData,
  buildFrost,
  buildPhilosophy,
  buildVeil,
  buildWords,
  type StoryContext,
} from './animations'
import { PHASE_START, SCHEDULE, SCROLL_PER_UNIT } from './schedule'
import ArchWords from './sections/ArchWords'
import DataSection from './sections/DataSection'
import FrostedReveal from './sections/FrostedReveal'
import Philosophy from './sections/Philosophy'
import Showreel from './sections/Showreel'
import './story.css'

/**
 * The whole scroll story as ONE pinned stage and ONE master timeline. The 3D
 * canvas sits at the back of the stage (so DOM layers can blend with it) and
 * a single scrubbed timeline drives the camera, the typography, the
 * frosted reveal, the data, the aperture and the showreel — so every element
 * stays in sync in both scroll directions.
 *
 * gsap.matchMedia builds a separate reduced-motion timeline and swaps between
 * them live if the preference changes; everything is reverted on unmount.
 */
export default function StoryStage({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ reduced: REDUCED_MOTION_QUERY, full: FULL_MOTION_QUERY }, (ctx) => {
        const el = root.current
        if (!el) return
        const reduced = Boolean(ctx.conditions?.reduced)
        journeyState.u = 0
        journeyState.door = 0
        journeyState.phase = 0

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${window.innerHeight * SCHEDULE.total * SCROLL_PER_UNIT}`,
            pin: true,
            scrub: reduced ? true : 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const story: StoryContext = { tl, root: el, reduced }
        buildCamera(story)
        buildWords(story)
        buildFrost(story)
        buildVeil(story)
        buildPhilosophy(story)
        buildData(story)
        buildAperture(story)
        // Pad to the full schedule so scroll length and timeline length match exactly.
        tl.set({}, {}, SCHEDULE.total)

        const video = el.querySelector<HTMLVideoElement>('.reel__video')
        const phaseStarts = PHASES.map((p) => PHASE_START[p.id])
        tl.eventCallback('onUpdate', () => {
          // The camera, door and exposure all read the timeline: draw a frame.
          requestRender()
          const now = tl.time()
          let index = 0
          while (index + 1 < phaseStarts.length && phaseStarts[index + 1] <= now) index++
          journeyState.phase = index

          // The showreel fully covers the scene: pause WebGL rendering.
          setSceneCovered(now >= SCHEDULE.aperture.end)

          // Fetch the poster only when the reel is approaching, not on page load.
          if (video && now >= SCHEDULE.stats.in.start && video.dataset.poster && !video.hasAttribute('poster')) {
            video.setAttribute('poster', video.dataset.poster)
          }

          // Play the showreel only while it's visible (never with reduced motion).
          if (video && video.dataset.reduced !== 'true') {
            const visible = now >= SCHEDULE.aperture.start
            if (visible && video.paused) void video.play().catch(() => {})
            else if (!visible && !video.paused) video.pause()
          }
        })

        if (import.meta.env.DEV) {
          // Dev helper: __story.seek('stats') jumps to a section to test it in isolation.
          Object.assign(window, {
            __story: {
              tl,
              labels: tl.labels,
              seek: (label: string) => window.scrollTo(0, tl.scrollTrigger!.labelToScroll(label)),
            },
          })
        }

        return () => {
          setSceneCovered(false)
          video?.pause()
        }
      })

      // Mobile browsers resize the viewport as the URL bar shows/hides; don't re-pin on that.
      ScrollTrigger.config({ ignoreMobileResize: true })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="story" aria-label="BuildRoots Architects — a walk through the house">
      {/* The WebGL canvas lives inside the stage so the words can blend with it. */}
      {children}
      <div className="story-layer story-hero">
        <TypographySection id="top" as="h1" srPrefix="BuildRoots Architects" words={hero.statement} caption={hero.caption} />
      </div>
      <FrostedReveal />
      <ArchWords />
      <div className="story-layer story-veil" aria-hidden="true" />
      <Philosophy />
      <DataSection />
      <Showreel />
    </section>
  )
}
