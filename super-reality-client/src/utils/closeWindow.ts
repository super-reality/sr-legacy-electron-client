export default function closeWindow() {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  remote.getCurrentWindow().close();
}
