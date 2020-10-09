/* eslint-disable radix */
const { desktopCapturer, remote } = require("electron");
const fs = require("fs");
const mouseEvents = require("global-mouse-events");
const hbjs = require("handbrake-js");
const cv = require("opencv4nodejs-prebuilt");
const _ = require("lodash"); // allows fast array transformations in javascript

export default function CVRecorder() {
  let clickEventDetails = [];
  const recordedChunks = [];
  const recordingPath = `${remote.app.getAppPath()}/step/media/`;
  const stepSnapshotPath = `${remote.app.getAppPath()}/step/snapshots/`;
  let recordingStarted = false;
  this.clickEventTriggered = false;
  let timeBegan = null;
  let timeStopped = null;
  let started = null;
  let pausedValue = null;
  let videoElement = null;
  let mediaRecorder = null; // MediaRecorder instance to capture footage
  const videoSelectSources = null;
  let differenceValue = 0;
  let stoppedDuration = 0;
  let pixelOffset = 2;
  let maxPixelStepLimit = 30;
  let currentTimer = "";
  let stepRecordingName = "";
  let recordingFullPath = "";

  Object.defineProperty(this, "clickEventDetails", {
    get: () => {
      return clickEventDetails;
    },
    set: (arr) => {
      if (!arr) throw new Error("Exception");

      clickEventDetails.push(arr);
    },
  });
  Object.defineProperty(this, "recordingStarted", {
    get: () => {
      return recordingStarted;
    },
  });
  Object.defineProperty(this, "currentTimer", {
    get: () => {
      return currentTimer;
    },
  });
  Object.defineProperty(this, "videoElement", {
    get: () => {
      return videoElement;
    },
    set: (element) => {
      if (!element) throw new Error("video element not defined");

      videoElement = element;
    },
  });
  Object.defineProperty(this, "pixelOffset", {
    get: () => {
      return pixelOffset;
    },
    set: (value) => {
      if (!Number.isInteger(value))
        throw new Error("pixelOffset should be an integer");

      pixelOffset = value;
    },
  });
  Object.defineProperty(this, "maxPixelStepLimit", {
    get: () => {
      return maxPixelStepLimit;
    },
    set: (value) => {
      if (!Number.isInteger(value))
        throw new Error("max pixel limit should be an integer ");

      maxPixelStepLimit = value;
    },
  });

  function getWindowsNearestBorderPoint(startX, startY, img, direction) {
    let move = true;
    let step = 0;
    let startXCordinate = startX;
    let startYCordinate = startY;
    const startXPoint = startXCordinate;
    const startYPoint = startYCordinate;
    while (move) {
      if (step >= maxPixelStepLimit) {
        if (direction == "right") {
          return [startXPoint + maxPixelStepLimit, startYPoint];
        }
        if (direction == "left") {
          return [startXPoint - maxPixelStepLimit, startYPoint];
        }
        if (direction == "top") {
          return [startXPoint, startYPoint - maxPixelStepLimit];
        }
        if (direction == "bottom") {
          return [startXPoint, startYPoint + maxPixelStepLimit];
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
          return [startXPoint + maxPixelStepLimit, startYPoint];
        }
        if (direction == "left") {
          return [startXPoint - maxPixelStepLimit, startYPoint];
        }
        if (direction == "top") {
          return [startXPoint, startYPoint - maxPixelStepLimit];
        }
        if (direction == "bottom") {
          return [startXPoint, startYPoint + maxPixelStepLimit];
        }
      }
    }

    // default return missing
    return [];
  }

  const extractClickedImages = async (pathToConvertedFile) => {
    const cap = new cv.VideoCapture(pathToConvertedFile);
    cap.set(cv.CAP_PROP_POS_MSEC, 500);
    const mainImage = cap.read();

    const frames = cap.get(cv.CAP_PROP_FRAME_COUNT);
    const jsonMetaData = {
      step_data: [],
    };

    // const jsonMetaData = new Dictionary()
    clickEventDetails.forEach(async (arr) => {
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

      const rightBorderCordiates = getWindowsNearestBorderPoint(
        xCordinate - pixelOffset,
        yCordinate - pixelOffset,
        cannyEdges2D,
        "right"
      );
      const leftBorderCordinates = getWindowsNearestBorderPoint(
        xCordinate - pixelOffset,
        yCordinate - pixelOffset,
        cannyEdges2D,
        "left"
      );
      const topBorderCordinates = getWindowsNearestBorderPoint(
        xCordinate - pixelOffset,
        yCordinate - pixelOffset,
        cannyEdges2D,
        "top"
      );
      const bottomBorderCordinates = getWindowsNearestBorderPoint(
        xCordinate - pixelOffset,
        yCordinate - pixelOffset,
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
        topBorderX - (topBorderX - leftBorderX) - pixelOffset;
      const topLeftCornerY = topBorderY - pixelOffset;

      const topRightCornerX = rightBorderX + pixelOffset;
      const topRightCornerY =
        rightBorderY - (rightBorderY - topBorderY) - pixelOffset;

      const bottomLeftCornerX = leftBorderX - pixelOffset;
      const bottomLeftCornerY =
        leftBorderY + (bottomBorderY - leftBorderY) + pixelOffset;

      const bottomRightCornerX =
        bottomBorderX + (rightBorderX - bottomBorderX) + pixelOffset;
      const bottomRightCornerY = bottomBorderY + pixelOffset;

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
      if (!fs.existsSync(`${stepSnapshotPath}/${stepRecordingName}`)) {
        fs.mkdir(`${stepSnapshotPath}/${stepRecordingName}`, (err, result) => {
          if (err) console.log("error", err);
        });
      }
      const snippedImageName = `_x-${xCordinate}_y-${yCordinate}_time_${timestamp.replace(
        /:/g,
        "-"
      )}.jpeg`;
      cv.imwrite(
        `${stepSnapshotPath}/${stepRecordingName}/${snippedImageName}`,
        outputImg,
        [parseInt(cv.IMWRITE_JPEG_QUALITY)]
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
      `${stepSnapshotPath}/${stepRecordingName}/${stepRecordingName}.json`,
      json,
      "utf8",
      (err) => {
        if (err) throw err;
      }
    );
    clickEventDetails = [];
  };

  const convertRawVideoFormat = (pathtoRawFile, pathToConvertedFile) => {
    hbjs
      .spawn({ input: pathtoRawFile, output: pathToConvertedFile })
      .on("error", (err) => {
        // invalid user input, no video found etc
      })
      .on("progress", (progress) => {
        console.log(
          "Percent complete: %s, ETA: %s",
          progress.percentComplete,
          progress.eta
        );
      })
      .on("complete", (complete) => {
        // extractClickedImages.apply(this,pathToConvertedFile);
        extractClickedImages(pathToConvertedFile);
      });
  };

  // Saves the video file on stop
  const handleStop = async (e) => {
    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    stepRecordingName = `vid-${Date.now()}.webm`;
    // console.log("stop")
    recordingFullPath = recordingPath + stepRecordingName;

    const fileNameAndExtension = recordingFullPath.split(".");
    const pathToConvertedFile = `${fileNameAndExtension[0]}.m4v`;

    console.log("recordingPath == >", recordingFullPath);
    if (recordingFullPath) {
      fs.writeFile(recordingFullPath, buffer, () => {
        convertRawVideoFormat(recordingFullPath, pathToConvertedFile);
      });
    }
  };

  // Captures all recorded chunks
  const handleDataAvailable = (e) => {
    recordedChunks.push(e.data);
  };

  // Change the videoSource window to record
  const selectSource = async (source) => {
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source.id,
        },
      },
    };

    // Create a Stream
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Preview the source in a video element
    this.videoElement.srcObject = this.stream;
    this.videoElement.play();

    // Create the Media Recorder
    const options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorder = new MediaRecorder(this.stream, options);

    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
  };

  const clockRunning = () => {
    const currentTime = new Date() - differenceValue;
    const timeElapsed = new Date(currentTime - timeBegan - stoppedDuration);
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();
    const ms = timeElapsed.getUTCMilliseconds();

    currentTimer = `${hour > 9 ? hour : `0${hour}`}:${
      min > 9 ? min : `0${min}`
    }:${sec > 9 ? sec : `0${sec}`}:${
      // eslint-disable-next-line no-nested-ternary
      ms > 99 ? ms : ms > 9 ? `0${ms}` : `00${ms}`
    }`;
  };

  const startTimer = () => {
    if (timeBegan === null) {
      timeBegan = new Date();
    }

    if (timeStopped !== null) {
      timeBegan = new Date();
    }

    started = setInterval(clockRunning.bind(this), 10);
  };

  const stopTimer = () => {
    // timeStopped = new Date();
    differenceValue = 0;
    clearInterval(started);
  };

  this.start = (source) => {
    selectSource(source).then(() => {
      mediaRecorder.start();
      recordingStarted = true;
      startTimer();
    });
  };

  const pauseTimer = () => {
    pausedValue = new Date(new Date() - differenceValue);
    clearInterval(started);
  };

  const resumeTimer = () => {
    differenceValue = new Date(new Date() - pausedValue);
    startTimer();
  };

  const resetTimer = () => {
    clearInterval(started);
    stoppedDuration = 0;
    differenceValue = 0;
    timeBegan = null;
    timeStopped = null;
  };

  this.pause = () => {
    recordingStarted = false;
    pauseTimer();
    mediaRecorder.pause();
  };

  this.resume = () => {
    recordingStarted = true;
    resumeTimer();
    mediaRecorder.resume();
  };

  this.stop = () => {
    recordingStarted = false;
    stopTimer();
    resetTimer();
    mediaRecorder.stop();
  };
}
