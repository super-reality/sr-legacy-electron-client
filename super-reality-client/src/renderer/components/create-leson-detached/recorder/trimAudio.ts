const path = require("path");
const shell = require("any-shell-escape");
const { exec } = require("child_process");

export default function trimAudio(
  trimFrom: string,
  trimTo: string,
  src: string,
  dst: string
) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const pathToFfmpeg = remote.app.isPackaged
    ? path.join(process.resourcesPath, "extra", "ffmpeg.exe")
    : path.join(remote.app.getAppPath(), "public", "extra", "ffmpeg.exe");

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

  exec(ffmpegCommand, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info("Audio Trimmed!");
    }
  });
}
