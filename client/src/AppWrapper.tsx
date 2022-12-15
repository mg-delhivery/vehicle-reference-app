import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import CreateVehicle from './pages/CreateVehicle';
import EditVehicle from './pages/EditVehicle';
import ErrorPage from './pages/ErrorPage';
import VehiclesList from './pages/VehiclesList';
import reportWebVitals from './reportWebVitals';
import Root from './routes/root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'vehicles',
        element: <VehiclesList />,
      },
      {
        path: 'vehicles/create',
        element: <CreateVehicle />,
      },
      {
        path: 'vehicles/:id/edit',
        element: <EditVehicle />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
