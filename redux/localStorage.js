export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return {
        adInsights: {},
        overview: {},
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      adInsights: {},
      overview: {},
    };
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore
  }
};