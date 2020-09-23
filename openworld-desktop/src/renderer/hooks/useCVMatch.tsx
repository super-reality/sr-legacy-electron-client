import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../redux/stores/renderer";
import globalData from "../globalData";
import doCvMatch from "../../utils/doCVMatch";
import { CVResult } from "../../types/utils";

export default function useCVMatch(
  images: string[],
  callback: (result: CVResult) => void,
  options?: Partial<AppState["settings"]>
): [() => JSX.Element, boolean, () => void, () => void, () => void] {
  const { cvMatchValue, cvCanvas, cvDelay } = useSelector(
    (state: AppState) => state.settings
  );
  const [capturing, setCapturing] = useState<boolean>(false);
  const templateEl = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(0);

  const videoElement = document.getElementById(
    "videoOutput"
  ) as HTMLVideoElement | null;

  const opt: Partial<AppState["settings"]> = {
    cvMatchValue,
    cvCanvas,
    cvDelay,
    ...options,
  };

  const beginCapture = useCallback(() => {
    setCapturing(true);
  }, []);

  const endCapture = useCallback(() => {
    setCapturing(false);
  }, []);

  const doMatch = useCallback(
    (force: boolean = false) => {
      if (videoElement && templateEl.current) {
        doCvMatch(images, videoElement, templateEl.current, opt)
          .then(callback)
          .catch(() => {
            if (!capturing && !force) {
              setTimeout(() => doMatch(true), 10);
            }
          });
      }
      setFrames(frames + 1);
    },
    [callback, capturing, frames, videoElement, templateEl]
  );

  useEffect(() => {
    setFrames(0);
  }, [images]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (capturing) {
      const id = setInterval(doMatch, opt.cvDelay);
      return () => clearInterval(id);
    }
  }, [capturing, frames]);

  const Component = useMemo(
    () => () => (
      <div
        style={{
          display: globalData.debugCv ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {images.map((image, index) => (
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`${image}-${index}`}
            style={{ display: "block" }}
            id={`templateImage-${index}`}
            src={image}
            crossOrigin="anonymous"
            ref={templateEl}
          />
        ))}
      </div>
    ),
    [images]
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
