import { Vector3 } from 'three'

/** Blue-hour palette: deep zenith, lavender mid-sky, a warm afterglow on the horizon. */
export const SKY = {
  zenith: '#141a2e',
  mid: '#3d4566',
  horizon: '#a88a8a',
  ground: '#15161b',
  glow: '#e0a77f',
  /** Direction of the set sun's afterglow (behind-left of the house). */
  glowDirection: new Vector3(-0.75, 0.04, -0.66).normalize(),
  fog: '#2c2f40',
}
