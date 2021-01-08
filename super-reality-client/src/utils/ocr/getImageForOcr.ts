import getUrlMat from "../cv/getUrlMat";
import cv from "../opencv/opencv";

export default function getImageForOcr(imageUrl: string): Promise<Buffer> {
  return new Promise((resolve) => {
    getUrlMat(imageUrl)
      .then((img) => {
        const imgExtension = imageUrl.slice(imageUrl.lastIndexOf("."));
        const processed_img = img.resize(img.rows * 2, img.cols * 2);
        processed_img.cvtColor(cv.COLOR_BGR2GRAY);
        processed_img.gaussianBlur(new cv.Size(5, 5), 0);
        processed_img.threshold(cv.THRESH_BINARY, 127, 255);
        resolve(cv.imencode(imgExtension, processed_img));
      })
      .catch((error) => {
        console.error(error);
        resolve(Buffer.from(""));
      });
  });
}
