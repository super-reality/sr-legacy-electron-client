import shell from "any-shell-escape";
import { exec } from "child_process";

export default function trimAudio(
  trimFrom: string,
  trimTo: string,
  src: string,
  dst: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const pathToFfmpeg = __non_webpack_require__("ffmpeg-static");
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

    exec(ffmpegCommand, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(dst);
      }
    });
  });
}
