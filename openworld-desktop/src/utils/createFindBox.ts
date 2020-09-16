/* eslint-disable global-require */
import path from "path";
import url from "url";
import globalData from "../renderer/globalData";

// eslint-disable-next-line no-undef
const mouseEvents = __non_webpack_require__("global-mouse-events");

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCurrentFindWindow() {
  return globalData.cvFindWindow;
}

export type FindBoxResolve = "Clicked" | "Focused" | "Cancelled" | "Moved";

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
  globalData.cvFindWindow.setIgnoreMouseEvents(true);
  globalData.cvFindWindow.setFocusable(false);

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
        mouse.y < pos.y + pos.height &&
        !props.closeOnClick
      ) {
        if (globalData.cvFindWindow != null) {
          globalData.cvFindWindow.close();
          globalData.cvFindWindow = null;
        }
        clearInterval(checkInterval);
        resolve("Focused");
      }
    }, 100);

    if (props.closeOnClick) {
      mouseEvents.on(
        "mousedown",
        (e: { x: number; y: number; button: number }) => {
          // console.log(e); // { x: 2962, y: 483, button: 1 }
          if (
            e.x > pos.x &&
            e.y > pos.y &&
            e.x < pos.x + pos.width &&
            e.y < pos.y + pos.height
          ) {
            if (globalData.cvFindWindow != null) {
              globalData.cvFindWindow.close();
              globalData.cvFindWindow = null;
            }
            resolve("Clicked");
          }
        }
      );
    }

    globalData.cvFindWindow.on("closed", () => {
      if (globalData.cvFindWindow != null) {
        globalData.cvFindWindow.destroy();
        globalData.cvFindWindow = null;
      }
      resolve("Cancelled");
    });
  });
}
