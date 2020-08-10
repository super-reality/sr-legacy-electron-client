// eslint-disable-next-line import/no-unresolved
const { app, globalShortcut, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const mainIpcInitialize = require("./ipcHandlers");
const installDevTools = require("./devtools");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#242526",
    width: 350,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "..", "build", "index.html"),
        protocol: "file:",
        slashes: true,
      })
  );

  mainWindow.removeMenu();
  globalShortcut.register("Alt+Shift+D", () => mainWindow.toggleDevTools());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainIpcInitialize();
  if (!app.isPackaged) {
    installDevTools();
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
