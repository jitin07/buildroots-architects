import { useEffect, useState } from "react";
import { brand, navLinks, routes } from "../data/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`nav${scrolled ? " is-scrolled" : ""}`} aria-label="Main">
        <a href={routes.home} className="nav__brand">
          <img src={brand.mark} alt="BuildRoots Architects" className="nav__mark" />
          <span className="nav__wordmark">
            BuildRoots
            <br />
            <small>Architects</small>
          </span>
        </a>
        <div className="nav__links">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
          <a href={routes.contact} className="nav__cta">
            Discuss Your Project
          </a>
        </div>
        <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__top">
            <img src={brand.mark} alt="" style={{ height: 42 }} />
            <button className="menu__close" aria-label="Close" onClick={close}>
              &times;
            </button>
          </div>
          <div className="menu__links">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={close}>
                {l.label}
              </a>
            ))}
          </div>
          <a href={routes.contact} onClick={close} className="menu__cta">
            Discuss Your Project
          </a>
        </div>
      )}
    </>
  );
}
