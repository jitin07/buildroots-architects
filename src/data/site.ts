// Single source of truth for page content and asset paths.
// Only verified information from the design hand-off lives here.

const office = "/assets/projects/buildroots-office";

export const CONTACT_EMAIL = "connect@buildroots.in";

/**
 * Navigation targets. The design links to separate Projects / About / Contact
 * pages that are not built yet, so these point at the matching Home sections.
 * Swap them for real routes once those pages exist.
 */
export const routes = {
  home: "#top",
  projects: "#project",
  about: "#about",
  contact: "#contact",
} as const;

export const navLinks = [
  { label: "Home", href: routes.home },
  { label: "Projects", href: routes.projects },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export const brand = {
  mark: "/assets/brand/mark.png",
  logoFull: "/assets/brand/logo-full.png",
};

export const flagship = {
  name: "BuildRoots Architects Studio",
  meta: [
    { label: "Type", value: "Studio Office" },
    { label: "Scope", value: "Architecture + Interiors" },
    { label: "Status", value: "Built" },
  ],
  hero: { src: `${office}/exterior-staircase.webp`, alt: "BuildRoots Architects studio at dusk" },
  cover: { src: `${office}/exterior-entrance.webp`, alt: "BuildRoots Architects studio entrance at golden hour" },
  interiors: [
    { src: `${office}/interior-conference.webp`, alt: "Conference room with timber ceiling and jali screen", label: "Conference Room" },
    { src: `${office}/interior-cabin.webp`, alt: "Director's cabin with slatted timber wall", label: "Principal's Cabin" },
  ],
  floorPlan: {
    src: `${office}/ground-floor-plan.webp`,
    title: "Ground Floor Plan · BuildRoots Architects Studio",
    alt: "Ground floor plan of the BuildRoots Architects studio showing conference room, reception and waiting, office, toilet, shaft, entrance and staircase",
    legend: "1 Conference Room · 2 Reception & Waiting · 3 Office · 4 Toilet · 5 Shaft · 6 Entrance · 7 Staircase",
  },
  story: [
    { src: `${office}/exterior-entrance.webp`, alt: "Arriving at the BuildRoots studio", caption: "Arrive.", kind: "photo" },
    { src: `${office}/interior-conference.webp`, alt: "Inside the conference room", caption: "Step inside.", kind: "photo" },
    { src: `${office}/ground-floor-plan.webp`, alt: "The ground floor plan", caption: "Read the plan.", kind: "drawing" },
  ] as const,
};

export const services = [
  { num: "01", title: "Architectural Design", body: "Site-led concepts, massing and detailing for residential and commercial buildings." },
  { num: "02", title: "Interior Design", body: "Material palettes, joinery and lighting carried through from shell to furnishing." },
  { num: "03", title: "Design Development", body: "Technical drawings and documentation that make the concept buildable." },
  { num: "04", title: "Construction & Execution", body: "On-site coordination and oversight through to a finished, handed-over space." },
];

export const steps = [
  { num: "01", title: "Understand", body: "Reading the brief, the site and the way you want to live or work." },
  { num: "02", title: "Conceptualize", body: "Massing, planning and early ideas tested against light and outlook." },
  { num: "03", title: "Design", body: "Spaces, materials and detail resolved into a coherent whole." },
  { num: "04", title: "Develop", body: "Working drawings and documentation prepared for execution." },
  { num: "05", title: "Deliver", body: "Built on site with oversight, down to the final detail." },
];

const anupJiHouse = "/assets/projects/anup-ji-house";

export const projects = [
  {
    slug: "anup-ji-house",
    name: "Anup Ji House",
    cover: { src: `${anupJiHouse}/exterior-front.png`, alt: "Anup Ji House — modern residential exterior at dusk" },
    meta: [
      { label: "Type", value: "Residential" },
      { label: "Scope", value: "Architecture + Interiors" },
      { label: "Status", value: "In Progress" },
    ],
  },
];

export const projectTypes = [
  "Residential Architecture",
  "Commercial Architecture",
  "Interior Design",
  "Design + Execution",
  "Other",
];
