import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

const fs = require("fs");

export default class CVEditor {
  constructor() {
    this._vid = null;
    this._canvas = null;
    this._context = null;
    this.canvasElement = null;
    this.videoElement = null;
  }

  set videoElement(elem) {
    if (!elem) {
      return;
    }

    this._vid = elem;
    this._vid.addEventListener("seeked", this.videoEventHandler.bind(this));
  }

  set canvasElement(elem) {
    if (!elem) {
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
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_TRIGGER_CV_MATCH",
      arg: null,
    });
  }
}

export function getRawAudioData(pathToAudio) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (e) {
      reject(e);
    }
  });
}
