import { Badge } from 'flowbite-react';
import React from 'react';

interface VehicleStateProps {
  rawState: string;
  size?: string;
}

export const VehicleStateDisplay = ({
  rawState,
  size = 'xs',
}: VehicleStateProps) => {
  const state = rawState.split(':');
  let displayState = state[0];

  if (state.length > 1) {
    displayState = state[1];
  }

  return <Badge size={size}>{displayState}</Badge>;
};
