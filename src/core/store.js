export function createStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  function getState() {
    return structuredClone(state);
  }

  function setState(updater) {
    const nextState = typeof updater === "function" ? updater(getState()) : updater;
    state = structuredClone(nextState);
    listeners.forEach((listener) => listener(getState()));
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getState());
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}
