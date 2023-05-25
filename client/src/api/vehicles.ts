// import axios, { AxiosRequestConfig } from 'axios';
import Client from '../utils/Client';

import { getUxDateDisplay } from '../utils/dates';

export const getVehicles = async (client: any) => {
  if (client) {
    const axiosClient = new Client(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/api/vehicles`);
    const reqHeaders = {
      withAuth: false,
    };
    const resp = await axiosClient.get('45', reqHeaders);
    const vehicleData = <VehicleParticipant[]>(resp.data);

    return vehicleData.map((vehicle) => getDisplayFromParticipant(vehicle));
  }
};

export const fetchVehicle = async (id: string, client: any) => {
  const axiosClient = new Client(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}`);
  const reqHeaders = {
    withAuth: false,
  };
  try {
    const resp = await axiosClient.get('fetchVehicles-id-1', reqHeaders);
    return getDisplayFromParticipant(resp);
  } catch (error) {
    console.error('error', error);
  }
};

export const createVehicle = async (
  data: VehicleParticipantForm,
  client: any
): Promise<void> => {
  const dto = getDtoFromDisplay(data);

  const axiosClient = new Client(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/api/vehicles`);
  const reqHeaders = {
    withAuth: false,
  };
  try {
    await axiosClient.post('createVehicles-1', dto, reqHeaders);
    return;
  } catch (error) {
    console.error('error', error);
  }
};

export const editVehicle = async (
  id: string,
  data: VehicleParticipantProperties,
  client: any
): Promise<void> => {
  const properties = { properties: getParticipantProperties(data) };

  const axiosClient = new Client(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}`);
  const reqHeaders = {
    withAuth: false,
  };
  try {
    await axiosClient.put('editehicles-1', properties, reqHeaders);
    return;
  } catch (error) {
    console.error('error', error);
  }
};

export const transitionStates = async (
  newState: string,
  vehicleIds: string[],
  client: any
) => {
  const calls = vehicleIds.map((id) => {
    const axiosClient = new Client(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}/transition`);
    const reqHeaders = {
      withAuth: false,
    };
    try {
      return axiosClient.put('transitionStates', { state: newState }, reqHeaders);
    } catch (error) {
      console.error('error', error);
    }
  });

  await Promise.all(calls);

  return;
};

const getDisplayFromParticipant = (
  participant: any
): VehicleDisplay => {
  return {
    id: participant.id,
    state: participant.state,
    uniqueCode: participant.uniqueCode,
    owner: participant.owner,
    category: participant.category || '',
    name: participant.name,
    properties: participant.properties,
    createdAt: getDateStructure(participant.createdAt),
    createdBy: participant.createdBy.name,
    updatedAt: getDateStructure(participant.updatedAt),
    updatedBy: participant.updatedBy.name,
  };
};

const getDateStructure = (epoch: number): DateInfo => {
  return {
    epoch,
    display: getUxDateDisplay(epoch),
  };
};

const getDtoFromDisplay = (data: VehicleDisplay): AddVehicleRequestDTO => {
  const dto: AddVehicleRequestDTO = {
    uniqueCode: data.uniqueCode,
    name: data.name,
    owner: data.owner,
    category: data.category,
    properties: getParticipantProperties(data.properties),
  };

  if (dto.properties && typeof dto.properties?.registrationYear === 'string') {
    dto.properties.registrationYear = parseInt(dto.properties.registrationYear);
  }

  return dto;
};

const getParticipantProperties = (
  initial: VehicleParticipantProperties
): VehicleParticipantProperties => {
  const props: VehicleParticipantProperties = {};

  if (
    typeof initial.registrationYear === 'string' &&
    initial.registrationYear !== ''
  ) {
    initial.registrationYear = parseInt(initial.registrationYear);
  }

  for (const [key, val] of Object.entries(initial)) {
    const isValidValue = val !== null && val !== '';
    if (initial.hasOwnProperty(key) && isValidValue) {
      props[key] = val;
    }
  }

  return props;
};
