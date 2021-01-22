import path from "path";

export default function getPublicPath(): string {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const proc: any = process;

  return remote.app.isPackaged
    ? path.join(proc.resourcesPath)
    : path.join(remote.app.getAppPath(), "public");
}
