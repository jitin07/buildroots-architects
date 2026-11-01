import { flagship } from "../data/site";
import { Reveal } from "./Reveal";

export function Interiors() {
  return (
    <section id="interiors" className="section section--night">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow eyebrow--dark">Inside the Studio</p>
          <h2 className="h2 h2--light">Interiors shaped by light and timber</h2>
        </Reveal>
        <div className="interiors__grid">
          {flagship.interiors.map((n) => (
            <Reveal as="figure" key={n.src} className="interiors__figure">
              <div className="interiors__crop">
                <img src={n.src} alt={n.alt} loading="lazy" />
              </div>
              <figcaption>{n.label}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
