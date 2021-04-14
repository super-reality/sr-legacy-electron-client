import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import ChapterInformationPanel from "../selector-panel/panels/ChapterInformationPanel";
import CanvasSelectorPanel from "../selector-panel/panels/CanvasSelectorPanel";
import GeneratePanel from "../selector-panel/panels/GeneratePanel";
import StartStepSelectorPanel from "../selector-panel/panels/StartStepSelectorPanel";
import StepInformationPanel from "../selector-panel/panels/StepInformationPanel";
import SkillsPanel from "../selector-panel/panels/SkillsPanel";
import AlertsPanel from "../selector-panel/panels/AlertsPanel";
import VideoItemPanel from "../selector-panel/panels/VideoItemPanel";
import StepOnSelectorPanel from "../selector-panel/panels/StepOnSelectorPanel";

export default function LeftPanelWrapper(): JSX.Element {
  const { openPanel, currentItem, currentChapter, currentStep } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  let Component: JSX.Element = <></>;

  switch (openPanel) {
    // items
    case "end-step-on":
      if (currentItem)
        Component = (
          <StepOnSelectorPanel
            key={`end-stepon-panel-${currentItem}`}
            itemId={currentItem}
          />
        );
      break;
    // items
    case "item-video":
      if (currentItem) Component = <VideoItemPanel itemId={currentItem} />;
      break;
    // Step
    case "step-skills":
    case "chapter-skills":
      Component = <SkillsPanel />;
      break;
    case "step-alerts":
    case "chapter-alerts":
      Component = <AlertsPanel />;
      break;
    case "step-canvas":
      if (currentStep)
        Component = (
          <CanvasSelectorPanel
            key={`step-canvas-${currentStep}`}
            stepId={currentStep}
          />
        );
      break;
    case "start-step":
      if (currentStep)
        Component = (
          <StartStepSelectorPanel
            key={`start-step-${currentStep}`}
            stepId={currentStep}
          />
        );
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
