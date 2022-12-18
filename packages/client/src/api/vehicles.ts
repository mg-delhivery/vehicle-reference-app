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

const getDisplayFromParticipant = (
  participant: VehicleParticipant
): VehicleDisplay => {
  return {
    id: participant.id,
    state: participant.state,
    name: participant.name,
    properties: participant.properties,
    createdAt: getUxDateDisplay(participant.createdAt),
    createdBy: participant.createdBy.name,
    updatedAt: getUxDateDisplay(participant.updatedAt),
    updatedBy: participant.updatedBy.name,
  };
};
