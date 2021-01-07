import globalData from "../renderer/globalData";

export default function deleteKeyListener(key: string): void {
  delete globalData.documentKeyListeners[key];
}
