//import { sharedAccessBundle } from 'header/AuthenticatedHeader';
import { PropsWithChildren, useEffect, useState, useCallback, memo } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import CreateVehicle from '../pages/CreateVehicle';
import EditVehicle from '../pages/EditVehicle';
import ErrorPage from '../pages/ErrorPage';
import ListVehicles from '../pages/ListVehicles';
import ViewVehicle from '../pages/ViewVehicle';
import {getToken} from '../api/vehicles';
import Root from '../routes/root';
import App from './AppInitiater';

// import { Home } from './home';

window.name = ""

const ConsoleUIProvider = (props: any) => {
  const [consoleInstance, setConsoleInstance] = useState(null);

  useEffect(() => {

    setConsoleInstance(props.console);
    (async function (){
      const token = await getToken(props.console)
      sessionStorage.setItem("appOwnerId", token);
    })()
    const handleEvent = (e: any)=>{
      //console.log(e)
      window.name =JSON.stringify(e.detail.payload.data)
      // console.log("Message recieved at SSE broker timestamp :-", e.detail.payload.brokerTimestamp );
      // console.log("Message recieved at SSE agent timestamp :-", e.detail.payload.agentTimestamp );
      // console.log("Message recieved at Console timestamp :-", e.detail.payload.consoleTimestamp)
    }
    document.addEventListener(props.console?.events()?.SSECallBackEvent,handleEvent)

    return () => {
      document.removeEventListener(props.console?.events()?.SSECallBackEvent, handleEvent);
    };
  }, [props.console]);


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <ListVehicles console={consoleInstance}/>,
        },
      ],
    },
    {
      path: '/os1-vehicle-reference-app',
      element: <Root />,
      errorElement: <ErrorPage />,
      handle: {
        crumb: {
          title: 'Vehicles',
        },
      },
      children: [
        {
          index: true,
          element: <ListVehicles console={consoleInstance}/>,
        },
        {
          path: 'create',
          element: <CreateVehicle console={consoleInstance} />,
          handle: {
            crumb: {
              title: 'Create',
            },
          },
        },
        {
          path: ':id',
          element: <Outlet />,
          handle: {
            crumb: {
              title: 'View',
            },
          },
          children: [
            {
              path: '',
              element: <ViewVehicle console={consoleInstance} />,
            },
            {
              path: 'edit',
              element: <EditVehicle console={consoleInstance} />,
              handle: {
                crumb: {
                  title: 'Edit',
                },
              },
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ConsoleUIProvider;
