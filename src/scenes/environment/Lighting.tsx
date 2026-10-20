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

      <hemisphereLight args={['#7c87b4', '#2b2620', 0.55]} />
      <directionalLight
        key={shadowMapSize}
        position={[-22, 26, 18]}
        intensity={1.1}
        color="#c3cbf0"
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={5}
        shadow-camera-far={90}
      />
      {/* Warm afterglow rim from behind-left catching the roof edges */}
      <directionalLight position={[-40, 6, -35]} intensity={0.6} color={SKY.glow} />

      <Environment frames={1} resolution={256}>
        <SkyDome radius={50} intensity={1.1} />
        <Lightformer form="rect" intensity={2.2} color={SKY.glow} position={[-30, 4, -26]} scale={[40, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#9aa6d6" position={[0, 30, 0]} rotation-x={Math.PI / 2} scale={[60, 60, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#ffd2a1" position={[20, 3, 30]} scale={[20, 3, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}
