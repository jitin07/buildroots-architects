/**
 * Loading signals sent from the lazily loaded WebGL chunk to the loading
 * screen, so the page shell doesn't need to import three.js.
 */
export const EXPERIENCE_READY = 'buildroots:experience-ready'
export const LOAD_PROGRESS = 'buildroots:load-progress'

export type LoadProgress = { active: boolean; progress: number }

export function emitLoadProgress(detail: LoadProgress) {
  window.dispatchEvent(new CustomEvent<LoadProgress>(LOAD_PROGRESS, { detail }))
}
