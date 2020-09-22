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
  const { cvThreshold, cvCanvas, cvDelay, cvGrayscale } = useSelector(
    (state: AppState) => state.settings
  );

  const setThreshold = useCallback((n: readonly number[]) => {
    reduxAction(store.dispatch, {
      type: "SET_SETTINGS",
      arg: { cvThreshold: n[0] },
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

  return (
    <Collapsible title="CV Setings">
      <BaseSlider
        title={`CV Threshold: ${cvThreshold}`}
        domain={[800, 1000]}
        defaultValues={[cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`CV Canvas Size: ${cvCanvas}% (${Math.round(
          (window.screen.width / 100) * cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseSlider
        title={`CV Delay: ${cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
      <BaseToggle
        title="Grayscale"
        value={cvGrayscale}
        callback={setGrayscale}
      />
    </Collapsible>
  );
}
