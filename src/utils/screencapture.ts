import { exec } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";

function captureCommand(filePath: string) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");

  const proc: any = process;
  // freeware nircmd http://www.nirsoft.net/utils/nircmd.html
  const nircmdc = remote.app.isPackaged
    ? path.join(proc.resourcesPath, "extra", "nircmdc.exe")
    : path.join(remote.app.getAppPath(), "public", "extra", "nircmdc.exe");

  switch (os.platform()) {
    case "win32":
      return `"${nircmdc}" sendkeypress Ctrl+printscreen & "${nircmdc}" cmdwait 100 clipboard saveimage ${filePath}`;
    case "darwin":
      return `screencapture -i ${filePath}`;
    case "linux":
      return `import ${filePath}`;
    default:
      throw new Error("unsupported platform");
  }
}

function capture(filePath: string, callback: any) {
  exec(captureCommand(filePath), (err) => {
    // console.error(err);
    // nircmd always exits with err even though it works
    if (err && os.platform() !== "win32") callback(err);

    // eslint-disable-next-line consistent-return
    if (fs.existsSync(filePath)) {
      callback(null, filePath);
    } else {
      callback(new Error("Screenshot failed"));
    }
  });
}

/*
   Capture a screenshot and resolve with the image path

   @param {String} [filePath]
   @param {Function} callback
*/
export default function screencapture(filePath: string, callback: any) {
  capture(filePath, callback);
}
