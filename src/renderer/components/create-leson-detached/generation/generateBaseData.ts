import { RecordingJson } from "../../recorder/types";
import { GeneratedData } from "./types";

export default function generateBaseData(
  recordingData: RecordingJson
): GeneratedData {
  const itemToStep: Record<string, string> = {};
  let lastStep = "";
  recordingData.step_data.forEach((data, index) => {
    const itemName = `${data.type} ${data.time_stamp}`;
    if (index == 0) {
      lastStep = `step ${data.time_stamp}`;
    }

    if (
      data.type == "left_click" ||
      data.type == "right_click" ||
      data.type == "wheel_click"
    ) {
      lastStep = `step ${data.time_stamp}`;
    }

    itemToStep[itemName] = lastStep;
  });

  return { itemToStep, items: {}, steps: {} };
}
