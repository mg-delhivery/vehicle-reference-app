import { Button, Spinner, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getVehicles } from '../api/vehicles';
import { RelativeDate } from '../components/RelativeDate';
import { VehicleState } from '../components/VehicleState';
import Title from '../layout/Title';

function VehiclesList() {
  const [vehicles, setVehicles] = useState<VehicleParticipant[]>([]);
  const navigate = useNavigate();
  // const { isLoading, data: vehicles } = useGetVehicles();

  useEffect(() => {
    const getAllVehicles = async () => {
      const { data } = await getVehicles();
      setVehicles(data);
    };
    getAllVehicles();
  }, []);

  return (
    <div id="VehiclesList" className="flex flex-col items-center gap-6">
      <Title>Vehicles</Title>

      <Table className="w-full">
        <Table.Head>
          <Table.HeadCell>Code</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>State</Table.HeadCell>
          <Table.HeadCell>Last Update</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {vehicles.map((vehicle, i) => (
            <Table.Row
              key={vehicle.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>{vehicle.uniqueCode}</Table.Cell>
              <Table.Cell>
                <Link
                  className="text-blue-700 underline"
                  to={`/vehicles/${vehicle.id}`}
                >
                  {vehicle.name}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <VehicleState rawState={vehicle.state} />
              </Table.Cell>
              <Table.Cell>
                <RelativeDate dateMs={vehicle.updatedAt} />
              </Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                >
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {vehicles.length === 0 && <Spinner aria-label="Loading vehicles" />}
    </div>
  );
}

export default VehiclesList;
