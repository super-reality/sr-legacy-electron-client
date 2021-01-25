import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import sha1 from "../../../../utils/md5";
import saveCanvasImage from "../../../../utils/saveCanvasImage";
import timestampToTime from "../../../../utils/timestampToTime";
import { IStep } from "../../../api/types/step/step";
import { itemsPath } from "../../../electron-constants";
import store from "../../../redux/stores/renderer";
import newStep from "../lesson-utils/newStep";
import setStatus from "../lesson-utils/setStatus";
import { StepData } from "../../recorder/types";
import { GeneratedData } from "./types";

function onlyUnique(value: any, index: number, self: Array<any>) {
  return self.indexOf(value) === index;
}

export default async function generateSteps(
  baseData: GeneratedData
): Promise<GeneratedData> {
  const {
    recordingData,
    currentChapter,
    currentRecording,
  } = store.getState().createLessonV2;

  const videoPanel = document.getElementById("video-panel") as HTMLVideoElement;
  const videoCanvas = document.getElementById(
    "video-canvas-panel"
  ) as HTMLCanvasElement;

  const steps: Record<string, StepData> = {};
  recordingData.step_data.forEach((data) => {
    steps[`step ${data.time_stamp}`] = data;
  });

  const uniqueSteps: string[] = Object.values(baseData.itemToStep).filter(
    onlyUnique
  );

  setStatus(`Generating steps`);

  const stepNameToStep: Record<string, IStep> = {};

  for (let index = 0; index < uniqueSteps.length; index += 1) {
    const stepName = uniqueSteps[index];
    setStatus(`Generating steps (${index}/${uniqueSteps.length})`);

    const timestamp = steps[stepName].time_stamp;
    // eslint-disable-next-line no-await-in-loop
    await new Promise<void>((resolve) => {
      const timestampTime = timestampToTime(timestamp);
      videoPanel.currentTime = timestampTime / 1000;
      setTimeout(resolve, 200);
    })
      .then(() =>
        saveCanvasImage(
          `${itemsPath}/${sha1(`step-${timestamp}`)}.png`,
          videoCanvas
        )
      )
      .then((file) => uploadFileToS3(file))
      .then((url) =>
        newStep(
          {
            name: stepName,
            anchor: recordingData.anchor,
            canvas: [
              {
                type: "Recording",
                value: {
                  recording: currentRecording || "",
                  timestamp: steps[stepName].time_stamp,
                  url,
                },
              },
            ],
          },
          currentChapter
        )
      )
      .then((step) => {
        if (step) {
          stepNameToStep[stepName] = step;
        }
      });
  }

  console.log("Steps name to data:", stepNameToStep);
  return { ...baseData, steps: stepNameToStep };
}
