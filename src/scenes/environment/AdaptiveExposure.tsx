import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'
import { journeyState } from '../camera/journey'
import { exposureAt } from './adaptation'

const fragmentShader = /* glsl */ `
  uniform float exposure;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(inputColor.rgb * exposure, inputColor.a);
  }
`

class ExposureEffect extends Effect {
  constructor() {
    super('ExposureEffect', fragmentShader, { uniforms: new Map([['exposure', new Uniform(1)]]) })
  }
}

/** Linear exposure applied before tone mapping, following the camera journey. */
export default function AdaptiveExposure() {
  const effect = useMemo(() => new ExposureEffect(), [])
  useEffect(() => () => effect.dispose(), [effect])
  useFrame(() => {
    effect.uniforms.get('exposure')!.value = exposureAt(journeyState.u)
  })
  return <primitive object={effect} dispose={null} />
}
