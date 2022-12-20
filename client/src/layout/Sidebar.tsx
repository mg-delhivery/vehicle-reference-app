import { Button, Sidebar } from 'flowbite-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SidebarContainer() {
  const navigate = useNavigate();

  return (
    <div className="w-fit">
      <div className="px-6 pt-10">
        <span className="text-xl md:text-2xl">
          <Link to="/vehicles">Vehicle Demo app</Link>
        </span>
      </div>
      <Sidebar>
        <Sidebar.CTA>
          <Button onClick={() => navigate('/vehicles/create')}>
            Create Vehicle
          </Button>
        </Sidebar.CTA>
      </Sidebar>
    </div>
  );
}

export default SidebarContainer;
