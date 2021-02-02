import * as cv from "../opencv/opencv";

export default function getLocalMat(image: string): Promise<cv.Mat> {
  return new Promise((resolve, reject) => {
    try {
      const mat = cv.imread(image);
      resolve(mat);
    } catch (e) {
      reject(e);
    }
  });
}
