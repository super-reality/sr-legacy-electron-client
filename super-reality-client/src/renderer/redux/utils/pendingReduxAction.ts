/**
 * Awaits for a change in the redux store and executes a callback function with the new state as an argument.
 * This allows us to execute actions in the future without having to be in the same context as the action dispatcher and listener.
 */

import store, { AppState } from "../stores/renderer";

export default function pendingReduxAction<T>(
  selectorFn: (st: AppState) => T,
  data: T,
  maxWait = 3000
): Promise<AppState> {
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const comp = selectorFn(store.getState()) === data;
      if (!comp) {
        resolve(store.getState());
      }
      if (new Date().getTime() - startTime > maxWait) {
        clearInterval(interval);
        reject();
      }
    }, 100);
  });
}
