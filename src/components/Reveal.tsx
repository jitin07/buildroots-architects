import { useEffect, useRef, useState, type ElementType, type ReactNode, type HTMLAttributes } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; children?: ReactNode };

/** Fades its content in place when it scrolls into view (no movement). */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, visible]);

  const cls = reduce ? className : `${className} reveal-armed${visible ? " is-visible" : ""}`.trim();
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
