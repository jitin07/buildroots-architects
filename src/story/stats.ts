import type { StatItem } from '../content/story'

/** The number an item counts up to: its position for services, its value for verified figures. */
export function statTarget(item: StatItem, index: number) {
  return item.kind === 'index' ? index + 1 : item.value
}

export function formatStat(item: StatItem, value: number) {
  return item.kind === 'index' ? String(Math.round(value)).padStart(2, '0') : `${Math.round(value)}${item.suffix ?? ''}`
}
