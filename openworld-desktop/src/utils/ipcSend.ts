import electron from "../electron";
const { ipcRenderer } = electron;

export function ipcSend(method: string, arg?: any): void {
  //debugLog("IPC SEND", method, arg, to);
  ipcRenderer.send("ipc_switch", method, arg);
}
