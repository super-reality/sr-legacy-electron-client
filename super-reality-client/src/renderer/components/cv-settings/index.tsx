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
  const stepData = useSelector((state: AppState) => state.createStep);

  const setMatchValue = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvMatchValue: n[0] },
    });
  }, []);

  const setCanvasSize = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvCanvas: n[0] },
    });
  }, []);

  const setDelay = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvDelay: n[0] },
    });
  }, []);

  const setGrayscale = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvGrayscale: val },
    });
  }, []);

  const setApplyThreshold = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvApplyThreshold: val },
    });
  }, []);

  const setThreshold = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "CREATE_STEP_DATA",
      arg: { cvThreshold: n[0] },
    });
  }, []);

  return (
    <>
      <BaseSlider
        title={`Match Value: ${stepData.cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[stepData.cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${stepData.cvCanvas}% (${Math.round(
          (window.screen.width / 100) * stepData.cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[stepData.cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={stepData.cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={stepData.cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${stepData.cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[stepData.cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${stepData.cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[stepData.cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </>
  );
}
