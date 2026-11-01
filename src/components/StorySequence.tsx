import { useEffect, useRef, useState } from "react";
import { flagship } from "../data/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

const frames = flagship.story;

/**
 * Sticky, scroll-driven crossfade: exterior → interior → actual floor plan,
 * all from the same project. Falls back to stacked stills for reduced motion.
 */
export function StorySequence() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [caption, setCaption] = useState<string>(frames[0].caption);
  const [captionVisible, setCaptionVisible] = useState(true);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const total = track.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -track.getBoundingClientRect().top / total));
      const seg = p * (frames.length - 1);
      frameRefs.current.forEach((f, i) => {
        if (!f) return;
        const op = Math.max(0, 1 - Math.abs(seg - i));
        f.style.opacity = op.toFixed(3);
        const img = f.querySelector("img");
        if (img) img.style.transform = `scale(${(1.08 - 0.08 * op).toFixed(3)})`;
      });
      if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      setActive(Math.round(seg));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  // Fade the caption out, swap text, fade back in.
  useEffect(() => {
    if (reduce || frames[active].caption === caption) return;
    setCaptionVisible(false);
    const t = setTimeout(() => {
      setCaption(frames[active].caption);
      setCaptionVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [active, caption, reduce]);

  return (
    <section ref={trackRef} className={`story${reduce ? " story--static" : ""}`} aria-label="The studio, in sequence">
      <div className="story__stage">
        {frames.map((f, i) => (
          <div
            key={f.src + i}
            ref={(el) => { frameRefs.current[i] = el; }}
            className={`story__frame${f.kind === "drawing" ? " story__frame--drawing" : ""}`}
          >
            <img src={f.src} alt={f.alt} loading="lazy" />
            <div className="story__shade" />
            {reduce && (
              <h2 className="story__caption story__static-caption">{f.caption}</h2>
            )}
          </div>
        ))}
        <div className="story__text">
          <div className="container">
            <p className="story__kicker">The Studio · A Sequence</p>
            <h2 className="story__caption" style={{ opacity: captionVisible ? 1 : 0 }} aria-live="polite">
              {caption}
            </h2>
          </div>
        </div>
        <div className="story__progress" aria-hidden="true">
          <div ref={barRef} className="story__bar" />
        </div>
      </div>
    </section>
  );
}
