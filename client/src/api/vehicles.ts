// import { sharedAccessBundle } from 'header/AuthenticatedHeader';
import axios from 'axios';

import { getUxDateDisplay } from '../utils/dates';

const getHeaders = () => ({
  'X-COREOS-ACCESS': 'token_here', //`${sharedAccessBundle.value.accessToken}`,
  'X-COREOS-REQUEST-ID': Date.now().toString(),
  'X-COREOS-TID': 'alpha', //sharedAccessBundle.value.tenantId,
});

export const getVehicles = async () => {
  const vehiclesResponse = await axios.get<VehicleParticipant[]>(
    `/api/vehicles`,
    { ...getHeaders }
  );
  return vehiclesResponse;
};

export const fetchVehicle = async (id: string): Promise<VehicleDisplay> => {
  const { data } = await axios.get<VehicleParticipant>(`/api/vehicles/${id}`, {
    ...getHeaders,
  });

  return getDisplayFromParticipant(data);
};

export const createVehicle = async (
  data: VehicleParticipantForm
): Promise<void> => {
  const dto = getDtoFromDisplay(data);

  await axios.post(`/api/vehicles`, dto, { ...getHeaders });

  return;
};

export const editVehicle = async (
  id: string,
  data: VehicleParticipantProperties
): Promise<void> => {
  const dto = getParticipantProperties(data);

  await axios.put(
    `/api/vehicles/${id}`,
    { properties: dto },
    { ...getHeaders }
  );

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
    createdAt: getUxDateDisplay(participant.createdAt),
    createdBy: participant.createdBy.name,
    updatedAt: getUxDateDisplay(participant.updatedAt),
    updatedBy: participant.updatedBy.name,
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

  if (typeof initial.registrationYear === 'string') {
    initial.registrationYear = parseInt(initial.registrationYear);
  }

  for (const [key, val] of Object.entries(initial)) {
    if (initial.hasOwnProperty(key) && val) {
      props[key] = val;
    }
  }

  return props;
};
