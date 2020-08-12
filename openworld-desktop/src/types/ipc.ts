type IpcMethods = "popup" | "test";

interface IpcMsg {
  method: IpcMethods;
  arg: any;
}

interface IpcMsgPopup extends IpcMsg {
  method: "popup";
  arg: string;
}

interface IpcMsgTest extends IpcMsg {
  method: "test";
  arg: { foo: number };
}

export type IpcArgument = IpcMsgPopup | IpcMsgTest;
