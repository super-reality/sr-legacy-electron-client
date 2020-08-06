import path from "path";
import url from "url";
import { app, BrowserWindow } from "electron";

function createWindow() {
  const browserWindow = new BrowserWindow({
    backgroundColor: "#000",
    width: 600,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    minWidth: 600,
    maxWidth: 1280,
    minHeight: 768,
    maxHeight: 1024,
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
    browserWindow.removeMenu();
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
