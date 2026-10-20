import { archWords } from '../../content/story'

/**
 * Section A — FORM / SPACE / LIGHT / LIVING. Each word is pinned to a camera
 * moment (see SCHEDULE.words) and blended into the scene with
 * mix-blend-mode: difference, so it reads against both sky and interior.
 */
export default function ArchWords() {
  return (
    <div className="story-layer arch-words">
      {archWords.map((w, i) => (
        <div key={w.id} className={`arch-word arch-word--${w.id}`} data-word={w.id}>
          <h2 className="arch-word__text">{w.word}</h2>
          <p className="arch-word__note t-small">
            <span className="arch-word__index t-caption">{String(i + 1).padStart(2, '0')}</span>
            {w.note}
          </p>
        </div>
      ))}
    </div>
  )
}
