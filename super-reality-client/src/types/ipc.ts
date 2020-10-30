import {
  initialCVSettings,
  initialBackgroundState,
} from "../renderer/redux/static";
import { CVResult } from "./utils";

export type IpcMethods =
  | "popup"
  | "pythonExec"
  | "pythonResponse"
  | "cv"
  | "cvResult";

export interface IpcMsg {
  method: IpcMethods;
  arg: any;
  to?: string;
}

export interface IpcMsgPopup extends IpcMsg {
  method: "popup";
  arg: string;
}

export interface IpcMsgPythocExec extends IpcMsg {
  method: "pythonExec";
  arg: any;
}

export interface IpcMsgPythocResponse extends IpcMsg {
  method: "pythonResponse";
  arg: any[] | undefined;
}

export interface ipcMsgCv extends IpcMsg {
  method: "cv";
  arg: typeof initialBackgroundState & typeof initialCVSettings;
}

export interface ipcMsgCvResult extends IpcMsg {
  method: "cvResult";
  arg: CVResult;
}

export type IpcArgument =
  | IpcMsgPopup
  | IpcMsgPythocExec
  | IpcMsgPythocResponse
  | ipcMsgCv
  | ipcMsgCvResult;
