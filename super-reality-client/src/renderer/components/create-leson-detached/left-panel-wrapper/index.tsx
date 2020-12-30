import React from "react";

import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import CanvasSelectorPanel from "../selector-panel/CanvasSelectorPanel";

export default function LeftPanelWrapper(): JSX.Element {
  const { openPanel, currentStep } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  let Component: JSX.Element = <></>;

  switch (openPanel) {
    case "step-canvas":
      if (currentStep) {
        Component = <CanvasSelectorPanel stepId={currentStep} />;
      }
      break;
    default:
      break;
  }

  return Component;
}
