import { OS1HttpClient } from '@os1-platform/console-ui-react' // Import OS1HttpClient
import { v4 as uuidv4 } from 'uuid';

import { getUxDateDisplay } from '../utils/dates';
import { VEHICLE_NAME_PLURAL } from '../utils/constants';

export const getVehicles = async (client: any) => {
  if (client) {
    const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_BASE_URL}`); 
    const resp = await axiosClient.get('/vehicles', 'getVehicles');
    const vehicleData = <VehicleParticipant[]>(resp.data);

    return vehicleData.map((vehicle) => getDisplayFromParticipant(vehicle));
  }
};


export const getToken = async (client: any) => {
  if (client) {
    const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_BASE_URL}`);
    const resp = await axiosClient.get('/vehicles/token', 'getToken');
    const token = <any>(resp.data);

    return token;
  }
};
export const fetchVehicle = async (id: string, client: any) => {
  const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_BASE_URL}`);

  try {
    const resp = await axiosClient.get(`/vehicles/${id}`,'fetchVehicles-id');
    return getDisplayFromParticipant(resp);
  } catch (error) {
    console.error('error', error);
  }
};

export const getAccessToken = async (client: any) => {
  if (client) {
    const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_TENANT_DNS}`);
    const headers = {
      "X-COREOS-REQUEST-ID": uuidv4(),
    };
    const clientCredentialsPayload = {
      clientId: `${process.env.REACT_APP_PARTICIPANT_CLIENT_ID}`,
      clientSecret: `${process.env.REACT_APP_PARTICIPANT_CLIENT_SECRET}`,
    };
    try {
      const resp =  await axiosClient.post(
        `/core/api/v1/aaa/auth/client-credentials`,
        clientCredentialsPayload,
        'createVehicles',
        { withUserInfo: false },
        { headers }
        );
        const token = <any>(resp.data);

        return token;
    } catch (error) {
      console.error('error', error);
    }    
  }
};

export const createVehicle = async (
  data: VehicleParticipantForm,
  client: any
): Promise<void> => {
  const dto = getDtoFromDisplay(data); // Construct payload data (dto)
  dto['callback'] = { // Set the callback URL attribute
    "url": "{{SSE_CALLBACK}}",
    "meta": {}
  } 
  console.log("api call requested :-", new Date(), "having unix timestamp:- ", Date.now()) // Log request timestamp
  const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_TENANT_DNS}`); // Instantiate Client to authorize API requests
  const token =  await getAccessToken(client)
  try {
    await axiosClient.post(
      `core/api/v2/participants/${VEHICLE_NAME_PLURAL}`, // Make API call to create a vehicle.
      dto,
      'createVehicles',
      {withAuth: false, withAccess: false},
      {
        headers: {
          'X-COREOS-ORIGIN-TOKEN': token.data.accessToken,
          'x-coreos-access': token.data.accessToken
        }
      }
      );
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
  const properties = { properties: getParticipantProperties(data) }; // Construct payload data

  const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_BASE_URL}/vehicles/${id}`); // Instantiate OS1HttpClient with vehicle ID endpoint

  try {
    const requestTime = Date.now() // Log initial request timestamp
    console.log("Request for callback Url", new Date()) // Logs a readable timestamp
    const sseClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_TENANT_DNS}`); // Sets up new separate client
    const callbackUrl = await sseClient.getEventBrokerUrl() // Gets SSE callback URL
    console.log("callback Url Revieved and api call is made after ms:- ", Date.now() - requestTime, "current Time is :-", new Date() ) // Logs time taken to get URL
    properties.properties['callback'] = callbackUrl.callback // Passses the payload of the callabck URL received

    await axiosClient.put('/',properties,'editehicles-1'); // Makes API Call to edit vehicle
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
    const axiosClient = new OS1HttpClient(client.authInitializer, `${process.env.REACT_APP_BASE_URL}`);
    try {
      return axiosClient.put(`/api/vehicles/${id}/transition`, { state: newState }, 'transitionStates');
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
    uniqueCode: participant?.uniqueCode,
    owner: participant?.owner,
    category: participant?.category || '',
    name: participant.name,
    properties: participant.properties,
    createdAt: getDateStructure(participant.createdAt),
    createdBy: participant?.createdBy?.name,
    updatedAt: getDateStructure(participant?.updatedAt),
    updatedBy: participant?.updatedBy?.name,
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
