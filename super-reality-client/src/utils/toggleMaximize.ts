export default function toggleMaximize() {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  if (remote.getCurrentWindow().isMaximized())
    remote.getCurrentWindow().unmaximize();
  else remote.getCurrentWindow().maximize();
}
