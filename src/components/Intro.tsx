import { Reveal } from "./Reveal";

export function Intro() {
  return (
    <section className="intro" id="about">
      <div className="container intro__grid">
        <Reveal>
          <p className="eyebrow eyebrow--light">About BuildRoots</p>
          <h2 className="intro__title">One studio shaping space, light and material — from concept to completion.</h2>
        </Reveal>
        <Reveal className="intro__body">
          <p>
            BuildRoots Architects brings architecture, interior design and on-site execution under one roof. We design for the
            site — its light, its orientation, its surroundings — so every space belongs where it stands.
          </p>
          <p>
            Natural stone, warm timber and daylight, detailed with care and built to last. The idea drawn at concept is the one
            realised in built form.
          </p>
          <a href="#approach" className="text-link intro__link">Our approach →</a>
        </Reveal>
      </div>
    </section>
  );
}
