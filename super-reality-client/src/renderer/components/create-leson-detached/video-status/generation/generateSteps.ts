import { IStep } from "../../../../api/types/step/step";
import store from "../../../../redux/stores/renderer";
import newStep from "../../lesson-utils/newStep";
import { GeneratedData } from "./types";

function onlyUnique(value: any, index: number, self: Array<any>) {
  return self.indexOf(value) === index;
}

export default function generateSteps(
  baseData: GeneratedData
): Promise<GeneratedData> {
  const { recordingData, currentChapter } = store.getState().createLessonV2;

  const uniqueSteps: string[] = Object.values(baseData.itemToStep).filter(
    onlyUnique
  );

  const stepNameToStep: Record<string, IStep> = {};
  uniqueSteps.map((stepName) => {
    return newStep(
      { name: stepName, anchor: recordingData.anchor },
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
