export default function userDataPath(): string {
  // eslint-disable-next-line global-require
  const { app, remote } = require("electron");
  return (app || remote.app).getPath("userData").replace(/\\/g, "/");
}
