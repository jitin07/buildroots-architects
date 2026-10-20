/**
 * Reduced-motion media queries, shared by JS (gsap.matchMedia, hooks) and
 * mirrored in CSS. In development, `?reduced-motion` in the URL forces the
 * reduced path so it can be tested without changing OS settings.
 */
const forced = import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion')

if (forced) document.documentElement.classList.add('reduced-motion')

export const REDUCED_MOTION_QUERY = forced ? 'all' : '(prefers-reduced-motion: reduce)'
export const FULL_MOTION_QUERY = forced ? 'not all' : '(prefers-reduced-motion: no-preference)'
