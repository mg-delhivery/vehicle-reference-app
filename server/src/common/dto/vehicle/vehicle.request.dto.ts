import { VehicleProperties, VehicleStateDTO } from './vehicle.dto';

export class AddVehicleRequestDTO {
  uniqueCode?: string;
  name?: string;
  owner?: string;
  category?: string;
  subCategory?: string;
  properties?: VehicleProperties;
  callback?: object;
}

export class UpdateVehiclePropertiesRequestDTO {
  properties: VehicleProperties;
  callback?: string;
}

export class TransitionVehicleStateRequestDTO {
  state: string;
}
