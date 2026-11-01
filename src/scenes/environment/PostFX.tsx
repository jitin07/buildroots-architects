import { Bloom, EffectComposer, SSAO, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useQuality } from '../quality'
import AdaptiveExposure from './AdaptiveExposure'

/**
 * Screen-space ambient occlusion (high tier), bloom on light fittings only,
 * filmic tone mapping and a soft vignette. Skipped entirely on the low tier,
 * where the renderer's own ACES tone mapping is used instead.
 *
 * N8AO (n8ao 2.0.1) was tried first but raises a per-frame "texture format /
 * sampler type mismatch" GL error with three r186, so the postprocessing
 * library's own SSAO is used.
 */
export default function PostFX() {
  const q = useQuality()
  if (!q.postprocessing) return null

  return (
    <EffectComposer key={q.tier} multisampling={q.multisampling} enableNormalPass={q.ambientOcclusion}>
      {q.ambientOcclusion ? (
        <SSAO
          samples={20}
          rings={5}
          radius={0.25}
          intensity={12}
          bias={0.015}
          luminanceInfluence={0.4}
          worldDistanceThreshold={20}
          worldDistanceFalloff={6}
          worldProximityThreshold={1.0}
          worldProximityFalloff={0.6}
        />
      ) : (
        <></>
      )}
      <Bloom mipmapBlur luminanceThreshold={1.2} luminanceSmoothing={0.15} intensity={0.35} radius={0.6} />
      <AdaptiveExposure />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.35} darkness={0.35} />
    </EffectComposer>
  )
}
