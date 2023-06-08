import { ConsoleUIContext } from '@os1-platform/console-ui-react';
import React from 'react';

function Initiate(props: any) {
  const context = ConsoleUIContext as React.Context<any>;
  const consoleInstance = React.useContext(context);
  if (consoleInstance) {
    props.setConsole(consoleInstance);
  }
  return <></>;
}

export default Initiate;
