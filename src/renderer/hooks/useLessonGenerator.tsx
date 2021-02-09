import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import uploadFileToS3 from "../../utils/api/uploadFileToS3";
import generateBaseData from "../components/create-leson-detached/generation/generateBaseData";
import generateClicks from "../components/create-leson-detached/generation/generateClicks";
import generateDialogues from "../components/create-leson-detached/generation/generateDialogues";
import generateSteps from "../components/create-leson-detached/generation/generateSteps";
import generationDone from "../components/create-leson-detached/generation/generationDone";
import clearTempFolder from "../components/create-leson-detached/lesson-utils/clearTempFolder";
import newAnchor from "../components/create-leson-detached/lesson-utils/newAnchor";
import setStatus from "../components/create-leson-detached/lesson-utils/setStatus";
import { AppState } from "../redux/stores/renderer";
import usePopup from "./usePopup";

export default function useLessonGenerator(): [
  () => JSX.Element,
  (uri: string) => void
] {
  const [Popup, open] = usePopup(false);

  const openPopup = useCallback(
    (anchorUri: string) => {
      open();

      setStatus(`Creating anchor`);
      uploadFileToS3(anchorUri).then((url) =>
        newAnchor({
          name: "New Anchor",
          type: "crop",
          templates: [url],
          anchorFunction: "or",
          cvMatchValue: 990,
          cvCanvas: 100,
          cvDelay: 50,
          cvGrayscale: true,
          cvApplyThreshold: false,
          cvThreshold: 127,
        }).then((anchorObj) => {
          if (anchorObj) {
            setStatus(`Generating`);
            const generatedData = generateBaseData();
            generateSteps(generatedData)
              .then((data) => generateDialogues(data))
              .then((data) => generateClicks(data, anchorObj))
              .then(() => generationDone())
              .catch((e) => {
                console.error(e);
                clearTempFolder();
                setStatus(`Error generating`);
              });
          } else {
            setStatus(`Error creating anchor`);
          }
        })
      );
    },
    [open]
  );

  /*
  const checkAnchor = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        currentItem: undefined,
        currentStep: undefined,
        currentAnchor: recordingData.anchor,
        recordingCvFrame: 0,
      },
    });
    testFullVideo(anchor);
  }, [recordingData, anchor]);
  */

  const GeneratorPopup = () => {
    const { status } = useSelector((state: AppState) => state.createLessonV2);

    return (
      <Popup width="340px" height="180px">
        <div style={{ textAlign: "center", margin: "auto" }}>{status}</div>
      </Popup>
    );
  };

  return [GeneratorPopup, openPopup];
}
