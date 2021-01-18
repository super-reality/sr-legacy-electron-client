import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import setCanvasSource from "../../../redux/utils/setCanvasSource";

export default function forceStepBackgroundUpdate(): void {
  const { currentStep, treeSteps } = store.getState().createLessonV2;
  const st = treeSteps[currentStep || ""];
  if (currentStep && st && st.canvas[0]) {
    const nav: number[] = [
      ...store.getState().createLessonV2.videoNavigation,
    ] || [0, 0, 0];

    const canvasObj = st.canvas[0];
    if (canvasObj.type == "Image") {
      setCanvasSource("url", canvasObj.value.url);
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          videoNavigation: nav,
        },
      });
    }
    if (canvasObj.type == "Recording") {
      if (canvasObj.value.url) {
        setCanvasSource("url", canvasObj.value.url);
      } else {
        setCanvasSource("recording", canvasObj.value.recording);
      }
    }
    if (canvasObj.type == "Url") {
      setCanvasSource("url", canvasObj.value);
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          videoNavigation: nav,
        },
      });
    }
  } else {
    setCanvasSource(undefined, "");
  }
}
