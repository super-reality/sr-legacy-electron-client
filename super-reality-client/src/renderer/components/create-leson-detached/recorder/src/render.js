const { desktopCapturer, remote } = require('electron');
const fs                          = require('fs');
const mouseEvents                 = require("global-mouse-events");
const hbjs                        = require('handbrake-js');
const cv                          = require('opencv4nodejs-prebuilt');
const _                           = require('lodash'); // allows fast array transformations in javascript
const { start } = require('repl');
const { dialog, Menu }            = remote;



const CVRecorder = function(){
  let clickEventDetails    = new Array();
  let recordedChunks       = new Array();
  let recordingPath        = remote.app.getAppPath() + "/step/media/";
  let stepSnapshotPath     = remote.app.getAppPath() + "/step/snapshots/";
  let recordingStarted     = false;
  this.clickEventTriggered = false; 
  let timeBegan            = null;
  let timeStopped          = null;
  let started              = null;
  let pausedValue          = null;
  let videoElement         = null;
  let mediaRecorder        = null;  // MediaRecorder instance to capture footage
  let videoSelectSources   = null; 
  let differenceValue      = 0;
  let stoppedDuration      = 0;
  let pixelOffset          = 2;
  let maxPixelStepLimit    = 30;
  let currentTimer         = "";


  Object.defineProperty(this, "clickEventDetails", {
    get: function(){
      return clickEventDetails
    },
    set: function(arr){
      if(!arr)
        throw new Error("Exception")
      
      clickEventDetails.push(arr)
    }
  }),

  Object.defineProperty(this, "recordingStarted", {
    get: function(){
      return recordingStarted
    }
  }),


  Object.defineProperty(this, "currentTimer", {
    get: function(){
      return currentTimer
    }
  }),


  Object.defineProperty(this, "videoElement", {
    get: function(){
      return videoElement
    },
    set: function(element){
      if(!element)
        throw new Error("video element not defined")
      
      videoElement = element;
    }
  }),


  Object.defineProperty(this, "pixelOffset", {
    get: function(){
      return pixelOffset
    },
    set: function(value){
      if(!Number.isInteger(value))
        throw new Error("pixelOffset should be an integer")
      
      pixelOffset = value;
    }
  }),


  Object.defineProperty(this, "maxPixelStepLimit", {
    get: function(){
      return maxPixelStepLimit
    },
    set: function(value){
      if(!Number.isInteger(value))
        throw new Error("max pixel limit should be an integer ")
      
      maxPixelStepLimit = value;
    }
  })


  this.start = function(source){
    selectSource(source).then(function(){
      mediaRecorder.start();
      recordingStarted = true;
      startTimer();
    })
  }


  this.pause = function(){
    recordingStarted = false;
    pauseTimer();
    mediaRecorder.pause();
  }

  
  this.resume = function(){
    recordingStarted = true;
    resumeTimer();
    mediaRecorder.resume();
  }

  this.stop = function(){
    recordingStarted = false;
    stopTimer();
    resetTimer();
    mediaRecorder.stop();
  }


  const startTimer = function() {
    if (timeBegan === null) {
        timeBegan = new Date();
        
    }
  
    if (timeStopped !== null) {
      timeBegan = new Date();
    }
    
    started = setInterval(clockRunning.bind(this), 10);  
  }
  
  
  const stopTimer = function () {
    // timeStopped = new Date();
    differenceValue = 0;
    clearInterval(started);
  }
  
  
  const pauseTimer = function() {
    pausedValue = new Date(new Date() - differenceValue);
    clearInterval(started);
  }
  
  
  const resumeTimer = function () {
    differenceValue = new Date(new Date() - pausedValue);
    startTimer();
  }
   
  const resetTimer = function() {
    clearInterval(started);
    stoppedDuration = 0;
    differenceValue = 0;
    timeBegan = null;
    timeStopped = null;
  }

  const clockRunning = function(){
    let currentTime = new Date() - differenceValue;
      timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
      , hour = timeElapsed.getUTCHours()
      , min = timeElapsed.getUTCMinutes()
      , sec = timeElapsed.getUTCSeconds()
      , ms = timeElapsed.getUTCMilliseconds();

    currentTimer = 
      (hour > 9 ? hour : "0" + hour) + ":" + 
      (min > 9 ? min : "0" + min) + ":" + 
      (sec > 9 ? sec : "0" + sec) + ":" + 
      (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);

  };

  
  // Change the videoSource window to record
  const selectSource = async function (source) {
  
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id
        }
      }
    };
  
  
    // Create a Stream
    this.stream = await navigator.mediaDevices
      .getUserMedia(constraints);
  
    // Preview the source in a video element
    this.videoElement.srcObject = this.stream;
    this.videoElement.play();
  
    // Create the Media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(this.stream, options);
  
    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
  }
  
  
  // Captures all recorded chunks
  const handleDataAvailable = function(e) {
    recordedChunks.push(e.data);
  }
  
  
  // Saves the video file on stop
  const handleStop = async function(e) {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm; codecs=vp9'
    });
  
    const buffer       = Buffer.from(await blob.arrayBuffer());
    stepRecordingName = `vid-${Date.now()}.webm`
    // console.log("stop")
    recordingFullPath = recordingPath + stepRecordingName
  
    const fileNameAndExtension  = recordingFullPath.split('.')
    const pathToConvertedFile = fileNameAndExtension[0] + '.m4v'
    
    console.log("recordingPath == >", recordingFullPath)
    if (recordingFullPath) {
      fs.writeFile(recordingFullPath, buffer, () => {
        convertRawVideoFormat(recordingFullPath, pathToConvertedFile)
      });
    }
  }

  const getWindowsNearestBorderPoint = function (start_x_cordinate,start_y_cordinate,img, direction){
    let move = true;
    let step = 0;
    let start_x_point = start_x_cordinate;
    let start_y_point = start_y_cordinate;
    while(move){
      if(step >= maxPixelStepLimit){
        if(direction == "right"){
          return [start_x_point+maxPixelStepLimit,start_y_point];
        }
        if(direction == "left"){
          return [start_x_point-maxPixelStepLimit,start_y_point];
        }
        if(direction == "top"){
          return [start_x_point,start_y_point-maxPixelStepLimit];
        }
        if(direction == "bottom"){
          return [start_x_point,start_y_point+maxPixelStepLimit];
        }
      }
      try{
        let pixelValue = img[start_y_cordinate][start_x_cordinate];
        if (pixelValue <= 255 && pixelValue > 0){
            move = false;
            return [start_x_cordinate, start_y_cordinate]
        }
        step +=1;
        if(direction == "right"){
          start_x_cordinate +=1;
        }
        if(direction == "left"){
          start_x_cordinate -=1;
        }
        if(direction == "top"){
          start_y_cordinate -=1;
        }
        if(direction == "bottom"){
          start_y_cordinate +=1;
        }
      }
      catch(err){
        console.log("Exception => clicked near "+ direction + " edge of frame")
        if(direction == "right"){
            return [start_x_point+maxPixelStepLimit,start_y_point];
        }
        if(direction == "left"){
          return [start_x_point-maxPixelStepLimit,start_y_point];
        }
        if(direction == "top"){
          return [start_x_point,start_y_point-maxPixelStepLimit];
        }
        if(direction == "bottom"){
          return [start_x_point,start_y_point+maxPixelStepLimit];
        }
      }
    }    
  }


  const convertRawVideoFormat = function (pathtoRawFile, pathToConvertedFile){
    hbjs.spawn({ input: pathtoRawFile, output: pathToConvertedFile })
    .on('error', err => {
      // invalid user input, no video found etc
    })
    .on('progress', progress => {
      console.log(
        'Percent complete: %s, ETA: %s',
        progress.percentComplete,
        progress.eta
      )
    })
    .on('complete', complete => {
      // extractClickedImages.apply(this,pathToConvertedFile);
      extractClickedImages(pathToConvertedFile);
    })
  }

  let extractClickedImages = async function(pathToConvertedFile){
    const cap = new cv.VideoCapture(pathToConvertedFile)
    cap.set(cv.CAP_PROP_POS_MSEC,500)    
    const mainImage = cap.read()

    const frames = cap.get(cv.CAP_PROP_FRAME_COUNT)
    var jsonMetaData = {
      step_data: []
    };
    
    // const jsonMetaData = new Dictionary()
    clickEventDetails.forEach(async function(arr){
      const timestamp  = arr[2]
      const yCordinate = arr[1]
      const xCordinate = arr[0]
      const timestampFormat = timestamp.split(':'); // split it at the colons

      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      const seconds      = (+ timestampFormat[0]) * 60 * 60 + (+ timestampFormat[1]) * 60 + (+ timestampFormat[2]); 
      const milliSeconds = timestampFormat[3]
      const interval = (seconds * 1000) + parseInt(milliSeconds)

      cap.set(cv.CAP_PROP_POS_MSEC, interval)     
      const currentImage = cap.read()

      const absDiff = mainImage.absdiff(currentImage);

      const grayImg = absDiff.cvtColor(cv.COLOR_BGRA2GRAY);

      const cannyEdges = grayImg.canny(25, 200,3);

      // cv.imwrite("snapshots/"+"_x-" + xCordinate + "_y-" + yCordinate+ "_time_"+ timestamp.replace(/:/g,"-") + "canny.jpeg", cannyEdges, [parseInt(cv.IMWRITE_JPEG_QUALITY)])

      const cannyEdges2D = cannyEdges.getDataAsArray();

      rightBorderCordiates    = getWindowsNearestBorderPoint(xCordinate - pixelOffset, yCordinate - pixelOffset, cannyEdges2D, "right");
      leftBorderCordinates    = getWindowsNearestBorderPoint(xCordinate - pixelOffset, yCordinate - pixelOffset, cannyEdges2D, "left");
      topBorderCordinates     = getWindowsNearestBorderPoint(xCordinate -pixelOffset , yCordinate - pixelOffset, cannyEdges2D, "top");
      bottomBorderCordinates  = getWindowsNearestBorderPoint(xCordinate -pixelOffset, yCordinate-pixelOffset , cannyEdges2D, "bottom");
      let rightBorderX       = rightBorderCordiates[0]
      let rightBorderY       = rightBorderCordiates[1]
      let leftBorderX        = leftBorderCordinates[0]
      let leftBorderY        = leftBorderCordinates[1]
      let topBorderX         = topBorderCordinates[0]
      let topBorderY         = topBorderCordinates[1]
      let bottomBorderX      = bottomBorderCordinates[0]
      let bottomBorderY      = bottomBorderCordinates[1]
      let snipWindowHeight   = bottomBorderY - topBorderY
      let snipWindowWidth    = rightBorderX - leftBorderX

      let topLeftCornerX = (topBorderX - (topBorderX-leftBorderX))- pixelOffset
      let topLeftCornerY = topBorderY- pixelOffset

      let topRightCornerX = rightBorderX +  pixelOffset
      let topRightCornerY = (rightBorderY - (rightBorderY - topBorderY))- pixelOffset

      let bottomLeftCornerX = leftBorderX -  pixelOffset
      let bottomLeftCornerY = (leftBorderY + (bottomBorderY - leftBorderY))+ pixelOffset

      let bottomRightCornerX = (bottomBorderX + (rightBorderX - bottomBorderX))+ pixelOffset
      let bottomRightCornerY = bottomBorderY+ pixelOffset


      const cornerPointsArr =  new Array(4);
      cornerPointsArr[0] = new cv.Point2(topLeftCornerX, topLeftCornerY)
      cornerPointsArr[1] = new cv.Point2(topRightCornerX, topRightCornerY)
      cornerPointsArr[2] = new cv.Point2(bottomLeftCornerX, bottomLeftCornerY)
      cornerPointsArr[3] = new cv.Point2(bottomRightCornerX, bottomRightCornerY)


      const outputCornerPointsArr = new Array(4);
      outputCornerPointsArr[0] = new cv.Point2(0,0)
      outputCornerPointsArr[1] = new cv.Point2(snipWindowWidth,0)
      outputCornerPointsArr[2] = new cv.Point2(0, snipWindowHeight)
      outputCornerPointsArr[3] = new cv.Point2(snipWindowWidth, snipWindowHeight)
      const matrix = cv.getPerspectiveTransform(cornerPointsArr, outputCornerPointsArr);

      const dsize = new cv.Size(snipWindowWidth, snipWindowHeight);

      const outputImg = mainImage.warpPerspective(matrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT)
      if (!fs.existsSync(stepSnapshotPath + "/" + stepRecordingName)){
        fs.mkdir(stepSnapshotPath + "/" + stepRecordingName, function(err, result) {
          if(err) console.log('error', err);
        });
      }
      const snippedImageName = "_x-" + xCordinate + "_y-" + yCordinate+ "_time_"+ timestamp.replace(/:/g,"-") + ".jpeg";
      cv.imwrite(stepSnapshotPath + "/" + stepRecordingName + "/" + snippedImageName, outputImg, [parseInt(cv.IMWRITE_JPEG_QUALITY)])
      jsonMetaData.step_data.push({name: snippedImageName, x_cordinate:xCordinate, y_cordinate: yCordinate, time_stamp:timestamp});
    });
    const json = JSON.stringify(jsonMetaData, null, "  ");
    fs.writeFile(stepSnapshotPath + "/" + stepRecordingName + "/" + stepRecordingName + ".json", json, 'utf8', function(err){
      if(err)
        throw err;
    });
    clickEventDetails = new Array();
  }

};