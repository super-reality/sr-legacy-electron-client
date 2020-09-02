import reduxAction from "../renderer/redux/reduxAction";
import store from "../renderer/redux/stores/renderer";

interface DetachLesson {
  type: "LESSON_VIEW";
  arg: any;
}

export type DetachArg = DetachLesson;

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
