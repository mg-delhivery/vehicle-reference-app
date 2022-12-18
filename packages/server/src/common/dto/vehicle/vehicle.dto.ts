export interface VehicleDTO {
  name: string;
  code: string;
  state: string;
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
}

export interface GetAllVehiclesResponse {
  data: VehicleDTO[];
}

export interface VehicleStateDTO {
  currentState: string;
  possibleStates: string[];
}
