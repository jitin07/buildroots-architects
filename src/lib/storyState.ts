/** Fired when the showreel fully covers (or uncovers) the 3D scene. */
export const SCENE_COVERED = 'buildroots:scene-covered'

/**
 * Story-level state shared between the DOM timeline and the WebGL layer.
 * When the showreel covers the whole screen, the 3D render loop is paused.
 */
export const storyState = {
  sceneCovered: false,
}

export function setSceneCovered(covered: boolean) {
  if (storyState.sceneCovered === covered) return
  storyState.sceneCovered = covered
  window.dispatchEvent(new CustomEvent<boolean>(SCENE_COVERED, { detail: covered }))
}
