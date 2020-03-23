const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");

function createWindow() {
    let browserWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 1024,
        minHeight: 768,
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
    browserWindow.once("ready-to-show", () => browserWindow.show());
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
