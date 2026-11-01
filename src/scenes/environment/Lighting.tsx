import { Environment, Lightformer } from '@react-three/drei'
import { useQuality } from '../quality'
import SkyDome from './SkyDome'
import { SKY } from './sky'

/**
 * Blue-hour lighting. A soft cool sky key casts the shadows, a hemisphere
 * fill keeps the shadow side readable, and a low-resolution environment map
 * (rendered once from the same sky dome plus a few light cards) gives glass,
 * water and metal believable reflections without any downloaded HDRI.
 */
export default function Lighting() {
  const { shadowMapSize } = useQuality()

  return (
    <>
      <fog attach="fog" args={[SKY.fog, 40, 150]} />
      <SkyDome />

      <hemisphereLight args={['#8d96bf', '#3a3228', 0.7]} />
      {/* Blue-hour ambient key — softened intensity, no harsh sun at dusk */}
      <directionalLight
        key={shadowMapSize}
        position={[-22, 26, 18]}
        intensity={0.6}
        color="#b8c0e0"
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.04}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={5}
        shadow-camera-far={90}
        shadow-radius={3}
      />
      {/* Warm afterglow rim from behind-left catching the roof edges */}
      <directionalLight position={[-40, 6, -35]} intensity={0.45} color={SKY.glow} />

      <Environment frames={1} resolution={512}>
        <SkyDome radius={50} intensity={1.2} />
        {/* Sunset glow card — wider, softer */}
        <Lightformer form="rect" intensity={1.8} color={SKY.glow} position={[-30, 4, -26]} scale={[50, 8, 1]} target={[0, 0, 0]} />
        {/* Cool overhead sky fill */}
        <Lightformer form="rect" intensity={1.0} color="#8e9ac4" position={[0, 35, 0]} rotation-x={Math.PI / 2} scale={[70, 70, 1]} />
        {/* Warm secondary glow — opposite side for glass variety */}
        <Lightformer form="rect" intensity={0.6} color="#ffd2a1" position={[20, 3, 30]} scale={[25, 4, 1]} target={[0, 0, 0]} />
        {/* Ground bounce — dark but present so glass bottoms aren't black */}
        <Lightformer form="rect" intensity={0.3} color="#4a4030" position={[0, -2, 10]} rotation-x={-Math.PI / 2} scale={[50, 50, 1]} />
      </Environment>
    </>
  )
}
