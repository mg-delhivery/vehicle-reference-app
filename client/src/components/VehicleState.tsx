import { Badge } from 'flowbite-react';
import React from 'react';

import { getStateDisplay } from '../utils/stateDisplay';

interface VehicleStateProps {
  rawState: string;
  size?: string;
}

export const VehicleStateDisplay = ({
  rawState,
  size = 'xs',
}: VehicleStateProps) => {
  const displayState = getStateDisplay(rawState);

  return <Badge size={size}>{displayState}</Badge>;
};
