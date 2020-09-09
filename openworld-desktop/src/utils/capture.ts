/* eslint-disable global-require */
// const cv = require("../opencv");
import fs from "fs";

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

function captureDesktop(): Promise<Buffer> {
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
        // resolve(stream);
        const video = document.createElement("video");
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          const canvas = document.createElement("canvas");
          canvas.width = 1920;
          canvas.height = 1280;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(video, 0, 0, 1920, 1280);
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

export default function capture(): void {
  captureDesktop().then((buffer) => {
    /*
    const image = cv.imdecode(buffer);
    image.bgrToGray();
    cv.imwrite("./img.png", image);
    */
    fs.writeFile("image.png", buffer, (e) => console.log(e));
  });
}
