import { steps } from "../data/site";
import { Reveal } from "./Reveal";

export function Process() {
  return (
    <section className="section section--cream">
      <div className="container">
        <Reveal className="process__head">
          <p className="eyebrow eyebrow--light">How We Work</p>
          <h2 className="h2 h2--dark">From first conversation to handover</h2>
        </Reveal>
        <div className="process__grid">
          {steps.map((p) => (
            <Reveal key={p.num} className="step">
              <span className="step__num">{p.num}</span>
              <h3 className="step__title">{p.title}</h3>
              <p className="step__body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
