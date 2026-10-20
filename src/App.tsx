import LoadingScreen from './components/LoadingScreen'
import Scene from './components/Scene'
import Navigation from './components/Navigation'
import ScrollExperience from './components/ScrollExperience'
import StoryStage from './story/StoryStage'
import DevHud from './components/DevHud'
import Footer from './components/Footer'
import Portfolio from './sections/portfolio/Portfolio'
import Services from './sections/Services'
import About from './sections/About'
import Contact from './sections/contact/Contact'

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Navigation />
      <ScrollExperience>
        <StoryStage>
          <Scene />
        </StoryStage>
        <Portfolio />
        <Services />
        <About />
        <Contact />
      </ScrollExperience>
      <Footer />
      {import.meta.env.DEV && <DevHud />}
    </>
  )
}
