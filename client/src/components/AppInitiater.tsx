import { OS1Provider } from '@os1-platform/console-ui-react';

import Initiate from './Initiate';

function AppInitiater(props: any) {
  const controls = [
    {
      type: 'SearchBox',
      width: 100,
      placeholder: 'Search Routes',
      float: 'left',
      id: 'SearchBox1',
      lensIcon: true,
    },
    {
      type: 'DropDown',
      width: 100,
      placeholder: 'Search Items',
      id: 'Dropdown1',
      functionBoundOption: [
        { value: 'Team A', text: 'Team A' },
        { value: 'Team B', text: 'Team B' },
        { value: 'Team C', text: 'Team C' },
      ],
    },
  ];

  const handleConsoleInstanceChange = (changedConsoleInstance: any) => {
    props.setConsole(changedConsoleInstance);
  };

  return (
    <>
      <OS1Provider
        clientId={'platform:app:ui'}
        loginRedirectPath={'/vehicle'}
        logoutRedirectPath={'/'}
        //devOrgName={'delhivery'}
        appId={'Single Leg-app:435858a9-1238-5ca9-b100-a5d46d108910'}
        controls={controls}
      >
        <Initiate setConsole={handleConsoleInstanceChange} />
      </OS1Provider>
    </>
  );
}

export default AppInitiater;
