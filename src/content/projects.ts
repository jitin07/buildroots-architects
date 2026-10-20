import home from '../assets/media/07_home.webp'
import daylight from '../assets/media/05_finishes.webp'
import entrance from '../assets/media/08_welcome.webp'
import blueprint from '../assets/media/blueprint.webp'
import foundation from '../assets/media/02_foundation.webp'
import structure from '../assets/media/03_structure.webp'
import masonry from '../assets/media/04_masonry.webp'
import landscape from '../assets/media/06_landscape.webp'

/**
 * Portfolio records. Replace these demonstration records with real projects:
 * set `status: 'completed'` (or 'in-progress') ONLY for genuine BuildRoots
 * work, and fill location/year only with verified details. Every record
 * below is a concept or visualisation and is labelled as such on the site.
 *
 * `cover: null` shows a drawn placeholder until photographs are available.
 */

export type ProjectStatus = 'concept' | 'in-progress' | 'completed'

export type ProjectCategory =
  | 'Contemporary residence'
  | 'Luxury farmhouse'
  | 'Interior design'
  | 'Commercial architecture'
  | 'Renovation & construction'

export type ProjectImage = { src: string; alt: string }

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  status: ProjectStatus
  /** Shown only when set. Use real, verified details. */
  location?: string
  year?: string
  summary: string
  scope: string[]
  cover: ProjectImage | null
  gallery: ProjectImage[]
  /** Drawn placeholder used when there is no cover image. */
  placeholder?: 'farmhouse' | 'commercial' | 'interior'
  /** Maps to the contact form's project type when someone asks about a similar project. */
  enquiryType: string
}

export const statusLabel: Record<ProjectStatus, string> = {
  concept: 'Concept',
  'in-progress': 'In progress',
  completed: 'Completed',
}

export const projects: Project[] = [
  {
    id: 'contemporary-residence',
    title: 'Contemporary Residence',
    category: 'Contemporary residence',
    status: 'concept',
    summary:
      'A two-storey family home with a glazed ground floor, a timber-screened upper volume and a perforated brick screen that filters light and views.',
    scope: ['Concept design', 'Elevations', '3D visualisation'],
    cover: { src: home, alt: 'Concept render of a two-storey contemporary house at dusk with lit interiors and timber fins' },
    gallery: [
      { src: daylight, alt: 'Daylight concept render of the front elevation with timber fins and brick screen' },
      { src: entrance, alt: 'Concept render of the entrance with a timber pivot door and stepping stones' },
      { src: blueprint, alt: 'Line drawing of the front elevation' },
    ],
    enquiryType: 'Contemporary residence',
  },
  {
    id: 'luxury-farmhouse',
    title: 'Farmhouse Retreat',
    category: 'Luxury farmhouse',
    status: 'concept',
    summary:
      'A single-storey farmhouse study: deep verandahs, a central courtyard and pitched roofs that open the living spaces to orchards on every side.',
    scope: ['Concept design', 'Site planning'],
    cover: null,
    gallery: [],
    placeholder: 'farmhouse',
    enquiryType: 'Farmhouse',
  },
  {
    id: 'residential-interior',
    title: 'Residential Interior',
    category: 'Interior design',
    status: 'concept',
    summary:
      'An open living and dining space arranged around daylight, with warm timber, soft plaster and a calm, restrained palette.',
    scope: ['Space planning', 'Materials & finishes', 'Furniture layout', 'Visualisation'],
    cover: { src: entrance, alt: 'Concept render looking through full-height glazing into a dining space with pendant lights' },
    gallery: [{ src: home, alt: 'Concept render of the lit interior seen from the garden' }],
    enquiryType: 'Interior design',
  },
  {
    id: 'commercial-studio',
    title: 'Commercial Studio Building',
    category: 'Commercial architecture',
    status: 'concept',
    summary:
      'A study for a compact workplace building: a regular structural grid, deep window reveals for solar control and a flexible open floor plate.',
    scope: ['Concept design', 'Facade study'],
    cover: null,
    gallery: [],
    placeholder: 'commercial',
    enquiryType: 'Commercial',
  },
  {
    id: 'construction-sequence',
    title: 'From Site to Home',
    category: 'Renovation & construction',
    status: 'concept',
    summary:
      'A visualised build sequence — foundations, frame, masonry and landscape — showing how design intent is carried through each stage on site.',
    scope: ['Construction sequencing', 'Site coordination', 'Visualisation'],
    cover: { src: structure, alt: 'Visualisation of a concrete frame under construction with scaffolding and a tower crane' },
    gallery: [
      { src: foundation, alt: 'Visualisation of foundations being laid on site' },
      { src: masonry, alt: 'Visualisation of masonry walls going up within the frame' },
      { src: landscape, alt: 'Visualisation of the finished house with landscaping' },
    ],
    enquiryType: 'Renovation / construction',
  },
]
