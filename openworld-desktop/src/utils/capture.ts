/* eslint-disable global-require */

export function captureDesktopStream(): Promise<MediaStream> {
  const { desktopCapturer } = require("electron");
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

export function capture(): void {
  captureDesktopStream().then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
  });
}
