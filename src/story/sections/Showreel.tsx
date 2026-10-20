import { useState } from 'react'
import { showreel } from '../../content/story'
import poster from '../../assets/media/hero-poster.webp'
import videoLarge from '../../assets/media/hero-loop.mp4'
import videoSmall from '../../assets/media/hero-loop-sm.mp4'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Sections E + F — the showreel layer. It is revealed through the expanding
 * star aperture (its clip-path, plus the accent outline drawn in the SVG),
 * then slowly zooms in. The video only plays while visible (the master
 * timeline toggles it) and never autoplays with reduced motion.
 */
export default function Showreel() {
  const reducedMotion = useReducedMotion()
  const [src] = useState(() => (window.matchMedia('(max-width: 767px)').matches ? videoSmall : videoLarge))

  return (
    <>
      <section className="story-layer reel" aria-labelledby="reel-title">
        <div className="reel__media">
          <video
            className="reel__video"
            src={reducedMotion ? undefined : src}
            // The poster is attached by the story timeline shortly before the reel appears.
            data-poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            data-reduced={reducedMotion ? 'true' : 'false'}
          />
        </div>
        <div className="reel__shade" />
        <div className="reel__info">
          <p className="reel__label t-caption">{showreel.label}</p>
          <h2 id="reel-title" className="reel__title t-h1">
            {showreel.title}
          </h2>
          <p className="reel__meta t-caption">
            {showreel.meta.join(' · ')} <span className="reel__note">— {showreel.note}</span>
          </p>
        </div>
      </section>
      <svg className="story-layer aperture" aria-hidden="true">
        <polygon className="aperture__outline" points="" />
      </svg>
    </>
  )
}
