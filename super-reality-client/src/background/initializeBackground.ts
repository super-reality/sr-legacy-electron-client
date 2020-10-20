import getWindowId from "../utils/getWindowId";

export default function initializeBackground() {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("ipc_register", "background", getWindowId());

  console.log("Background process init");
}
