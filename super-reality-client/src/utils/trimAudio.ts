import path from "path";
import shell from "any-shell-escape";
import { exec } from "child_process";

export default function trimAudio(
  trimFrom: string,
  trimTo: string,
  src: string,
  dst: string
): Promise<string> {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const proc = process as any;
  const pathToFfmpeg = remote.app.isPackaged
    ? path.join(proc.resourcesPath, "extra", "ffmpeg.exe")
    : path.join(remote.app.getAppPath(), "public", "extra", "ffmpeg.exe");

  return new Promise((resolve, reject) => {
    const ffmpegCommand = shell([
      pathToFfmpeg,
      "-ss",
      trimFrom,
      "-i",
      src,
      "-t",
      trimTo,
      "-c",
      "copy",
      dst,
    ]);

    try {
      exec(ffmpegCommand, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(dst);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
