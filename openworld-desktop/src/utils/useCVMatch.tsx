import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import _ from "lodash";
import { captureDesktopStream } from "./capture";

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

interface Result {
  dist: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Options {
  maxCanvasSize: number;
  interval: number;
  threshold: number;
}

const defaultOptions: Options = {
  maxCanvasSize: 400,
  interval: 500,
  threshold: 0.98,
};

export default function useCVMatch(
  image: string,
  callback: (result: Result) => void,
  options?: Partial<Options>
): [() => JSX.Element, boolean, () => void, () => void, () => void] {
  const [capturing, setCapturing] = useState<boolean>(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const templateEl = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(0);

  const opt = {
    ...defaultOptions,
    ...options,
  };

  const beginCapture = useCallback(() => {
    setCapturing(true);
  }, []);

  const endCapture = useCallback(() => {
    setCapturing(false);
  }, []);

  const doMatch = useCallback(() => {
    const win = window as any;
    const { cv } = win;
    if (cv == undefined || image == "") return;

    if (canvasEl.current && videoElement.current && templateEl.current) {
      try {
        const src = new cv.Mat(
          opt.maxCanvasSize,
          opt.maxCanvasSize,
          cv.CV_8UC4
        );
        const dstC1 = new cv.Mat(
          opt.maxCanvasSize,
          opt.maxCanvasSize,
          cv.CV_8UC1
        );
        if (frames !== 0) {
          // Original to grayscale
          const vc = new cv.VideoCapture(videoElement.current);
          vc.read(src);
          cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
          cv.cvtColor(dstC1, src, cv.COLOR_GRAY2RGBA);

          // Dest and mask
          const dst = new cv.Mat(
            opt.maxCanvasSize,
            opt.maxCanvasSize,
            cv.CV_8UC4
          );
          const mask = new cv.Mat();

          // Metrics
          const xScale = window.screen.width / opt.maxCanvasSize;
          const yScale = window.screen.height / opt.maxCanvasSize;

          // Template
          const ogTemplate = cv.imread("templateImage");
          const templ = cvResize(
            ogTemplate,
            ogTemplate.cols / xScale,
            ogTemplate.rows / yScale
          );

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

          // console.log("Best match rate: ", bestDist);
          if (bestDist > opt.threshold) {
            const result: Result = {
              dist: bestDist,
              x: Math.round(xScale * bestPoint.x),
              y: Math.round(yScale * bestPoint.y),
              width: Math.round(templ.cols * xScale),
              height: Math.round(templ.rows * yScale),
            };
            callback(result);
          }
          cv.imshow("canvasOutput", src);
        } else {
          // First frame will always be empty
          cv.imshow("canvasOutput", dstC1);
        }
      } catch (e) {
        console.error(e);
      }
      setFrames(frames + 1);
    }
  }, [callback, frames, videoElement, canvasEl, templateEl]);

  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        videoElement.current.width = opt.maxCanvasSize;
        videoElement.current.height = opt.maxCanvasSize;
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
      const id = setInterval(doMatch, opt.interval);
      return () => clearInterval(id);
    }
  }, [capturing, frames]);

  const Component = useMemo(
    () => () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video
          style={{ width: "400px" }}
          className="video"
          playsInline
          ref={videoElement}
        />
        <img
          style={{ display: "block" }}
          id="templateImage"
          src={image}
          crossOrigin="anonymous"
          ref={templateEl}
        />
        <canvas
          style={{ width: "400px", height: "250px" }}
          id="canvasOutput"
          ref={canvasEl}
          width={opt.maxCanvasSize}
          height={opt.maxCanvasSize}
        />
      </div>
    ),
    []
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
