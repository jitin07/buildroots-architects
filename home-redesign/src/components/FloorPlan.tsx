import { flagship } from "../data/site";
import { FloorPlanViewer } from "./FloorPlanViewer";
import { Reveal } from "./Reveal";

export function FloorPlan() {
  const plan = flagship.floorPlan;
  return (
    <section id="plan" className="section section--cream">
      <div className="container">
        <Reveal className="plan__head">
          <p className="eyebrow eyebrow--light">Architectural Drawing</p>
          <h2 className="h2 h2--dark">The actual ground-floor plan</h2>
          <p className="plan__lede">
            The real 2D layout drawn for the BuildRoots studio. Zoom, pan and open full-screen to read every room, dimension and
            annotation.
          </p>
        </Reveal>
        <Reveal>
          <FloorPlanViewer src={plan.src} alt={plan.alt} title={plan.title} legend={plan.legend} />
        </Reveal>
      </div>
    </section>
  );
}
