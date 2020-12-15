import path from "path";
import shell from "any-shell-escape";
import { exec } from "child_process";
import getPublicPath from "./electron/getPublicPath";

export default function trimAudio(
  trimFrom: string,
  trimTo: string,
  src: string,
  dst: string
): Promise<string> {
  const pathToFfmpeg = path.join(getPublicPath(), "extra", "ffmpeg.exe");

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
