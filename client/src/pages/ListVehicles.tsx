import { Button, Spinner, Table, Toast } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { getVehicles } from '../api/vehicles';
import { RelativeDate } from '../components/RelativeDate';
import { VehicleState } from '../components/VehicleState';
import Title from '../layout/Title';

function VehiclesList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState<VehicleParticipant[]>([]);
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllVehicles = async () => {
      const { data } = await getVehicles();
      setVehicles(data);
      setIsLoading(false);
    };
    getAllVehicles();
  }, []);

  useEffect(() => {
    if (searchParams.has('success')) {
      const message = searchParams.get('message');

      if (message === 'created') {
        setToastMsg('Vehicle created');
      } else if (message === 'edited') {
        setToastMsg('Vehicle edited');
      }

      setTimeout(() => {
        setToastMsg(undefined);
        searchParams.delete('success');
        searchParams.delete('message');
        setSearchParams(searchParams);
      }, 3000);
    }
  }, []);

  return (
    <div id="VehiclesList" className="flex flex-col items-center gap-6">
      {toastMsg && (
        <Toast className="fixed top-6 bg-green-500 text-slate-200">
          <div className="ml-3 text-sm font-normal">{toastMsg}</div>
          <Toast.Toggle />
        </Toast>
      )}

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
      {isLoading && <Spinner aria-label="Loading vehicles" />}
    </div>
  );
}

export default VehiclesList;
