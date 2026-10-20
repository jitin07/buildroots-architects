import { philosophy } from '../../content/story'

/** Section C — the practice's philosophy, one line at a time. */
export default function Philosophy() {
  return (
    <section className="story-layer philo" aria-labelledby="philo-label">
      <div className="philo__inner">
        <p id="philo-label" className="philo__label t-caption">
          {philosophy.label}
        </p>
        <h2 className="philo__lines">
          {philosophy.lines.map((line) => (
            <span key={line} className="philo__line">
              <span className="philo__text">{line}</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
