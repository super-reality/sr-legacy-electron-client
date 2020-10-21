export default function getWindowId(): number {
  // eslint-disable-next-line global-require
  return require("electron").remote.getCurrentWindow().id;
}
