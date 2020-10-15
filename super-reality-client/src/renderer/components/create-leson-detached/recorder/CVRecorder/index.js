/* eslint-disable lines-between-class-members */

import { captureDesktopStream } from "../../../../../utils/capture";

/* eslint-disable radix */
const { app, remote } = require("electron");
const fs = require("fs");
// eslint-disable-next-line no-undef
const mouseEvents = __non_webpack_require__("global-mouse-events");
// eslint-disable-next-line no-undef
const hbjs = __non_webpack_require__("handbrake-js");
const _ = require("lodash"); // allows fast array transformations in javascript
const cv = require("../../../../../utils/opencv/opencv");

export default class CVRecorder {
  constructor() {
    const userData = (app || remote.app)
      .getPath("userData")
      .replace(/\\/g, "/");

    this._clickEventDetails = [];
    this._recordedChunks = [];
    this._audioRecordedChunks = [];
    this._stepPath = `${userData}/step/`;
    this._recordingPath = `${userData}/step/media/`;
    this._stepSnapshotPath = `${userData}/step/snapshots/`;
    this._recordingStarted = false;
    this._clickEventTriggered = false;
    this._timeBegan = null;
    this._timeStopped = null;
    this._started = null;
    this._pausedValue = null;
    this._videoElement = null;
    this._mediaRecorder = null; // _MediaRecorder instance to capture footage
    this._audioMediaRecorder = null; // _MediaRecorder instance to capture audio
    this._differenceValue = 0;
    this._stoppedDuration = 0;
    this._pixelOffset = 2;
    this._maxPixelStepLimit = 30;
    this._currentTimer = "";
    this._stepRecordingName = "";
    this._recordingFullPath = "";

    if (!fs.existsSync(this._stepPath)) {
      fs.mkdir(this._stepPath, (err) => {
        if (err) console.log("error", err);
      });
    }
    if (!fs.existsSync(this._recordingPath)) {
      fs.mkdir(this._recordingPath, (err) => {
        if (err) console.log("error", err);
      });
    }
    if (!fs.existsSync(this._stepSnapshotPath)) {
      fs.mkdir(this._stepSnapshotPath, (err) => {
        if (err) console.log("error", err);
      });
    }

    this.start = this.start.bind(this);
    this.extractClickedImages = this.extractClickedImages.bind(this);
    this.convertRawVideoFormat = this.convertRawVideoFormat.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleDataAvailable = this.handleDataAvailable.bind(this);
    this.handleAudioStop = this.handleAudioStop.bind(this);
    this.handleAudioDataAvailable = this.handleAudioDataAvailable.bind(this);
    this.selectSource = this.selectSource.bind(this);
    this.clockRunning = this.clockRunning.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.start = this.start.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resumeTimer = this.resumeTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.stop = this.stop.bind(this);
  }

  get clickEventDetails() {
    return this._clickEventDetails;
  }

  get recordedChunks() {
    return this._recordedChunks;
  }

  set clickEventDetails(arr) {
    if (!arr) throw new Error("Exception");

    this._clickEventDetails.push(arr);
  }

  get recordingStarted() {
    return this._recordingStarted;
  }

  get currentTimer() {
    return this._currentTimer;
  }

  get videoElement() {
    return this._videoElement;
  }

  get pixelOffset() {
    return this._pixelOffset;
  }

  set pixelOffset(value) {
    if (!Number.isInteger(value))
      throw new Error("_pixelOffset should be an integer");

    this._pixelOffset = value;
  }

  get maxPixelStepLimit() {
    return this._maxPixelStepLimit;
  }
  set maxPixelStepLimit(value) {
    if (!Number.isInteger(value))
      throw new Error("max pixel limit should be an integer ");

    this._maxPixelStepLimit = value;
  }

  getWindowsNearestBorderPoint(startX, startY, img, direction) {
    let move = true;
    let step = 0;
    let startXCordinate = startX;
    let startYCordinate = startY;
    const startXPoint = startXCordinate;
    const startYPoint = startYCordinate;
    while (move) {
      if (step >= this._maxPixelStepLimit) {
        if (direction == "right") {
          return [startXPoint + this._maxPixelStepLimit, startYPoint];
        }
        if (direction == "left") {
          return [startXPoint - this._maxPixelStepLimit, startYPoint];
        }
        if (direction == "top") {
          return [startXPoint, startYPoint - this._maxPixelStepLimit];
        }
        if (direction == "bottom") {
          return [startXPoint, startYPoint + this._maxPixelStepLimit];
        }
      }
      try {
        const pixelValue = img[startYCordinate][startXCordinate];
        if (pixelValue <= 255 && pixelValue > 0) {
          move = false;
          return [startXCordinate, startYCordinate];
        }
        step += 1;
        if (direction == "right") {
          startXCordinate += 1;
        }
        if (direction == "left") {
          startXCordinate -= 1;
        }
        if (direction == "top") {
          startYCordinate -= 1;
        }
        if (direction == "bottom") {
          startYCordinate += 1;
        }
      } catch (err) {
        console.log(`Exception clicked near ${direction} edge of frame`);
        if (direction == "right") {
          return [startXPoint + this._maxPixelStepLimit, startYPoint];
        }
        if (direction == "left") {
          return [startXPoint - this._maxPixelStepLimit, startYPoint];
        }
        if (direction == "top") {
          return [startXPoint, startYPoint - this._maxPixelStepLimit];
        }
        if (direction == "bottom") {
          return [startXPoint, startYPoint + this._maxPixelStepLimit];
        }
      }
    }

    // default return missing
    return [];
  }

  async extractClickedImages(pathToConvertedFile) {
    const cap = new cv.VideoCapture(pathToConvertedFile);
    cap.set(cv.CAP_PROP_POS_MSEC, 500);
    const mainImage = cap.read();
    // console.log(pathToConvertedFile)

    const frames = cap.get(cv.CAP_PROP_FRAME_COUNT);
    const jsonMetaData = {
      step_data: [],
    };

    this._clickEventDetails.forEach(async (arr) => {
      const timestamp = arr[2];
      const yCordinate = arr[1];
      const xCordinate = arr[0];
      const timestampFormat = timestamp.split(":"); // split it at the colons

      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      const seconds =
        +timestampFormat[0] * 60 * 60 +
        +timestampFormat[1] * 60 +
        +timestampFormat[2];
      const milliSeconds = timestampFormat[3];
      const interval = seconds * 1000 + parseInt(milliSeconds);

      cap.set(cv.CAP_PROP_POS_MSEC, interval);
      const currentImage = cap.read();

      const absDiff = mainImage.absdiff(currentImage);

      const grayImg = absDiff.cvtColor(cv.COLOR_BGRA2GRAY);

      const cannyEdges = grayImg.canny(25, 200, 3);

      // cv.imwrite("snapshots/"+"_x-" + xCordinate + "_y-" + yCordinate+ "_time_"+ timestamp.replace(/:/g,"-") + "canny.jpeg", cannyEdges, [parseInt(cv.IMWRITE_JPEG_QUALITY)])

      const cannyEdges2D = cannyEdges.getDataAsArray();

      const rightBorderCordiates = this.getWindowsNearestBorderPoint(
        xCordinate - this._pixelOffset,
        yCordinate - this._pixelOffset,
        cannyEdges2D,
        "right"
      );
      const leftBorderCordinates = this.getWindowsNearestBorderPoint(
        xCordinate - this._pixelOffset,
        yCordinate - this._pixelOffset,
        cannyEdges2D,
        "left"
      );
      const topBorderCordinates = this.getWindowsNearestBorderPoint(
        xCordinate - this._pixelOffset,
        yCordinate - this._pixelOffset,
        cannyEdges2D,
        "top"
      );
      const bottomBorderCordinates = this.getWindowsNearestBorderPoint(
        xCordinate - this._pixelOffset,
        yCordinate - this._pixelOffset,
        cannyEdges2D,
        "bottom"
      );
      const rightBorderX = rightBorderCordiates[0];
      const rightBorderY = rightBorderCordiates[1];
      const leftBorderX = leftBorderCordinates[0];
      const leftBorderY = leftBorderCordinates[1];
      const topBorderX = topBorderCordinates[0];
      const topBorderY = topBorderCordinates[1];
      const bottomBorderX = bottomBorderCordinates[0];
      const bottomBorderY = bottomBorderCordinates[1];
      const snipWindowHeight = bottomBorderY - topBorderY;
      const snipWindowWidth = rightBorderX - leftBorderX;

      const topLeftCornerX =
        topBorderX - (topBorderX - leftBorderX) - this._pixelOffset;
      const topLeftCornerY = topBorderY - this._pixelOffset;

      const topRightCornerX = rightBorderX + this._pixelOffset;
      const topRightCornerY =
        rightBorderY - (rightBorderY - topBorderY) - this._pixelOffset;

      const bottomLeftCornerX = leftBorderX - this._pixelOffset;
      const bottomLeftCornerY =
        leftBorderY + (bottomBorderY - leftBorderY) + this._pixelOffset;

      const bottomRightCornerX =
        bottomBorderX + (rightBorderX - bottomBorderX) + this._pixelOffset;
      const bottomRightCornerY = bottomBorderY + this._pixelOffset;

      const cornerPointsArr = new Array(4);
      cornerPointsArr[0] = new cv.Point2(topLeftCornerX, topLeftCornerY);
      cornerPointsArr[1] = new cv.Point2(topRightCornerX, topRightCornerY);
      cornerPointsArr[2] = new cv.Point2(bottomLeftCornerX, bottomLeftCornerY);
      cornerPointsArr[3] = new cv.Point2(
        bottomRightCornerX,
        bottomRightCornerY
      );

      const outputCornerPointsArr = new Array(4);
      outputCornerPointsArr[0] = new cv.Point2(0, 0);
      outputCornerPointsArr[1] = new cv.Point2(snipWindowWidth, 0);
      outputCornerPointsArr[2] = new cv.Point2(0, snipWindowHeight);
      outputCornerPointsArr[3] = new cv.Point2(
        snipWindowWidth,
        snipWindowHeight
      );
      const matrix = cv.getPerspectiveTransform(
        cornerPointsArr,
        outputCornerPointsArr
      );

      const dsize = new cv.Size(snipWindowWidth, snipWindowHeight);

      const outputImg = mainImage.warpPerspective(
        matrix,
        dsize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT
      );

      const snippedImageName = `_x-${xCordinate}_y-${yCordinate}_time_${timestamp.replace(
        /:/g,
        "-"
      )}.jpeg`;
      if (
        !fs.existsSync(
          `${this._stepSnapshotPath}${this._stepRecordingName.split(".")[0]}`
        )
      ) {
        fs.mkdir(
          `${this._stepSnapshotPath}${this._stepRecordingName.split(".")[0]}`,
          (err) => {
            if (err) throw err;
          }
        );
      }
      cv.imwrite(
        `${this._stepSnapshotPath}${
          this._stepRecordingName.split(".")[0]
        }/${snippedImageName}`,
        outputImg,
        [parseInt(cv.IMWRITE_JPEG_QUALITY)]
      );
      console.log(
        `${this._stepSnapshotPath}${
          this._stepRecordingName.split(".")[0]
        }/${snippedImageName}`
      );
      jsonMetaData.step_data.push({
        name: snippedImageName,
        x_cordinate: xCordinate,
        y_cordinate: yCordinate,
        time_stamp: timestamp,
      });
    });
    const json = JSON.stringify(jsonMetaData, null, "  ");
    fs.writeFile(
      `${this._stepSnapshotPath}/${this._stepRecordingName}.json`,
      json,
      "utf8",
      (err) => {
        if (err) throw err;
      }
    );
    this._clickEventDetails = [];
  }

  convertRawVideoFormat(pathtoRawFile, pathToConvertedFile) {
    console.log(pathtoRawFile);
    console.log(pathToConvertedFile);
    hbjs
      .spawn({ input: pathtoRawFile, output: pathToConvertedFile })
      .on("error", (err) => {
        console.error(err);
        // invalid user input, no video found etc
      })
      // .on("progress", (progress) => {
      //   console.log(
      //     "Percent complete: %s, ETA: %s",
      //     progress.percentComplete,
      //     progress.eta
      //   );
      // })
      .on("complete", (complete) => {
        console.log("complete");
        console.log(pathToConvertedFile);
        this.extractClickedImages(pathToConvertedFile);
      });
  }

  // Saves the video file on stop
  handleStop(e) {
    const videoBlob = new Blob(this._recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    videoBlob.arrayBuffer().then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer);
      this._stepRecordingName = `${Date.now()}.webm`;
      this._recordingFullPath = `${this._recordingPath}vid-${this._stepRecordingName}`;
      this._fileNameAndExtension = this._recordingFullPath.split(".");
      const pathToConvertedFile = `${this._fileNameAndExtension[0]}.m4v`;

      console.log("_recordingPath == >", this._recordingFullPath);
      console.log("pathToConvertedFile == >", pathToConvertedFile);
      if (this._recordingFullPath) {
        fs.writeFile(this._recordingFullPath, buffer, () => {
          this.convertRawVideoFormat(
            this._recordingFullPath,
            pathToConvertedFile
          );
        });
      }
    });
  }

  handleAudioStop(e) {
    const audioBlob = new Blob(this._audioRecordedChunks, {
      type: "audio/wav;",
    });

    audioBlob.arrayBuffer().then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer);
      this._audioRecordingFullPath = `${this._recordingPath}aud-${this._stepRecordingName}`;
      this._fileNameAndExtension = this._audioRecordingFullPath.split(".");
      this._audioRecordingFullPath = `${this._fileNameAndExtension[0]}.webm`;
      if (this._audioRecordingFullPath) {
        fs.writeFile(this._audioRecordingFullPath, buffer, (err) => {
          if (err) throw err;
        });
      }
    });
  }

  // Captures all recorded chunks
  handleDataAvailable(e) {
    this._recordedChunks.push(e.data);
  }

  // Captures all recorded chunks
  handleAudioDataAvailable(e) {
    this._audioRecordedChunks.push(e.data);
  }

  // Change the videoSource window to record
  async selectSource(source) {
    try {
      // Create a Stream
      // accepts source id now
      this.stream = await this.captureDesktopStream(source.id);

      // Preview the source in a video element
      this._videoElement = document.createElement("video");
      this._videoElement.srcObject = this.stream;
      this._videoElement.onloadedmetadata = (e) => {
        this._videoElement.play();
        this._videoElement.muted = true;
      };

      // Create the Media Recorder
      const options = { mimeType: "video/webm; codecs=vp9" };
      this._mediaRecorder = new MediaRecorder(this.stream, options);

      // Create the Media Recorder
      const audioOptions = { mimeType: "audio/webm" };
      this._audioMediaRecorder = new MediaRecorder(
        this._audioStream,
        audioOptions
      );

      // Register Event Handlers
      this._mediaRecorder.ondataavailable = this.handleDataAvailable;
      this._mediaRecorder.onstop = this.handleStop;

      this._audioMediaRecorder.ondataavailable = this.handleAudioDataAvailable;
      this._audioMediaRecorder.onstop = this.handleAudioStop;
    } catch (e) {
      console.error(e);
    }
  }

  clockRunning() {
    const currentTime = new Date() - this._differenceValue;
    const timeElapsed = new Date(
      currentTime - this._timeBegan - this._stoppedDuration
    );
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();
    const ms = timeElapsed.getUTCMilliseconds();

    this._currentTimer = `${hour > 9 ? hour : `0${hour}`}:${
      min > 9 ? min : `0${min}`
    }:${sec > 9 ? sec : `0${sec}`}:${
      // eslint-disable-next-line no-nested-ternary
      ms > 99 ? ms : ms > 9 ? `0${ms}` : `00${ms}`
    }`;
  }

  startTimer() {
    if (this._timeBegan === null) {
      this._timeBegan = new Date();
    }

    if (this._timeStopped !== null) {
      this._timeBegan = new Date();
    }

    this._started = setInterval(this.clockRunning.bind(this), 10);
  }

  stopTimer() {
    // _timeStopped = new Date();
    this._differenceValue = 0;
    clearInterval(this._started);
  }

  start(source) {
    this.selectSource(source).then(() => {
      this._mediaRecorder.start();
      this._audioMediaRecorder.start();
      this._recordingStarted = true;
      this.startTimer();
    });
  }

  pauseTimer() {
    this._pausedValue = new Date(new Date() - this._differenceValue);
    clearInterval(this._started);
  }

  resumeTimer() {
    this._differenceValue = new Date(new Date() - this._pausedValue);
    this.startTimer();
  }

  resetTimer() {
    clearInterval(this._started);
    this._stoppedDuration = 0;
    this._differenceValue = 0;
    this._timeBegan = null;
    this._timeStopped = null;
  }

  pause() {
    this._recordingStarted = false;
    this.pauseTimer();
    this._mediaRecorder.pause();
    this._audioMediaRecorder.pause();
  }

  resume() {
    this._recordingStarted = true;
    this.resumeTimer();
    this._mediaRecorder.resume();
    this._audioMediaRecorder.resume();
  }

  stop() {
    this._recordingStarted = false;
    this.stopTimer();
    this.resetTimer();
    this._mediaRecorder.stop();
    this._audioMediaRecorder.stop();
  }
}
