import globalData from "../../renderer/globalData";
import store, { AppState } from "../../renderer/redux/stores/renderer";
import { CVResult, Rectangle } from "../../types/utils";
import getLocalMat from "./getLocalMat";
import getUrlMat from "./getUrlMat";
// import matToCanvas from "./matToCanvas";
import * as cv from "../opencv/opencv";
import getPrimaryMonitor from "../electron/getPrimaryMonitor";
import matToCanvas from "./matToCanvas";
import OcrService from "../ocr/ocrService";

export default function doCvMatch(
  images: string[],
  sourceElement: any,
  sourceType: "filename" | "video" | "buffer",
  templateType: "template" | "ocr",
  options: Partial<AppState["settings"]["cv"]>
): Promise<CVResult> {
  // Feed default settings from redux store + passed settings
  const opt: AppState["settings"]["cv"] = {
    ...store.getState().settings.cv,
    ...options,
  };

  return new Promise((resolve, reject) => {
    const beginTime = new Date().getTime();
    if (globalData.debugCv) {
      // console.log(cv ? "CV Ok" : "CV Error", images);
    }
    if (cv == undefined || images[0] == "") return;

    let srcMat = new cv.Mat();
    let width = 1;
    let height = 1;
    let xScale = 1;
    let yScale = 1;

    if (sourceType == "filename") {
      srcMat = cv.imread(sourceElement);
      width = (srcMat.cols / 100) * opt.cvCanvas;
      height = (srcMat.rows / 100) * opt.cvCanvas;
      xScale = srcMat.cols / width;
      yScale = srcMat.rows / height;
      width = Math.round(width);
      height = Math.round(height);
      srcMat = srcMat.resize(height, width);
    } else if (sourceType == "video") {
      width = (sourceElement.videoWidth / 100) * opt.cvCanvas;
      height = (sourceElement.videoHeight / 100) * opt.cvCanvas;
      xScale = sourceElement.videoWidth / width;
      yScale = sourceElement.videoHeight / height;
      width = Math.round(width);
      height = Math.round(height);
      const ogMat = new cv.Mat(sourceElement, height, width, cv.CV_8UC4);
      if (ogMat) srcMat = ogMat;
    } else if (sourceType == "buffer") {
      const primary = getPrimaryMonitor();
      width = (primary.bounds.width / 100) * opt.cvCanvas;
      height = (primary.bounds.height / 100) * opt.cvCanvas;
      xScale = primary.bounds.width / width;
      yScale = primary.bounds.height / height;
      width = Math.round(width);
      height = Math.round(height);

      srcMat = new cv.Mat(
        Buffer.from(sourceElement as Uint8Array),
        primary.bounds.height,
        primary.bounds.width,
        cv.CV_8UC4
      );
      srcMat = srcMat.resize(height, width);
    }

    matToCanvas(srcMat, "canvasOutput");

    if (globalData.debugCv) {
      // console.log(`sourceElement: ${sourceElement}`);
      console.log(`Source: ${width}x${height}, Scaling: ${xScale}/${yScale}`);
    }

    // Source Mat and Template mat filters should be applied in the same order!
    if ((opt.cvGrayscale || templateType == "ocr") && srcMat) {
      srcMat = srcMat.cvtColor(cv.COLOR_RGBA2GRAY);
    } else if (sourceType == "buffer") {
      // Add an || for any input that is RGBA
      srcMat = srcMat.cvtColor(cv.COLOR_RGBA2RGB);
    }

    let srcMatBuffer: Buffer | undefined;
    if (templateType == "ocr") {
      srcMat.gaussianBlur(new cv.Size(5, 5), 0);
      srcMat.threshold(cv.THRESH_BINARY, 127, 255);
      srcMatBuffer = cv.imencode(".png", srcMat);
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
      if (templateType == "template") {
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
            const endTime = new Date().getTime();
            const ret: CVResult = {
              id: "",
              time: endTime - beginTime,
              date: endTime,
              dist: bestDist,
              sizeFactor: 0,
              x: Math.round(xScale * bestPoint.x),
              y: Math.round(yScale * bestPoint.y),
              width: Math.round(templates[bestIndex].cols * xScale),
              height: Math.round(templates[bestIndex].rows * yScale),
            };
            matToCanvas(srcMat, "canvasTestOutput");
            resolve(ret);
          })
          .catch(reject);
      } else if (templateType == "ocr") {
        let bestDist = 0;
        let bbox: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
        Promise.all(
          images.map(
            (findText): Promise<any> => {
              const ocrService = new OcrService();
              return ocrService
                .initialize("eng")
                .then(() => ocrService.getResult(srcMatBuffer || ""))
                .then((res) => {
                  res.data.lines.forEach((line) => {
                    line.words.forEach((word) => {
                      if (
                        word.text == findText &&
                        word.confidence > 80 &&
                        bestDist < word.confidence
                      ) {
                        bestDist = word.confidence;
                        bbox = {
                          x: Math.min(word.bbox.x0, word.bbox.x1),
                          y: Math.min(word.bbox.y0, word.bbox.y1),
                          width:
                            Math.max(word.bbox.x0, word.bbox.x1) -
                            Math.min(word.bbox.x0, word.bbox.x1),
                          height:
                            Math.max(word.bbox.y0, word.bbox.y1) -
                            Math.min(word.bbox.y0, word.bbox.y1),
                        };
                      }
                    });
                  });
                })
                .catch(reject);
            }
          )
        ).then(() => {
          const endTime = new Date().getTime();
          const ret: CVResult = {
            id: "",
            time: endTime - beginTime,
            date: endTime,
            dist: bestDist,
            sizeFactor: 0,
            x: Math.round(xScale * bbox.x),
            y: Math.round(yScale * bbox.y),
            width: Math.round(bbox.width * xScale),
            height: Math.round(bbox.height * yScale),
          };
          resolve(ret);
        });
      }
    } else {
      reject();
    }
  });
}
