export const getFilterableStates = (vehicles: VehicleDisplay[]): string[] => {
  return vehicles.reduce<string[]>((accumulator, vehicle) => {
    if (!accumulator.includes(vehicle.state.current)) {
      accumulator.push(vehicle.state.current);
    }

    return accumulator;
  }, []);
};
