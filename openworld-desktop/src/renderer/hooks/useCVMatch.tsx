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
import createFindBox from "../../utils/createFindBox";

function getTemplateMat(id: string, xScale: number, yScale: number): cv.Mat {
  const img = document.getElementById(id) as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const w = img.width;
  const h = img.height;
  canvas.width = w;
  canvas.height = h;
  console.log(w, h);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0);
    const buff = ctx.getImageData(0, 0, w, h).data;
    const mat = new cv.Mat(Buffer.from(buff), w, h, cv.CV_8UC4);
    console.log(w / xScale, h / yScale);
    return mat.resize(Math.round(h / yScale), Math.round(w / xScale));
  }
  return new cv.Mat();
}

function canvasToMat(
  canvas: HTMLCanvasElement,
  w?: number,
  h?: number
): cv.Mat | undefined {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const buffer = Buffer.from(
      ctx.getImageData(0, 0, w || canvas.width, h || canvas.height).data
    );
    return new cv.Mat(
      buffer,
      w || canvas.width,
      h || canvas.height,
      cv.CV_8UC4
    );
  }
  return undefined;
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
    canvas.height = mat.rows;
    canvas.width = mat.cols;
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
  thresholdFactor: number;
}

const defaultOptions: Options = {
  maxCanvasSize: 1024,
  interval: 500,
  threshold: 0.98,
  thresholdFactor: 6000,
};

export default function useCVMatch(
  image: string,
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
      console.log(cv ? "CV Ok" : "CV Error", image, frames);
      if (
        cv == undefined ||
        (image == "" && templateEl.current?.currentSrc == "")
      )
        return;

      // set canvas dimensions
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

        console.log(`${width} x ${height}`);
        // Draw video onto a new canvas and get the buffer data to a Mat

        ctx.drawImage(videoElement.current, 0, 0, width, height);

        const buffer = Buffer.from(ctx.getImageData(0, 0, width, height).data);
        let srcMat = new cv.Mat(buffer, height, width, cv.CV_8UC4);
        srcMat = srcMat.cvtColor(cv.COLOR_RGBA2BGRA);
        // srcMat = srcMat.cvtColor(cv.COLOR_RGBA2GRAY);

        if (srcMat) {
          // Template
          const templateMat = getTemplateMat("templateImage", xScale, yScale); // .cvtColor(cv.COLOR_RGBA2GRAY);

          console.log(templateMat);
          // Do match
          const result = srcMat.matchTemplate(
            templateMat,
            cv.TM_CCORR_NORMED,
            new cv.Mat()
          );
          // result.normalize(cv.NORM_MINMAX);
          result.normalize(0, 1, cv.NORM_MINMAX, -1, new cv.Mat());
          const minMax = result.minMaxLoc();
          console.log(minMax.maxLoc);

          srcMat.drawRectangle(
            minMax.maxLoc,
            new cv.Point2(
              minMax.maxLoc.x + templateMat.cols,
              minMax.maxLoc.y + templateMat.rows
            ),
            new cv.Vec3(0, 255, 0),
            5
          );
          /*
          createFindBox({
            x: Math.round(xScale * minMax.maxLoc.x),
            y: Math.round(yScale * minMax.maxLoc.y),
            width: Math.round(templateMat.cols * xScale),
            height: Math.round(templateMat.rows * yScale),
          });
          */
          matToCanvas(srcMat, "canvasOutput");
        }
      } else {
        console.log(canvas, ctx, videoElement.current);
      }

      /*
      const canvas = document.createElement("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx && videoElement.current) {
        ctx.drawImage(
          videoElement.current,
          0,
          0,
          opt.maxCanvasSize,
          opt.maxCanvasSize
        );
      }
      const srcMat = canvasToMat(canvas, opt.maxCanvasSize, opt.maxCanvasSize);
      console.log(srcMat);
      if (srcMat) {
        srcMat.resize(opt.maxCanvasSize, opt.maxCanvasSize);

        srcMat.cvtColor(cv.COLOR_RGBA2GRAY);
        matToCanvas(srcMat, "canvasOutput");
      }
      */
      /*
      if (canvasEl.current && srcMat && templateEl.current) {
        try {
          const dstC1 = new cv.Mat(
            opt.maxCanvasSize,
            opt.maxCanvasSize,
            cv.CV_8UC1
          );
          if (force || frames !== 0) {
            // Original to grayscale
            const vc = new cv.VideoCapture(0);
            const frame = vc.read();
            frame.cvtColor(cv.COLOR_RGBA2GRAY);

            // Dest and mask
            const dst = new cv.Mat(
              opt.maxCanvasSize,
              opt.maxCanvasSize,
              cv.CV_8UC4
            );
            const mask = new cv.Mat();


            // Template
            const buffer = Buffer.from(getImageData("templateImage") || []);
            const templateMat = cv.imdecode(buffer);
            const tw = templateMat.cols / xScale;
            const th = templateMat.rows / yScale;

            templateMat.resize(tw, th);

            console.log(
              `Process ${dst.rows}x${dst.cols} (${dst.rows * dst.cols})`
            );
            const timerId = new Date().getTime();
            console.time(`CV Loop ${timerId}`);

            // Do match
            const result = srcMat.matchTemplate(
              templateMat,
              cv.TM_CCORR_NORMED,
              mask
            );
            // result.normalize(cv.NORM_MINMAX);
            const minMax = result.minMaxLoc();

            console.log(minMax);
            console.timeEnd(`CV Loop ${timerId}`);
            
            // Re-scale to draw
            const point = new cv.Point(
              bestPoint.x + templateMat.cols,
              bestPoint.y + templateMat.rows
            );

            // Output
            const redScalar = new cv.Scalar(255, 0, 0, 255);
            cv.rectangle(src, bestPoint, point, redScalar, 2, cv.LINE_8, 0);
            cv.rectangle(
              src,
              { x: templateMat.cols / 2, y: templateMat.rows / 2 },
              { x: dst.cols + templateMat.cols / 2, y: dst.rows + templateMat.rows / 2 },
              redScalar,
              2,
              cv.LINE_8,
              0
            );

            console.log("Best match rate: ", bestDist);
            const size =
              Math.sqrt(templateMat.cols * templateMat.rows) / opt.thresholdFactor;
            console.log("Threshold: ", opt.threshold - size);

            if (bestDist > opt.threshold - size) {
              const result: CVResult = {
                dist: bestDist,
                sizeFactor: size,
                x: Math.round(xScale * bestPoint.x),
                y: Math.round(yScale * bestPoint.y),
                width: Math.round(templateMat.cols * xScale),
                height: Math.round(templateMat.rows * yScale),
              };
              callback(result);
            }
            matToCanvas(srcMat, "canvasOutput");
          } else {
            // First frame will always be empty
            matToCanvas(dstC1, "canvasOutput");
            if (!capturing && !force) {
              setTimeout(() => doMatch(true), 10);
            }
          }
        } catch (e) {
          console.error(e);
        }
        setFrames(frames + 1);
      }
      */
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
  }, [image]);

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
          style={{ width: "300px", height: "210px" }}
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
          style={{ width: "300px" }}
          id="canvasOutput"
          ref={canvasEl}
          width={opt.maxCanvasSize}
          height={opt.maxCanvasSize}
        />
      </div>
    ),
    [image]
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
