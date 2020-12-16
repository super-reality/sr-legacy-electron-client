import globalData from "../../renderer/globalData";
import store, { AppState } from "../../renderer/redux/stores/renderer";
import { CVResult } from "../../types/utils";
import getLocalMat from "./getLocalMat";
import getMatFromVideo from "./getMatFromVideo";
import getUrlMat from "./getUrlMat";
import matToCanvas from "./matToCanvas";
import * as cv from "../opencv/opencv";

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

    if (typeof sourceElement == "string") {
      srcMat = cv.imread(sourceElement);
      width = (srcMat.cols / 100) * opt.cvCanvas;
      height = (srcMat.rows / 100) * opt.cvCanvas;
      xScale = srcMat.cols / width;
      yScale = srcMat.rows / height;
      width = Math.round(width);
      height = Math.round(height);
      srcMat = srcMat.resize(height, width);
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
      console.log(`sourceElement: ${sourceElement}`);
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
          )}/${Math.round(ret.rows / yScale)}, template channels: ${
            ret.channels
          }`
        );
      }

      ret = ret.resize(
        Math.round(ret.rows / yScale),
        Math.round(ret.cols / xScale)
      );
      // Source Mat and Template mat filters should be applied in the same order!
      if (opt.cvGrayscale) {
        ret = ret.cvtColor(cv.COLOR_RGBA2GRAY);
      } else {
        ret = ret.cvtColor(cv.COLOR_RGBA2RGB);
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
          image.indexOf("http") !== -1 ? getUrlMat(image) : getLocalMat(image)
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

          // if (bestDist > opt.cvMatchValue / 1000) {
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
          matToCanvas(srcMat, "canvasTestOutput");
        })
        .catch(reject);
    } else {
      reject();
    }
  });
}
