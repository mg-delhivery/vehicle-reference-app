import React from 'react';
import { useRouteError } from 'react-router-dom';

function Route() {
  const error = useRouteError() as { statusText: string; message: string };

  return (
    <div id="ErrorPage">
      <h1>Error</h1>
      <p>This is the error page.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default Route;
