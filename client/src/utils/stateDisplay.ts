export const getStateDisplay = (fullState: string) => {
  const state = fullState?.split(':');

  if (state?.length > 1) {
    return state[1];
  }

  return state;
};
