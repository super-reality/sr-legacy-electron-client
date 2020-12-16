import fs from "fs";

import { recordingPath, stepSnapshotPath } from "../../../electron-constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function deleteSelectedRecording(): void {
  const { currentRecording } = store.getState().createLessonV2;

  let errored = false;
  if (currentRecording) {
    try {
      const recordingVideo = `${recordingPath}/vid-${currentRecording}.mkv`;
      if (fs.existsSync(recordingVideo)) {
        fs.unlinkSync(recordingVideo);
      }
      const recordingJson = `${stepSnapshotPath}/${currentRecording}.json`;
      if (fs.existsSync(recordingJson)) {
        fs.unlinkSync(recordingJson);
      }
      const recordingAudio = `${recordingPath}/aud-${currentRecording}.webm`;
      if (fs.existsSync(recordingAudio)) {
        fs.unlinkSync(recordingAudio);
      }
    } catch (e) {
      console.error(e);
      errored = true;
    }
  }

  if (!errored) {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        currentRecording: undefined,
      },
    });
  }
}
