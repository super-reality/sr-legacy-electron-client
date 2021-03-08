import React, { useEffect, useState, useCallback, useMemo } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../redux/stores/renderer";
import globalData from "../globalData";
import doCvMatch from "../../utils/cv/doCVMatch";
import { CVResult } from "../../types/utils";
import { initialCVSettings } from "../redux/static";

// eslint-disable-next-line no-undef
const Capturer = __non_webpack_require__("desktop-capture");

export default function useCVMatch(
  images: string[],
  callback: (result: CVResult) => void,
  options?: typeof initialCVSettings
): [() => JSX.Element, boolean, () => void, () => void, () => void] {
  const settings = useSelector((state: AppState) => state.settings.cv);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [frames, setFrames] = useState(0);

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

  const doMatch = useCallback(() => {
    console.log(opt);
    const dateStart = new Date().getTime();
    const frame = Capturer.getFrame();
    doCvMatch(images, frame, "buffer", "template", opt)
      .then((res) => {
        callback(res);
        if (globalData.debugCv) {
          console.log(
            `${`CV match time taken - ${new Date().getTime() - dateStart}`}ms`
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setFrames(frames + 1);
  }, [callback, images, capturing, frames, opt]);

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
    // eslint-disable-next-line react/display-name
    () => () => (
      <div
        style={{
          display: globalData.debugCv ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
        }}
      />
    ),
    [images]
  );

  return [Component, capturing, beginCapture, endCapture, doMatch];
}
