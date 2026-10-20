import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { brand } from '../content/copy'
import { navLinks } from '../config/site'
import { scrollToSection } from '../lib/scrollTo'
import './Navigation.css'

/**
 * Fixed top bar: wordmark, section links and a "Start a project" action.
 * Below 900px the links move into a full-screen menu with focus trapping,
 * Escape to close and focus returned to the menu button.
 */
export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solid, setSolid] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      // Past the pinned story, give the bar a solid ground over the business sections.
      const story = document.querySelector('.story')
      const end = (story?.closest('.pin-spacer') ?? story)?.getBoundingClientRect().bottom ?? Infinity
      setSolid(end <= 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.classList.add('menu-open')
    const focusables = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      } else if (e.key === 'Tab') {
        const items = [toggle.current!, ...focusables()]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <>
      <a href="#work" className="skip-link" onClick={go('work')}>
        Skip the 3D introduction
      </a>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}${solid ? ' nav--solid' : ''}${open ? ' nav--open' : ''}`}>
        <a href="#top" className="nav__brand" onClick={go('top')}>
          <span className="nav__name">{brand.name}</span>{' '}
          <span className="nav__descriptor t-caption">{brand.descriptor}</span>
          <span className="visually-hidden">, back to top</span>
        </a>

        <nav className="nav__links" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={go(link.id)}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="nav__cta" onClick={go('contact')}>
          Start a project
        </a>

        <button
          ref={toggle}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className="nav__toggle-icon" aria-hidden="true" />
        </button>

        <div ref={menu} id="site-menu" className="nav__menu" hidden={!open}>
          <nav aria-label="Main">
            <ol className="nav__menu-list">
              {navLinks.map((link, i) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} onClick={go(link.id)}>
                    <span className="t-caption">{String(i + 1).padStart(2, '0')}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>
    </>
  )
}
