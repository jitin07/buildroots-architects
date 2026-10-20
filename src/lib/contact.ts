import { site } from '../config/site'

export type EnquiryFields = {
  name: string
  phone: string
  email: string
  location: string
  projectType: string
  budget: string
  description: string
}

export type FieldErrors = Partial<Record<keyof EnquiryFields, string>>

export const emptyEnquiry: EnquiryFields = {
  name: '',
  phone: '',
  email: '',
  location: '',
  projectType: '',
  budget: '',
  description: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Validates one field. Messages say what to do, never blame. */
export function validateField(field: keyof EnquiryFields, raw: string): string | undefined {
  const value = raw.trim()
  switch (field) {
    case 'name':
      return value.length >= 2 ? undefined : 'Enter your full name.'
    case 'phone': {
      const digits = value.replace(/\D/g, '')
      if (!value) return 'Enter a phone number so we can call you back.'
      return digits.length >= 10 && digits.length <= 15 && /^[+\d\s()-]+$/.test(value)
        ? undefined
        : 'Enter a phone number with 10–15 digits, e.g. +91 98765 43210.'
    }
    case 'email':
      if (!value) return 'Enter your email address.'
      return EMAIL.test(value) ? undefined : 'Enter an email address like name@example.com.'
    case 'location':
      return value.length >= 2 ? undefined : 'Enter the city or area of the project.'
    case 'projectType':
      return value ? undefined : 'Choose the type of project.'
    case 'budget':
      return value ? undefined : 'Choose an approximate budget, or “Not sure yet”.'
    case 'description':
      if (value.length < 20) return 'Tell us a little more — at least 20 characters.'
      return value.length <= 2000 ? undefined : 'Keep the description under 2,000 characters.'
  }
}

export function validateAll(fields: EnquiryFields): FieldErrors {
  const errors: FieldErrors = {}
  for (const key of Object.keys(fields) as (keyof EnquiryFields)[]) {
    const error = validateField(key, fields[key])
    if (error) errors[key] = error
  }
  return errors
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'failed'; message: string }

/**
 * Sends the enquiry to the configured form endpoint as JSON. Success is
 * reported ONLY when the endpoint answers with a 2xx status. With no endpoint
 * configured, nothing is sent and the caller is told so.
 */
export async function submitEnquiry(fields: EnquiryFields, honeypot: string): Promise<SubmitResult> {
  const { endpoint, accessKey } = site.contactForm
  if (!endpoint) return { status: 'not-configured' }

  const payload: Record<string, string> = {
    ...trimAll(fields),
    subject: `New project enquiry — ${fields.projectType} (${fields.location.trim()})`,
    // Many form services drop submissions that fill this hidden field.
    _gotcha: honeypot,
  }
  if (accessKey) payload.access_key = accessKey

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (response.ok) return { status: 'sent' }
    return { status: 'failed', message: `The form service responded with an error (${response.status}).` }
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError'
    return {
      status: 'failed',
      message: aborted ? 'The request took too long.' : 'We couldn’t reach the form service — check your connection.',
    }
  } finally {
    window.clearTimeout(timeout)
  }
}

function trimAll(fields: EnquiryFields): EnquiryFields {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])) as EnquiryFields
}

/** A ready-to-send email with the enquiry, for when online sending isn't available. */
export function enquiryMailto(fields: EnquiryFields) {
  const f = trimAll(fields)
  const body = [
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    `Project location: ${f.location}`,
    `Project type: ${f.projectType}`,
    `Approximate budget: ${f.budget}`,
    '',
    f.description,
  ].join('\n')
  const subject = `Project enquiry — ${f.projectType || 'BuildRoots'}`
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
