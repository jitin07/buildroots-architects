import { useEffect, useRef } from 'react'
import { statusLabel, type Project } from '../../content/projects'
import { prefillEnquiry } from '../../lib/enquiry'
import { scrollToSection } from '../../lib/scrollTo'
import ProjectPlaceholder from './ProjectPlaceholder'

type Props = { project: Project | null; onClose: () => void }

/**
 * Project detail in a native modal <dialog>: focus moves into it, Escape and
 * the close button dismiss it, focus returns to the card, and the page behind
 * doesn't scroll.
 */
export default function ProjectDialog({ project, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (project && !el.open) {
      el.showModal()
      document.documentElement.classList.add('dialog-open')
    }
    if (!project && el.open) el.close()
  }, [project])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const handleClose = () => {
      document.documentElement.classList.remove('dialog-open')
      onClose()
    }
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [onClose])

  const discuss = () => {
    if (!project) return
    prefillEnquiry(project.enquiryType)
    dialog.current?.close()
    // The dialog's 'close' event fires asynchronously; release the scroll lock now
    // so the page can move straight to the form.
    document.documentElement.classList.remove('dialog-open')
    // Next frame: after the dialog has restored focus to the card (which would
    // otherwise cancel a smooth scroll started now).
    requestAnimationFrame(() => scrollToSection('contact'))
  }

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) dialog.current?.close()
      }}
    >
      {project && (
        <div className="project-dialog__inner">
          <header className="project-dialog__header">
            <div className="project-dialog__tags">
              <span className={`status-badge status-badge--${project.status}`}>{statusLabel[project.status]}</span>
              <span className="t-caption">{project.category}</span>
            </div>
            <button type="button" className="project-dialog__close" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </header>

          <h2 id="project-dialog-title" className="project-dialog__title t-h1">
            {project.title}
          </h2>

          <div className="project-dialog__body">
            <p className="project-dialog__summary">{project.summary}</p>
            <dl className="project-dialog__meta">
              <div>
                <dt className="t-caption">Scope</dt>
                <dd>{project.scope.join(', ')}</dd>
              </div>
              <div>
                <dt className="t-caption">Status</dt>
                <dd>{project.status === 'concept' ? 'Concept / design study' : statusLabel[project.status]}</dd>
              </div>
              {project.location && (
                <div>
                  <dt className="t-caption">Location</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt className="t-caption">Year</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="project-dialog__gallery">
            {project.cover ? (
              <img src={project.cover.src} alt={project.cover.alt} width={1600} height={900} />
            ) : (
              project.placeholder && <ProjectPlaceholder variant={project.placeholder} />
            )}
            {project.gallery.map((image) => (
              <img key={image.src} src={image.src} alt={image.alt} width={1600} height={900} loading="lazy" />
            ))}
          </div>

          <footer className="project-dialog__footer">
            <button type="button" className="button button--primary" onClick={discuss}>
              Discuss a similar project
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}
