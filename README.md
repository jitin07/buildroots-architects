# BuildRoots Architects — Website

Vite + React + TypeScript implementation of the Claude Design hand-off `project/Home.dc.html`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Structure

```
./
  public/assets/            optimized images served as-is
    brand/                  mark.png, logo-full.png (transparent)
    projects/buildroots-office/
                            exterior-*.webp, interior-*.webp,
                            ground-floor-plan.webp (full 3625×4541, unaltered geometry)
  scripts/optimize-images.mjs   regenerates public/assets from source PNGs (set ASSETS_SRC)
  src/
    data/site.ts            all copy, routes and project → asset mapping
    hooks/useReducedMotion.ts
    components/             Nav, Hero, Intro, Flagship, Interiors, StorySequence,
                            FloorPlan + FloorPlanViewer, Services, Process, Contact, Footer
    styles/global.css       design tokens + section styles
```

## Behaviour notes

- **Scroll reveals** fade in place (no movement); hero has a gentle parallax.
- **Story sequence** is a sticky, scroll-driven crossfade: exterior → interior → actual ground-floor plan (all from the same project).
- **Floor-plan viewer**: zoom buttons, mouse-wheel zoom (1×–6×), drag to pan, Fit, Full screen.
- **Reduced motion**: reveals, parallax and the sticky sequence are disabled; the sequence becomes stacked stills.
- **Enquiry form** validates name / email / message. No backend is configured, so a valid submission opens the visitor's
  email app pre-filled to `connect@buildroots.in` and says so — it never claims the message was sent.
- **Navigation**: the design links to separate Projects / About / Contact pages that are not built yet. Until they are,
  `routes` in `src/data/site.ts` points those links at the matching Home sections. Change them there when the pages exist.
