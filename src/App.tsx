import { Navigation } from './components';
import { GenerativeWorld } from './lab/GenerativeWorld';
import { Overlay } from './lab/Overlay';
import { Terminal } from './lab/Terminal';

function App() {
  return (
    <div id="top" className="relative w-full bg-lab-void">
      {/* fixed 4D dot-space behind everything */}
      <GenerativeWorld />

      {/* preserved header layout, re-skinned for the lab */}
      <Navigation />

      {/* scrollable narrative that drives the camera */}
      <Overlay />

      {/* the CLI as a physical object in the world */}
      <Terminal />
    </div>
  );
}

export default App;
