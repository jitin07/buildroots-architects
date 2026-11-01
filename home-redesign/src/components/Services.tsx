import { services } from "../data/site";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="approach" className="section section--emerald">
      <div className="container">
        <Reveal className="services__head">
          <p className="eyebrow eyebrow--dark">What We Do</p>
          <h2 className="h2 h2--light">A single team across every stage</h2>
        </Reveal>
        <div className="services__grid">
          {services.map((s) => (
            <Reveal key={s.num} className="service">
              <span className="service__num">{s.num}</span>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__body">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
