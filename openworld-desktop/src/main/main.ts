import path from "path";
import url from "url";
import { app, BrowserWindow } from "electron";

function createWindow() {
  const browserWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  browserWindow.loadURL(
    url.format({
      protocol: "file",
      slashes: false,
      pathname: path.resolve(__dirname, "renderer", "index.html"),
    })
  );
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
    browserWindow.webContents.openDevTools();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
