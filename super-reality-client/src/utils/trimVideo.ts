import { exec } from "child_process";
import path from "path";
import shell from "any-shell-escape";
import getPublicPath from "./electron/getPublicPath";

export default function trimVideo(
  trimFrom: string,
  trimTo: string,
  width: string,
  height: string,
  x: string,
  y: string,
  src: string,
  dst: string
) {
  const pathToFfmpeg = path.join(getPublicPath(), "extra", "ffmpeg.exe");

  const ffmpegCommand = shell([
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
  ]);

  exec(ffmpegCommand, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info("Video Trimmed!");
    }
  });
}
