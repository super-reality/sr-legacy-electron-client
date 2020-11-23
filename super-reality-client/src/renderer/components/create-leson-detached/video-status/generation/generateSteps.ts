import { IStep } from "../../../../api/types/step/step";
import store from "../../../../redux/stores/renderer";
import newStep from "../../lesson-utils/newStep";
import setStatus from "../../lesson-utils/setStatus";
import { StepData } from "../../recorder/types";
import { GeneratedData } from "./types";

function onlyUnique(value: any, index: number, self: Array<any>) {
  return self.indexOf(value) === index;
}

export default function generateSteps(
  baseData: GeneratedData
): Promise<GeneratedData> {
  const {
    recordingData,
    currentChapter,
    currentRecording,
  } = store.getState().createLessonV2;

  const steps: Record<string, StepData> = {};
  recordingData.step_data.forEach((data) => {
    steps[`step ${data.time_stamp}`] = data;
  });

  const uniqueSteps: string[] = Object.values(baseData.itemToStep).filter(
    onlyUnique
  );

  setStatus(`Generating steps`);

  const stepNameToStep: Record<string, IStep> = {};
  uniqueSteps.map((stepName) => {
    return newStep(
      {
        name: stepName,
        anchor: recordingData.anchor,
        recordingId: currentRecording,
        recordingTimestamp: steps[stepName].time_stamp,
      },
      currentChapter
    ).then((step) => {
      if (step) {
        stepNameToStep[stepName] = step;
      }
    });
  });

  return Promise.all(uniqueSteps).then(() => {
    console.log("Steps name to data:", stepNameToStep);
    return { ...baseData, steps: stepNameToStep };
  });
}
