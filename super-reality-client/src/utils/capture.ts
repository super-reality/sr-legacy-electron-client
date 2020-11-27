/* eslint-disable global-require */

import getDisplayBounds from "./getNewBounds";

export function captureDesktopStream(): Promise<MediaStream> {
  const { desktopCapturer } = require("electron");
  const bounds = getDisplayBounds();
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }).then(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              minWidth: bounds.width,
              minHeight: bounds.height,
              chromeMediaSource: "desktop",
            },
          } as any,
        });
        resolve(stream);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  });
}

export function capture(): void {
  captureDesktopStream().then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
  });
}
