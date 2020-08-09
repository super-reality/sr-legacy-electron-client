const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");

function createWindow() {
    let width = 450;
    let height = 850;
    let browserWindow = new BrowserWindow({
        minWidth: width,
        minHeight: height,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    browserWindow.loadURL(url.format({
        protocol: "file",
        slashes: false,
        pathname: path.resolve(__dirname, "..", "build", "index.html")
    }));
    browserWindow.once("ready-to-show", () => {
        browserWindow.show();
        browserWindow.webContents.openDevTools();
    });
    browserWindow.setMenu(null);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
