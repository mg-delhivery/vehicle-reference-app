import { Badge, Select } from 'flowbite-react';
import React from 'react';

import { VehicleStateDisplay } from './VehicleState';

interface VehicleStateTransitionerProps {
  rawState: string;
  size: string;
}

export const VehicleStateTransitioner = ({
  rawState,
  size = 'lg',
}: VehicleStateTransitionerProps) => {
  return (
    <div className="flex flex-row gap-4">
      <VehicleStateDisplay size={size} rawState={rawState} />
      <span>&#8594;</span>
      <span className="grow">
        <Select>
          <option>next</option>
        </Select>
      </span>
    </div>
  );
};
