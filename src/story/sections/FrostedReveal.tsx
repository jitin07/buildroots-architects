/**
 * Section B — a pane of reeded, frosted glass rises as the camera reaches the
 * glazing, then a clear slit opens in step with the pivot door, revealing the
 * sharp interior behind it. The blur is a real backdrop-filter over the live
 * WebGL canvas; the slit is a CSS mask driven by the --open variable.
 */
export default function FrostedReveal() {
  return <div className="story-layer frost" aria-hidden="true" />
}
