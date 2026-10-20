/** Fired to preset the contact form's project type (e.g. from a project's "discuss" link). */
export const PREFILL_ENQUIRY = 'buildroots:prefill-enquiry'

export function prefillEnquiry(projectType: string) {
  window.dispatchEvent(new CustomEvent<string>(PREFILL_ENQUIRY, { detail: projectType }))
}
