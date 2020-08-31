/* eslint-disable global-require */
import path from "path";
import url from "url";
import { useCallback } from "react";
import jsonRpcRemote from "../../utils/jsonRpcSend";

export function createFindBox(
  posx: Number,
  posy: Number,
  width: Number,
  height: Number
): void {
  const { remote } = require("electron");
  const snipWindow = new remote.BrowserWindow({
    width: width,
    height: height,
    frame: false,
    x: posx,
    y: posy,
    // transparent: true,
    opacity: 1,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const proc: any = process;
  snipWindow.loadURL(
    url.format({
      pathname: remote.app.isPackaged
        ? path.join(proc.resourcesPath, "app.asar", "build", "find.html")
        : path.join("..", "public", "find.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  snipWindow.on("closed", () => {
    snipWindow.destroy();
  });
  snipWindow.on("mouseEnterFromFindTarget", () => {
    console.log("mouseenterevne");
    snipWindow.close();
  });
}
function createSniper(imgUrl: any): Promise<string> {
  const { remote } = require("electron");
  const snipWindow = new remote.BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    opacity: 1,
    alwaysOnTop: true,
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const proc: any = process;

  // change the pathname to get the correct path in build
  snipWindow.loadURL(
    url.format({
      pathname: remote.app.isPackaged
        ? path.join(proc.resourcesPath, "app.asar", "build", "dialog.html")
        : path.join("..", "public", "dialog.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  snipWindow.on("closed", () => {
    remote.globalShortcut.unregister("Shift+S");
    remote.globalShortcut.unregister("Shift+D");
    snipWindow.destroy();
  });
  let translucent = false;

  // snipWindow.webContents.openDevTools();

  remote.globalShortcut.register("Shift+D", () => {
    translucent = !translucent;
    if (translucent == true) {
      snipWindow.setIgnoreMouseEvents(true);
    } else {
      snipWindow.setIgnoreMouseEvents(false);
    }
  });

  return new Promise<string>((resolve, reject) => {
    remote.globalShortcut.register("Shift+S", () => {
      if (snipWindow != null) {
        const pos = snipWindow.getPosition();
        const size = snipWindow.getSize();
        snipWindow.close();
        const imglocalPath = "";

        jsonRpcRemote("snipImage", {
          posx: pos[0] + 3,
          posy: pos[1] + 3,
          width: size[0] - 6,
          height: size[1] - 6,
          path: imglocalPath,
        })
          .then((res: any) => {
            let ImagePathCopy: string = "";
            try {
              ImagePathCopy = res.result.imgPath;
            } catch (err) {
              reject(err);
            }
            resolve(ImagePathCopy.replace(/\\/g, "/").replace(/"/g, ""));
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject();
      }
    });
  });
}

export default function useMediaSniper(
  imgUrl: any,
  onFinish: (url: string) => void
): () => void {
  const open = useCallback(() => {
    createSniper(imgUrl).then(onFinish);
  }, [onFinish, imgUrl]);

  return open;
}
