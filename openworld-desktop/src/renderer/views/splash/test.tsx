import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { captureDesktopStream } from "../../../utils/capture";
import ButtonSimple from "../../components/button-simple";
import cvTestImage from "../../../assets/images/cvtest.png";
import createFindBox from "../../../utils/createFindBox";

const maxCanvasSize = 400;
const threshold = 10.98;

function cvResize(image: any, w: number, h: number): any {
  const win = window as any;
  const { cv } = win;

  const src = image;
  const dst = new cv.Mat();
  const dsize = new cv.Size(w, h);
  cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
  src.delete();
  return dst;
}

export default function Test() {
  const [capturing, setCapturing] = useState<boolean>(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const templateEl = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(0);

  const onClick = useCallback(() => {
    setCapturing(!capturing);
  }, [capturing]);

  const doMatch = useCallback(() => {
    const win = window as any;
    const { cv } = win;
    if (cv == undefined) return;

    if (canvasEl.current && videoElement.current && templateEl.current) {
      try {
        const src = new cv.Mat(maxCanvasSize, maxCanvasSize, cv.CV_8UC4);
        const dstC1 = new cv.Mat(maxCanvasSize, maxCanvasSize, cv.CV_8UC1);
        if (frames !== 0) {
          // Original to grayscale
          const vc = new cv.VideoCapture(videoElement.current);
          vc.read(src);
          cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
          cv.cvtColor(dstC1, src, cv.COLOR_GRAY2RGBA);

          // Dest and mask
          const dst = new cv.Mat(maxCanvasSize, maxCanvasSize, cv.CV_8UC4);
          const mask = new cv.Mat();

          // Metrics
          const xScale = 1920 / maxCanvasSize;
          const yScale = 1080 / maxCanvasSize;

          // Template
          const ogTemplate = cv.imread("templateImage");
          console.log(
            "template: ",
            ogTemplate.cols / xScale,
            ogTemplate.rows / yScale
          );
          const templ = cvResize(
            ogTemplate,
            ogTemplate.cols / xScale,
            ogTemplate.rows / yScale
          );
          // ogTemplate.delete();

          // Do match
          // console.log(src, dst, templ);
          cv.matchTemplate(src, templ, dst, cv.TM_CCORR_NORMED, mask);

          const newDst: Array<Array<any>> = [];
          let start = 0;
          let end = dst.cols;

          let bestDist = 0;
          let bestPoint = {
            x: 0,
            y: 0,
          };

          for (let i = 0; i < dst.rows; i += 1) {
            newDst[i] = [];
            for (let k = 0; k < dst.cols; k += 1) {
              newDst[i][k] = dst.data32F[start];

              if (newDst[i][k] > bestDist) {
                bestDist = newDst[i][k];
                bestPoint = {
                  x: k,
                  y: i,
                };
              }
              start += 1;
            }
            start = end;
            end += dst.cols;
          }

          // Re-scale to draw
          const point = new cv.Point(
            bestPoint.x + templ.cols,
            bestPoint.y + templ.rows
          );

          // Output
          const redScalar = new cv.Scalar(255, 0, 0, 255);
          cv.rectangle(src, bestPoint, point, redScalar, 2, cv.LINE_8, 0);
          cv.rectangle(
            src,
            { x: templ.cols / 2, y: templ.rows / 2 },
            { x: dst.cols + templ.cols / 2, y: dst.rows + templ.rows / 2 },
            redScalar,
            2,
            cv.LINE_8,
            0
          );

          console.log("Best match rate: ", bestDist);
          if (bestDist > threshold) {
            createFindBox({
              x: Math.round(xScale * bestPoint.x),
              y: Math.round(yScale * bestPoint.y),
              width: Math.round(templ.cols * xScale),
              height: Math.round(templ.rows * yScale),
            }).then(() => {});
          }
          cv.imshow("canvasOutput", src);
        } else {
          cv.imshow("canvasOutput", dstC1);
        }
      } catch (e) {
        console.error(e);
      }
      setFrames(frames + 1);
    }
  }, [frames, videoElement, canvasEl, templateEl]);

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

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (capturing) {
      const id = setInterval(doMatch, 500);
      return () => clearInterval(id);
    }
  }, [capturing, frames]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <video
        style={{ width: "400px" }}
        className="video"
        playsInline
        ref={videoElement}
      />
      <img
        style={{ display: "none" }}
        id="templateImage"
        src={cvTestImage}
        ref={templateEl}
      />
      <canvas
        style={{ width: "400px", height: "250px" }}
        id="canvasOutput"
        ref={canvasEl}
        width={maxCanvasSize}
        height={maxCanvasSize}
      />
      <ButtonSimple
        width="200px"
        height="24px"
        margin="auto 8px"
        onClick={onClick}
      >
        {capturing ? "Stop capturing" : "Begin capturing"}
      </ButtonSimple>
    </div>
  );
}
