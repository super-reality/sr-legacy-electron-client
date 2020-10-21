import { IpcArgument } from "../types/ipc";

export default function ipcSend(msg: IpcArgument): void {
  // debugLog("IPC SEND", method, arg, to);
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("ipc_switch", msg.method, msg);
}
