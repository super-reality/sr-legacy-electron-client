import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { captureDesktopStream } from "../../../utils/capture";
import ButtonSimple from "../../components/button-simple";

const maxVideoSize = 400;

function imageDataFromMat(mat: any) {
  // converts the mat type to cv.CV_8U
  const win = window as any;
  const { cv } = win;
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale =
    // eslint-disable-next-line no-nested-ternary
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error(
        "Bad number of channels (Source image must have 1, 3 or 4 channels)"
      );
  }
  const clampedArray = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );
  img.delete();
  return clampedArray;
}

/**
 * What we're going to render is:
 *
 * 1. A video component so the user can see what's on the camera.
 *
 * 2. A button to generate an image of the video, load OpenCV and
 * process the image.
 *
 * 3. A canvas to allow us to capture the image of the video and
 * show it to the user.
 */
export default function Test() {
  const [processing, updateProcessing] = useState(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  /**
   * In the onClick event we'll capture a frame within
   * the video to pass it to our service.
   */
  function onClick() {
    updateProcessing(true);
    if (canvasEl.current && videoElement.current) {
      const ctx = canvasEl.current.getContext("2d");
      if (ctx) {
        /*
        ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize);
        const image = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize);
        */
        const win = window as any;
        const { cv } = win;

        try {
          const src = new cv.Mat(maxVideoSize, maxVideoSize, cv.CV_8UC4);
          const dstC1 = new cv.Mat(maxVideoSize, maxVideoSize, cv.CV_8UC1);
          const vc = new cv.VideoCapture(videoElement.current);
          vc.read(src);

          cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
          cv.imshow("canvasOutput", dstC1);
        } catch (e) {
          console.error(e);
        }
        /*
        const img = cv.matFromImageData(image);
        const result = new cv.Mat();
        
        cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);

        const processedImage = imageDataFromMat(result);
        // Render the processed image to the canvas
        ctx.putImageData(processedImage, 0, 0);
        */
        updateProcessing(false);
      }
    }
  }

  /**
   * In the useEffect hook we'll load the video
   * element to show what's on camera.
   */
  useEffect(() => {
    async function initVideoStream() {
      if (videoElement.current) {
        videoElement.current.width = maxVideoSize;
        videoElement.current.height = maxVideoSize;
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
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <video className="video" playsInline ref={videoElement} />
      <ButtonSimple
        width="200px"
        height="24px"
        margin="auto 8px"
        onClick={onClick}
      >
        {processing ? "Processing..." : "Take a photo"}
      </ButtonSimple>
      <canvas
        id="canvasOutput"
        ref={canvasEl}
        width={maxVideoSize}
        height={maxVideoSize}
      />
    </div>
  );
}
