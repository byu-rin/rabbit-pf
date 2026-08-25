import {
  Navigation,
  Hero,
  Projects,
  About,
  Skills,
  Contact,
  Footer,
} from './components';

function App() {
  return (
    <div className="w-full">
      <Navigation />
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
