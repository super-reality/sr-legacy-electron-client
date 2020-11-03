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
