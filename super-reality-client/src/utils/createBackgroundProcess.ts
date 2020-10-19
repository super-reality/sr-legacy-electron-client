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
    width: 100,
    height: 100,
    frame: false,
    show: false,
    alwaysOnTop: false,
    resizable: true,
    webPreferences: {
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

  return new Promise<void>((resolve) => {
    // globalData.backgroundProcess.webContents.openDevTools();
    globalData.backgroundProcess.webContents.once("dom-ready", () => {
      console.log("Background process init OK");
      globalData.backgroundProcess.webContents.send("background", true);
    });

    globalData.backgroundProcess.on("closed", () => {
      console.log("Background process closed unexpectedly!");
      globalData.backgroundProcess = null;
      resolve();
    });
  });
}
