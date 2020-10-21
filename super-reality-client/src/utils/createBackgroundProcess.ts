/* eslint-disable global-require */
import path from "path";
import url from "url";
import globalData from "../renderer/globalData";

export function getBackgroundProcess() {
  return globalData.backgroundProcess;
}

export default function createBackgroundProcess(): Promise<void> {
  console.log("Initializing background process..");
  const { remote } = require("electron");

  if (globalData.backgroundProcess != null) {
    return new Promise((r) => r());
  }
  globalData.backgroundProcess = new remote.BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  });

  const proc: any = process;
  globalData.backgroundProcess.loadURL(
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

  remote.globalShortcut.register("Alt+Shift+F", () => {
    globalData.backgroundProcess.webContents.openDevTools();
  });

  return new Promise<void>((resolve) => {
    globalData.backgroundProcess.webContents.once("dom-ready", () => {
      console.log("Background process init OK");
      globalData.backgroundProcess.webContents.send("background", true);
    });

    globalData.backgroundProcess.on("closed", () => {
      console.log("Background process closed unexpectedly!");
      globalData.backgroundProcess = null;
      remote.globalShortcut.unregister("Alt+Shift+F");
      resolve();
    });
  });
}
