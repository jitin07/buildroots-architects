import { useEffect, useRef } from "react";
import { flagship, routes } from "../data/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (reduce) {
      img.style.transform = "";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = img.getBoundingClientRect();
      const off = (r.top + r.height / 2 - window.innerHeight / 2) * -0.03;
      img.style.transform = `translateY(${off.toFixed(1)}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <header className="hero" id="top">
      <div className="hero__media">
        <img ref={imgRef} className="hero__img" src={flagship.hero.src} alt={flagship.hero.alt} fetchPriority="high" />
      </div>
      <div className="hero__shade" />
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="hero__kicker">Architecture · Interiors · Execution</p>
          <h1 className="hero__title">
            Architecture designed around
            <br />
            <em>the way you live.</em>
          </h1>
          <p className="hero__lede">
            Thoughtful architecture, refined interiors, and purposeful spaces shaped around people, place, and possibility.
          </p>
          <div className="hero__ctas">
            <a href={routes.projects} className="btn btn--gold">Explore Our Projects</a>
            <a href={routes.contact} className="btn btn--ghost">Discuss Your Project</a>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">Scroll</div>
    </header>
  );
}
