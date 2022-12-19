import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Label,
  Pagination,
  Spinner,
  Table,
  TextInput,
  Toast,
} from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { getVehicles } from '../api/vehicles';
import { RelativeDate } from '../components/RelativeDate';
import { VehicleStateDisplay } from '../components/VehicleState';
import Title from '../layout/Title';

interface VehicleSearchForm {
  search: string;
}

const ITEMS_PER_PAGE = 10;

function VehiclesList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState<VehicleParticipant[]>([]);
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [paginationPage, setPaginationPage] = useState(1);

  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    if (searchParams.has('page')) {
      const qPage = parseInt(searchParams.get('page') || '');
      if (!isNaN(qPage)) {
        setPaginationPage(qPage);

        setFilterSearch('');
        reset();
      }
    }
  }, [searchParams]);

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

  const newPaginationState = (page: number) => {
    navigate({
      pathname: '.',
      search: `?${createSearchParams({
        page: `${page}`,
      })}`,
    });
  };

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<VehicleSearchForm>();

  const handleSearch = (query: string) => {
    setFilterSearch(query);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  return (
    <div id="VehiclesList" className="flex flex-col items-center gap-6">
      {toastMsg && (
        <Toast className="fixed top-6 bg-green-500 text-slate-200">
          <div className="ml-3 text-sm font-normal">{toastMsg}</div>
          <Toast.Toggle />
        </Toast>
      )}
      <div className="w-full flex flex-row gap-4">
        <div className="grow">
          <Title>Vehicles</Title>
        </div>
        <div className="flex-none">
          <Button onClick={() => navigate('/vehicles/create')}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Create Vehicle</span>
          </Button>
        </div>
      </div>
      <div className="w-full">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextInput
            id="search"
            placeholder="Search by vehicle name"
            required={false}
            addon={<FontAwesomeIcon icon={faSearch} />}
            {...register('search', {
              onChange: (e) => {
                handleSearch(e.target.value);
              },
            })}
          />
        </form>
      </div>
      <div className="w-full">
        <Table className="w-full">
          <Table.Head>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>State</Table.HeadCell>
            <Table.HeadCell>Last Update</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {vehicles
              .filter((vehicle) => {
                if (filterSearch === '') {
                  return vehicle;
                }
                // console.log(
                //   `v: ${vehicle.name.toLowerCase()}; r: ${vehicle.name
                //     .toLowerCase()
                //     .includes(
                //       filterSearch.toLowerCase()
                //     )}; q: '${filterSearch.toLocaleLowerCase()}'`
                // );
                if (
                  vehicle.name
                    .toLowerCase()
                    .includes(filterSearch.toLowerCase())
                ) {
                  return vehicle;
                }
              })
              .sort((a, b) => {
                return a.updatedAt > b.updatedAt ? -1 : 1;
              })
              .filter(
                (vehicle, i) =>
                  Math.ceil((i + 1) / ITEMS_PER_PAGE) == paginationPage
              )
              .map((vehicle, i) => (
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
                    <VehicleStateDisplay rawState={vehicle.state} />
                  </Table.Cell>
                  <Table.Cell>
                    <RelativeDate dateMs={vehicle.updatedAt} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex items-center justify-center text-center">
        <Pagination
          currentPage={paginationPage}
          layout="pagination"
          onPageChange={newPaginationState}
          showIcons={true}
          totalPages={Math.ceil(vehicles.length / ITEMS_PER_PAGE)}
          previousLabel="Go back"
          nextLabel="Go forward"
        />
      </div>
      {isLoading && <Spinner aria-label="Loading vehicles" />}
    </div>
  );
}

export default VehiclesList;
