import electron from "../electron";
import { IpcArgument } from "../types/ipc";
import JSON_RPC from "json-rpc3/dist/cjs/index"

const { ipcRenderer } = electron;
const json_rpc = new JSON_RPC({ url: 'http://localhost:4000/jsonrpc' });

export function json_rpc_remote(method: any, param: any) {
  return new Promise((resolve, eject) => {
    json_rpc.calls([{
      id:1,
      method:method,
      params:param
    }]).then(res=>{
      resolve(res.getById(1))
    }).catch(err=>{
      eject(err)
    })
  })
}
export function ipcSend(msg: IpcArgument): void {
  //debugLog("IPC SEND", method, arg, to);
  ipcRenderer.send("ipc_switch", msg.method, msg.arg);
}
