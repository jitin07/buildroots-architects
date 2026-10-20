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
          samples={16}
          rings={4}
          radius={0.08}
          intensity={22}
          bias={0.02}
          luminanceInfluence={0.6}
          worldDistanceThreshold={30}
          worldDistanceFalloff={8}
          worldProximityThreshold={0.6}
          worldProximityFalloff={0.3}
        />
      ) : (
        <></>
      )}
      <Bloom mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.2} intensity={0.55} radius={0.7} />
      <AdaptiveExposure />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.28} darkness={0.62} />
    </EffectComposer>
  )
}
