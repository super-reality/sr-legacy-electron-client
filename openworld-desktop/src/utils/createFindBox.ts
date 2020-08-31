/* eslint-disable global-require */
import path from "path";
import url from "url";

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
