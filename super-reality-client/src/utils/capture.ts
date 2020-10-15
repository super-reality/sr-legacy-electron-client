/* eslint-disable global-require */

export function captureDesktopStream(sourceId: any): Promise<MediaStream> {
  const { desktopCapturer } = require("electron");
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }).then(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sourceId,
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
