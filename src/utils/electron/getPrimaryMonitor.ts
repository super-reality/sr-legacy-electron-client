export default function getPrimaryMonitor(): Electron.Display {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  return remote.screen.getPrimaryDisplay();
}
