import { flagship, routes } from "../data/site";
import { Reveal } from "./Reveal";

export function Flagship() {
  return (
    <section id="project" className="section section--night2">
      <div className="container">
        <Reveal className="flagship__head">
          <div>
            <p className="eyebrow eyebrow--dark">Selected Project</p>
            <h2 className="flagship__title">{flagship.name}</h2>
          </div>
          <a href={routes.projects} className="text-link flagship__all">All projects →</a>
        </Reveal>
        <div className="flagship__grid">
          <Reveal as="figure" className="flagship__figure">
            <img src={flagship.cover.src} alt={flagship.cover.alt} loading="lazy" />
          </Reveal>
          <Reveal>
            <dl className="meta">
              {flagship.meta.map((m) => (
                <div key={m.label}>
                  <dt className="meta__label">{m.label}</dt>
                  <dd className="meta__value">{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="prose-dark">
              Our own studio is a working expression of how we design: a narrow urban plot opened up with a double-height
              reception, a perforated terracotta jali that filters harsh afternoon light, and warm timber linings that carry
              through every room.
            </p>
            <p className="prose-dark">
              Below, explore the building — its exteriors, interiors and the actual ground-floor plan drawn for the space.
            </p>
            <div className="flagship__ctas">
              <a href="#plan" className="btn btn--sm btn--gold">View 2D Layout</a>
              <a href="#interiors" className="btn btn--sm btn--ghost">See Interiors</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
