import { archWords, stats } from '../content/story'
import { gsap } from '../lib/gsap'
import { journeyState, keyU, PHASES } from '../scenes/camera/keyframes'
import { PHASE_START, SCHEDULE, type Span } from './schedule'
import { formatStat, statTarget } from './stats'

/**
 * Builders that add each story section to the master timeline. Every builder
 * receives the same timeline and places its tweens at absolute times from
 * SCHEDULE, so sections overlap deliberately and scrub together in both
 * directions. With reduced motion, transforms are dropped (opacity only), the
 * camera cuts between shots instead of flying, and the aperture becomes a
 * crossfade.
 */
export type StoryContext = {
  tl: gsap.core.Timeline
  root: HTMLElement
  reduced: boolean
}

const $ = (root: HTMLElement, selector: string) => root.querySelector<HTMLElement>(selector)
const $$ = (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector))
const len = (span: Span) => span.end - span.start
const cutAtEnd = (p: number) => (p >= 1 ? 1 : 0)
const smoothstep = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Camera journey: path position, door, and the opening statement. */
export function buildCamera({ tl, root, reduced }: StoryContext) {
  for (const phase of PHASES) {
    const start = PHASE_START[phase.id]
    tl.addLabel(phase.id, start)
    // Reduced motion: hold each shot, then cut to the next exactly at the phase end
    // (never at the start — the threshold cut must wait until the door is open).
    tl.to(journeyState, { u: keyU(phase.toKey), duration: phase.duration, ease: reduced ? cutAtEnd : phase.ease }, start)
    if (phase.id === 'threshold') {
      tl.to(journeyState, { door: 1, duration: phase.duration * 0.5, ease: 'power2.inOut' }, start + phase.duration * 0.12)
    }
  }

  const hero = $(root, '.story-hero')
  if (hero) {
    tl.to(hero, { opacity: 0, y: reduced ? 0 : -40, duration: len(SCHEDULE.heroOut), ease: 'power1.in' }, SCHEDULE.heroOut.start)
  }
}

/** Section A — the four architectural words. */
export function buildWords({ tl, root, reduced }: StoryContext) {
  for (const { id } of archWords) {
    const span = SCHEDULE.words[id]
    const el = $(root, `[data-word="${id}"]`)
    if (!el) continue
    const text = el.querySelector('.arch-word__text')
    const note = el.querySelector('.arch-word__note')
    tl.addLabel(id, span.start)

    tl.fromTo(text, { opacity: 0, yPercent: reduced ? 0 : 22 }, { opacity: 1, yPercent: 0, duration: 0.45, ease: 'power3.out' }, span.start)
    tl.fromTo(note, { opacity: 0, y: reduced ? 0 : 14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, span.start + 0.15)
    // A slow lateral drift while the word holds, as if it sits in the scene's depth.
    if (!reduced) tl.fromTo(el, { xPercent: -1.5 }, { xPercent: 1.5, duration: len(span), ease: 'none' }, span.start)
    tl.to(text, { opacity: 0, yPercent: reduced ? 0 : -12, duration: 0.35, ease: 'power2.in' }, span.end - 0.35)
    tl.to(note, { opacity: 0, duration: 0.25, ease: 'power1.in' }, span.end - 0.35)
  }
}

/** Section B — frosted glass that clears through a slit as the door opens. */
export function buildFrost({ tl, root, reduced }: StoryContext) {
  const frost = $(root, '.frost')
  if (!frost) return
  const { in: fadeIn, open, out } = SCHEDULE.frost
  tl.addLabel('frost', fadeIn.start)
  tl.fromTo(frost, { opacity: 0 }, { opacity: 1, duration: len(fadeIn), ease: 'power1.inOut' }, fadeIn.start)
  if (!reduced) {
    tl.fromTo(frost, { '--open': 0 }, { '--open': 64, duration: len(open), ease: 'power2.inOut' }, open.start)
  }
  tl.to(frost, { opacity: 0, duration: len(out), ease: 'power1.inOut' }, out.start)
}

/** Darkening veil under C and D. */
export function buildVeil({ tl, root }: StoryContext) {
  const veil = $(root, '.story-veil')
  if (!veil) return
  tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: len(SCHEDULE.veil), ease: 'power1.inOut' }, SCHEDULE.veil.start)
}

/** Section C — philosophy lines. */
export function buildPhilosophy({ tl, root, reduced }: StoryContext) {
  const section = $(root, '.philo')
  if (!section) return
  const label = $(root, '.philo__label')
  const texts = $$(root, '.philo__text')
  const { lines, settle, out } = SCHEDULE.philosophy
  tl.addLabel('philosophy', lines[0] - 0.2)

  tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.3 }, lines[0] - 0.15)
  texts.forEach((text, i) => {
    tl.fromTo(text, { opacity: 0, yPercent: reduced ? 0 : 105 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'power3.out' }, lines[i])
    if (i > 0) tl.to(texts[i - 1], { opacity: 0.38, duration: 0.3, ease: 'power1.out' }, lines[i])
  })
  tl.to(texts.slice(0, -1), { opacity: 1, duration: 0.25, ease: 'power1.inOut' }, settle)
  tl.to(section, { opacity: 0, y: reduced ? 0 : -30, duration: len(out), ease: 'power2.in' }, out.start)
}

/** Section D — numbered data with depth. */
export function buildData({ tl, root, reduced }: StoryContext) {
  const section = $(root, '.data')
  if (!section) return
  const header = $(root, '.data__header')
  const items = $$(root, '.data__item')
  const { in: enter, out } = SCHEDULE.stats
  tl.addLabel('stats', enter.start)

  tl.fromTo(section, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, enter.start)
  tl.fromTo(header, { opacity: 0, y: reduced ? 0 : 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, enter.start)
  tl.fromTo(
    items,
    { opacity: 0, y: reduced ? 0 : 48, rotateX: reduced ? 0 : 16 },
    { opacity: 1, y: 0, rotateX: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
    enter.start + 0.1,
  )

  items.forEach((el, i) => {
    const item = stats.items[i]
    const num = el.querySelector<HTMLElement>('.data__num')
    const ghost = el.querySelector<HTMLElement>('.data__num-ghost')
    if (!item || !num) return
    const target = statTarget(item, i)
    const counter = { value: reduced ? target : 0 }
    const render = () => void (num.textContent = formatStat(item, counter.value))
    render()
    if (!reduced) {
      tl.to(counter, { value: target, duration: 0.6, ease: 'power1.out', onUpdate: render }, enter.start + 0.15 + i * 0.1)
      // The ghost numeral drifts away from the solid one: a quiet parallax depth cue.
      if (ghost) tl.fromTo(ghost, { xPercent: 1, yPercent: 2 }, { xPercent: 5, yPercent: 9, duration: out.end - enter.start, ease: 'none' }, enter.start)
    }
  })

  tl.to(section, { opacity: 0, y: reduced ? 0 : -30, duration: len(out), ease: 'power2.in' }, out.start)
}

const STAR = { spikes: 8, innerRatio: 0.52 }

/** Points of an 8-spike star centred in a w×h box, outer radius r, rotated by `turn` radians. */
function starPoints(w: number, h: number, r: number, turn: number) {
  const pts: string[] = []
  const n = STAR.spikes * 2
  for (let i = 0; i < n; i++) {
    const radius = i % 2 === 0 ? r : r * STAR.innerRatio
    const a = -Math.PI / 2 + turn + (i / n) * Math.PI * 2
    pts.push(`${(w / 2 + Math.cos(a) * radius).toFixed(1)}px ${(h / 2 + Math.sin(a) * radius).toFixed(1)}px`)
  }
  return pts
}

/** Sections E + F — star aperture onto the showreel, slow zoom, project info. */
export function buildAperture({ tl, root, reduced }: StoryContext) {
  const reel = $(root, '.reel')
  const media = $(root, '.reel__media')
  const svg = root.querySelector<SVGSVGElement>('.aperture')
  const outline = root.querySelector<SVGPolygonElement>('.aperture__outline')
  if (!reel || !media) return
  const { aperture, showreel } = SCHEDULE
  tl.addLabel('aperture', aperture.start)
  tl.addLabel('showreel', showreel.info.start)

  if (reduced) {
    gsap.set(reel, { clipPath: 'none' })
    tl.fromTo(reel, { opacity: 0 }, { opacity: 1, duration: len(aperture), ease: 'power1.inOut' }, aperture.start)
  } else {
    const state = { p: 0 }
    const draw = () => {
      const w = reel.clientWidth
      const h = reel.clientHeight
      const p = state.p
      if (p >= 1) {
        reel.style.clipPath = 'none'
      } else {
        // Outer radius large enough that the inner points clear the corners at p = 1.
        const rMax = (Math.hypot(w, h) / 2 / STAR.innerRatio) * 1.02
        const turn = (p * Math.PI) / 8
        reel.style.clipPath = `polygon(${starPoints(w, h, rMax * p, turn).join(',')})`
        if (svg && outline) {
          svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
          outline.setAttribute('points', starPoints(w, h, rMax * p * 1.035, turn).map((s) => s.replace(/px/g, '')).join(' '))
          outline.style.opacity = String(Math.min(1, p * 10) * (1 - smoothstep(p, 0.7, 1)))
        }
      }
    }
    draw()
    tl.to(state, { p: 1, duration: len(aperture), ease: 'power2.inOut', onUpdate: draw }, aperture.start)
    tl.fromTo(media, { scale: 1 }, { scale: 1.12, duration: len(showreel.zoom), ease: 'none' }, showreel.zoom.start)
  }

  tl.fromTo(
    $$(root, '.reel__info > *'),
    { opacity: 0, y: reduced ? 0 : 20 },
    { opacity: 1, y: 0, duration: len(showreel.info), stagger: 0.08, ease: 'power2.out' },
    showreel.info.start,
  )
}
