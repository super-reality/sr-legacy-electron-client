import globalData from "../renderer/globalData";
import store, { AppState } from "../renderer/redux/stores/renderer";
import { CVResult } from "../types/utils";
import * as cv from "./opencv/opencv";

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
  templateEl: HTMLImageElement,
  options: Partial<AppState["settings"]>
): Promise<CVResult> {
  // Feed default settings from redux store + passed settings
  const opt: AppState["settings"] = {
    ...store.getState().settings,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (globalData.debugCv) {
      // console.log(cv ? "CV Ok" : "CV Error", image, frames);
    }
    if (cv == undefined || (images[0] == "" && templateEl.currentSrc == ""))
      return;

    let srcMat = new cv.Mat();
    let width = 1;
    let height = 1;
    let xScale = 1;
    let yScale = 1;
    if (typeof sourceElement == "string") {
      srcMat = cv.imread(sourceElement);
      width = Math.round((srcMat.cols / 100) * opt.cvCanvas);
      height = Math.round((srcMat.rows / 100) * opt.cvCanvas);
      xScale = srcMat.cols / width;
      yScale = srcMat.rows / height;
    } else {
      width = Math.round((sourceElement.videoWidth / 100) * opt.cvCanvas);
      height = Math.round((sourceElement.videoHeight / 100) * opt.cvCanvas);
      xScale = sourceElement.videoWidth / width;
      yScale = sourceElement.videoHeight / height;
      const ogMat = getMatFromVideo(sourceElement, width, height);
      if (ogMat) srcMat = ogMat;
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

    if (srcMat) {
      // Template
      const templateMats = images.map((image, index) => {
        let ret = getTemplateMat(`templateImage-${index}`, xScale, yScale);
        // Source Mat and Template mat filters should be applied in the same order!
        if (opt.cvGrayscale) {
          ret = ret.cvtColor(cv.COLOR_RGBA2GRAY);
        }
        if (opt.cvApplyThreshold) {
          ret = ret.threshold(opt.cvThreshold, 255, cv.ADAPTIVE_THRESH_MEAN_C);
        }
        return ret;
      });

      // console.log(templateMat);
      let bestPoint = { x: 0, y: 0 };
      let bestDist = 0;
      let bestIndex = 0;

      images.map((image, index) => {
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

      if (bestDist > opt.cvMatchValue / 1000) {
        if (globalData.debugCv) {
          console.log(
            `Distance: ${bestDist}, index: ${bestIndex}, point: ${bestPoint.x},${bestPoint.y}`
          );
        }
        const ret: CVResult = {
          dist: bestDist,
          sizeFactor: 0,
          x: Math.round(xScale * bestPoint.x),
          y: Math.round(yScale * bestPoint.y),
          width: Math.round(templateMats[bestIndex].cols * xScale),
          height: Math.round(templateMats[bestIndex].rows * yScale),
        };
        resolve(ret);
      } else if (globalData.debugCv) {
        console.log(`not found: ${bestDist} (${opt.cvMatchValue / 1000})`);
        reject();
      }
      matToCanvas(srcMat, "canvasTestOutput");
    } else {
      reject();
    }
  });
}
