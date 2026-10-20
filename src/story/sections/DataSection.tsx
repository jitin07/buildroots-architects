import { stats } from '../../content/story'
import { formatStat, statTarget } from '../stats'

/**
 * Section D — large numerals with a stroked "ghost" copy behind each one that
 * drifts on scroll for a subtle sense of depth. Content comes from
 * content/story.ts (services by default; never unverified figures).
 */
export default function DataSection() {
  return (
    <section className="story-layer data" aria-labelledby="data-title">
      <div className="data__inner">
        <header className="data__header">
          <p className="t-caption">{stats.label}</p>
          <h2 id="data-title" className="data__title t-h3">
            {stats.title}
          </h2>
        </header>
        <ol className="data__grid">
          {stats.items.map((item, i) => {
            const final = formatStat(item, statTarget(item, i))
            return (
              <li key={item.label} className="data__item" data-index={i}>
                <div className="data__num-wrap" aria-hidden="true">
                  <span className="data__num-ghost">{final}</span>
                  <span className="data__num">{final}</span>
                </div>
                {/* Screen readers get the final value, not the animated counter. */}
                <span className="visually-hidden">{final}</span>
                <h3 className="data__label">{item.label}</h3>
                {item.description && <p className="data__desc t-small">{item.description}</p>}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
