import { brand, CONTACT_EMAIL, navLinks, routes } from "../data/site";

const footerServices = ["Architectural Design", "Interior Design", "Design Development", "Construction & Execution"];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src={brand.logoFull} alt="BuildRoots Architects" loading="lazy" />
            <p>Architecture, interior design and execution — spaces shaped around people, place and possibility.</p>
          </div>
          <div>
            <p className="footer__heading">Explore</p>
            <div className="footer__list">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="footer__heading">Services</p>
            <div className="footer__list">
              {footerServices.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="footer__heading">Get in touch</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer__email">{CONTACT_EMAIL}</a>
            <a href={routes.contact} className="footer__enquire">Enquire →</a>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} BuildRoots Architects. All rights reserved.</span>
          <span>Architecture · Interiors · Execution</span>
        </div>
      </div>
    </footer>
  );
}
