# BuildRoots Architects — website

Immersive single-page site for BuildRoots Architects (architecture, interior design and construction, Greater Noida, India): a scroll-driven 3D walk through a house, followed by portfolio, services, about and contact sections.

**Stack:** React 19 · TypeScript · Vite 8 · Three.js / React Three Fiber / Drei · @react-three/postprocessing · GSAP ScrollTrigger

## Getting started

Requires Node.js `^20.19` or `>=22.12`.

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check, lint and build in one go |

Development helpers (dev server only): add `?reduced-motion` to the URL to preview the reduced-motion version, or `?no-webgl` to preview the still-image fallback. In the console, `__story.seek('stats')` jumps to a story section.

## Configuration

All deployment-specific values are environment variables (see `.env.example`). Anything left empty is hidden on the site — nothing is invented.

| Variable | Purpose |
| --- | --- |
| `VITE_CONTACT_ENDPOINT` | **Required for the contact form to send.** A form service URL that accepts JSON and returns 2xx (e.g. Formspree, Web3Forms). Without it the form explains that online sending isn't set up and offers a pre-filled email instead. |
| `VITE_CONTACT_ACCESS_KEY` | Only for services that need a key in the body (e.g. Web3Forms). |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number, international format, digits only. Shows the WhatsApp buttons. |
| `VITE_PUBLIC_PHONE` | Phone number as it should be displayed. |
| `VITE_SOCIAL_*` | Social profile URLs (Instagram, LinkedIn, Facebook, YouTube, Pinterest). |
| `SITE_URL` | Public URL (no trailing slash). Adds canonical/Open Graph URLs and generates `sitemap.xml`. |

## Editing content

| What | Where |
| --- | --- |
| Portfolio projects | `src/content/projects.ts` — replace the concept records with real ones; set `status: 'completed'` only for genuine BuildRoots projects |
| Services | `src/content/services.ts` |
| About, contact copy, project types, budget ranges | `src/content/business.ts` |
| Story words, philosophy, showreel caption | `src/content/story.ts` |
| Email, location, nav links | `src/config/site.ts` |
| Images and video | `src/assets/media/` |

## Project structure

```
src/
  components/   Navigation, loading screen, 3D canvas wrapper (with WebGL fallback), footer
  story/        Pinned scroll story: master GSAP timeline, schedule, sections A–F
  scenes/       3D scene: procedural house, materials, garden, lighting, camera path
  sections/     Portfolio, Services, About, Contact
  content/      All site copy and records
  config/       Business configuration (reads env vars)
  lib/, hooks/  Shared helpers
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository. The Vite preset is detected (`vercel.json` sets build command `npm run build` and output `dist`).
3. Under **Settings → Environment Variables**, add the variables above (at least `VITE_CONTACT_ENDPOINT` and `SITE_URL`). `VITE_*` values are baked in at build time, so redeploy after changing them.
4. Deploy. `vercel.json` adds long-term caching for hashed assets and basic security headers.

## Notes

- The 3D bundle (~300 kB gzip) loads lazily after the page shell; without WebGL, or if it fails to load, a still render is shown and the rest of the site works normally.
- Reduced-motion users get an opacity-only version with camera cuts instead of the fly-through.
- Portfolio entries are currently concept/visualisation records and are labelled “Concept” on the site.
