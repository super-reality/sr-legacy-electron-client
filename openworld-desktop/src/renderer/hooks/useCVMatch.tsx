import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import _ from "lodash";
import { captureDesktopStream } from "../../utils/capture";
import * as cv from "../opencv";

const debugCv = false;

function getTemplateMat(id: string, xScale: number, yScale: number): cv.Mat {
  const img = document.getElementById(id) as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const w = img.width;
  const h = img.height;
  canvas.width = w;
  canvas.height = h;
  // console.log(w, h);
  const ctx = canvas.getContext("2d");
  if (ctx && w !== 0 && h !== 0) {
    ctx.drawImage(img, 0, 0);
    const buff = ctx.getImageData(0, 0, w, h).data;
    const mat = new cv.Mat(Buffer.from(buff), h, w, cv.CV_8UC4);
    // console.log(w / xScale, h / yScale);
    return mat.resize(Math.round(h / yScale), Math.round(w / xScale));
  }
  return new cv.Mat();
}

function matToCanvas(mat: cv.Mat, id: string): void {
  // convert your image to rgba color space
  const matRGBA =
    mat.channels === 1
      ? mat.cvtColor(cv.COLOR_GRAY2RGBA)
      : mat.cvtColor(cv.COLOR_BGRA2RGBA);

  // create new ImageData from raw mat data
  const imgData = new ImageData(
    new Uint8ClampedArray(matRGBA.getData()),
    mat.cols,
    mat.rows
  );

  // set canvas dimensions
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  if (canvas) {
    canvas.width = mat.cols;
    canvas.height = mat.rows;
  }

  // set image data
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.putImageData(imgData, 0, 0);
}

export interface CVResult {
  dist: number;
  sizeFactor: number;
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
  maxCanvasSize: 800,
  interval: 50,
  threshold: 0.97,
};

export default function useCVMatch(
  images: string[],
  callback: (result: CVResult) => void,
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

  const doMatch = useCallback(
    (force: boolean = false) => {
      if (debugCv) {
        // console.log(cv ? "CV Ok" : "CV Error", image, frames);
      }
      if (
        cv == undefined ||
        (images[0] == "" && templateEl.current?.currentSrc == "") ||
        videoElement.current?.videoWidth == 0 ||
        videoElement.current?.videoHeight == 0
      )
        return;

      // get canvas for the ourput
      const canvas = document.getElementById(
        "canvasOutput"
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (canvas && ctx && videoElement.current) {
        // Convert video size to scaled down canvas size
        const min = Math.max(
          videoElement.current.videoWidth,
          videoElement.current.videoHeight
        );
        const width = Math.round(
          (videoElement.current.videoWidth / min) * opt.maxCanvasSize
        );
        const height = Math.round(
          (videoElement.current.videoHeight / min) * opt.maxCanvasSize
        );
        canvas.width = width;
        canvas.height = height;
        // Metrics
        const xScale = videoElement.current.videoWidth / width;
        const yScale = videoElement.current.videoHeight / height;

        // Draw video onto a new canvas and get the buffer data to a Mat

        ctx.drawImage(videoElement.current, 0, 0, width, height);

        const buffer = Buffer.from(ctx.getImageData(0, 0, width, height).data);
        let srcMat = new cv.Mat(buffer, height, width, cv.CV_8UC4);
        srcMat = srcMat.cvtColor(cv.COLOR_RGBA2BGRA);
        srcMat = srcMat.cvtColor(cv.COLOR_RGBA2GRAY);

        if (srcMat) {
          // Template
          const templateMats = images.map((image, index) =>
            getTemplateMat(`templateImage-${index}`, xScale, yScale).cvtColor(
              cv.COLOR_RGBA2GRAY
            )
          );

          // console.log(templateMat);
          // Do match
          let bestPoint = { x: 0, y: 0 };
          let bestDist = 0;
          let bestIndex = 0;

          const results = images.map((image, index) => {
            const result = srcMat.matchTemplate(
              templateMats[index],
              cv.TM_CCORR_NORMED,
              new cv.Mat()
            );

            const minMax = result.minMaxLoc();

            const point = minMax.maxLoc;
            const dist = minMax.maxVal;
            if (dist > bestDist) {
              bestPoint = point;
              bestDist = dist;
              bestIndex = index;
            }
            srcMat.drawRectangle(
              minMax.maxLoc,
              new cv.Point2(
                point.x + templateMats[index].cols,
                point.y + templateMats[index].rows
              ),
              new cv.Vec3(0, 255, 0),
              5
            );

            return result;
          });

          if (bestDist > opt.threshold) {
            console.log(
              `Distance: ${bestDist}, index: ${bestIndex}, point: ${bestPoint.x},${bestPoint.y}`
            );
            const ret: CVResult = {
              dist: bestDist,
              sizeFactor: 0,
              x: Math.round(xScale * bestPoint.x),
              y: Math.round(yScale * bestPoint.y),
              width: Math.round(templateMats[bestIndex].cols * xScale),
              height: Math.round(templateMats[bestIndex].rows * yScale),
            };
            callback(ret);
          } else if (debugCv) {
            console.log(`not found: ${bestDist}`);
          }

          if (debugCv) {
            matToCanvas(srcMat, "canvasOutput");
          }
        } else if (!capturing && !force) {
          setTimeout(() => doMatch(true), 10);
        }
      } else {
        console.error(canvas, ctx, videoElement.current);
      }
      setFrames(frames + 1);
    },
    [callback, capturing, frames, videoElement, canvasEl, templateEl]
  );

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
    setFrames(0);
  }, [images]);

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
          display: debugCv ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video
          style={{ width: "300px", height: "210px" }}
          className="video"
          playsInline
          ref={videoElement}
        />
        {images.map((image, index) => (
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`${image}-${index}`}
            style={{ display: "block" }}
            id={`templateImage-${index}`}
            src={image}
            crossOrigin="anonymous"
            ref={templateEl}
          />
        ))}
        <canvas
          style={{ width: "300px" }}
          id="canvasOutput"
          ref={canvasEl}
          width={opt.maxCanvasSize}
          height={opt.maxCanvasSize}
        />
      </div>
    ),
    [images]
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
