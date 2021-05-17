import isElectron from "../electron/isElectron";

export default function userDataPath(): string {
  if (isElectron()) {
    // eslint-disable-next-line global-require
    const { app, remote } = require("electron");
    return (app || remote.app).getPath("userData").replace(/\\/g, "/");
  }
  return "";
}
