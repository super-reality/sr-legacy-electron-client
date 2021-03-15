/* eslint-disable func-names */
/* eslint-disable global-require */
import path from "path";
import url from "url";
import { DetachArg } from "./handleIpc";
import store from "../renderer/redux/stores/renderer";
import isElectron from "./electron/isElectron";
import { voidFunction } from "../renderer/constants";

export default function createDetachedWindow(
  props: any,
  detach: DetachArg,
  callback?: () => void
): Promise<void> {
  if (!isElectron()) {
    console.error("createDetachedWindow was not escaped correcty.");
    return new Promise(voidFunction);
  }
  const { remote } = require("electron");
  const newWindow = new remote.BrowserWindow({
    frame: true,
    alwaysOnTop: true,
    resizable: true,
    show: false,
    paintWhenInitiallyHidden: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    ...props,
  });

  newWindow.removeMenu();

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
    // newWindow.webContents.openDevTools();
    newWindow.webContents.once("dom-ready", () => {
      newWindow.webContents.send("token", store.getState().auth.token);
      newWindow.webContents.send("detached", detach);
      setTimeout(function () {
        newWindow.show();
      }, 1000);
    });

    newWindow.on("closed", () => {
      newWindow.destroy();
      if (callback) callback();
      resolve();
    });
  });
}
