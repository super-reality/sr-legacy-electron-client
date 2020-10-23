import globalData from "../renderer/globalData";
import store, { AppState } from "../renderer/redux/stores/renderer";
import { CVResult } from "../types/utils";
import * as cv from "./opencv/opencv";

function getImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function getLocalMat(image: string): Promise<cv.Mat> {
  return new Promise((resolve, reject) => {
    try {
      const mat = cv.imread(image);
      resolve(mat);
    } catch (e) {
      reject(e);
    }
  });
}

function getUrlMat(image: string): Promise<cv.Mat> {
  return new Promise((resolve, reject) => {
    getImage(image).then((img) => {
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
        resolve(mat);
      } else {
        resolve(new cv.Mat());
      }
    });
  });
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

function getMatFromVideo(
  videoElement: HTMLVideoElement,
  width: number,
  height: number
): cv.Mat | null {
  if (videoElement?.videoWidth == 0 || videoElement?.videoHeight == 0) {
    return null;
  }

  // get canvas for the output
  const canvas = document.getElementById("canvasOutput") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    canvas.width = width;
    canvas.height = height;

    // Draw video onto a new canvas and get the buffer data to a Mat
    ctx.drawImage(videoElement, 0, 0, width, height);

    const buffer = Buffer.from(ctx.getImageData(0, 0, width, height).data);
    let srcMat = new cv.Mat(buffer, height, width, cv.CV_8UC4);
    srcMat = srcMat.cvtColor(cv.COLOR_RGBA2BGRA);
    return srcMat;
  }
  return null;
}

export default function doCvMatch(
  images: string[],
  sourceElement: string | HTMLVideoElement,
  options: Partial<AppState["settings"]["cv"]>
): Promise<CVResult> {
  const beginTime = new Date().getTime();
  // Feed default settings from redux store + passed settings
  const opt: AppState["settings"]["cv"] = {
    ...store.getState().settings.cv,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (globalData.debugCv) {
      // console.log(cv ? "CV Ok" : "CV Error", images);
    }
    if (cv == undefined || images[0] == "") return;

    let srcMat = new cv.Mat();
    let width = 1;
    let height = 1;
    let xScale = 1;
    let yScale = 1;
    let mode: "Local" | "Dom" = "Dom";
    if (typeof sourceElement == "string") {
      srcMat = cv.imread(sourceElement);
      width = (srcMat.cols / 100) * opt.cvCanvas;
      height = (srcMat.rows / 100) * opt.cvCanvas;
      xScale = srcMat.cols / width;
      yScale = srcMat.rows / height;
      width = Math.round(width);
      height = Math.round(height);
      srcMat = srcMat.resize(height, width);
      mode = "Local";
    } else {
      width = (sourceElement.videoWidth / 100) * opt.cvCanvas;
      height = (sourceElement.videoHeight / 100) * opt.cvCanvas;
      xScale = sourceElement.videoWidth / width;
      yScale = sourceElement.videoHeight / height;
      width = Math.round(width);
      height = Math.round(height);
      const ogMat = getMatFromVideo(sourceElement, width, height);
      if (ogMat) srcMat = ogMat;
    }

    if (globalData.debugCv) {
      console.log(`Source: ${width}x${height}, Scaling: ${xScale}/${yScale}`);
    }

    // Source Mat and Template mat filters should be applied in the same order!
    if (opt.cvGrayscale && srcMat) {
      srcMat = srcMat.cvtColor(cv.COLOR_RGBA2GRAY);
    }
    if (opt.cvApplyThreshold && srcMat) {
      srcMat = srcMat.threshold(
        opt.cvThreshold,
        255,
        cv.ADAPTIVE_THRESH_MEAN_C
      );
    }

    function adjustMat(mat: cv.Mat): cv.Mat {
      let ret = mat;
      if (globalData.debugCv) {
        console.log(
          `Template: ${ret.cols}x${ret.rows} => ${Math.round(
            ret.cols / xScale
          )}/${Math.round(ret.rows / yScale)}`
        );
      }

      ret = ret.resize(
        Math.round(ret.rows / yScale),
        Math.round(ret.cols / xScale)
      );
      // Source Mat and Template mat filters should be applied in the same order!
      if (opt.cvGrayscale) {
        ret = ret.cvtColor(cv.COLOR_RGBA2GRAY);
      }
      if (opt.cvApplyThreshold) {
        ret = ret.threshold(opt.cvThreshold, 255, cv.ADAPTIVE_THRESH_MEAN_C);
      }
      return ret;
    }

    if (srcMat) {
      // Get Templates
      Promise.all(
        images.map((image) =>
          mode == "Dom" ? getUrlMat(image) : getLocalMat(image)
        )
      )
        .then((templateMats) => {
          const templates = templateMats.map(adjustMat);
          let bestPoint = { x: 0, y: 0 };
          let bestDist = 0;
          let bestIndex = 0;

          images.map((image, index) => {
            const result = srcMat.matchTemplate(
              templates[index],
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

            return result;
          });

          if (bestDist > opt.cvMatchValue / 1000) {
            if (globalData.debugCv) {
              console.log(
                `Distance: ${bestDist}, index: ${bestIndex}, point: ${Math.round(
                  xScale * bestPoint.x
                )},${Math.round(yScale * bestPoint.y)}`
              );
            }
            const ret: CVResult = {
              id: "",
              time: new Date().getTime() - beginTime,
              dist: bestDist,
              sizeFactor: 0,
              x: Math.round(xScale * bestPoint.x),
              y: Math.round(yScale * bestPoint.y),
              width: Math.round(templates[bestIndex].cols * xScale),
              height: Math.round(templates[bestIndex].rows * yScale),
            };
            resolve(ret);
          } else {
            if (globalData.debugCv) {
              console.log(
                `not found: ${bestDist} (${opt.cvMatchValue / 1000})`
              );
            }
            reject();
          }
          matToCanvas(srcMat, "canvasTestOutput");
        })
        .catch(reject);
    } else {
      reject();
    }
  });
}
