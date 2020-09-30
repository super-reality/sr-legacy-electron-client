/* eslint-disable func-names */
/* eslint-disable global-require */
import path from "path";
import url from "url";
import store from "../renderer/redux/stores/renderer";
import isElectron from "./isElectron";

export default function createLessonInterface(
  props: any,
  callback?: () => void
): Promise<void> {
  if (!isElectron()) {
    console.error("createLessonInterface was not escaped correcty.");
    return new Promise(() => {});
  }
  const { remote } = require("electron");
  const newWindow = new remote.BrowserWindow({
    transparent: true,
    resizable: true,
    fullscreen: false,
    show: false,
    frame: false,
    acceptFirstMouse: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    ...props,
  });

  newWindow.removeMenu();
  newWindow.setVisibleOnAllWorkspaces(true);

  const proc: any = process;
  newWindow.loadURL(
    remote.app.isPackaged
      ? url.format({
          pathname: path.join(
            proc.resourcesPath,
            "app.asar",
            "build",
            "index.html"
          ),
          protocol: "file:",
          slashes: true,
        })
      : "http://localhost:3000"
  );

  return new Promise<void>((resolve) => {
    newWindow.webContents.openDevTools({ mode: "undocked" });
    newWindow.webContents.once("dom-ready", () => {
      newWindow.webContents.send("token", store.getState().auth.token);
      newWindow.webContents.send("detached", {
        type: "LESSON_CREATE",
        arg: true,
      });
      setTimeout(function () {
        newWindow.show();
        newWindow.focus();
      }, 1000);
    });

    newWindow.on("closed", () => {
      newWindow.destroy();
      if (callback) callback();
      resolve();
    });
  });
}
