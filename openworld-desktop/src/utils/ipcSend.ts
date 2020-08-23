import { ipcRenderer } from "electron";
import { IpcArgument } from "../types/ipc";


export default function ipcSend(msg: IpcArgument): void {
  // debugLog("IPC SEND", method, arg, to);
  ipcRenderer.send("ipc_switch", msg.method, msg.arg);
}
