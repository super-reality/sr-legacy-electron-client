import fs from "fs";
import { recordingPath } from "../../electron-constants";
import reduxAction from "../reduxAction";
import { VideoSources } from "../slices/createLessonSliceV2";
import store from "../stores/renderer";

export default function setCanvasSource(
  type: VideoSources,
  source: string
): void {
  const { canvasSourceType } = store.getState().createLessonV2;
  let ok = false;
  let canvasSourceDesc = "no source";
  if (type == "file" && fs.existsSync(source)) {
    ok = true;
    canvasSourceDesc = source.split(/(\\|\/)/g).pop() ?? canvasSourceDesc;
  }
  if (
    type == "recording" &&
    fs.existsSync(`${recordingPath}/vid-${source}.webm`)
  ) {
    ok = true;
    canvasSourceDesc = `recording ${source}`;
  }
  if (type == "url") {
    ok = true;
    canvasSourceDesc = source;
  }
  if (ok) {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        canvasSourceType: type,
        canvasSource: source,
        canvasSourceDesc,
      },
    });
  } else if (canvasSourceType !== undefined) {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        canvasSourceType: undefined,
        canvasSource: undefined,
        canvasSourceDesc,
      },
    });
  }
}
