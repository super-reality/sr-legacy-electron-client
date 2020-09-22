import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import * as cv from "../opencv";
import { AppState } from "../redux/stores/renderer";

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
  cvThreshold: number;
  cvCanvas: number;
  cvDelay: number;
}

export default function useCVMatch(
  images: string[],
  callback: (result: CVResult) => void,
  options?: Partial<Options>
): [() => JSX.Element, boolean, () => void, () => void, () => void] {
  const { cvGrayscale, cvThreshold, cvCanvas, cvDelay } = useSelector(
    (state: AppState) => state.settings
  );
  const [capturing, setCapturing] = useState<boolean>(false);
  const templateEl = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(0);

  const videoElement = document.getElementById(
    "videoOutput"
  ) as HTMLVideoElement | null;
  const canvasElement = document.getElementById(
    "canvasOutput"
  ) as HTMLCanvasElement | null;

  const opt = {
    cvThreshold,
    cvCanvas,
    cvDelay,
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
        videoElement?.videoWidth == 0 ||
        videoElement?.videoHeight == 0
      )
        return;

      // get canvas for the ourput
      const canvas = document.getElementById(
        "canvasOutput"
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (canvas && ctx && videoElement) {
        // Convert video size to scaled down canvas size
        // const min = Math.max(videoElement.videoWidth, videoElement.videoHeight);
        const width = Math.round(
          (videoElement.videoWidth / 100) * opt.cvCanvas
        );
        const height = Math.round(
          (videoElement.videoHeight / 100) * opt.cvCanvas
        );
        canvas.width = width;
        canvas.height = height;
        console.log(width, height);
        // Metrics
        const xScale = videoElement.videoWidth / width;
        const yScale = videoElement.videoHeight / height;

        // Draw video onto a new canvas and get the buffer data to a Mat

        ctx.drawImage(videoElement, 0, 0, width, height);

        const buffer = Buffer.from(ctx.getImageData(0, 0, width, height).data);
        let srcMat = new cv.Mat(buffer, height, width, cv.CV_8UC4);
        srcMat = srcMat.cvtColor(cv.COLOR_RGBA2BGRA);
        if (cvGrayscale) {
          srcMat = srcMat.cvtColor(cv.COLOR_RGBA2GRAY);
        }

        if (srcMat) {
          // Template
          const templateMats = images.map((image, index) => {
            const t = getTemplateMat(`templateImage-${index}`, xScale, yScale);
            if (cvGrayscale) return t.cvtColor(cv.COLOR_RGBA2GRAY);
            return t;
          });

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

          if (bestDist > opt.cvThreshold / 1000) {
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
            console.log(`not found: ${bestDist} (${opt.cvThreshold / 1000})`);
          }

          if (debugCv) {
            matToCanvas(srcMat, "canvasOutput");
          }
        } else if (!capturing && !force) {
          setTimeout(() => doMatch(true), 10);
        }
      } else {
        console.error(canvas, ctx, videoElement);
      }
      setFrames(frames + 1);
    },
    [callback, capturing, frames, videoElement, canvasElement, templateEl]
  );

  useEffect(() => {
    setFrames(0);
  }, [images]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (capturing) {
      const id = setInterval(doMatch, opt.cvDelay);
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
      </div>
    ),
    [images]
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
