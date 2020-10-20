type IpcMethods = "popup" | "pythonExec" | "pythonResponse";

interface IpcMsg {
  method: IpcMethods;
  arg: any;
  to: string;
}

interface IpcMsgPopup extends IpcMsg {
  method: "popup";
  arg: string;
}

interface IpcMgsPythocExec extends IpcMsg {
  method: "pythonExec";
  arg: string;
}

interface IpcMgsPythocResponse extends IpcMsg {
  method: "pythonResponse";
  arg: string;
}

export type IpcArgument = IpcMsgPopup | IpcMgsPythocExec;
