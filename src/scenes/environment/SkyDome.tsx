import { useMemo } from 'react'
import { BackSide, Color, ShaderMaterial } from 'three'
import { SKY } from './sky'

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 zenith;
  uniform vec3 mid;
  uniform vec3 horizon;
  uniform vec3 ground;
  uniform vec3 glow;
  uniform vec3 glowDirection;
  uniform float intensity;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 sky = mix(horizon, mid, smoothstep(0.0, 0.22, h));
    sky = mix(sky, zenith, smoothstep(0.18, 0.75, h));
    // Afterglow concentrated near the horizon in the sunset direction.
    float g = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(glowDirection.x, 0.0, glowDirection.z))), 0.0), 3.0);
    sky += glow * g * (1.0 - smoothstep(0.0, 0.3, h)) * 0.8;
    vec3 col = h < 0.0 ? mix(horizon * 0.55, ground, smoothstep(0.0, -0.15, h)) : sky;
    // Fine dither to avoid gradient banding.
    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    gl_FragColor = vec4(col * intensity + (n - 0.5) / 255.0, 1.0);
    #include <colorspace_fragment>
  }
`

type Props = { radius?: number; intensity?: number }

/** Gradient sky dome; also rendered into the environment map for reflections. */
export default function SkyDome({ radius = 380, intensity = 1 }: Props) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: new Color(SKY.zenith) },
          mid: { value: new Color(SKY.mid) },
          horizon: { value: new Color(SKY.horizon) },
          ground: { value: new Color(SKY.ground) },
          glow: { value: new Color(SKY.glow) },
          glowDirection: { value: SKY.glowDirection },
          intensity: { value: intensity },
        },
      }),
    [intensity],
  )

  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[radius, 48, 24]} />
    </mesh>
  )
}
