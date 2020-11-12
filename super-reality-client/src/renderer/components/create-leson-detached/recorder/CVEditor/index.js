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
const fs = require("fs");

export default class CVEditor {
  constructor(video, canvas) {
    this._vid = null;
    this._canvas = null;
    this._context = null;
    this.canvasElement = canvas;
    this.videoElement = video;
  }

  set videoElement(elem) {
    if (!elem) {
      console.error("video element undefined/null");
      return;
    }

    this._vid = elem;
    this._vid.addEventListener("seeked", this.videoEventHandler.bind(this));
  }

  set canvasElement(elem) {
    if (!elem) {
      console.error("canvas element undefined/null");
      return;
    }
    this._canvas = elem;
  }

  set seekFrame(interval) {
    if (!Number(interval) && interval !== 0)
      throw new Error("Interval is not a number");
    this._vid.currentTime = interval;
  }

  videoEventHandler() {
    this._context = this._canvas.getContext("2d");
    this._canvas.width = this._vid.videoWidth;
    this._canvas.height = this._vid.videoHeight;
    this._context.drawImage(
      this._vid,
      0,
      0,
      this._canvas.width,
      this._canvas.height
    );
  }
}

export function trimAudio(trimFrom, trimTo, src, dst) {
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
      console.error(err);
    } else {
      console.info("Audio Trimmed!");
    }
  });
}

export function getRawAudioData(pathToAudio) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToAudio, (err, buffer) => {
      const audioBlob = new window.Blob([new Uint8Array(buffer)]);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
        const audioContext = new AudioContext();
        // Convert array buffer into audio buffer
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer.getChannelData(0));
        });
      };
      fileReader.readAsArrayBuffer(audioBlob);
    });
  });
}
