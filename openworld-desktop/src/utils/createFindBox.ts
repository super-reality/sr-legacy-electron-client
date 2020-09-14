/* eslint-disable global-require */
import path from "path";
import url from "url";
import jsonRpcRemote from "./jsonRpcSend";
import globalData from "../renderer/globalData";

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCurrentFindWindow() {
  return globalData.cvFindWindow;
}

export type FindBoxResolve = "Focused" | "Cancelled" | "Moved";

export default function createFindBox(
  pos: Position,
  props: any = {}
): Promise<FindBoxResolve> {
  const { remote } = require("electron");

  if (globalData.cvFindWindow != null) {
    globalData.cvFindWindow.setBounds({
      width: pos.width + 64,
      height: pos.height + 64,
      x: pos.x - 32,
      y: pos.y - 32,
    });
    return new Promise<"Moved">((r) => r());
  }
  globalData.cvFindWindow = new remote.BrowserWindow({
    width: pos.width + 64,
    height: pos.height + 64,
    frame: false,
    x: pos.x - 32,
    y: pos.y - 32,
    transparent: true,
    opacity: 1,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    ...props,
  });

  const proc: any = process;
  globalData.cvFindWindow.loadURL(
    url.format({
      pathname: remote.app.isPackaged
        ? path.join(proc.resourcesPath, "app.asar", "build", "find.html")
        : path.join("..", "..", "public", "find.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  return new Promise<FindBoxResolve>((resolve) => {
    const checkInterval = setInterval(() => {
      const mouse = remote.screen.getCursorScreenPoint();
      if (
        mouse.x > pos.x &&
        mouse.y > pos.y &&
        mouse.x < pos.x + pos.width &&
        mouse.y < pos.y + pos.height
      ) {
        if (globalData.cvFindWindow != null) {
          globalData.cvFindWindow.close();
          globalData.cvFindWindow = null;
        }
        clearInterval(checkInterval);
        resolve("Focused");
      }
    }, 100);

    globalData.cvFindWindow.on("closed", () => {
      if (globalData.cvFindWindow != null) {
        globalData.cvFindWindow.destroy();
        globalData.cvFindWindow = null;
      }
      resolve("Cancelled");
    });
  });
}
