/// <reference types="react-scripts" />

declare module "header/initialize" {
  function initialize(): void;
  export = initialize;
}

interface VehicleState {
  current: string;
  transitions: string[];
}

interface ParticipantActor {
  id: string;
  name: string;
  appId: string;
}

interface VehicleParticipantProperties {
  [key: string]: any;
  mode?: string;
  fuelType?: string;
  operatorId?: string;
  payloadCapacity?: string;
  registrationNumber?: string;
  registrationYear?: number;
  availability?: boolean;
}

interface VehicleParticipant {
  id: string;
  uniqueCode: string;
  name: string;
  owner: string;
  participantType: string;
  properties: VehicleParticipantProperties;
  state: VehicleState;
  category: string?;
  createdAt: number;
  updatedAt: number;
  createdBy: ParticipantActor;
  updatedBy: ParticipantActor;
}

interface DateInfo {
  epoch: number;
  display: string;
}

interface VehicleDisplay {
  id: string;
  state: VehicleState;
  name: string;
  uniqueCode: string;
  owner: string;
  category: string;
  properties: VehicleParticipantProperties;
  createdAt: DateInfo;
  createdBy: string;
  updatedAt: DateInfo;
  updatedBy: string;
}

interface VehicleParticipantForm extends VehicleDisplay {}

interface AddVehicleRequestDTO {
  uniqueCode?: string;
  name?: string;
  owner?: string;
  category?: string;
  subCategory?: string;
  properties?: VehicleParticipantProperties;
}
