/* eslint-disable global-require */
import path from "path";
import url from "url";
import jsonRpcRemote from "./jsonRpcSend";

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function createFindBox(pos: Position): Promise<void> {
  const { remote } = require("electron");
  const findWindow = new remote.BrowserWindow({
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
  });

  const proc: any = process;
  findWindow.loadURL(
    url.format({
      pathname: remote.app.isPackaged
        ? path.join(proc.resourcesPath, "app.asar", "build", "find.html")
        : path.join("..", "..", "public", "find.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  return new Promise<void>((resolve) => {
    // findWindow.webContents.openDevTools();

    const checkInterval = setInterval(() => {
      const mouse = remote.screen.getCursorScreenPoint();
      if (
        mouse.x > pos.x &&
        mouse.y > pos.y &&
        mouse.x < pos.x + pos.width &&
        mouse.y < pos.y + pos.height
      ) {
        findWindow.close();
        clearInterval(checkInterval);
      }
    }, 100);

    findWindow.on("closed", () => {
      findWindow.destroy();
      resolve();
    });
  });
}
const { remote } = require("electron");

export function findCVMatch(imageUrl: string): Promise<boolean> {
  const win = remote.getCurrentWindow();
  const pos = win.getPosition();
  const size = win.getSize();
  return new Promise((resolve, reject) => {
    jsonRpcRemote("findCV", {
      imageUrl: imageUrl,
      parentx: pos[0],
      parenty: pos[1],
      parentwidth: size[0],
      parentheight: size[1],
    })
      .then((res: any) => {
        if (res.result[0] == 1) {
          resolve(true);
          console.log(res.result, "result");
          createFindBox({
            x: res.result[1],
            y: res.result[2],
            width: res.result[3],
            height: res.result[4],
          }).then(() => {});
        } else {
          resolve(false);
        }
      })
      .catch((e) => {
        reject();
      });
  });
}

export function findCVArrayMatch(
  imageUrls: string[],
  functions: Number[]
): Promise<boolean> {
  const win = remote.getCurrentWindow();
  const pos = win.getPosition();
  const size = win.getSize();
  return new Promise((resolve, reject) => {
    jsonRpcRemote("findCVArray", {
      imageUrls: imageUrls,
      functions: functions,
      parentx: pos[0],
      parenty: pos[1],
      parentwidth: size[0],
      parentheight: size[1],
    })
      .then((res: any) => {
        if (res.result[0] == 1) {
          resolve(true);
          console.log(res.result, "result");
          createFindBox({
            x: res.result[1],
            y: res.result[2],
            width: res.result[3],
            height: res.result[4],
          }).then(() => {});
        } else {
          resolve(false);
        }
      })
      .catch((e) => {
        reject();
      });
  });
}
