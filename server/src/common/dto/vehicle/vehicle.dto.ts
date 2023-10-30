export interface VehicleDTO {
  name: string;
  code: string;
  state: VehicleStateDTO;
  category: string;
  subcategory: string;
  properties: VehicleProperties;
}

export interface VehicleProperties {
  mode?: string;
  fuelType?: string;
  operatorId?: string;
  payloadCapacity?: string;
  registrationNumber?: string;
  registrationYear?: number;
  availability?: boolean;
  callback?: string;
}

export interface GetAllVehiclesResponse {
  data: VehicleDTO[];
}

export interface VehicleStateDTO {
  current: string;
  transitions: string[];
}
