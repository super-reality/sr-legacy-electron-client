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

  ipcRenderer.on("rendererInit", () => {
    ipcRenderer.send("ipc_register", "renderer", getWindowId());
    createBackgroundProcess();
  });

  ipcRenderer.on("detached", (e: any, arg: DetachArg) => {
    reduxAction(store.dispatch, { type: "SET_DETACHED", arg });
  });

  ipcRenderer.on("background", (e: any, arg: boolean) => {
    reduxAction(store.dispatch, { type: "SET_BACKGROUND", arg });
  });

  ipcRenderer.on("pythonExec", (e: any, arg: any) => {
    pythonExecute(arg);
  });

  ipcRenderer.on("pythonResponse", (e: any, arg: any) => {
    console.log("pythonResponse", arg);
  });

  ipcRenderer.on("token", (e: any, arg: string) => {
    reduxAction(store.dispatch, { type: "AUTH_TOKEN", arg });
  });
}
