import { OS1Provider, OS1HttpClient, functionBoundOption, } from '@os1-platform/console-ui-react';

import Initiate from './Initiate';

function AppInitiater(props: any) {
  /** This function is only for demonstration purpose that loads dropdown values dynamically */
  (async function autoComplete() {
    let returnValue: {value: string, text: string}[]=[]
        if (props && props.console) {
            var cl = new OS1HttpClient(props.console.authInitializer, 'https://jsonplaceholder.typicode.com/todos');
            
            const resp = await cl.get(``,'test-id');
            resp.data.map((response: any)=>{
                    returnValue.push({value: response.title, text: response.title})
                })

            functionBoundOption(returnValue,"Dropdown1" )
        }
})()

/**These are injectable controls that are optional component */
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
      placeholder: 'Select Items',
      id: 'Dropdown1',
      hasAsyncFunctionBoundOption: true
    }
  ];

  const handleConsoleInstanceChange = (changedConsoleInstance: any) => {
    props.setConsole(changedConsoleInstance);
  };

  return (
    <>
      <OS1Provider
        clientId={process.env.REACT_APP_CLIENT_ID}
        loginRedirectPath={'/os1-vehicle-reference-app'}
        logoutRedirectPath={'/'}
        devTenantId={process.env.REACT_APP_DEV_TENANT_ID}
        appId={process.env.REACT_APP_INITIAL_APP_ID}
        controls={controls}
        interTabCommunicationRequired={true}
      >
        <Initiate setConsole={handleConsoleInstanceChange} />
      </OS1Provider>
    </>
  );
}

export default AppInitiater;
