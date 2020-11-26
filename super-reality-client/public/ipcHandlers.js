const { ipcMain, dialog } = require("electron");

const ipc = ipcMain;

// [name]: webContents
const ipcWindows = {};

let puppeteer;

function handleIpcSwitch(_event, method, msg) {
  if (msg.to) {
    const target = ipcWindows[msg.to];
    if (target) {
      target.send(method, msg.arg);
    }
  } else {
    switch (method) {
      // add more message handlers here
      case "popup":
        dialog.showMessageBox({ message: msg.arg });
        break;
      case "getUrlbyTitle":
        puppeteer.getDuckDuckGoUrl(msg.arg).then((url) => {
          _event.sender.send(msg.responseChannel, {
            url,
            title: msg.arg,
          });
        });
        break;
      default:
        break;
    }
  }
}

function handleIpcRegister(event, method, arg) {
  console.log(`Register IPC`, method);
  ipcWindows[method] = event.sender;
}

function mainIpcInitialize(pup) {
  puppeteer = pup;
  puppeteer.initWindow();
  ipc.on("ipc_switch", handleIpcSwitch);
  ipc.on("ipc_register", handleIpcRegister);
}

module.exports = mainIpcInitialize;
