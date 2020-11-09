/*
We are using ffmpeg to trim audio. 
You need to install these pakages: 
-- npm install ffmpeg-static
-- npm install any-shell-escape

trimAudio function
@params
trimFrom = "00:00:00" or "seconds"
trimTo   = "00:00:00" or "seconds"
src      = "../folder/fileToTrim.webm"
dst      = "../folder/trimmedAudio.webm" 

*/
const pathToFfmpeg = require("ffmpeg-static");
const shell = require("any-shell-escape");
const { exec } = require("child_process");

export default function trimAudio(
  trimFrom: string,
  trimTo: string,
  src: string,
  dst: string
) {
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
