// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import globalData from "../renderer/globalData";

export default function globalKeyListener(e: KeyboardEvent): void {
  if (globalData.documentKeyListeners[e.key]) {
    globalData.documentKeyListeners[e.key](e);
  }
}
