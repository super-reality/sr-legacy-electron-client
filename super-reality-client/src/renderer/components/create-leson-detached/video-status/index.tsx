import React, { useCallback, useEffect, useMemo } from "react";
import fs from "fs";
import path from "path";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { nativeImage } from "electron";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import ButtonRound from "../../button-round";
import store, { AppState } from "../../../redux/stores/renderer";
import usePopup from "../../../hooks/usePopup";
import ModalList from "../modal-list";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/doCVMatch";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import newAnchor from "../lesson-utils/newAnchor";
import userDataPath from "../../../../utils/userDataPath";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import { IStep } from "../../../api/types/step/step";
import generateDialogues from "./generation/generateDialogues";
import generateBaseData from "./generation/generateBaseData";
import generateSteps from "./generation/generateSteps";
import generateClicks from "./generation/generateClicks";
import saveCanvasImage from "../../../../utils/saveCanvasImage";
import testFullVideo from "./generation/testFullVideo";
import setStatus from "../lesson-utils/setStatus";
import generationDone from "./generation/generationDone";

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    recordingData,
    currentAnchor,
    currentStep,
    treeAnchors,
    videoNavigation,
    cropRecording,
    cropRecordingPos,
    canvasSource,
    currentRecording,
    currentCanvasSource,
    status,
    triggerCvMatch,
  } = useSelector((state: AppState) => state.createLessonV2);

  const anchor = useMemo(() => {
    const slice = store.getState().createLessonV2;
    const step: IStep | null = slice.treeSteps[currentStep || ""];

    return slice.treeAnchors[step?.anchor || currentAnchor || ""] || null;
  }, [currentAnchor, currentStep]);

  const [SelectAnchorPopup, doOpenAnchorPopup, close] = usePopup(false);

  const openAnchor = useCallback(
    (e: string | undefined) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: e },
      });
    },
    [dispatch]
  );

  const setRecordingAnchor = useCallback(
    (e: string | undefined) => {
      reduxAction(dispatch, {
        type: "SET_RECORDING_DATA",
        arg: { anchor: e },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    console.log(
      "Do cv match trigger",
      currentRecording,
      triggerCvMatch,
      currentCanvasSource
    );
    if (currentCanvasSource && anchor) {
      doCvMatch(anchor.templates, currentCanvasSource, anchor).then((arg) =>
        reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
      );
    } else if (anchor) {
      const videoHidden = document.getElementById(
        "video-hidden"
      ) as HTMLVideoElement;
      if (videoHidden) {
        doCvMatch(anchor.templates, videoHidden, anchor).then((arg) =>
          reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
        );
      }
    }
  }, [dispatch, anchor, currentRecording, triggerCvMatch, currentCanvasSource]);

  const generateItems = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });

    setStatus(`Generating`);
    const generatedData = generateBaseData();
    generateSteps(generatedData)
      .then((data) => generateDialogues(data))
      .then((data) => generateClicks(data, anchor))
      .then(() => generationDone())
      .catch((e) => setStatus(`Error generating`));
  }, [recordingData, anchor]);

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

  const doNewAnchor = useCallback(
    (url) => {
      newAnchor({
        name: "New Anchor",
        type: "crop",
        templates: [url],
        anchorFunction: "or",
        cvMatchValue: 0,
        cvCanvas: 50,
        cvDelay: 100,
        cvGrayscale: true,
        cvApplyThreshold: false,
        cvThreshold: 127,
      });
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { cropRecording: false },
      });
    },
    [dispatch]
  );

  const callback = useCallback(
    (e) => {
      if (e.indexOf("http") == -1) {
        uploadFileToS3(e).then((url) => {
          doNewAnchor(url);
        });
      } else {
        doNewAnchor(e);
      }
    },
    [doNewAnchor]
  );

  const doSaveNewAnchor = useCallback(() => {
    const userData = userDataPath();
    const fileName = `${userData}/capture.png`;
    const output = `${userData}/crop.png`;

    saveCanvasImage(fileName).then(() => {
      // Crop it
      console.log(cropRecordingPos);
      const image = nativeImage.createFromPath(fileName).crop({
        x: Math.round(cropRecordingPos.x),
        y: Math.round(cropRecordingPos.y),
        width: Math.round(cropRecordingPos.width),
        height: Math.round(cropRecordingPos.height),
      });
      // console.log(image);
      fs.writeFile(output, image.toPNG(), {}, () => {
        const timestamped = path.join(userData, `${new Date().getTime()}.png`);
        fs.copyFile(output, timestamped, () => callback(timestamped));
      });
    });
  }, [callback, cropRecordingPos]);

  const [Popup, doCreateAnchor] = usePopupImageSource(
    callback,
    true,
    true,
    true,
    true
  );

  return (
    <div className="video-status-container">
      {Popup}
      <SelectAnchorPopup
        width="320px"
        height="400px"
        style={{ padding: "10px" }}
      >
        <ModalList
          options={Object.keys(treeAnchors).map((a) => treeAnchors[a])}
          current={recordingData.anchor || ""}
          selected={recordingData.anchor || ""}
          setCurrent={(id) => {
            setRecordingAnchor(id || undefined);
            openAnchor(id || undefined);
            close();
          }}
          open={(id) => {
            openAnchor(id || undefined);
            close();
          }}
        />
      </SelectAnchorPopup>
      {!cropRecording && (
        <>
          <ButtonRound
            svg={AnchorIcon}
            width="28px"
            height="28px"
            style={{ margin: "auto 8px" }}
            onClick={doOpenAnchorPopup}
          />
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={doCreateAnchor}
          >
            Create new anchor
          </ButtonSimple>
        </>
      )}
      {cropRecording && (
        <ButtonSimple
          width="140px"
          height="12px"
          margin="auto auto"
          onClick={doSaveNewAnchor}
        >
          Save anchor
        </ButtonSimple>
      )}
      {recordingData.anchor && !cropRecording ? (
        <>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={checkAnchor}
          >
            Check anchor
          </ButtonSimple>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={generateItems}
          >
            Generate
          </ButtonSimple>
        </>
      ) : (
        <div style={{ color: "var(--color-red)" }}>
          <i>{!cropRecording && "Attach an anchor to edit"}</i>
        </div>
      )}
      <div
        style={{ fontFamily: "monospace", marginLeft: "auto" }}
      >{`${canvasSource} / ${status}`}</div>
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
