import * as cv from "../opencv/opencv";

export default function getMatFromVideo(
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
