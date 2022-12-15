import { Badge } from 'flowbite-react';
import React from 'react';

interface VehicleStateProps {
  rawState: string;
}

export const VehicleState = ({ rawState }: VehicleStateProps) => {
  const state = rawState.split(':');

  return <Badge>{state[0]}</Badge>;
};
