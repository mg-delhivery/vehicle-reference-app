import { act, render, screen } from '@testing-library/react';
import React from 'react';
import * as router from 'react-router-dom';

import VehiclesList from './ListVehicles';

describe(VehiclesList.name, () => {
  const navigate = jest.fn();

  beforeEach(async () => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    await act(async () => {
      render(<VehiclesList />);
    });
  });
});

test('renders learn react link', async () => {
  expect(screen.findByText('vehicle', { exact: false }));
});
