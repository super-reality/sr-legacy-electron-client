import pythonExecute from "../background/pythonExecute";
import reduxAction from "../renderer/redux/reduxAction";
import store from "../renderer/redux/stores/renderer";
import {
  IpcMsg,
  ipcMsgCv,
  ipcMsgCvResult,
  IpcMsgPythocExec,
  IpcMsgPythocResponse,
} from "../types/ipc";
import createBackgroundProcess from "./createBackgroundProcess";

import getWindowId from "./getWindowId";

interface DetachLesson {
  type: "LESSON_VIEW";
  arg: any;
}

interface CreateLesson {
  type: "LESSON_CREATE";
  arg: any;
}

interface DetachSniping {
  type: "SNIPING_TOOL";
  arg: string;
}

export type DetachArg = DetachLesson | DetachSniping | CreateLesson;

/**
 * Utility function to create an ipc listener, removing previous listeners on the same channel, type aware.
 * @param channel IPC channel to listen.
 * @param fn function to execute.
 */
function makeIpcListener<T extends IpcMsg>(
  channel: T["method"],
  fn: (e: Electron.IpcRendererEvent, arg: T["arg"]) => void
): void {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");
  ipcRenderer.removeAllListeners(channel);
  ipcRenderer.on(channel, fn);
}

export default function handleIpc(): void {
  console.log("Initialize IPC handlers");
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");

  // Remove the listeners before initializing to avoid HMR creating duplicate listeners
  ipcRenderer.removeAllListeners("rendererInit");
  ipcRenderer.on("rendererInit", () => {
    console.log("Register on IPC as: renderer");
    ipcRenderer.send("ipc_register", "renderer", getWindowId());
    createBackgroundProcess();
  });

  ipcRenderer.removeAllListeners("detached");
  ipcRenderer.on("detached", (e: any, arg: DetachArg) => {
    console.log(`Register on IPC as: ${arg.type}`);
    ipcRenderer.send("ipc_register", arg.type, getWindowId());
    reduxAction(store.dispatch, { type: "SET_DETACHED", arg });
  });

  ipcRenderer.removeAllListeners("background");
  ipcRenderer.on("background", (e: any, arg: boolean) => {
    console.log("Register on IPC as background");
    ipcRenderer.send("ipc_register", "background", getWindowId());
    reduxAction(store.dispatch, { type: "SET_BACKGROUND", arg });
  });

  ipcRenderer.removeAllListeners("token");
  ipcRenderer.on("token", (e: any, arg: string) => {
    reduxAction(store.dispatch, { type: "AUTH_TOKEN", arg });
  });

  makeIpcListener<IpcMsgPythocExec>("pythonExec", (e, arg) => {
    console.log("pythonExec", arg);
    pythonExecute(arg);
  });

  makeIpcListener<IpcMsgPythocResponse>("pythonResponse", (e, arg) => {
    console.log("pythonResponse", arg);
  });

  makeIpcListener<ipcMsgCv>("cv", (e, arg) => {
    reduxAction(store.dispatch, {
      type: "SET_BACK",
      arg: { cvTemplates: arg.cvTemplates, cvTo: arg.cvTo },
    });
    reduxAction(store.dispatch, { type: "SET_CV_SETTINGS", arg });
  });

  makeIpcListener<ipcMsgCvResult>("cvResult", (e, arg) => {
    reduxAction(store.dispatch, { type: "SET_CV_RESULT", arg });
  });
}
