import { ConsoleUIContext } from '@os1-platform/console-ui-react';
import React from 'react';

function Initiate(props: any) {
  /**To integrate Console V2, we have to use Context of Console UI */
  const context = ConsoleUIContext as React.Context<any>;
  const consoleInstance = React.useContext(context);
  if (consoleInstance) {
    props.setConsole(consoleInstance);
  }
  return <></>;
}

export default Initiate;
