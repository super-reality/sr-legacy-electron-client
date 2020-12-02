// eslint-disable-next-line import/no-unresolved
const {
  app,
  globalShortcut,
  BrowserWindow,
  screen,
  protocol,
} = require("electron");
const path = require("path");
const url = require("url");
const mainIpcInitialize = require("./ipcHandlers");
const installDevTools = require("./devtools");
const Puppeteer = require("./puppeteer");

const puppeteer = new Puppeteer();

let mainWindow;

app.allowRendererProcessReuse = false;

function sendInit() {
  console.log("Renderer Init signal");
  mainWindow.webContents.send("rendererInit", true);
}

function sendReady() {
  console.log("Renderer Ready signal");
  mainWindow.webContents.send("rendererReady", true);
}

function getDisplayBounds() {
  const newBounds = { x: 0, y: 0, width: 0, height: 0 };
  const displays = screen.getAllDisplays();
  newBounds.x = Math.min(...displays.map((display) => display.bounds.x));
  newBounds.y = Math.min(...displays.map((display) => display.bounds.y));
  screen.getAllDisplays().forEach((display) => {
    newBounds.width = Math.max(
      newBounds.width,
      Math.abs(newBounds.x) + display.bounds.x + display.bounds.width
    );
    newBounds.height = Math.max(
      newBounds.height,
      Math.abs(newBounds.y) + display.bounds.y + display.bounds.height
    );
  });
  return newBounds;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    transparent: true,
    resizable: false,
    focusable: false,
    show: false,
    frame: false,
    width: 1024,
    height: 768,
    acceptFirstMouse: true,
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
    mainWindow.show();
    mainWindow.focus();
    sendInit();

    setTimeout(() => {
      mainWindow.setSize(1000, 1000);
      mainWindow.setPosition(0, 0);
    }, 250);
    setTimeout(() => {
      const bounds = getDisplayBounds();
      mainWindow.setPosition(bounds.x, bounds.y);
    }, 500);
    setTimeout(() => {
      const bounds = getDisplayBounds();
      mainWindow.setSize(bounds.width, bounds.height);
      sendReady();
    }, 1000);
  });

  mainIpcInitialize(puppeteer);
  if (!app.isPackaged) {
    installDevTools();
  }
}

function preCreateWindow() {
  setTimeout(createWindow, 1000);
}

app.whenReady().then(() => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

app.on("ready", preCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    preCreateWindow();
  }
});
