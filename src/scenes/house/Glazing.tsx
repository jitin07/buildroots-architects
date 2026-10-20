import { useArchMaterials } from '../materials/useArchMaterials'
import Block from './Block'

type Props = {
  /** Facade plane: 'z' = wall facing ±Z at `at`; 'x' = wall facing ±X at `at`. */
  axis: 'x' | 'z'
  at: number
  /** Extent along the wall (x for axis 'z', z for axis 'x'). */
  from: number
  to: number
  bottom: number
  top: number
  /** Target spacing between mullions in metres; actual spacing divides the run evenly. */
  bay?: number
  mullion?: number
}

const FRAME_DEPTH = 0.12

/** Floor-to-ceiling glazed curtain wall: glass panes, slim mullions, head and sill frames. */
export default function Glazing({ axis, at, from, to, bottom, top, bay = 2.4, mullion = 0.06 }: Props) {
  const m = useArchMaterials()
  const length = to - from
  const bays = Math.max(1, Math.round(length / bay))
  const step = length / bays
  const height = top - bottom
  const half = mullion / 2
  const fd = FRAME_DEPTH / 2

  // Builds min/max corners in facade-local terms (u along the wall, v up, n through it).
  const box = (u0: number, u1: number, v0: number, v1: number, n0: number, n1: number) =>
    axis === 'z'
      ? { min: [u0, v0, at + n0] as const, max: [u1, v1, at + n1] as const }
      : { min: [at + n0, v0, u0] as const, max: [at + n1, v1, u1] as const }

  const mullions = Array.from({ length: bays + 1 }, (_, i) => from + i * step)

  return (
    <group>
      <mesh
        material={m.glass}
        position={axis === 'z' ? [(from + to) / 2, bottom + height / 2, at] : [at, bottom + height / 2, (from + to) / 2]}
        rotation={axis === 'z' ? [0, 0, 0] : [0, Math.PI / 2, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[length, height]} />
      </mesh>

      {mullions.map((u) => (
        <Block key={u} {...box(u - half, u + half, bottom, top, -fd, fd)} material={m.frame} />
      ))}
      <Block {...box(from, to, bottom, bottom + 0.05, -fd, fd)} material={m.frame} />
      <Block {...box(from, to, top - 0.05, top, -fd, fd)} material={m.frame} />
    </group>
  )
}
