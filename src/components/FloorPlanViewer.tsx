import { useCallback, useEffect, useRef, useState } from "react";

type Props = { src: string; alt: string; title: string; legend?: string };

const MIN = 1;
const MAX = 6;

/**
 * Zoom / pan / fit / full-screen viewer for an actual architectural drawing.
 * The drawing is only transformed for display — never altered.
 */
export function FloorPlanViewer({ src, alt, title, legend }: Props) {
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fp = useRef({ scale: 1, tx: 0, ty: 0 });
  const [zoom, setZoom] = useState(1);

  const apply = useCallback(() => {
    const v = viewRef.current, img = imgRef.current;
    if (!v || !img) return;
    const s = fp.current;
    const maxX = Math.max(0, (img.offsetWidth * s.scale - v.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * s.scale - v.clientHeight) / 2);
    s.tx = Math.max(-maxX, Math.min(maxX, s.tx));
    s.ty = Math.max(-maxY, Math.min(maxY, s.ty));
    img.style.transform = `translate(-50%,-50%) translate(${s.tx}px,${s.ty}px) scale(${s.scale})`;
    v.style.cursor = s.scale > 1 ? "grab" : "default";
    setZoom(s.scale);
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const s = fp.current;
    s.scale = Math.max(MIN, Math.min(MAX, s.scale * factor));
    if (s.scale === 1) { s.tx = 0; s.ty = 0; }
    apply();
  }, [apply]);

  const reset = () => { fp.current = { scale: 1, tx: 0, ty: 0 }; apply(); };

  const toggleFull = () => {
    const v = viewRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  };

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
    };

    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    const down = (e: PointerEvent) => {
      if (fp.current.scale <= 1) return;
      dragging = true;
      view.style.cursor = "grabbing";
      sx = e.clientX; sy = e.clientY; ox = fp.current.tx; oy = fp.current.ty;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      fp.current.tx = ox + (e.clientX - sx);
      fp.current.ty = oy + (e.clientY - sy);
      apply();
    };
    const up = () => {
      dragging = false;
      if (fp.current.scale > 1) view.style.cursor = "grab";
    };
    const reclamp = () => apply();

    view.addEventListener("wheel", onWheel, { passive: false });
    view.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("resize", reclamp);
    document.addEventListener("fullscreenchange", reclamp);
    return () => {
      view.removeEventListener("wheel", onWheel);
      view.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", reclamp);
      document.removeEventListener("fullscreenchange", reclamp);
    };
  }, [apply, zoomBy]);

  return (
    <div className="viewer">
      <div className="viewer__bar">
        <div className="viewer__label">
          <span className="viewer__dot" />
          <span className="viewer__title">{title}</span>
        </div>
        <div className="viewer__controls">
          <button type="button" className="viewer__btn viewer__btn--icon" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.4)}>
            &minus;
          </button>
          <span className="viewer__zoom" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" className="viewer__btn viewer__btn--icon" aria-label="Zoom in" onClick={() => zoomBy(1.4)}>
            +
          </button>
          <button type="button" className="viewer__btn viewer__btn--text" onClick={reset}>Fit</button>
          <button type="button" className="viewer__btn viewer__btn--text viewer__btn--primary" onClick={toggleFull}>
            Full screen
          </button>
        </div>
      </div>
      <div ref={viewRef} className="viewer__view">
        <img ref={imgRef} className="viewer__img" src={src} alt={alt} draggable={false} loading="lazy" />
      </div>
      {legend && (
        <div className="viewer__legend">
          <strong>Legend</strong>
          {legend}
        </div>
      )}
    </div>
  );
}
