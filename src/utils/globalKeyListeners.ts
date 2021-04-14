// eslint-disable-next-line @typescript-eslint/no-unused-vars
import globalData from "../renderer/globalData";

export function globalKeyDownListener(e: KeyboardEvent): void {
  if (globalData.documentKeyDownListeners[e.key]) {
    globalData.documentKeyDownListeners[e.key](e);
  }
}

export function globalKeyUpListener(e: KeyboardEvent): void {
  if (globalData.documentKeyUpListeners[e.key]) {
    globalData.documentKeyUpListeners[e.key](e);
  }
}

export function addKeyDownListener(
  key: string,
  fn: (e: KeyboardEvent) => void
): void {
  globalData.documentKeyDownListeners[key] = fn;
}

export function addKeyUpListener(
  key: string,
  fn: (e: KeyboardEvent) => void
): void {
  globalData.documentKeyUpListeners[key] = fn;
}

export function deleteKeyDownListener(key: string): void {
  delete globalData.documentKeyDownListeners[key];
}

export function deleteKeyUpListener(key: string): void {
  delete globalData.documentKeyUpListeners[key];
}
