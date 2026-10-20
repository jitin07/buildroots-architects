import { useRef } from 'react'
import blueprint from '../assets/media/blueprint.webp'
import { about } from '../content/business'
import { site } from '../config/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './info.css'

/** About the practice: headline, positioning and the three disciplines. */
export default function About() {
  const root = useRef<HTMLElement>(null)
  useScrollReveal(root)
  const { city, region, country } = site.location

  return (
    <section ref={root} id="about" className="section about" aria-labelledby="about-title">
      <p className="section__label t-caption" data-reveal>
        {about.label}
      </p>

      <div className="about__intro">
        <h2 id="about-title" className="about__headline t-display" data-reveal>
          {about.headline}
        </h2>
        <div className="about__text">
          {about.paragraphs.map((p) => (
            <p key={p} className="t-body" data-reveal>
              {p}
            </p>
          ))}
          <p className="about__location t-caption" data-reveal>
            {city}, {region}, {country}
          </p>
        </div>
      </div>

      <figure className="about__drawing" data-reveal>
        <img src={blueprint} alt="Line drawing of a contemporary house elevation" width={1600} height={900} loading="lazy" />
      </figure>

      <ul className="about__pillars">
        {about.pillars.map((pillar, i) => (
          <li key={pillar.title} data-reveal>
            <span className="t-caption">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="about__pillar-title">{pillar.title}</h3>
            <p className="t-small">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
