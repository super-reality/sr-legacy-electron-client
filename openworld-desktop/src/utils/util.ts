import JSON_RPC from "json-rpc3/dist/cjs"
import electron from "../electron";
import { IpcArgument } from "../types/ipc";


const { ipcRenderer } = electron;
const jsonrpc = new JSON_RPC({ url: 'http://localhost:4000/jsonrpc' });

export function jsonRpcRemote(method: any, param: any) {
  return new Promise((resolve, eject) => {
    jsonrpc.calls([{
      id:1 ,
      method: method,
      params: param
    }]).then(res=>{
      resolve(res.getById(1))
    }).catch(err=>{
      eject(err)
    })
  })
}
export function ipcSend(msg: IpcArgument): void {
  ipcRenderer.send("ipc_switch", msg.method, msg.arg);
}
