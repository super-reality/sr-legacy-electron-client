const { desktopCapturer, remote } = require('electron');
const fs                          = require('fs');
const mouseEvents                 = require("global-mouse-events");
const hbjs                        = require('handbrake-js');
const cv                          = require('opencv4nodejs-prebuilt');
const _                           = require('lodash'); // allows fast array transformations in javascript
const { dialog, Menu }            = remote;


let clickEventDetails = []
let mediaRecorder; // MediaRecorder instance to capture footage
let xCordinate    = 0; 
let yCordinate    = 0;
let recordingStarted    = false;
let clickEventTriggered = false; 
let recordingPath     = remote.app.getAppPath() + "/step/media/"
let stepSnapshotPath  = remote.app.getAppPath() + "/step/snapshots/"
let stepRecordingName = "";
const recordedChunks    = [];
const maxPixelStepLimit = 30
const pixelOffset       = 2;





mouseEvents.on("mousedown", event => {
  if(recordingStarted){
    clickEventTriggered = true;
    xCordinate = event.x
    yCordinate = event.y
    clickEventDetails.push([xCordinate,yCordinate,currentTimer])
    // console.log(event);
  }
});


// Buttons
const videoElement     = document.querySelector('video');
const startBtn         = document.getElementById('startBtn');
const stopBtn          = document.getElementById('stopBtn');
const pauseBtn         = document.getElementById('pauseBtn');
const resumeBtn        = document.getElementById('resumeBtn');
const videoSelectBtn   = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;
let currentTimer = ""

let timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null
    , pausedValue = null
    , differenceValue=0;

function startTimer() {
  if (timeBegan === null) {
      timeBegan = new Date();
  }

  if (timeStopped !== null) {
      stoppedDuration += (new Date() - timeStopped);
  }

  started = setInterval(clockRunning, 10);  
}


function stopTimer() {
  timeStopped = new Date();
  clearInterval(started);
}

function pauseTimer() {
    pausedValue = new Date(new Date() - differenceValue);
    // console.log("paused"pausedValue)
    clearInterval(started);
}

function resumeTimer() {
    differenceValue = new Date(new Date() - pausedValue);
    startTimer();
}
 

function resetTimer() {
  clearInterval(started);
  stoppedDuration = 0;
  timeBegan = null;
  timeStopped = null;
}


function clockRunning(){
    var currentTime = new Date() - differenceValue;
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


  console.log("time began == >", timeBegan);
  console.log("stooped duration == >",stoppedDuration)
  console.log("currentTimer ==>", currentTimer)
};



function getWindowsNearestBorderPoint(start_x_cordinate,start_y_cordinate,img, direction){
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
          console.log(start_x_cordinate,start_y_cordinate);
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


async function extractClickedImages(pathToConvertedFile){
  const cap = new cv.VideoCapture(pathToConvertedFile)
  cap.set(cv.CAP_PROP_POS_MSEC,500)    
  const mainImage = cap.read()

  const frames = cap.get(cv.CAP_PROP_FRAME_COUNT)

  clickEventDetails.forEach(function(arr){
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
    // cap.release()
    // cap.reset()

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
    let matrix = cv.getPerspectiveTransform(cornerPointsArr, outputCornerPointsArr);

    let dsize = new cv.Size(snipWindowWidth, snipWindowHeight);

    let outputImg = mainImage.warpPerspective(matrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT)
    if (!fs.existsSync(stepSnapshotPath + "/" + stepRecordingName)){
      fs.mkdir(stepSnapshotPath + "/" + stepRecordingName, function(err, result) {
        if(err) console.log('error', err);
      });
    }
    cv.imwrite(stepSnapshotPath + "/" + stepRecordingName + "/" +"_x-" + xCordinate + "_y-" + yCordinate+ "_time_"+ timestamp.replace(/:/g,"-") + ".jpeg", outputImg, [parseInt(cv.IMWRITE_JPEG_QUALITY)])

  });
}


function convertRawVideoFormat(pathtoRawFile, pathToConvertedFile){
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
    extractClickedImages(pathToConvertedFile)
  })
}


startBtn.onclick = e => {
  mediaRecorder.start();
  recordingStarted = true;
  startTimer()

  startBtn.classList.add('is-danger');
  pauseBtn.disabled = false;
  startBtn.innerText = 'Recording';
};

pauseBtn.onclick = e => {
  pauseTimer();
  mediaRecorder.pause();
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
};

resumeBtn.onclick = e => {
  resumeTimer();
  mediaRecorder.resume();
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
};

stopBtn.onclick = e => {
  stopTimer();
  resetTimer();
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};



videoSelectBtn.onclick = getVideoSources;


// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );

  videoOptionsMenu.popup();
}


// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

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
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}


// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}


// Saves the video file on stop
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer       = Buffer.from(await blob.arrayBuffer());
  stepRecordingName = `vid-${Date.now()}.webm`
   // if (!writeFile.existsSync(recordingPath + "/" + recordingName)) writeFile.mkdir(recordingPath + "/" + recordingName);
  recordingPath = recordingPath + stepRecordingName
  console.log(recordingPath)

  const fileNameAndExtension  = recordingPath.split('.')
  const pathToConvertedFile = fileNameAndExtension[0] + '.m4v'

  if (recordingPath) {
    fs.writeFile(recordingPath, buffer, () => {
      convertRawVideoFormat(recordingPath, pathToConvertedFile)
    });
  }
}
