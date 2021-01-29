export default function setFocusable(set: boolean) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  remote.getCurrentWindow().setFocusable(set);
  if (set) {
    remote.getCurrentWindow().focus();
  }
}
