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
import { initialCVSettings } from "../redux/static";

export default function useCVMatch(
  images: string[],
  callback: (result: CVResult) => void,
  options?: typeof initialCVSettings
): [() => JSX.Element, boolean, () => void, () => void, () => void] {
  const settings = useSelector((state: AppState) => state.settings.cv);
  const [capturing, setCapturing] = useState<boolean>(false);
  const templateEl = useRef<HTMLImageElement | null>(null);
  const [frames, setFrames] = useState(0);

  const videoElement = document.getElementById(
    "videoOutput"
  ) as HTMLVideoElement | null;

  const opt: typeof initialCVSettings = useMemo(() => {
    return {
      ...settings,
      ..._.pick(options, Object.keys(initialCVSettings)),
    };
  }, [settings, options]);

  const beginCapture = useCallback(() => {
    setCapturing(true);
  }, []);

  const endCapture = useCallback(() => {
    setCapturing(false);
  }, []);

  const doMatch = useCallback(
    (force: boolean = false) => {
      // console.log(opt);
      const dateStart = new Date().getTime();
      if (videoElement && templateEl.current) {
        doCvMatch(images, videoElement, opt)
          .then((res) => {
            callback(res);
            if (globalData.debugCv) {
              console.log(
                `${`CV match time taken - ${
                  new Date().getTime() - dateStart
                }`}ms`
              );
            }
          })
          .catch(() => {
            if (!capturing && !force) {
              setTimeout(() => doMatch(true), 10);
            }
          });
      }
      setFrames(frames + 1);
    },
    [callback, capturing, frames, videoElement, templateEl, opt]
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
  }, [capturing, frames, opt]);

  const Component = useMemo(
    () => () => (
      <div
        style={{
          display: globalData.debugCv ? "none" : "none",
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
