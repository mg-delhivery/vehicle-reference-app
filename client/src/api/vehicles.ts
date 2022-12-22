import { AxiosRequestConfig } from 'axios';
import { sharedAccessBundle } from 'header/AuthenticatedHeader';
import { axiosInstance } from 'header/httpClient';
import { firstValueFrom } from 'rxjs';

import { getUxDateDisplay } from '../utils/dates';

const isTokenLoaded = async (): Promise<void> => {
  const bundle = sharedAccessBundle;

  await firstValueFrom(bundle);

  return;
};

export const getVehicles = async (): Promise<VehicleDisplay[]> => {
  await isTokenLoaded();

  const req: AxiosRequestConfig = {
    url: `${process.env.REACT_APP_BASE_URL}/api/vehicles`,
    method: 'get',
  };
  const resp = await axiosInstance<VehicleParticipant[]>(req);

  return resp.map((vehicle) => getDisplayFromParticipant(vehicle));
};

export const fetchVehicle = async (id: string): Promise<VehicleDisplay> => {
  const req: AxiosRequestConfig = {
    url: `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}`,
    method: 'get',
  };
  const resp = await axiosInstance<VehicleParticipant>(req);

  return getDisplayFromParticipant(resp);
};

export const createVehicle = async (
  data: VehicleParticipantForm
): Promise<void> => {
  const dto = getDtoFromDisplay(data);

  const req: AxiosRequestConfig = {
    url: `${process.env.REACT_APP_BASE_URL}/api/vehicles`,
    method: 'post',
    data: dto,
  };
  await axiosInstance<void>(req);

  return;
};

export const editVehicle = async (
  id: string,
  data: VehicleParticipantProperties
): Promise<void> => {
  const properties = getParticipantProperties(data);

  const req: AxiosRequestConfig = {
    url: `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}`,
    method: 'put',
    data: properties,
  };
  await axiosInstance<void>(req);

  return;
};

export const transitionStates = async (
  newState: string,
  vehicleIds: string[]
) => {
  const calls = vehicleIds.map((id) => {
    const req: AxiosRequestConfig = {
      url: `${process.env.REACT_APP_BASE_URL}/api/vehicles/${id}/transition`,
      method: 'put',
      data: { state: newState },
    };
    return axiosInstance<void>(req);
  });

  await Promise.all(calls);

  return;
};

const getDisplayFromParticipant = (
  participant: VehicleParticipant
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
