import { REDUCED_MOTION_QUERY } from './motion'

/** Height of the fixed navigation, kept clear above anchored sections. */
const NAV_OFFSET = 72

/**
 * Scrolls to a section by id. Works across the pinned story (positions are
 * read live, after ScrollTrigger's pin spacing) and honours reduced motion.
 */
export function scrollToSection(id: string) {
  const target = id === 'top' ? null : document.getElementById(id)
  const top = target ? target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET : 0
  const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  // Move focus for keyboard and screen-reader users without a second jump.
  if (target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`)
}
