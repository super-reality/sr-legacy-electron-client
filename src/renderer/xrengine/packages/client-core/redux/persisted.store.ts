// import getConfig from 'next/config';
import * as publicRuntimeConfig from "../../../xrconstants";

import { RESTORE } from "./actions";

const { localStorageKey } = publicRuntimeConfig;

export function restoreState(): any {
  return {
    type: RESTORE,
  };
}

export function getStoredState(key: string) {
  if (!window) {
    return undefined;
  }
  const rawState = localStorage.getItem(localStorageKey);
  if (!rawState) {
    return undefined;
  }
  const state = JSON.parse(rawState);
  return state[key];
}

export function saveState(state: any) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
