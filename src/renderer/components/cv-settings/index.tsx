import React, { useCallback } from "react";
import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import { useSelector } from "react-redux";
import BaseSlider from "../base-slider";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import BaseToggle from "../base-toggle";

export default function CVSettings(): JSX.Element {
  const cvSettings = useSelector((state: AppState) => state.settings.cv);

  const setMatchValue = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvMatchValue: n[0] },
    });
  }, []);

  const setCanvasSize = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvCanvas: n[0] },
    });
  }, []);

  const setDelay = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvDelay: n[0] },
    });
  }, []);

  const setGrayscale = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvGrayscale: val },
    });
  }, []);

  const setApplyThreshold = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvApplyThreshold: val },
    });
  }, []);

  const setThreshold = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_CV_SETTINGS",
      arg: { cvThreshold: n[0] },
    });
  }, []);

  return (
    <>
      <BaseSlider
        title={`Match Value: ${cvSettings.cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[cvSettings.cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${cvSettings.cvCanvas}% (${Math.round(
          (window.screen.width / 100) * cvSettings.cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[cvSettings.cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={cvSettings.cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={cvSettings.cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${cvSettings.cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[cvSettings.cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${cvSettings.cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[cvSettings.cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </>
  );
}
