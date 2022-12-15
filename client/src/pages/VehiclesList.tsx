import { Table } from 'flowbite-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Title from '../layout/Title';

function VehiclesList() {
  const navigate = useNavigate();

  return (
    <div id="VehiclesList" className="mt-6">
      <Title>Vehicles</Title>
      <Table>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>234902392342234</Table.Cell>
            <Table.Cell>Motorcycle 1</Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>234902392342234</Table.Cell>
            <Table.Cell>Motorcycle 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default VehiclesList;
