import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { captureDesktopStream } from "../../../utils/capture";
import { AppState } from "../../redux/stores/renderer";

export default function CvComponents() {
  const { cvThreshold, cvCanvas, cvDelay } = useSelector(
    (state: AppState) => state.settings
  );
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        videoElement.current.width = cvCanvas;
        videoElement.current.height = cvCanvas;
        videoElement.current.srcObject = await captureDesktopStream();

        return new Promise((resolve) => {
          if (videoElement.current) {
            videoElement.current.onloadedmetadata = () => {
              resolve(videoElement.current);
            };
          }
        });
      }
      return Promise.reject();
    }

    async function load() {
      const videoLoaded = (await initVideoStream()) as HTMLVideoElement;
      videoLoaded.play();
      return videoLoaded;
    }

    load();
  }, []);

  return (
    <div style={{ display: "none" }}>
      <video
        style={{ width: "300px", height: "210px" }}
        id="videoOutput"
        playsInline
        ref={videoElement}
      />
      <canvas
        style={{ width: "300px" }}
        id="canvasOutput"
        ref={canvasEl}
        width={cvCanvas}
        height={cvCanvas}
      />
    </div>
  );
}
