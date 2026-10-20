/** The practice's services — single source for the Services section and the story's data section. */
export type Service = {
  id: string
  title: string
  /** Short label for compact layouts (story data section). */
  short: string
  summary: string
  deliverables: string[]
}

export const services: Service[] = [
  {
    id: 'architecture',
    title: 'Architectural Design',
    short: 'Architecture',
    summary: 'From the first concept to buildable drawings, shaped around site, light and the way you live.',
    deliverables: ['Concept design', 'Planning', 'Elevations', 'Working drawings'],
  },
  {
    id: 'interiors',
    title: 'Interior Design',
    short: 'Interiors',
    summary: 'Interiors conceived with the architecture, so every room feels considered and complete.',
    deliverables: ['Space planning', 'Materials & finishes', 'Furniture layouts', 'Visualisation'],
  },
  {
    id: 'construction',
    title: 'Construction & Execution',
    short: 'Construction',
    summary: 'Design intent carried through to site, with coordination and checks at every stage.',
    deliverables: ['Site execution', 'Coordination', 'Quality monitoring'],
  },
  {
    id: 'visualisation',
    title: '3D Visualization',
    short: 'Visualisation',
    summary: 'See the space before it is built, inside and out, and decide with confidence.',
    deliverables: ['Photorealistic exterior renders', 'Photorealistic interior renders'],
  },
  {
    id: 'cost',
    title: 'BOQ & Cost Planning',
    short: 'Cost planning',
    summary: 'Clear quantities and specifications, so the budget is understood before work begins.',
    deliverables: ['Quantity estimation', 'Material specifications', 'Budget planning'],
  },
]
