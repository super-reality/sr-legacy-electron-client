import { remote } from "electron";
import path from "path";
import url from "url";
import { useCallback } from "react";
import jsonRpcRemote from "../../utils/jsonRpcSend";

function createSniper(imgUrl: any): Promise<string> {
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

  // change the pathname to get the correct path in build
  snipWindow.loadURL(
    url.format({
      pathname: remote.app.isPackaged
        ? path.join(process.resourcesPath, "app.asar", "build", "dialog.html")
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
        let imglocalPath: any = "";
        if (imgUrl != undefined) {
          imglocalPath = imgUrl;
        }
        jsonRpcRemote("snipImage", {
          posx: pos[0] + 3,
          posy: pos[1] + 3,
          width: size[0] - 6,
          height: size[1] - 6,
          path: imglocalPath,
        })
          .then((res) => {
            const rescopy: any = res;
            let ImagePathCopy: string = "";
            try {
              ImagePathCopy = rescopy.result.imgPath;
            } catch (err) {
              reject(err);
            }
            resolve(ImagePathCopy);
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
  }, []);

  return open;
}
