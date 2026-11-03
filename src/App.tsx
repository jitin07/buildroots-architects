import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { Flagship } from "./components/Flagship";
import { Interiors } from "./components/Interiors";
import { StorySequence } from "./components/StorySequence";
import { FloorPlan } from "./components/FloorPlan";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="root">
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Flagship />
        <Interiors />
        <StorySequence />
        <FloorPlan />
        <Projects />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
