import { remote } from "electron";
import path from "path";
import url from "url";
import { useCallback } from "react";
import jsonRpcRemote from "../../utils/jsonRpcSend";

function createSniper(): Promise<string> {
  console.log("createSniper");

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
    remote.globalShortcut.unregister("Control+S");
    remote.globalShortcut.unregister("Control+D");
    snipWindow.destroy();
  });
  let translucent = false;

  // snipWindow.webContents.openDevTools();

  remote.globalShortcut.register("Control+D", () => {
    translucent = !translucent;
    if (translucent == true) {
      snipWindow.setIgnoreMouseEvents(true);
    } else {
      snipWindow.setIgnoreMouseEvents(false);
    }
  });

  return new Promise<string>((resolve, reject) => {
    remote.globalShortcut.register("Control+S", () => {
      if (snipWindow != null) {
        const pos = snipWindow.getPosition();
        const size = snipWindow.getSize();
        console.log(pos, size);
        snipWindow.close();

        jsonRpcRemote("snipImage", {
          posx: pos[0] + 3,
          posy: pos[1] + 3,
          width: size[0] - 6,
          height: size[1] - 6,
          path: "",
        })
          .then((res) => {
            const rescopy: any = res;
            const ImagePathCopy = rescopy.result.imgPath;
            console.log(ImagePathCopy);
            resolve(ImagePathCopy);
          })
          .catch((err) => {
            console.log("error ocurred checkmehere");
            reject(err);
            console.log(err);
          });
      } else {
        reject();
      }
    });
  });
}

export default function useMediaSniper(
  onFinish: (url: string) => void
): () => void {
  const open = useCallback(() => {
    createSniper().then(onFinish);
  }, []);

  return open;
}