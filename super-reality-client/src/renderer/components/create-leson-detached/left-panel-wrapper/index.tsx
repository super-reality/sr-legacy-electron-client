import React from "react";

import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import CanvasSelectorPanel from "../selector-panel/panels/CanvasSelectorPanel";
import GeneratePanel from "../selector-panel/panels/GeneratePanel";
import StartStepSelectorPanel from "../selector-panel/panels/StartStepSelectorPanel";

export default function LeftPanelWrapper(): JSX.Element {
  const { openPanel, currentStep } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  let Component: JSX.Element = <></>;

  switch (openPanel) {
    case "step-canvas":
      if (currentStep) Component = <CanvasSelectorPanel stepId={currentStep} />;

      break;
    case "start-step":
      if (currentStep)
        Component = <StartStepSelectorPanel stepId={currentStep} />;
      break;
    case "geenrate-recording":
      if (currentStep) Component = <GeneratePanel stepId={currentStep} />;
      break;
    default:
      break;
  }

  return Component;
}
