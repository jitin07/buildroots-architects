import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { budgetRanges, contactIntro, projectTypes } from '../../content/business'
import { site } from '../../config/site'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  emptyEnquiry,
  enquiryMailto,
  submitEnquiry,
  validateAll,
  validateField,
  type EnquiryFields,
  type FieldErrors,
} from '../../lib/contact'
import { PREFILL_ENQUIRY } from '../../lib/enquiry'
import './contact.css'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; message: string }
  | { kind: 'not-configured' }

const WHATSAPP_MESSAGE = 'Hello BuildRoots, I would like to discuss a project.'

/**
 * Contact section: direct details plus an enquiry form. Validation runs on
 * blur and clears as soon as a field is fixed; submit validates everything
 * and focuses the first problem. Success is shown only after the configured
 * endpoint confirms receipt.
 */
export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const uid = useId()
  const [fields, setFields] = useState<EnquiryFields>(emptyEnquiry)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  useScrollReveal(root)

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const type = (e as CustomEvent<string>).detail
      if (projectTypes.includes(type)) {
        setFields((f) => ({ ...f, projectType: type }))
        setErrors((er) => ({ ...er, projectType: undefined }))
      }
    }
    window.addEventListener(PREFILL_ENQUIRY, onPrefill)
    return () => window.removeEventListener(PREFILL_ENQUIRY, onPrefill)
  }, [])

  const id = (name: keyof EnquiryFields) => `${uid}-${name}`

  const onChange = (name: keyof EnquiryFields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setFields((f) => ({ ...f, [name]: value }))
    // Once an error is showing, re-check on every keystroke: it clears the moment the field is valid.
    if (errors[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }))
    if (status.kind === 'failed' || status.kind === 'not-configured') setStatus({ kind: 'idle' })
  }

  const onBlur = (name: keyof EnquiryFields) => (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (!value.trim()) return // Don't scold an untouched, empty field on blur.
    setErrors((er) => ({ ...er, [name]: validateField(name, value) }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateAll(fields)
    setErrors(found)
    const first = Object.keys(found)[0] as keyof EnquiryFields | undefined
    if (first) {
      form.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus()
      return
    }
    setStatus({ kind: 'sending' })
    const result = await submitEnquiry(fields, honeypot)
    if (result.status === 'sent') {
      setStatus({ kind: 'sent' })
      setFields(emptyEnquiry)
    } else if (result.status === 'not-configured') {
      setStatus({ kind: 'not-configured' })
    } else {
      setStatus({ kind: 'failed', message: result.message })
    }
  }

  const field = (name: keyof EnquiryFields) => ({
    id: id(name),
    name,
    value: fields[name],
    onChange: onChange(name),
    onBlur: onBlur(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id(name)}-error` : undefined,
    required: true,
  })

  const error = (name: keyof EnquiryFields) =>
    errors[name] ? (
      <p id={`${id(name)}-error`} className="field__error">
        {errors[name]}
      </p>
    ) : null

  const { city, region, country } = site.location

  return (
    <section ref={root} id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__intro">
        <p className="section__label t-caption" data-reveal>
          {contactIntro.label}
        </p>
        <h2 id="contact-title" className="contact__title t-display" data-reveal>
          {contactIntro.title}
        </h2>
        <p className="t-body" data-reveal>
          {contactIntro.text}
        </p>

        <dl className="contact__details" data-reveal>
          <div>
            <dt className="t-caption">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
          {site.phone && (
            <div>
              <dt className="t-caption">Phone</dt>
              <dd>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
              </dd>
            </div>
          )}
          <div>
            <dt className="t-caption">Studio</dt>
            <dd>
              {city}, {region}, {country}
            </dd>
          </div>
        </dl>

        {site.whatsapp ? (
          <a className="button contact__whatsapp" href={site.whatsapp.link(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" data-reveal>
            Chat on WhatsApp
          </a>
        ) : (
          import.meta.env.DEV && (
            <p className="contact__dev-note t-small">
              Dev note: set VITE_WHATSAPP_NUMBER in .env.local to show the WhatsApp button.
            </p>
          )
        )}
      </div>

      {status.kind === 'sent' ? (
        <div className="contact__success" role="status">
          <p className="t-caption">Enquiry sent</p>
          <h3 className="t-h2">Thank you — we have received your message.</h3>
          <p className="t-body">We will be in touch at the email or phone number you gave us.</p>
          <button type="button" className="button" onClick={() => setStatus({ kind: 'idle' })}>
            Send another enquiry
          </button>
        </div>
      ) : (
        <form ref={form} className="contact__form" noValidate onSubmit={onSubmit} aria-describedby={`${uid}-required`} data-reveal>
          <p id={`${uid}-required`} className="contact__required t-small">
            All fields are required.
          </p>

          <div className="field">
            <label htmlFor={id('name')}>Full name</label>
            <input type="text" autoComplete="name" {...field('name')} />
            {error('name')}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor={id('phone')}>Phone number</label>
              <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" {...field('phone')} />
              {error('phone')}
            </div>
            <div className="field">
              <label htmlFor={id('email')}>Email</label>
              <input type="email" autoComplete="email" {...field('email')} />
              {error('email')}
            </div>
          </div>

          <div className="field">
            <label htmlFor={id('location')}>Project location</label>
            <input type="text" autoComplete="address-level2" placeholder="City or area" {...field('location')} />
            {error('location')}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor={id('projectType')}>Project type</label>
              <select {...field('projectType')}>
                <option value="" disabled>
                  Choose…
                </option>
                {projectTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {error('projectType')}
            </div>
            <div className="field">
              <label htmlFor={id('budget')}>Approximate budget</label>
              <select {...field('budget')}>
                <option value="" disabled>
                  Choose…
                </option>
                {budgetRanges.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {error('budget')}
            </div>
          </div>

          <div className="field">
            <label htmlFor={id('description')}>Project description</label>
            <textarea rows={5} placeholder="Site, size, rooms, timeline…" {...field('description')} />
            {error('description')}
          </div>

          {/* Spam trap: invisible to people, filled in by bots. */}
          <div className="contact__trap" aria-hidden="true">
            <label htmlFor={`${uid}-company`}>Company</label>
            <input id={`${uid}-company`} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="contact__actions">
            <button type="submit" className="button button--primary" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
          </div>

          <div aria-live="polite" className="contact__live">
            {status.kind === 'failed' && (
              <div className="contact__alert" role="alert">
                <p>
                  <strong>Your enquiry wasn’t sent.</strong> {status.message} Your details are still here — try again, or email
                  them to us.
                </p>
                <div className="contact__alert-actions">
                  <button type="submit" className="button">
                    Try again
                  </button>
                  <a className="button" href={enquiryMailto(fields)}>
                    Email this enquiry
                  </a>
                </div>
              </div>
            )}
            {status.kind === 'not-configured' && (
              <div className="contact__alert" role="alert">
                <p>
                  <strong>Online sending isn’t set up yet, so this message was not sent.</strong> Email it to us instead — your
                  details are filled in for you.
                </p>
                <div className="contact__alert-actions">
                  <a className="button button--primary" href={enquiryMailto(fields)}>
                    Email this enquiry
                  </a>
                  {site.whatsapp && (
                    <a className="button" href={site.whatsapp.link(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
