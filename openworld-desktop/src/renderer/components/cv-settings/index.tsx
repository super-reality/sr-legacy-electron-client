import React, { useCallback } from "react";
import "./index.scss";
import "../containers.scss";
import "../lesson.scss";
import { useSelector } from "react-redux";
import Collapsible from "../collapsible";
import BaseSlider from "../base-slider";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import BaseToggle from "../base-toggle";

export default function CVSettings(): JSX.Element {
  const {
    cvMatchValue,
    cvThreshold,
    cvApplyThreshold,
    cvCanvas,
    cvDelay,
    cvGrayscale,
  } = useSelector((state: AppState) => state.settings);

  const setMatchValue = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvMatchValue: n[0] },
    });
  }, []);

  const setCanvasSize = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvCanvas: n[0] },
    });
  }, []);

  const setDelay = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvDelay: n[0] },
    });
  }, []);

  const setGrayscale = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvGrayscale: val },
    });
  }, []);

  const setApplyThreshold = useCallback((val: boolean) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvApplyThreshold: val },
    });
  }, []);

  const setThreshold = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvThreshold: n[0] },
    });
  }, []);

  return (
    <Collapsible title="CV Setings">
      <BaseSlider
        title={`Match Value: ${cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${cvCanvas}% (${Math.round(
          (window.screen.width / 100) * cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </Collapsible>
  );
}
