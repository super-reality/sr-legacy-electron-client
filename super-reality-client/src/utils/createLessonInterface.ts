/* eslint-disable func-names */
/* eslint-disable global-require */
import path from "path";
import url from "url";
import reduxAction from "../renderer/redux/reduxAction";
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
    // frame: true,
    resizable: true,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    frame: false,
    opacity: 1,
    paintWhenInitiallyHidden: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
    ...props,
  });

  newWindow.removeMenu();

  remote.globalShortcut.register("Alt+Shift+S", function () {
    const transparent = store.getState().render.overlayTransparent;
    reduxAction(store.dispatch, {
      type: "SET_OVERLAY_TRANSPARENT",
      arg: !transparent,
    });
    if (transparent) {
      newWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      newWindow.setIgnoreMouseEvents(false);
    }
  });

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
    newWindow.webContents.openDevTools();
    newWindow.webContents.once("dom-ready", () => {
      newWindow.webContents.send("token", store.getState().auth.token);
      newWindow.webContents.send("detached", {
        type: "LESSON_CREATE",
        arg: true,
      });
      setTimeout(function () {
        newWindow.show();
      }, 1000);
    });

    newWindow.on("closed", () => {
      remote.globalShortcut.unregister("Alt+Shift+S");
      newWindow.destroy();
      if (callback) callback();
      resolve();
    });
  });
}
