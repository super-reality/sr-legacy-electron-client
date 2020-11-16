import { CVResult } from "../../../../../types/utils";
import doCvMatch from "../../../../../utils/doCVMatch";
import saveCanvasImage from "../../../../../utils/saveCanvasImage";
import timestampToTime from "../../../../../utils/timestampToTime";
import { IAnchor } from "../../../../api/types/anchor/anchor";
import { ItemFocus } from "../../../../api/types/item/item";
import { itemsPath } from "../../../../electron-constants";
import reduxAction from "../../../../redux/reduxAction";
import store from "../../../../redux/stores/renderer";
import newItem from "../../lesson-utils/newItem";
import setStatus from "../../lesson-utils/setStatus";
import { StepData } from "../../recorder/types";
import { GeneratedData } from "./types";

function makeClick(cvResult: CVResult, data: StepData): Partial<ItemFocus> {
  const itemToSet: Partial<ItemFocus> = {
    trigger: 1,
    anchor: true,
    focus: "Mouse Point",
    name: `${data.type} ${data.time_stamp}`,
    type: "focus_highlight",
    relativePos: {
      width: 128,
      height: 128,
      x: (data.x_cordinate ? data.x_cordinate - cvResult.x : 0) - 64,
      y: (data.y_cordinate ? data.y_cordinate - cvResult.y : 0) - 64,
    },
  };

  return itemToSet;
}

export default async function generateClicks(
  baseData: GeneratedData,
  anchor: IAnchor
): Promise<GeneratedData> {
  const newData = { ...baseData };
  const videoHidden = document.getElementById(
    "video-hidden"
  ) as HTMLVideoElement;

  const { recordingData } = store.getState().createLessonV2;

  const filtered = recordingData.step_data.filter(
    (d) =>
      d.type == "left_click" ||
      d.type == "right_click" ||
      d.type == "wheel_click"
  );

  for (let index = 0; index < filtered.length; index += 1) {
    const data = filtered[index];
    const stepName = `step ${data.time_stamp}`;
    const stepId = baseData.steps[stepName]?._id ?? undefined;

    setStatus(`Generating clicks (${index}/${filtered.length})`);

    if (stepId) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>((resolve) => {
        const timestamp = data.time_stamp;
        const timestampTime = timestampToTime(timestamp);
        videoHidden.currentTime = timestampTime / 1000;
        setTimeout(resolve, 200);
      })
        .then(() => doCvMatch(anchor.templates, videoHidden, anchor))
        .then((cvResult) => {
          reduxAction(store.dispatch, {
            type: "SET_RECORDING_CV_DATA",
            arg: {
              index: timestampToTime(data.time_stamp) / 1000,
              value: cvResult.dist,
            },
          });
          return makeClick(cvResult, data);
        })
        .then((item) => newItem(item, stepId))
        .then((item) => {
          if (item) newData.items[item.name] = item;
          return saveCanvasImage(`${itemsPath}/${stepId}.png`);
        });
    }
  }

  return newData;
}
