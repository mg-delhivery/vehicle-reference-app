/// <reference types="react-scripts" />

interface ParticipantActor {
  id: string;
  name: string;
  appId: string;
}

interface VehicleParticipantProperties {
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
  state: string;
  createdAt: number;
  updatedAt: number;
  createdBy: ParticipantActor;
  updatedBy: ParticipantActor;
}

interface VehicleDisplay {
  id: string;
  state: string;
  name: string;
  properties: VehicleParticipantProperties;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
