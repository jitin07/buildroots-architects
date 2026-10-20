import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { about } from '../content/business'
import { navLinks, site } from '../config/site'
import { gsap, useGSAP } from '../lib/gsap'
import { FULL_MOTION_QUERY, REDUCED_MOTION_QUERY } from '../lib/motion'
import { scrollToSection } from '../lib/scrollTo'
import './Footer.css'

const WORDMARK = 'BUILDROOTS'
const YEAR = new Date().getFullYear()

/**
 * Cinematic footer. It sits beneath the page content (sticky at the bottom,
 * lower z-index), so the content lifts away like a curtain to reveal it,
 * while the BUILDROOTS wordmark rises letter by letter, scrubbed to the
 * reveal. Social links appear only when configured.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null)
  const [fits, setFits] = useState(true)

  // The curtain only works if the whole footer fits on screen; otherwise it scrolls normally.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => setFits(el.scrollHeight <= window.innerHeight)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ reduced: REDUCED_MOTION_QUERY, full: FULL_MOTION_QUERY }, (ctx) => {
        const reduced = Boolean(ctx.conditions?.reduced)
        const content = document.querySelector('.site-content')
        const letters = gsap.utils.toArray<HTMLElement>('.footer__letter', root.current)
        if (!content) return
        gsap.fromTo(
          letters,
          { yPercent: reduced ? 0 : 105, opacity: reduced ? 0 : 1 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: { trigger: content, start: 'bottom bottom', end: 'max', scrub: reduced ? true : 0.8 },
          },
        )
        gsap.fromTo(
          '.footer__top, .footer__columns',
          { opacity: 0, y: reduced ? 0 : 30 },
          { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: content, start: 'bottom bottom', end: 'bottom 55%', scrub: reduced ? true : 0.8 } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToSection(id)
  }
  const { city, region, country } = site.location

  return (
    <footer ref={root} className={`footer${fits ? '' : ' footer--static'}`}>
      <div className="footer__top">
        <p className="footer__tagline t-h2">{about.headline}</p>
        <a href="#contact" className="button button--primary" onClick={go('contact')}>
          Start a project
        </a>
      </div>

      <div className="footer__columns">
        <div className="footer__col">
          <h2 className="t-caption">Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
              </li>
            )}
            {site.whatsapp && (
              <li>
                <a href={site.whatsapp.link('Hello BuildRoots, I would like to discuss a project.')} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
            <li className="footer__muted">
              {city}, {region}, {country}
            </li>
          </ul>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="t-caption">Navigate</h2>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={go(link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" onClick={go('top')}>
                Back to top ↑
              </a>
            </li>
          </ul>
        </nav>

        {site.social.length > 0 && (
          <div className="footer__col">
            <h2 className="t-caption">Follow</h2>
            <ul>
              {site.social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="footer__wordmark">
        <span className="visually-hidden">{site.name}</span>
        {WORDMARK.split('').map((letter, i) => (
          <span key={i} className="footer__letter-mask" aria-hidden="true">
            <span className="footer__letter">{letter}</span>
          </span>
        ))}
      </p>

      <div className="footer__bottom t-caption">
        <span>
          © {YEAR} {site.name}
        </span>
        <span>Architecture · Interiors · Construction</span>
      </div>
    </footer>
  )
}
