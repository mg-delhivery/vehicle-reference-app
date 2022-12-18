import { DateTime } from 'luxon';
import React from 'react';

import { getUxDateDisplay } from '../utils/dates';

interface RelativeDateProps {
  dateMs: number;
}

export const RelativeDate = ({ dateMs }: RelativeDateProps) => {
  return <div>{getUxDateDisplay(dateMs)}</div>;
};
