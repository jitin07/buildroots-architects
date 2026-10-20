import type { Project } from '../../content/projects'

/**
 * A drawn line elevation shown in place of a photograph until real imagery
 * is added. Honest by design: it reads as a drawing, never as a finished
 * building, and carries a "drawings in preparation" caption.
 */
export default function ProjectPlaceholder({ variant }: { variant: NonNullable<Project['placeholder']> }) {
  return (
    <div className="project-placeholder">
      <svg viewBox="0 0 400 300" role="img" aria-label={`Line drawing: ${variant} concept`} preserveAspectRatio="xMidYMid meet">
        <line x1="20" y1="240" x2="380" y2="240" className="pp-ground" />
        {variant === 'farmhouse' && (
          <g className="pp-lines">
            <polyline points="50,240 50,160 130,110 210,160 210,240" />
            <polyline points="190,240 190,170 270,120 350,170 350,240" />
            <line x1="40" y1="160" x2="220" y2="160" />
            {[70, 100, 130, 160].map((x) => (
              <line key={x} x1={x} y1="175" x2={x} y2="240" />
            ))}
            <rect x="225" y="190" width="40" height="50" />
            <rect x="285" y="190" width="40" height="30" />
            <line x1="20" y1="252" x2="380" y2="252" className="pp-faint" />
          </g>
        )}
        {variant === 'commercial' && (
          <g className="pp-lines">
            <rect x="90" y="60" width="220" height="180" />
            {[120, 150, 180].map((y) => (
              <line key={y} x1="90" y1={y} x2="310" y2={y} />
            ))}
            {[145, 200, 255].map((x) => (
              <line key={x} x1={x} y1="60" x2={x} y2="240" />
            ))}
            <rect x="180" y="200" width="40" height="40" />
            <line x1="80" y1="60" x2="320" y2="60" />
          </g>
        )}
        {variant === 'interior' && (
          <g className="pp-lines">
            <rect x="60" y="60" width="280" height="180" />
            <rect x="90" y="150" width="110" height="40" />
            <rect x="230" y="110" width="80" height="50" />
            <circle cx="270" cy="200" r="18" />
          </g>
        )}
      </svg>
      <span className="project-placeholder__caption t-caption">Drawings in preparation</span>
    </div>
  )
}
