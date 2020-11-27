export default function setMaximize(set: boolean) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  if (!remote.getCurrentWindow().isMaximized() && !set)
    remote.getCurrentWindow().unmaximize();
  else if (set) remote.getCurrentWindow().maximize();
}
