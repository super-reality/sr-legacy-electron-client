/* eslint-disable global-require */
import fs from "fs";
import cv from "../services/cv";

function toBuffer(blob: Blob | null, cb: (err: any, buff?: Buffer) => void) {
  if (typeof Blob === "undefined" || !(blob instanceof Blob)) {
    throw new Error("first argument must be a Blob");
  }
  if (typeof cb !== "function") {
    throw new Error("second argument must be a function");
  }

  const reader = new FileReader();

  function onLoadEnd(e: any) {
    reader.removeEventListener("loadend", onLoadEnd, false);
    if (e.error) cb(e.error);
    else cb(null, Buffer.from(reader.result || ""));
  }

  reader.addEventListener("loadend", onLoadEnd, false);
  reader.readAsArrayBuffer(blob);
}

export function captureDesktop(): Promise<Buffer> {
  const { desktopCapturer, remote } = require("electron");
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }).then(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              width: 1920,
              height: 1080,
            },
          } as any,
        });
        // resolve(stream);
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          video.play();
          const canvas = document.createElement("canvas");
          canvas.width = 1920;
          canvas.height = 1080;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(video, 0, 0, 1920, 1080);
            canvas.toBlob((blob) => {
              toBuffer(blob, (err, buffer) => {
                if (err) reject(err);
                resolve(buffer);
              });
            });
          }
        };
      } catch (e) {
        reject(e);
      }
    });
  });
}

export function captureDesktopStream(): Promise<MediaStream> {
  const { desktopCapturer, remote } = require("electron");
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }).then(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
            },
          } as any,
        });
        resolve(stream);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default function capture(): void {
  /*
  captureDesktop().then((buffer) => {
    const image = cv.imdecode(buffer);
    image.bgrToGray();
    cv.imwrite("./img.png", image);
    fs.writeFile("image.png", buffer, (e) => console.log(e));
  });
  */
  captureDesktopStream().then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    /*
    video.onloadedmetadata = () => {
      const src = new cv.Mat(1920, 1080, cv.CV_8UC4);
      const dst = new cv.Mat(1920, 1080, cv.CV_8UC1);
      const cap = new cv.VideoCapture(video);
      video.play();
      cap.read(src);
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      cv.imshow("canvasOutput", dst);
    };
    */
  });
}
