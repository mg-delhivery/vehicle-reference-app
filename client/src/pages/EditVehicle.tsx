import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div id="EditVehicle">
      <h1>Edit Vehicle</h1>
      <div>ID: {id}</div>
      <button onClick={() => navigate('..')}>Save</button>
    </div>
  );
}

export default EditVehicle;
