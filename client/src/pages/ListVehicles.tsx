import { faCheck, faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OS1Toast, OS1Modal } from '@os1-platform/console-ui-react';
import {
  Button,
  Checkbox,
  Dropdown,
  Pagination,
  Spinner,
  Table,
  TextInput,
} from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { getVehicles, transitionStates } from '../api/vehicles';
import { Toast } from '../components/Toast';
import { VehicleStateDisplay } from '../components/VehicleState';
import Title from '../layout/Title';
import { getFilterableStates } from '../utils/filterableStates';
import { getStateDisplay } from '../utils/stateDisplay';

interface VehicleSearchForm {
  search: string;
}

const ITEMS_PER_PAGE = 10;

function ListVehicles(props: any) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reloadSeed, setReloadSeed] = useState(0);
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [transitionPaths, setTransitionPaths] = useState<{
    [key: string]: string[];
  }>({});
  const [toastMsg, setToastMsg] = useState<string>();
  const [modalMsg, setModalMsg] = useState<string>("");
  const [currentTimeZone, setCurrentTimeZone] = useState<string>();
  const [convertedDate, setConvertedDate] = useState<string>();
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioningState, setIsTransitioningState] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState('');
  const [filterableStates, setFilterableStates] = useState<string[]>([]);
  const [stateFilter, setStateFilter] = useState<string>('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<{
    [key: string]: boolean;
  }>({});

  const { register, reset } = useForm<VehicleSearchForm>();

  useEffect(() => {
    if (searchParams.has('page')) {
      const qPage = parseInt(searchParams.get('page') || '');
      if (!isNaN(qPage)) {
        setPaginationPage(qPage);

        setFilterSearch('');
        reset();
      }
    }
  }, [reset, searchParams]);

  useEffect(()=>{
    const handleEvent = async(e: any)=>{
      setToastMsg(undefined);
      console.log(e)
      //window.name =JSON.stringify(e.detail.payload.data)
      //const vehicleData = <VehicleParticipant[]>(e.detail.payload.data.data);

      //const vehicle = getDisplayFromParticipant(e.detail.payload.data.data);
      // console.log("vehicleTest", vehicle, vehicles)
      // vehicles.push(vehicle)
      // console.log("vehicle", vehicles)
      // setVehicles(vehicles)
      // setFilterableStates(getFilterableStates(vehicles));
      // const emptyVehicleSelections = getEmptyVehicleSelections(vehicles);
      // setSelectedVehicles(emptyVehicleSelections);
      // constructStateTransitionPaths(vehicles);
      setTimeout(async() => {
        let vehicles = await getVehicles(props.console);
        if (vehicles == undefined) vehicles = [];
        setVehicles(vehicles);
        if (e?.detail?.payload?.data?.data){
          setToastMsg(`name : ${e?.detail?.payload?.data?.data?.name}, owner: ${e?.detail?.payload?.data?.data?.owner}, unique Code: ${e?.detail?.payload?.data?.data?.uniqueCode} `);
          console.log("Message recieved at SSE broker timestamp for broadcast:-", e.detail.payload.brokerTimestamp );
          console.log("Message recieved at SSE agent timestamp for broadcast:-", e.detail.payload.agentTimestamp );
          console.log("Message recieved at Console timestamp for broadcast:-", e.detail.payload.consoleTimestamp)
        }
        else{
          setToastMsg('Vehicle edited');
          console.log("Message recieved at SSE broker timestamp:-", e.detail.payload.brokerTimestamp );
          console.log("Message recieved at SSE agent timestamp:-", e.detail.payload.agentTimestamp );
          console.log("Message recieved at Console timestamp:-", e.detail.payload.consoleTimestamp)
        }
  
        setFilterableStates(getFilterableStates(vehicles));
        const emptyVehicleSelections = getEmptyVehicleSelections(vehicles);
        setSelectedVehicles(emptyVehicleSelections);
        constructStateTransitionPaths(vehicles);
      }, 200);
    }
    document.addEventListener(props.console?.events()?.SSECallBackEvent,handleEvent)
  },[props.console])

  useEffect(() => {
    const getAllVehicles = async () => {
      if (props.console){
      //  await subscribeTopic(props.console);
        let vehicles = await getVehicles(props.console);
        if (vehicles == undefined) vehicles = [];
        setVehicles(vehicles);
        setIsLoading(false);
  
        setFilterableStates(getFilterableStates(vehicles));
        const emptyVehicleSelections = getEmptyVehicleSelections(vehicles);
        setSelectedVehicles(emptyVehicleSelections);
        constructStateTransitionPaths(vehicles);
      }
    };
    getAllVehicles();
  }, [reloadSeed, props.console]);
  useEffect(() => {
    if (searchParams.has('success')) {
      const message = searchParams.get('message');

      if (message === 'created') {
       if (window && window?.name){
        const event = JSON.parse(window.name)
        setToastMsg(`name : ${event.name}, owner: ${event.owner}, unique Code: ${event.uniqueCode} `);
       }
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
  }, [searchParams, setSearchParams ]);

  useEffect(()=>{
    if (props.console) {

      props.console.eventBus().on(props.console.events().OnChangeEvent, (e: any) => {
        window.console.log(e)
        if (e.target.id == 'Dropdown1'){
          setModalMsg(e.target.value)
          document.getElementById("modaleElement")?.classList.toggle("hidden")
        }

        if (e.target.id == 'timeZone-DropDown'){
          if (document.getElementById("TimeZonetoastElement"))
          (document.getElementById("TimeZonetoastElement")as HTMLElement).style.display=""
          console.log(props.console.convertTime(new Date()))
          console.log(props.console.currentTimeZone())
          //document.getElementById("modaleElement")?.classList.toggle("hidden")
          setShowToast(true)
        }
      })
      props.console.eventBus().on(props.console.events().OnClickEvent, (e: any) => {
        window.console.log(e)
      })
    }
  },[props.console])

  const triggerStateTransitions = async (newState: string) => {
    const forUpdate = Object.keys(selectedVehicles).filter(
      (id) => selectedVehicles[id]
    );

    setIsTransitioningState(true);
    await transitionStates(newState, forUpdate, props.console);
    clearStateSelections();

    // Should be sufficient to reload vehicles
    setReloadSeed(Math.random());
    // But leaving this in place to trigger a full reload. Will revisit.
    window.location.reload();

    setIsTransitioningState(false);
  };

  const constructStateTransitionPaths = (vehicles: VehicleDisplay[]) => {
    const paths: { [key: string]: string[] } = {};

    vehicles.forEach((v) => {
      if (!(v.state.current in paths)) {
        paths[v.state.current] = v.state.transitions;
      }
    });

    setTransitionPaths(paths);
  };

  const getEmptyVehicleSelections = (vehicles: VehicleDisplay[]) =>
    vehicles?.reduce((accumulator, v) => {
      const updated = { ...accumulator };
      updated[v.id] = false;
      return updated;
    }, {} as { [key: string]: boolean });

  const newPaginationState = (page: number) => {
    navigate({
      pathname: '.',
      search: `?${createSearchParams({
        page: `${page}`,
      })}`,
    });
  };

  const handleSearch = (query: string) => {
    setFilterSearch(query);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handleCheckboxChange = (state: string, vehicleId: string) => {
    const selectionsClone = { ...selectedVehicles };

    if (!selectedVehicles[vehicleId]) {
      setSelectedState(state);
      selectionsClone[vehicleId] = true;
      setSelectedVehicles(selectionsClone);
    } else {
      selectionsClone[vehicleId] = false;
      setSelectedVehicles(selectionsClone);

      if (Object.values(selectionsClone).every((v) => !v)) {
        setSelectedState('');
      }
    }
  };

  const clearStateSelections = () => {
    setSelectedState('');
    const newSelections = getEmptyVehicleSelections(vehicles);
    setSelectedVehicles(newSelections);
  };

  const unSubscribe = async() => {
    if (props.console){
      console.log("Inside Unsubscribe")
      //await unSubscribeTopic(props.console)
    }
  };

  const toastConfig = {
    bgColor: 'green',
    message: toastMsg || '',
    timeout: 20,
    icon: 'info',
    closeButton: true,
  };

  const timeZoneToastConfig = {
    bgColor: 'green',
    message: `This event is triggered on change in timeZone`  || '',
    timeout: 10,
    icon: 'info',
    closeButton: true,
  };

  const modalConfig = {
    title: "DropDown Value",
    bgColor: "green",
    message: "This modal is redered by on Change Event of DropDown",
    icon: "info",
    buttons: [
        {
            id: "button-ele-1",
            backgroundColor: "red",
            text: "Cancel",
            event: "upEvent"
        }
    ]
}

useEffect(()=>{
  window.addEventListener('upEvent', (event) => {
    //window.console.log("Button clicked", event);
    document.getElementById("modaleElement")?.classList.toggle("hidden")
})
},[])



  return (
    <div id="ListVehicles" className="flex flex-col items-center gap-6 mt-5">
      {toastMsg && (
        <OS1Toast
          elementId={'toastElement'}
          toastConfig={toastConfig}
        />
      )}
      {showToast && (
        <OS1Toast
          elementId={'TimeZonetoastElement'}
          toastConfig={timeZoneToastConfig}
        />
      )}
      {modalMsg && (
        <OS1Modal
          elementId={'modaleElement'}
          modalConfig={modalConfig}
        />
      )}
      <div className="w-full flex flex-row justify-between gap-4">
        <div className="grow">
          <Title>Vehicles</Title>
        </div>
        <div className="flex mt-3">
        <Button
            className="whitespace-nowrap mr-5"
            onClick={() => unSubscribe()}
          >
            <FontAwesomeIcon icon={faMinus} />
            <span className="ml-2">Unsubscribe Topic</span>
          </Button>
          <Button
            className="whitespace-nowrap"
            onClick={() => navigate('/os1-vehicle-reference-app/create')}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Create New Vehicle</span>
          </Button>
        </div>
      </div>
      <div className="w-full">
        {selectedState ? (
          <div className="flex flex-row gap-6">
            {transitionPaths[selectedState].map((path, i) => (
              <Button
                key={i}
                size="xs"
                onClick={() => triggerStateTransitions(path)}
                disabled={isTransitioningState}
              >
                {!isTransitioningState ? `Transition to ${path}` : <Spinner />}
              </Button>
            ))}
            {transitionPaths[selectedState].length === 0 && (
              <p>No states available for transition.</p>
            )}
            <Button color="light" size="xs" onClick={clearStateSelections}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-row gap-4">
            <form
              className="w-full flex flex-col gap-4"
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
            <Dropdown label="Status" color="light">
              {filterableStates.map((state) => (
                <Dropdown.Item
                  key={state}
                  onClick={() => {
                    if (state === stateFilter) {
                      setStateFilter('');
                    } else {
                      setStateFilter(state);
                    }
                  }}
                >
                  {stateFilter === state && <FontAwesomeIcon icon={faCheck} />}
                  <span className="ml-2">{getStateDisplay(state)}</span>
                </Dropdown.Item>
              ))}
              {stateFilter && <Dropdown.Divider />}
              {stateFilter && (
                <Dropdown.Item>
                  <Button
                    color="light"
                    size="xs"
                    onClick={() => setStateFilter('')}
                  >
                    Clear Selection
                  </Button>
                </Dropdown.Item>
              )}
            </Dropdown>
          </div>
        )}
      </div>
      <div className="w-full">
        <Table className="w-full">
          <Table.Head>
            <Table.HeadCell className="!p-4"></Table.HeadCell>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>State</Table.HeadCell>
            <Table.HeadCell>Last Update</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {vehicles
              .filter((vehicle) => {
                if (!stateFilter) {
                  return vehicle;
                }

                if (vehicle.state.current === stateFilter) {
                  return vehicle;
                }

                return false;
              })
              .filter((vehicle) => {
                if (!filterSearch) {
                  return vehicle;
                }

                if (
                  vehicle.name
                    .toLowerCase()
                    .includes(filterSearch.toLowerCase())
                ) {
                  return vehicle;
                }

                return false;
              })
              .sort((a, b) => {
                return a.updatedAt.epoch > b.updatedAt.epoch ? -1 : 1;
              })
              .filter(
                (vehicle, i) =>
                  Math.ceil((i + 1) / ITEMS_PER_PAGE) === paginationPage
              )
              .map((vehicle, i) => (
                <Table.Row
                  key={vehicle.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="!p-4">
                    {!selectedState || selectedVehicles[vehicle.id] ? (
                      <Checkbox
                        value={vehicle.state.current}
                        onChange={(e) =>
                          handleCheckboxChange(
                            vehicle.state.current,
                            vehicle.id
                          )
                        }
                        checked={selectedVehicles[vehicle.id]}
                      />
                    ) : (
                      <span></span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{vehicle.uniqueCode}</Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-blue-700 underline"
                      to={`/vehicle/${vehicle.id}`}
                    >
                      {vehicle.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <VehicleStateDisplay rawState={vehicle.state.current} />
                  </Table.Cell>
                  <Table.Cell>{vehicle.updatedAt.display}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      onClick={() => navigate(`/os1-vehicle-reference-app/${vehicle.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      {!isLoading && !stateFilter && !filterSearch && (
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
      )}
      {isLoading && <Spinner aria-label="Loading vehicles" />}
    </div>
  );
}

export default ListVehicles;
