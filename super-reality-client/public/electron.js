// eslint-disable-next-line import/no-unresolved
const {
  app,
  globalShortcut,
  BrowserWindow,
  screen,
  protocol,
  Menu,
  Tray,
} = require("electron");
const path = require("path");
const url = require("url");
const mainIpcInitialize = require("./ipcHandlers");
const installDevTools = require("./devtools");
const Puppeteer = require("./puppeteer");

let tray = null;

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

function showWindow() {
  if (mainWindow) {
    if (!mainWindow.isVisible() || mainWindow.isMinimized()) mainWindow.show();
    else mainWindow.moveTop();
  }
}

function toggleWindow() {
  if (mainWindow && mainWindow.isVisible()) {
    if (!mainWindow.isMinimized()) {
      mainWindow.minimize();
    } else {
      showWindow();
    }
  } else {
    showWindow();
  }
}

function getDisplay() {
  return screen.getPrimaryDisplay();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    focusable: true,
    show: false,
    frame: false,
    width: 1024,
    height: 768,
    acceptFirstMouse: true,
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

  mainWindow.removeMenu();
  globalShortcut.register("Alt+Shift+D", () => mainWindow.toggleDevTools());

  const iconPath = "logo192.png";

  tray = new Tray(path.join(__dirname, iconPath));
  tray.on("double-click", toggleWindow);
  tray.setToolTip("Super Reality");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        showWindow();
      },
    },
    {
      label: "Quit",
      click: () => {
        console.log("Bye bye!");
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  mainWindow.on("closed", () => {
    app.quit();
  });

  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true, "floating");
    sendInit();

    setTimeout(() => {
      mainWindow.setSize(1000, 1000);
      mainWindow.setPosition(0, 0);
    }, 500);
    setTimeout(() => {
      const bounds = getDisplay();
      mainWindow.setPosition(bounds.bounds.x, bounds.bounds.y);
    }, 1000);
    setTimeout(() => {
      const bounds = getDisplay();
      mainWindow.setSize(bounds.workArea.width, bounds.workArea.height);
    }, 1500);
    setTimeout(() => {
      sendReady();
    }, 2000);
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
