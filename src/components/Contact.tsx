import { useState, type ChangeEvent, type FormEvent } from "react";
import { CONTACT_EMAIL, projectTypes } from "../data/site";
import { Reveal } from "./Reveal";

type Form = { name: string; email: string; phone: string; projectType: string; message: string };
type Errors = Partial<Record<"name" | "email" | "message", boolean>>;

const empty: Form = { name: "", email: "", phone: "", projectType: "", message: "" };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Enquiry form. No backend is configured, so a valid submission hands a
 * pre-filled message to the visitor's email app — it never claims to have sent.
 */
export function Contact() {
  const [form, setForm] = useState<Form>(empty);
  const [err, setErr] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErr((x) => ({ ...x, [name]: false }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = true;
    if (!EMAIL_RE.test(form.email.trim())) next.email = true;
    if (!form.message.trim()) next.message = true;
    if (Object.keys(next).length) {
      setErr(next);
      return;
    }
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "-"}\nProject type: ${form.projectType || "-"}\n\n${form.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry — " + form.name)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setForm(empty);
    setErr({});
  };

  return (
    <section id="contact" className="section section--night2 contact">
      <div className="container contact__grid">
        <Reveal>
          <p className="eyebrow eyebrow--dark">Start a Project</p>
          <h2 className="contact__title">Let's discuss what you want to build.</h2>
          <p className="contact__lede">Tell us about your site and your brief. We'll come back to you to set up a first conversation.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact__email">{CONTACT_EMAIL}</a>
        </Reveal>
        <Reveal>
          {sent ? (
            <div className="sent" role="status">
              <h3>Opening your email…</h3>
              <p>
                Your message has been handed to your email app addressed to {CONTACT_EMAIL}. If nothing opened, write to us
                directly at that address.
              </p>
              <button type="button" onClick={reset}>Send another</button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div>
                <input className="field" name="name" value={form.name} onChange={onField} placeholder="Name" aria-label="Name"
                  autoComplete="name" aria-invalid={!!err.name} aria-describedby={err.name ? "err-name" : undefined} />
                {err.name && <p id="err-name" className="field-error">Please enter your name.</p>}
              </div>
              <div>
                <input className="field" name="email" type="email" value={form.email} onChange={onField} placeholder="Email"
                  aria-label="Email" autoComplete="email" aria-invalid={!!err.email}
                  aria-describedby={err.email ? "err-email" : undefined} />
                {err.email && <p id="err-email" className="field-error">Please enter a valid email.</p>}
              </div>
              <input className="field" name="phone" type="tel" value={form.phone} onChange={onField}
                placeholder="Phone (optional)" aria-label="Phone (optional)" autoComplete="tel" />
              <select className="field" name="projectType" value={form.projectType} onChange={onField} aria-label="Project type">
                <option value="">Project type</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div>
                <textarea className="field" name="message" value={form.message} onChange={onField} rows={4}
                  placeholder="Tell us about your project" aria-label="Message" aria-invalid={!!err.message}
                  aria-describedby={err.message ? "err-message" : undefined} />
                {err.message && <p id="err-message" className="field-error">Please add a short message.</p>}
              </div>
              <button type="submit" className="btn btn--gold form__submit">Send enquiry</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
