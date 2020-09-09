import React, { useEffect, useRef, useState } from "react";
import ogCV from "../../../services/cv";
import { captureDesktopStream } from "../../../utils/capture";

const cv = ogCV as any;
const maxVideoSize = 400;

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
  async function onClick() {
    updateProcessing(true);

    if (canvasEl.current && videoElement.current) {
      const ctx = canvasEl.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize);
        const image = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize);
        // Load the model
        await cv.load();
        // Processing image
        const processedImage = await cv.imageProcessing(image);
        // Render the processed image to the canvas
        ctx.putImageData(processedImage.data.payload, 0, 0);
        updateProcessing(false);
      }
    }
  }

  /**
   * In the useEffect hook we'll load the video
   * element to show what's on camera.
   */
  useEffect(() => {
    async function initCamara() {
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
      const videoLoaded = (await initCamara()) as HTMLVideoElement;
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
      <button
        type="button"
        disabled={processing}
        style={{ width: maxVideoSize, padding: 10 }}
        onClick={onClick}
      >
        {processing ? "Processing..." : "Take a photo"}
      </button>
      <canvas ref={canvasEl} width={maxVideoSize} height={maxVideoSize} />
    </div>
  );
}
