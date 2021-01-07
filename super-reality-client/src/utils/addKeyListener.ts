// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import globalData from "../renderer/globalData";

export default function addKeyListener(
  key: string,
  fn: (e: KeyboardEvent) => void
): void {
  globalData.documentKeyListeners[key] = fn;
}
