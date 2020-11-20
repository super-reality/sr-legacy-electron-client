import * as cv from "../opencv/opencv";

export default function matToCanvas(mat: cv.Mat, id: string): void {
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
