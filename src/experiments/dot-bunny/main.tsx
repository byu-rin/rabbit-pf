import React from 'react';
import ReactDOM from 'react-dom/client';
import DotBunny from './DotBunny';

// Standalone entry — mounts ONLY the experiment. Does not import the site's
// App, styles, or routes.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DotBunny />
  </React.StrictMode>,
);
