import pythonExecute from "../background/pythonExecute";
import reduxAction from "../renderer/redux/reduxAction";
import store from "../renderer/redux/stores/renderer";
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

  ipcRenderer.removeAllListeners("pythonExec");
  ipcRenderer.on("pythonExec", (e: any, arg: any) => {
    console.log("pythonExec", arg);
    pythonExecute(arg);
  });

  ipcRenderer.removeAllListeners("pythonResponse");
  ipcRenderer.on("pythonResponse", (e: any, arg: any) => {
    console.log("pythonResponse", arg);
  });

  ipcRenderer.removeAllListeners("token");
  ipcRenderer.on("token", (e: any, arg: string) => {
    reduxAction(store.dispatch, { type: "AUTH_TOKEN", arg });
  });
}
