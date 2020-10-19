// eslint-disable-next-line import/no-unresolved
const { app, globalShortcut, BrowserWindow, protocol } = require("electron");
const path = require("path");
const url = require("url");
const mainIpcInitialize = require("./ipcHandlers");
const installDevTools = require("./devtools");

let mainWindow;

app.allowRendererProcessReuse = false;

function sendInit() {
  console.log("Renderer Init signal");
  mainWindow.webContents.send("rendererInit", true);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#242526",
    width: 350,
    height: 800,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
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
  // mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();
  globalShortcut.register("Alt+Shift+D", () => mainWindow.toggleDevTools());

  mainWindow.on("closed", () => {
    app.quit();
  });

  mainWindow.webContents.once("dom-ready", () => {
    sendInit();
  });

  mainIpcInitialize();
  if (!app.isPackaged) {
    installDevTools();
  }
}

app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

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
