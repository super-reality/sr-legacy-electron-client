import { exec } from "child_process";
import fs from "fs";
import path from "path";
import shell from "any-shell-escape";
import getPublicPath from "./electron/getPublicPath";
import logger from "./logger";

export default function cropVideo(
  trimFrom: string,
  trimTo: string,
  width: string | number,
  height: string | number,
  x: string | number,
  y: string | number,
  src: string,
  dst: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pathToFfmpeg = path.join(getPublicPath(), "extra", "ffmpeg.exe");
    if (fs.existsSync(dst)) {
      fs.unlinkSync(dst);
    }

    const command = [
      pathToFfmpeg,
      "-i",
      src,
      "-filter:v",
      `crop=${width}:${height}:${x}:${y}`,
      "-ss",
      trimFrom,
      "-to",
      trimTo,
      "-video_size",
      `${width}x${height}`,
      "-async",
      "1",
      dst,
    ];

    logger("info", command);
    const ffmpegCommand = shell(command);

    exec(ffmpegCommand, (err) => {
      if (err) {
        reject(err);
      } else {
        console.info("Video Trimmed!");
        resolve(dst);
      }
    });
  });
}
