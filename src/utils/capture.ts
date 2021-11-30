import getPrimaryMonitor from "./electron/getPrimaryMonitor";

export function capturePrimaryStream(): Promise<MediaStream> {
  // eslint-disable-next-line global-require
  const { desktopCapturer } = require("electron");
  const primaryId = `${getPrimaryMonitor().id}`;

  return new Promise((resolve, reject) => {
    desktopCapturer
      .getSources({ types: ["screen"] })
      .then(async (sources: any) => {
        const sourceId = sources.filter(
          (source: any) => source.display_id == primaryId
        )[0].id;
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sourceId,
              },
            } as any,
          });
          resolve(videoStream);
        } catch (e) {
          reject(e);
        }
      });
  });
}

export function capture(): void {
  capturePrimaryStream().then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
  });
}
