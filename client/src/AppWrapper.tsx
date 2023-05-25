import { useState } from 'react';

import AppInitiater from './components/AppInitiater';
import ConsoleUIProvider from './components/ConsoleUIProvider';
import './index.css';

function AppWrapper() {
  const [console, setConsole] = useState(null);

  return (
    <>
      <AppInitiater setConsole={setConsole} console={console} />
      <ConsoleUIProvider console={console} />
    </>
  );
}

export default AppWrapper;
