export default function setTopMost(set: boolean) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron") as any;
  if (set) remote.getCurrentWindow().setAlwaysOnTop("floating");
  else {
    remote.getCurrentWindow().setAlwaysOnTop(false);
    remote.getCurrentWindow().focus();
  }
}
