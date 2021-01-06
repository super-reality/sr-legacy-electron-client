import React from "react";

import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import ChapterInformationPanel from "../selector-panel/ChapterInformationPanel";
import CanvasSelectorPanel from "../selector-panel/panels/CanvasSelectorPanel";
import GeneratePanel from "../selector-panel/panels/GeneratePanel";
import StartStepSelectorPanel from "../selector-panel/panels/StartStepSelectorPanel";
import StepInformationPanel from "../selector-panel/StepInformationPanel";

export default function LeftPanelWrapper(): JSX.Element {
  const { openPanel, currentChapter, currentStep } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  let Component: JSX.Element = <></>;

  switch (openPanel) {
    // Step
    case "step-canvas":
      if (currentStep) Component = <CanvasSelectorPanel stepId={currentStep} />;
      break;
    case "start-step":
      if (currentStep)
        Component = <StartStepSelectorPanel stepId={currentStep} />;
      break;
    case "step-information":
      if (currentStep)
        Component = (
          <StepInformationPanel
            key={`${currentStep}-step-information`}
            stepId={currentStep}
          />
        );
      break;
    // Chapter
    case "chapter-information":
      if (currentChapter)
        Component = (
          <ChapterInformationPanel
            key={`${currentChapter}-step-information`}
            chapterId={currentChapter}
          />
        );
      break;
    case "generate-recording":
      Component = <GeneratePanel />;
      break;
    default:
      break;
  }

  return Component;
}
