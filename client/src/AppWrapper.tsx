import { useState } from 'react';

import AppInitiater from './components/AppInitiater';
import ConsoleUIProvider from './components/ConsoleUIProvider';
import './index.css';

function AppWrapper() {
  const [console, setConsole] = useState(null); // This state is used by client app, to set the context of console UI

  return (
    <>
      <AppInitiater setConsole={setConsole} console={console} />
      <ConsoleUIProvider console={console} />
    </>
  );
}

export default AppWrapper;
