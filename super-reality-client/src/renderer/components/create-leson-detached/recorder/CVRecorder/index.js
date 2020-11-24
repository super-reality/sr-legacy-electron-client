/* eslint-disable lines-between-class-members */
import {
  recordingPath,
  stepPath,
  stepSnapshotPath,
} from "../../../../electron-constants";

import Browser from "./Browser";
/* eslint-disable radix */
const { desktopCapturer } = require("electron");
const fs = require("fs");
// eslint-disable-next-line no-undef

/*
need to install the following dependency
npm install ts-ebml --save
*/
const { Decoder, Encoder, tools, Reader } = require("ts-ebml");
const _ = require("lodash"); // allows fast array transformations in javascript
const cv = require("../../../../../utils/opencv/opencv");

export default class CVRecorder {
  constructor() {
    this._clickEventDetails = [];
    this._urlTitleDic = {};
    this._recordedChunks = [];
    this._audioRecordedChunks = [];
    this._stepPath = stepPath;
    this._recordingPath = recordingPath;
    this._stepSnapshotPath = stepSnapshotPath;
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
    this._doubleClickThreshold = 500; // in milliseconds
    this._currentTimer = "";
    this._stepRecordingName = "";
    this._recordingFullPath = "";
    this._finishCallback = () => {};
    this._source = async function(){await desktopCapturer.getSources({
        types: ['window', 'screen']
      }).then(function (source){
        return source[0] //default whole desktop source
      });
    }

    this.start = this.start.bind(this);
    this.extractClickedImages = this.extractClickedImages.bind(this);
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
    this.restart = this.restart.bind(this);
    this.stop = this.stop.bind(this);
    this.finishCallback = this.finishCallback.bind(this);
    this.getActiveBrowserTabUrl = this.getActiveBrowserTabUrl.bind(this);
  }

  set finishCallback(value) {
    this._finishCallback = value;
  }

  get finishCallback() {
    return this._finishCallback;
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
        console.warn(`Exception clicked near ${direction} edge of frame`);
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

  async getActiveBrowserTabUrl(eventDetails){
    await new Promise(async (resolve, reject) => {
      try{
          const browser = new Browser()
          console.log("Queue => value ", eventDetails)
          if(eventDetails[1] != "" && !this._urlTitleDic[eventDetails[1]]){
            this._urlTitleDic[eventDetails[1]] = ""  
            browser.owner = eventDetails[0];
            browser.title = eventDetails[1];
            if(browser.checkIfBrowser() !== ""){
              await browser.getBrowserUrl().then((url)=>{
                console.log("url instside processqueue", url)
                this._urlTitleDic[eventDetails[1]] = url
                resolve(url);
              })
            }else{
              const url = "";
              resolve(url);
            }
          }
        
      } catch (e) {
        console.log("browser error => ", e)
        reject(e)
      }
    })
  }

  async extractClickedImages() {
    const cap = new cv.VideoCapture(this._recordingFullPath);
    cap.set(cv.CAP_PROP_POS_MSEC, 500);
    let mainImage = cap.read();

    const jsonMetaData = {
      step_data: [],
    };

    let previousInterval = 0;
    await Promise.all(
      this._clickEventDetails.map(async (arr) => {
        let doubleClick = false;
        let clickType = "";
        let keyboardEvents = {};
        let contourDic = {};
        let processTitle = "";
        let processOwnerName = "";
        let browserTabUrl = "";
        if(arr[4] !== undefined){
          keyboardEvents = arr[4]
        }
        if(arr[5] !== undefined){
          processTitle = arr[5]
        }
        if(arr[6] !== undefined){
          processOwnerName = arr[6]
        }
        let snippedImageName = "";
        const eventType = arr[3];
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

        if(eventType === "left_click"){

          cap.set(cv.CAP_PROP_POS_MSEC, interval - 500);
          mainImage = cap.read();
  
          cap.set(cv.CAP_PROP_POS_MSEC, interval);
          const currentImage = cap.read();
  
          const absDiff = mainImage.absdiff(currentImage);
  
          const grayImg = absDiff.cvtColor(cv.COLOR_BGRA2GRAY);
  
          const cannyEdges = grayImg.canny(23, 180, 3);
  
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
  
          const topLeftCornerX = topBorderX - (topBorderX - leftBorderX) - this._pixelOffset;
          const topLeftCornerY = topBorderY - this._pixelOffset;
  
          const topRightCornerX = rightBorderX + this._pixelOffset;
          const topRightCornerY = rightBorderY - (rightBorderY - topBorderY) - this._pixelOffset;
  
          const bottomLeftCornerX = leftBorderX - this._pixelOffset;
          const bottomLeftCornerY = leftBorderY + (bottomBorderY - leftBorderY) + this._pixelOffset;
  
          const bottomRightCornerX = bottomBorderX + (rightBorderX - bottomBorderX) + this._pixelOffset;
          const bottomRightCornerY = bottomBorderY + this._pixelOffset;
  
          const cornerPointsArr = new Array(4);
          cornerPointsArr[0] = new cv.Point2(topLeftCornerX, topLeftCornerY);
          cornerPointsArr[1] = new cv.Point2(topRightCornerX, topRightCornerY);
          cornerPointsArr[2] = new cv.Point2(bottomLeftCornerX, bottomLeftCornerY);
          cornerPointsArr[3] = new cv.Point2(
            bottomRightCornerX,
            bottomRightCornerY
          );
  
          contourDic["top_left_corner"]  = [topLeftCornerX, topLeftCornerY];
          contourDic["top_right_corner"] = [topRightCornerX, topRightCornerY];
          contourDic["bottom_left_corner"] = [bottomLeftCornerX, bottomLeftCornerY];
          contourDic["bottom_right_corner"] = [bottomRightCornerX, bottomRightCornerY];
  
        }
        if( eventType === "left_click"  ||
            eventType === "right_click" ||
            eventType === "wheel_click" 
          ){
          if(interval - previousInterval < this._doubleClickThreshold){
            doubleClick = true
          }
          if(!doubleClick){
            clickType = "single"
          }else{
            clickType = "double"
          }
          previousInterval = interval
        }
        if(this._urlTitleDic[processTitle]){
          browserTabUrl = this._urlTitleDic[processTitle] 
        }
        jsonMetaData.step_data.push({
            type: eventType,
            process_owner: processOwnerName,
            process_title: processTitle,
            process_url: browserTabUrl,
            click_type: clickType, 
            name: snippedImageName,
            x_cordinate: xCordinate,
            y_cordinate: yCordinate,
            contours: contourDic,
            time_stamp: timestamp,
            keyboard_events: keyboardEvents
        });
      })
    ).then(()=>{
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
      this._finishCallback(jsonMetaData);
    });
  }

  // Saves the video file on stop
  handleStop(e) {
    if(!this._recordingRestarted){
      const videoBlob = new Blob(this._recordedChunks, {
        type: "video/webm;codecs=vp9",
      });
      const readAsArrayBuffer = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (ev) => {
            reject(ev.error);
          };
        });
      };
      const injectMetadata = (blob) => {
        const decoder = new Decoder();
        const reader = new Reader();
        reader.logging = false;
        reader.drop_default_duration = false;

        return readAsArrayBuffer(blob).then((buffer) => {
          const elms = decoder.decode(buffer);
          elms.forEach((elm) => {
            reader.read(elm);
          });
          reader.stop();
          const refinedMetadataBuf = tools.makeMetadataSeekable(
            reader.metadatas,
            reader.duration,
            reader.cues
          );
          const body = buffer.slice(reader.metadataSize);
          const result = new Blob([refinedMetadataBuf, body], {
            type: blob.type,
          });

          return result;
        });
      };
      const seekableVideoBlob = injectMetadata(videoBlob);
      seekableVideoBlob.then((blob) => {
        blob.arrayBuffer().then((arrayBuffer) => {
          const buffer = Buffer.from(arrayBuffer);
          this._recordingFullPath = `${this._recordingPath}vid-${this._stepRecordingName}`;
          console.log("recording path: ", this._recordingFullPath);
          if (this._recordingFullPath) {
            fs.writeFile(this._recordingFullPath, buffer, () => {
              this.extractClickedImages();
            });
          }
        });
      });
    }
  }

  handleAudioStop(e) {
    if(!this._recordingRestarted){
      const audioBlob = new Blob(this._audioRecordedChunks, {
        type: "audio/webm",
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
  }

  // Captures all recorded chunks
  handleDataAvailable(e) {
    if(!this._recordingRestarted){
      this._recordedChunks.push(e.data);
    }
  }

  // Captures all recorded chunks
  handleAudioDataAvailable(e) {
    if(!this._recordingRestarted){
      this._audioRecordedChunks.push(e.data);
    }
  }

  async captureDesktopStream(sourceId) {
    return new Promise((resolve, reject) => {
      desktopCapturer.getSources({ types: ["screen"] }).then(async () => {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sourceId,
              },
            },
          });
          const constraintsAudio = { audio: true };
          this._audioStream = await navigator.mediaDevices.getUserMedia(
            constraintsAudio
          );
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...this._audioStream.getAudioTracks(),
          ]);
          resolve(combinedStream);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  // Change the videoSource window to record
  selectSource(source) {
    return this.captureDesktopStream(source.id).then((newStream) => {
      return new Promise((resolve, reject) => {
        try {
          this.stream = newStream;
          this._videoElement = document.createElement("video");
          this._videoElement.srcObject = this.stream;
          this._videoElement.onloadedmetadata = (e) => {
            // console.log(e);
            this._videoElement.play();
            this._videoElement.muted = true;

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
            resolve();
          };
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    });
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
    this._differenceValue = 0;
    clearInterval(this._started);
  }

  start(source) {
    this._source = source;
    console.log("started video recording");
    return this.selectSource(this._source).then(() => {
      this._stepRecordingName = `${Date.now()}.webm`;
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

  restart() {
    this._recordingRestarted = true;
    this.stopTimer();
    this.resetTimer();
    if(!this._recordingStarted){
      this.resume();
    }
    this._audioMediaRecorder.stop();
    this._mediaRecorder.stop();
    this.selectSource(this._source).then(() => {
      this._mediaRecorder.start();
      this._audioMediaRecorder.start();
      this._recordingStarted = true;
      this.startTimer();
      this._recordingRestarted = false;
    });
  }

  stop() {
    this._recordingStarted = false;
    this.stopTimer();
    this.resetTimer();
    this._mediaRecorder.stop();
    this._audioMediaRecorder.stop();
  }
}
