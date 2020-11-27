export default function minimizeWindow() {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  remote.getCurrentWindow().minimize();
}
