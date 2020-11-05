import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { captureDesktopStream } from "../../../utils/capture";
import getDisplayBounds from "../../../utils/getNewBounds";
import { AppState } from "../../redux/stores/renderer";

export default function CvComponents() {
  const { cvCanvas } = useSelector((state: AppState) => state.settings.cv);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        const fullBounds = getDisplayBounds();
        videoElement.current.width = fullBounds.width;
        videoElement.current.height = fullBounds.height;
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
    <div>
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
      <canvas
        id="canvasTestOutput"
        style={{ width: "300px", margin: "auto" }}
      />
    </div>
  );
}
