import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { capturePrimaryStream } from "../../../utils/capture";
import getDisplayBounds from "../../../utils/electron/getDisplayBounds";
import { AppState } from "../../redux/stores/renderer";

export default function CvComponents() {
  const { cvCanvas } = useSelector((state: AppState) => state.settings.cv);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        videoElement.current.srcObject = await capturePrimaryStream();

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <video
        style={{ width: "600px", height: "auto", margin: "0 auto" }}
        id="videoOutput"
        playsInline
        muted
        ref={videoElement}
      />
      <canvas
        style={{ width: "600px", height: "auto", margin: "0 auto" }}
        id="canvasOutput"
        ref={canvasEl}
        width={cvCanvas}
        height={cvCanvas}
      />
      <canvas
        id="canvasTestOutput"
        style={{ width: "600px", height: "auto", margin: "0 auto" }}
      />
    </div>
  );
}
