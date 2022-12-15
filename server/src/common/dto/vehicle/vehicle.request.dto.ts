import { VehicleProperties } from './vehicle.dto';

export class AddVehicleRequestDTO {
  uniqueCode?: string;
  name?: string;
  owner?: string;
  category?: string;
  subCategory?: string;
  properties?: VehicleProperties;
}

export class UpdateVehiclePropertiesRequestDTO {
  properties: VehicleProperties;
}
