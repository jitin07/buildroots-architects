// Story sequence copy. Draft wording — replace with approved BuildRoots copy.

import { services } from './services'

export const archWords = [
  { id: 'form', word: 'Form', note: 'Long, low volumes anchored by natural stone.' },
  { id: 'space', word: 'Space', note: 'Floor-to-ceiling glazing that lets the garden in.' },
  { id: 'light', word: 'Light', note: 'Every room arranged around daylight and view.' },
  { id: 'living', word: 'Living', note: 'Calm, warm rooms made for everyday life.' },
] as const

export type ArchWordId = (typeof archWords)[number]['id']

export const philosophy = {
  label: 'Our philosophy',
  lines: ['Designed with purpose.', 'Crafted with precision.', 'Built to last.'],
}

/**
 * Data section items. These are the practice's SERVICES, shown as numbered
 * disciplines — not achievements. To show verified figures instead, use
 * `{ kind: 'figure', value: 120, suffix: '+', label: 'Homes completed' }`.
 * Never put unverified numbers here.
 */
export type StatItem =
  | { kind: 'index'; label: string; description: string }
  | { kind: 'figure'; value: number; suffix?: string; label: string; description?: string }

export const stats: { label: string; title: string; items: StatItem[] } = {
  label: 'What we do',
  title: 'One practice, from first sketch to final detail',
  items: services.map((service) => ({ kind: 'index', label: service.short, description: service.summary })),
}

/** Showreel caption. Keep to verified facts about the project shown. */
export const showreel = {
  label: 'Selected work',
  title: 'Private residence',
  meta: ['Architecture', 'Interiors', 'Visualisation'],
  note: 'Concept visualisation',
}
