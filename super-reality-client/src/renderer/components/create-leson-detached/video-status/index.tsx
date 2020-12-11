import React, { useCallback, useEffect, useMemo } from "react";
import path from "path";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import ButtonRound from "../../button-round";
import store, { AppState } from "../../../redux/stores/renderer";
import usePopup from "../../../hooks/usePopup";
import ModalList from "../modal-list";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/cv/doCVMatch";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import userDataPath from "../../../../utils/files/userDataPath";
import uploadFileToS3 from "../../../../utils/api/uploadFileToS3";
import { IStep } from "../../../api/types/step/step";
import generateDialogues from "./generation/generateDialogues";
import generateBaseData from "./generation/generateBaseData";
import generateSteps from "./generation/generateSteps";
import generateClicks from "./generation/generateClicks";
import saveCanvasImage from "../../../../utils/saveCanvasImage";
import testFullVideo from "./generation/testFullVideo";
import setStatus from "../lesson-utils/setStatus";
import generationDone from "./generation/generationDone";
import cropImage from "../../../../utils/cropImage";
import Flex from "../../flex";
import newAnchor from "../lesson-utils/newAnchor";
import { IAnchor } from "../../../api/types/anchor/anchor";
import updateStep from "../lesson-utils/updateStep";
import updateAnchor from "../lesson-utils/updateAnchor";
import useDebounce from "../../../hooks/useDebounce";
import clearTempFolder from "../lesson-utils/clearTempFolder";
import logger from "../../../../utils/logger";
import { itemsPath } from "../../../electron-constants";
import editStepItemsRelativePosition from "../lesson-utils/editStepItemsRelativePosition";
import timetoTimestamp from "../../../../utils/timeToTimestamp";

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

const MODE_CREATE = 1;
const MODE_ADD_TO = 2;

type ANCHOR_EDIT_MODES = typeof MODE_CREATE | typeof MODE_ADD_TO;

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    recordingData,
    currentAnchor,
    currentStep,
    treeSteps,
    treeAnchors,
    cropRecording,
    cropEditAnchor,
    cropEditAnchorMode,
    cropRecordingPos,
    canvasSourceType,
    canvasSourceDesc,
    canvasSource,
    status,
    triggerCvMatch,
    videoNavigation,
  } = useSelector((state: AppState) => state.createLessonV2);

  const { cvResult } = useSelector((state: AppState) => state.render);

  const anchor = useMemo(() => {
    // const slice = store.getState().createLessonV2;
    const step: IStep | null = treeSteps[currentStep || ""];

    return treeAnchors[step?.anchor || currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor, treeSteps, currentStep]);

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

  const cvDebouncer = useDebounce(300);

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

  const generateItems = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });

    if (anchor) {
      setStatus(`Generating`);
      const generatedData = generateBaseData();
      generateSteps(generatedData)
        .then((data) => generateDialogues(data))
        .then((data) => generateClicks(data, anchor))
        .then(() => generationDone())
        .catch((e) => {
          logger("error", e);
          console.error(e);
          clearTempFolder();
          setStatus(`Error generating`);
        });
    } else {
      setStatus(`No anchor selected`);
    }
  }, [anchor]);

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

  const doExitEditAnchor = useCallback(() => {
    setStatus("-");
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        cropRecording: false,
        cropEditAnchor: null,
      },
    });
  }, [dispatch]);

  const [
    EditAnchorOptions,
    openEditAnchorOptions,
    closeEditAnchorOptions,
  ] = usePopup(false);

  const doSaveNewAnchor = useCallback(() => {
    setStatus("Saving anchor..");
    saveCanvasImage(captureFileName)
      .then((image) => cropImage(image, cropRecordingPos))
      .then(newAnchorPre)
      .then((a) => {
        if (a) {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_DATA",
            arg: { currentAnchor: a._id },
          });
          reduxAction(dispatch, {
            type: "SET_RECORDING_DATA",
            arg: {
              anchor: a._id,
            },
          });
        }
        doExitEditAnchor();
      });
  }, [cropRecordingPos, doExitEditAnchor, dispatch]);

  const [Popup, doCreateAnchor] = usePopupImageSource(
    newAnchorPre,
    true,
    true,
    true,
    true
  );

  const editCreateNewAnchor = useCallback(
    (fileName: string) => {
      newAnchorPre(fileName)
        .then(
          (a): Promise<IStep | undefined> => {
            const slice = store.getState().createLessonV2;
            const step: IStep | null = slice.treeSteps[currentStep || ""];
            if (a && step && currentStep) {
              const newTimestamp = timetoTimestamp(videoNavigation[1]);
              return updateStep(
                { anchor: a._id, recordingTimestamp: newTimestamp },
                currentStep
              ).then((updatedStep) => {
                if (updatedStep) {
                  reduxAction(dispatch, {
                    type: "CREATE_LESSON_V2_SETSTEP",
                    arg: { step: updatedStep },
                  });
                }
                return updatedStep;
              });
            }
            return new Promise((r) => r(undefined));
          }
        )
        .then(doExitEditAnchor)
        .catch((e) => {
          console.error(e);
          doExitEditAnchor();
        });
    },
    [videoNavigation, dispatch, currentStep, doExitEditAnchor]
  );

  const editAddToCurrentAnchor = useCallback(
    (fileName: string) => {
      uploadFileToS3(fileName)
        .then(
          (newUrl): Promise<IAnchor | undefined> => {
            const slice = store.getState().createLessonV2;
            const step: IStep | null = slice.treeSteps[currentStep || ""];
            if (currentStep && step && step.anchor) {
              const a: IAnchor | null = slice.treeAnchors[step.anchor];
              return updateAnchor(
                { templates: [...a.templates, newUrl] },
                step.anchor
              ).then((updatedAnchor) => {
                if (updatedAnchor) {
                  reduxAction(dispatch, {
                    type: "CREATE_LESSON_V2_SETANCHOR",
                    arg: { anchor: updatedAnchor },
                  });
                }
                return updatedAnchor;
              });
            }
            return new Promise((r) => r(undefined));
          }
        )
        .then(doExitEditAnchor)
        .catch((e) => {
          console.error(e);
          doExitEditAnchor();
        });
    },
    [currentStep, doExitEditAnchor]
  );

  const setEditAnchorMode = useCallback(
    (mode: ANCHOR_EDIT_MODES) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { cropEditAnchorMode: mode },
      });
      closeEditAnchorOptions();
    },
    [closeEditAnchorOptions, dispatch]
  );

  useEffect(() => {
    if (cropEditAnchor) {
      openEditAnchorOptions();
    }
  }, [cropEditAnchor, openEditAnchorOptions]);

  const doFinishEditAnchor = useCallback(() => {
    saveCanvasImage(captureFileName)
      .then((image) => cropImage(image, cropRecordingPos))
      .then((file) => {
        if (cropEditAnchorMode == MODE_CREATE) {
          setStatus("Creating new anchor");
          editCreateNewAnchor(file);
          if (currentStep) {
            editStepItemsRelativePosition(
              currentStep,
              cropRecordingPos,
              cvResult
            );
          }
        }
        if (cropEditAnchorMode == MODE_ADD_TO) {
          setStatus("Adding to anchor");
          editAddToCurrentAnchor(file);
        }
      });
  }, [cropEditAnchorMode, cropRecordingPos, currentStep, cvResult]);

  return (
    <div className="video-status-container">
      <EditAnchorOptions width="540px" height="240px">
        <Flex style={{ justifyContent: "center", margin: "0 auto 16px auto" }}>
          Choose one
        </Flex>
        <Flex style={{ justifyContent: "space-evenly", marginBottom: "16px" }}>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => setEditAnchorMode(MODE_CREATE)}
          >
            Create new
          </ButtonSimple>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => setEditAnchorMode(MODE_ADD_TO)}
          >
            Add to current
          </ButtonSimple>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => {
              closeEditAnchorOptions();
              doExitEditAnchor();
            }}
          >
            Cancel
          </ButtonSimple>
        </Flex>
      </EditAnchorOptions>
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
      {cropRecording && !cropEditAnchor && (
        <ButtonSimple
          width="140px"
          height="12px"
          margin="auto auto"
          onClick={doSaveNewAnchor}
        >
          Save anchor
        </ButtonSimple>
      )}
      {cropRecording && cropEditAnchor && (
        <>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto auto"
            onClick={doFinishEditAnchor}
          >
            Done
          </ButtonSimple>

          <ButtonSimple width="100px" height="16px" onClick={doExitEditAnchor}>
            Cancel
          </ButtonSimple>
        </>
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
      >{`${canvasSourceDesc} / ${status}`}</div>
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
