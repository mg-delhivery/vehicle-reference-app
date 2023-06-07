export const VEHICLE_NAME_SINGULAR = 'test';
export const VEHICLE_NAME_PLURAL = 'tests';

export const PARTICIPANT_EXISTS_ERROR_CODE = '101110522301';

export const PARTICIPANT_CREATE_BODY = {
  name: {
    singular: VEHICLE_NAME_SINGULAR,
    plural: VEHICLE_NAME_PLURAL,
  },
};

export const ATTRIBUTES_CREATE_BODY = {
  attributes: [
    {
      name: 'mode',
      description: 'mode of vehicle',
      dataType: 'string',
      indexed: false,
      validation: {
        required: true,
      },
    },
    {
      name: 'fuelType',
      description: 'fuelType of Vehicle',
      dataType: 'string',
      indexed: false,
      validation: {
        required: true,
        valueOneOf: ['Diesel', 'Gasoline', 'Electric', 'CNG'],
      },
    },
    {
      name: 'operatorId',
      description: 'id of operator',
      dataType: 'string',
      indexed: false,
      validation: {
        required: true,
      },
    },
    {
      name: 'payloadCapacity',
      description: 'capacity vehicle can carry',
      dataType: 'string',
      indexed: false,
      validation: {
        required: false,
      },
    },
    {
      name: 'registrationNumber',
      description: 'registration number of vehicle',
      dataType: 'string',
      indexed: false,
      validation: {
        required: false,
      },
    },
    {
      name: 'registrationYear',
      description: 'year of vehicle registration',
      dataType: 'number',
      indexed: false,
      validation: {
        required: false,
      },
    },
    {
      name: 'availability',
      description: 'is vehicle available',
      dataType: 'boolean',
      indexed: false,
      validation: {
        required: false,
      },
    },
  ],
};
