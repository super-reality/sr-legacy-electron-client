import reduxAction from "../renderer/redux/reduxAction";
import store from "../renderer/redux/stores/renderer";

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
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");

  ipcRenderer.on("detached", (e: any, arg: DetachArg) => {
    reduxAction(store.dispatch, { type: "SET_DETACHED", arg });
  });

  ipcRenderer.on("token", (e: any, arg: string) => {
    reduxAction(store.dispatch, { type: "AUTH_TOKEN", arg });
  });
}
