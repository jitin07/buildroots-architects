import { projects } from "../data/site";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <section id="more-projects" className="section section--night2">
      <div className="container">
        <Reveal className="flagship__head">
          <div>
            <p className="eyebrow eyebrow--dark">More Projects</p>
            <h2 className="flagship__title">Our Work</h2>
          </div>
        </Reveal>

        <div className="projects-grid">
          {projects.map((p) => (
            <Reveal key={p.slug} as="article" className="project-card">
              <figure className="project-card__figure">
                <img src={p.cover.src} alt={p.cover.alt} loading="lazy" />
              </figure>
              <div className="project-card__info">
                <h3 className="project-card__name">{p.name}</h3>
                <dl className="meta meta--sm">
                  {p.meta.map((m) => (
                    <div key={m.label}>
                      <dt className="meta__label">{m.label}</dt>
                      <dd className="meta__value">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
