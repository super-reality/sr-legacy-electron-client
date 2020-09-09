import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { captureDesktopStream } from "../../../utils/capture";
import ButtonSimple from "../../components/button-simple";

const maxCanvasSize = 400;

export default function Test() {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const [frames, setFrames] = useState(0);

  const onClick = useCallback(() => {
    const win = window as any;
    const { cv } = win;
    if (cv == undefined) return;

    if (canvasEl.current && videoElement.current) {
      const ctx = canvasEl.current.getContext("2d");
      if (ctx) {
        try {
          const src = new cv.Mat(maxCanvasSize, maxCanvasSize, cv.CV_8UC4);
          const dstC1 = new cv.Mat(maxCanvasSize, maxCanvasSize, cv.CV_8UC1);
          console.log(videoElement.current, src);
          if (frames !== 0) {
            const vc = new cv.VideoCapture(videoElement.current);
            vc.read(src);
            cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
          }
          cv.imshow("canvasOutput", dstC1);
        } catch (e) {
          console.error(e);
        }
        setFrames(frames + 1);
        /*
        ctx.drawImage(videoElement.current, 0, 0, w, h);
        const image = ctx.getImageData(0, 0, w, h);
        */
      }
    }
  }, [frames]);

  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        videoElement.current.width = maxCanvasSize;
        videoElement.current.height = maxCanvasSize;
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <video className="video" playsInline ref={videoElement} />
      <ButtonSimple
        width="200px"
        height="24px"
        margin="auto 8px"
        onClick={onClick}
      >
        Take a photo
      </ButtonSimple>
      <canvas
        style={{ width: "400px", height: "250px" }}
        id="canvasOutput"
        ref={canvasEl}
        width={maxCanvasSize}
        height={maxCanvasSize}
      />
    </div>
  );
}
