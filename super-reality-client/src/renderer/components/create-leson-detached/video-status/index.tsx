import React, { useCallback, useEffect, useMemo } from "react";
import path from "path";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/cv/doCVMatch";
import userDataPath from "../../../../utils/files/userDataPath";
import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import { IStep } from "../../../api/types/step/step";
import saveCanvasImage from "../../../../utils/saveCanvasImage";
import setStatus from "../lesson-utils/setStatus";
import cropImage from "../../../../utils/cropImage";
import newAnchor from "../lesson-utils/newAnchor";
import { IAnchor } from "../../../api/types/anchor/anchor";
import useDebounce from "../../../hooks/useDebounce";
import { itemsPath } from "../../../electron-constants";

function doNewAnchor(url: string) {
  return newAnchor({
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
  });
}

function newAnchorPre(file: string): Promise<IAnchor | undefined> {
  if (file.indexOf("http") == -1) {
    return uploadFileToS3(file).then(doNewAnchor);
  }
  return doNewAnchor(file);
}

const userData = userDataPath();
const captureFileName = `${userData}/capture.png`;

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    currentAnchor,
    currentStep,
    treeSteps,
    treeAnchors,
    canvasSourceType,
    canvasSourceDesc,
    canvasSource,
    status,
    triggerCvMatch,
    previewEditArea,
    previewMode,
  } = useSelector((state: AppState) => state.createLessonV2);

  const anchor: IAnchor | null = useMemo(() => {
    // const slice = store.getState().createLessonV2;
    const step: IStep | null = treeSteps[currentStep || ""];

    return treeAnchors[step?.anchor || currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor, treeSteps, currentStep]);

  const cvDebouncer = useDebounce(1000);

  useEffect(() => {
    if (!anchor) return;
    console.log(
      "Do cv match trigger:",
      triggerCvMatch,
      canvasSourceType,
      canvasSource
    );

    if (canvasSourceType == "file" && canvasSource) {
      // Trigger CV match on current preview canvas
      cvDebouncer(() => {
        doCvMatch(anchor.templates, canvasSource, anchor).then((arg) =>
          reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
        );
      });
    } else if (canvasSourceType == "url" && canvasSource) {
      const fileName = canvasSource.split("/")?.pop() || "";
      const file = path.join(itemsPath, fileName);
      // Trigger CV match on current preview canvas
      cvDebouncer(() => {
        doCvMatch(anchor.templates, file, anchor).then((arg) =>
          reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
        );
      });
    } else {
      const videoHidden = document.getElementById(
        "video-hidden"
      ) as HTMLVideoElement;
      if (videoHidden) {
        cvDebouncer(() => {
          // trigger cv match on current video/recording
          doCvMatch(anchor.templates, videoHidden, anchor).then((arg) =>
            reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
          );
        });
      }
    }
  }, [
    dispatch,
    cvDebouncer,
    anchor,
    triggerCvMatch,
    canvasSourceType,
    canvasSource,
  ]);

  const doExitPreviewModes = useCallback(() => {
    setStatus("-");
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        previewMode: "IDLE",
      },
    });
  }, [dispatch]);

  const doSaveNewAnchor = useCallback(() => {
    setStatus("Saving anchor..");
    saveCanvasImage(captureFileName)
      .then((image) => cropImage(image, previewEditArea))
      .then(newAnchorPre)
      .then(doExitPreviewModes);
  }, [previewEditArea, doExitPreviewModes, dispatch]);

  return (
    <>
      <div className="video-status-container">
        {previewMode == "CREATE_ANCHOR" && (
          <>
            <ButtonSimple
              width="140px"
              height="12px"
              margin="auto auto"
              onClick={doSaveNewAnchor}
            >
              Save anchor
            </ButtonSimple>
            <ButtonSimple
              width="140px"
              height="12px"
              margin="auto auto"
              onClick={doExitPreviewModes}
            >
              Cancel
            </ButtonSimple>
          </>
        )}

        <div
          style={{
            color: "#04aff0",
            textShadow: "0px 1px #a6b1bd",
            fontFamily: "monospace",
            marginLeft: "auto",
          }}
        >{`${canvasSourceDesc} / ${status}`}</div>
        <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
      </div>
    </>
  );
}
