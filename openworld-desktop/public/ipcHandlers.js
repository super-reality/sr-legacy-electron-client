const { ipcMain, dialog } = require("electron");

const ipc = ipcMain;

function handleIpcSwitch(_event, method, arg) {
  switch (method) {
    // add more message handlers here
    case "popup":
      dialog.showMessageBox({ message: arg });
      break;
    default:
      break;
  }
}

function mainIpcInitialize() {
  ipc.on("ipc_switch", handleIpcSwitch);
}

module.exports = mainIpcInitialize;
