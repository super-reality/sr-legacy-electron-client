export default function setResizable(set: boolean) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  remote.getCurrentWindow().setResizable(set);
}
