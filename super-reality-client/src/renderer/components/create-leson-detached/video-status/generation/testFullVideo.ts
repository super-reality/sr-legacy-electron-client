import doCvMatch from "../../../../../utils/cv/doCVMatch";
import timestampToTime from "../../../../../utils/timestampToTime";
import { IAnchor } from "../../../../api/types/anchor/anchor";
import reduxAction from "../../../../redux/reduxAction";
import store from "../../../../redux/stores/renderer";

export default async function testFullVideo(anchor: IAnchor): Promise<void> {
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

    const timestamp = data.time_stamp;
    const timestampTime = timestampToTime(timestamp);
    videoHidden.currentTime = timestampTime / 1000;

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
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
        return true;
      });
  }
}
