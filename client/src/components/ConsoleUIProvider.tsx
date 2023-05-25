//import { sharedAccessBundle } from 'header/AuthenticatedHeader';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import CreateVehicle from '../pages/CreateVehicle';
import EditVehicle from '../pages/EditVehicle';
import ErrorPage from '../pages/ErrorPage';
import ListVehicles from '../pages/ListVehicles';
import ViewVehicle from '../pages/ViewVehicle';
import Root from '../routes/root';
import App from './AppInitiater';

// import { Home } from './home';

const ConsoleUIProvider = (props: any) => {
  const [consoleInstance, setConsoleInstance] = useState(null);
  useEffect(() => {
    setConsoleInstance(props.console);
  }, [props.console]);
  if (consoleInstance) {
    window.console.log(consoleInstance);
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <ListVehicles console={consoleInstance} />,
        },
      ],
    },
    {
      path: '/vehicle',
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
          element: <ListVehicles console={consoleInstance} />,
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
