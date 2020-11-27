import getImage from "../getImage";
import * as cv from "../opencv/opencv";

export default function getUrlMat(image: string): Promise<cv.Mat> {
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
