import { useCallback, useRef, useState } from 'react'
import { portfolioIntro } from '../../content/business'
import { projects, statusLabel, type Project } from '../../content/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import ProjectDialog from './ProjectDialog'
import ProjectPlaceholder from './ProjectPlaceholder'
import './portfolio.css'

/**
 * Editorial portfolio: an asymmetric grid of large images driven entirely by
 * the records in content/projects.ts. Each card opens a detail dialog.
 */
export default function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<Project | null>(null)
  const close = useCallback(() => setActive(null), [])
  useScrollReveal(root)

  return (
    <section ref={root} id="work" className="section portfolio" aria-labelledby="work-title">
      <header className="section__header">
        <p className="section__label t-caption" data-reveal>
          {portfolioIntro.label}
        </p>
        <h2 id="work-title" className="section__title t-h1" data-reveal>
          {portfolioIntro.title}
        </h2>
        <p className="section__note t-small" data-reveal>
          {portfolioIntro.note}
        </p>
      </header>

      <ol className="portfolio__grid">
        {projects.map((project, i) => (
          <li key={project.id} className={`project-card project-card--${(i % 5) + 1}`} data-reveal>
            <button type="button" className="project-card__button" onClick={() => setActive(project)} aria-haspopup="dialog">
              <span className="project-card__media">
                {project.cover ? (
                  <img src={project.cover.src} alt={project.cover.alt} width={1600} height={900} loading="lazy" />
                ) : (
                  project.placeholder && <ProjectPlaceholder variant={project.placeholder} />
                )}
                <span className={`status-badge status-badge--${project.status}`}>{statusLabel[project.status]}</span>
              </span>
              <span className="project-card__meta">
                <span className="project-card__index t-caption">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-card__text">
                  <span className="project-card__category t-caption">{project.category}</span>
                  <span className="project-card__title">{project.title}</span>
                </span>
                <span className="project-card__cta t-caption" aria-hidden="true">
                  View <span className="project-card__arrow">→</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <ProjectDialog project={active} onClose={close} />
    </section>
  )
}
