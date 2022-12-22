import React from 'react';
import { Outlet } from 'react-router-dom';

import { Breadcrumbs } from '../components/Breadcrumbs';

function Root() {
  return (
    <div id="VehicleDemoApp" className="flex flex-row gap-4">
      <div id="content" className="w-full mx-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mt-8 mb-6">
          <Breadcrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
