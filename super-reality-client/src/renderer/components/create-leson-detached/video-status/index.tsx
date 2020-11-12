import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import timestampToTime from "../../../../utils/timestampToTime";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import newAnchor from "../lesson-utils/newAnchor";
import userDataPath from "../../../../utils/userDataPath";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import newItem from "../lesson-utils/newItem";
import sha1 from "../../../../utils/sha1";
import { Item } from "../../../api/types/item/item";
import newStep from "../lesson-utils/newStep";
import { itemsPath } from "../../../electron-constants";
import getDefaultItemProps from "../lesson-utils/getDefaultItemProps";

function saveCanvasImage(fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById("preview-video-canvas") as
      | HTMLCanvasElement
      | undefined;
    if (canvas) {
      const url = canvas.toDataURL("image/jpg", 0.8);

      // remove Base64 stuff from the Image
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(fileName, base64Data, "base64", (err) => {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    } else {
      reject();
    }
  });
}

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    recordingData,
    currentAnchor,
    currentStep,
    treeAnchors,
    treeItems,
    videoNavigation,
    recordingTempItems,
    currentChapter,
    cropRecording,
    cropRecordingPos,
    canvasSource,
    currentRecording,
    currentCanvasSource,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [matchFrame, setMatchFrame] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const anchor = useMemo(() => {
    const slice = store.getState().createLessonV2;
    const step = slice.treeSteps[currentStep || ""] || null;

    return slice.treeAnchors[step.anchor || currentAnchor || ""] || null;
  }, [currentAnchor]);

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
  }, [
    dispatch,
    anchor,
    currentStep,
    currentRecording,
    videoNavigation,
    currentCanvasSource,
  ]);

  // Anchor full video wide matching/testing
  useEffect(() => {
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && anchor) {
      if (matchFrame !== -1 && matchFrame < recordingData.step_data.length) {
        const orig = recordingData.step_data[matchFrame];
        const timestamp = orig.time_stamp;
        const timestampTime = timestampToTime(timestamp);
        videoHidden.currentTime = timestampTime / 1000;
        timeoutRef.current = setTimeout(() => {
          doCvMatch(anchor.templates, videoHidden, anchor).then((arg) => {
            reduxAction(dispatch, {
              type: "SET_RECORDING_CV_DATA",
              arg: { index: timestampTime / 1000, value: arg.dist },
            });

            // Create new item based on step data from recording
            const id = sha1(`${orig.type}-${orig.time_stamp}`);
            const itemType = "focus_highlight";
            const itemToSet = {
              trigger: null,
              destination: "", // a step ID to go to
              transition: 0, // type
              anchor: true,
              ...getDefaultItemProps(itemType),
              _id: id,
              name: `${orig.type} ${orig.time_stamp}`,
              type: itemType,
              focus: "Mouse Point",
              relativePos: {
                width: 16,
                height: 16,
                x: orig.x_cordinate ? orig.x_cordinate - arg.x : 0,
                y: orig.y_cordinate ? orig.y_cordinate - arg.y : 0,
              },
            };

            if (orig.type !== "keydown" && orig.type !== "keyup") {
              itemToSet.relativePos.x -= 64;
              itemToSet.relativePos.y -= 64;
              itemToSet.relativePos.width = 128;
              itemToSet.relativePos.height = 128;
            }

            if (
              orig.type == "left_click" ||
              orig.type == "right_click" ||
              orig.type == "wheel_click"
            ) {
              reduxAction(dispatch, {
                type: "CREATE_LESSON_V2_SET_TEMPITEM",
                arg: {
                  item: itemToSet as Item,
                },
              });
            }

            saveCanvasImage(`${itemsPath}/${sha1(itemToSet.name)}.png`).then(
              () => {
                if (timeoutRef.current) {
                  setMatchFrame(matchFrame + 1);
                }
              }
            );
          });
        }, 200);
      } else {
        setMatchFrame(-1);
      }
    }
  }, [matchFrame, recordingData, timeoutRef, dispatch, anchor]);

  const testFullVideo = useCallback(() => {
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
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && recordingData.anchor) {
      videoHidden.currentTime = 0;
      setMatchFrame(0);
    }
  }, [recordingData]);

  const generateItems = useCallback(() => {
    Promise.all(
      Object.keys(recordingTempItems).map((k) => {
        const item = recordingTempItems[k];
        return newStep(
          { name: recordingTempItems[k].name, anchor: recordingData.anchor },
          currentChapter
        ).then((step) => {
          if (step) newItem(item, step._id);
        });
      })
    );
  }, [dispatch, recordingTempItems, treeItems, currentChapter, recordingData]);

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
            onClick={
              matchFrame == -1
                ? testFullVideo
                : () => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setMatchFrame(-1);
                  }
            }
          >
            {matchFrame == -1 ? "Check anchor" : "Stop checking"}
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
      <div style={{ marginLeft: "auto" }}>{canvasSource}</div>
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
